import { unstable_cache } from 'next/cache'
import { PUBLIC_CACHE_TTL, type PublicTag } from '@/lib/cache/tags'

/**
 * Envuelve una lectura de Prisma en el Data Cache de Next (`unstable_cache`)
 * con TTL de 1 hora y tags por tabla. Es la ÚNICA forma en que el sitio
 * público debe leer contenido editorial: así la base se consulta como mucho
 * una vez por hora por lectura (y no una vez por visita), y Neon puede
 * suspenderse el resto del tiempo.
 *
 * Detalle importante: el Data Cache serializa a JSON. En un MISS `unstable_cache`
 * devuelve el objeto vivo (con `Date`) y en un HIT el JSON parseado (con
 * strings), lo que produce bugs que solo aparecen en el segundo request.
 * Para que el comportamiento sea idéntico siempre, normalizamos el resultado
 * a JSON también en el MISS. Consecuencia: los campos `Date`/`Decimal` llegan
 * como string — si un consumidor necesita `Date`, que haga `new Date(x)`.
 *
 * `key` debe identificar la lectura (los argumentos de `fn` se suman solos a
 * la clave). `tags` son las tablas que participan, para invalidarlas desde
 * el admin (ver lib/cache/revalidate.ts).
 */
export function cachedContent<Args extends unknown[], T>(
  key: string[],
  tags: PublicTag[],
  fn: (...args: Args) => Promise<T>,
): (...args: Args) => Promise<T> {
  return unstable_cache(
    async (...args: Args) => {
      const result = await fn(...args)
      return result === undefined ? result : (JSON.parse(JSON.stringify(result)) as T)
    },
    key,
    { revalidate: PUBLIC_CACHE_TTL, tags },
  )
}

/** Cache-Control para respuestas GET públicas de /api que sirven catálogo. */
export const PUBLIC_API_CACHE_HEADERS = {
  'Cache-Control': `public, max-age=300, s-maxage=${PUBLIC_CACHE_TTL}, stale-while-revalidate=86400`,
} as const
