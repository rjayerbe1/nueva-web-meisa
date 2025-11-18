import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const LOCAL_URL = process.env.DATABASE_URL

const neonPrisma = new PrismaClient({
  datasources: { db: { url: NEON_URL } }
})

const localPrisma = new PrismaClient({
  datasources: { db: { url: LOCAL_URL } }
})

async function main() {
  console.log('\n=== USUARIOS EN NEON (PRODUCCIÓN) ===')
  const neonUsers = await neonPrisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  })
  console.log(`Total: ${neonUsers.length} usuarios`)
  neonUsers.forEach(u => console.log(`  - ${u.email} (${u.id}) - ${u.role}`))

  console.log('\n=== USUARIOS EN LOCAL ===')
  const localUsers = await localPrisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  })
  console.log(`Total: ${localUsers.length} usuarios`)
  localUsers.forEach(u => console.log(`  - ${u.email} (${u.id}) - ${u.role}`))

  console.log('\n=== PROYECTOS EN NEON ===')
  const neonProjects = await neonPrisma.proyecto.findMany({
    select: { id: true, titulo: true, createdBy: true },
    take: 5
  })
  console.log(`Total proyectos: ${await neonPrisma.proyecto.count()}`)
  console.log('Primeros 5 proyectos:')
  neonProjects.forEach(p => console.log(`  - ${p.titulo} (createdBy: ${p.createdBy})`))

  console.log('\n=== PROYECTOS EN LOCAL ===')
  const localProjectsCount = await localPrisma.proyecto.count()
  console.log(`Total proyectos: ${localProjectsCount}`)

  await neonPrisma.$disconnect()
  await localPrisma.$disconnect()
}

main()
