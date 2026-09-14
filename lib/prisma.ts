import { PrismaClient } from '@prisma/client'
import { revalidateForModel } from '@/lib/cache/revalidate'

/**
 * Operaciones que modifican filas. Tras cualquiera de ellas sobre un modelo
 * que alimenta el sitio público (ver MODEL_TAGS en lib/cache/tags.ts) se
 * invalida el caché público, sin importar desde qué ruta del admin, script
 * o restore de backup se haya escrito. Único punto de enganche: no hay que
 * acordarse de llamar revalidateTag en cada handler nuevo.
 */
const WRITE_OPERATIONS = new Set([
  'create',
  'createMany',
  'createManyAndReturn',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
])

function createPrismaClient() {
  // PRISMA_LOG_QUERIES=1 imprime cada SQL en stdout. Sirve para comprobar en
  // local (npm run build && npm start) que navegar el sitio público NO toca
  // la base: con el caché caliente no debe salir ninguna línea.
  const log = process.env.PRISMA_LOG_QUERIES ? (['query'] as const) : []
  return new PrismaClient({ log: [...log] }).$extends({
    name: 'revalidate-public-cache',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args)
          if (WRITE_OPERATIONS.has(operation)) {
            // Prisma expone el modelo en PascalCase; MODEL_TAGS usa el nombre
            // del delegate (camelCase), igual que `prisma.plant`.
            revalidateForModel(model.charAt(0).toLowerCase() + model.slice(1))
          }
          return result
        },
      },
    },
  })
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
