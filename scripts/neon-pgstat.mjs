// Contadores de lecturas por tabla en Neon (pg_stat_user_tables, solo lectura).
// Sirve para comprobar que navegar el sitio público NO consulta la base
// (el contador no debe subir con cada visita). Uso:
//   DATABASE_URL=... node scripts/neon-pgstat.mjs [etiqueta]
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const rows = await prisma.$queryRawUnsafe(`
  SELECT relname, (seq_scan + idx_scan)::bigint AS scans, now() AS at
  FROM pg_stat_user_tables
  WHERE relname IN ('plantas','social_links','configuracion_contacto','configuracion_empresa','menu_items','footer_links','categorias_proyecto','proyectos','landings_seo','contactos_whatsapp')
  ORDER BY relname`)
const label = process.argv[2] ?? ''
console.log(label, new Date().toISOString())
for (const r of rows) console.log(String(r.relname).padEnd(24), String(r.scans))
await prisma.$disconnect()
