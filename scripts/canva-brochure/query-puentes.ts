import { prisma } from "../../lib/prisma"

async function main() {
  const proyectos = await prisma.proyecto.findMany({
    where: {
      OR: [
        { titulo: { contains: "puente", mode: "insensitive" } },
        { titulo: { contains: "OVEJAS", mode: "insensitive" } },
        { titulo: { contains: "CASCADA", mode: "insensitive" } },
        { titulo: { contains: "TECNOQUIMICAS", mode: "insensitive" } },
        { titulo: { contains: "FLORESTA", mode: "insensitive" } },
        { titulo: { contains: "QUILICHAO", mode: "insensitive" } },
        { tags: { has: "puente" } },
      ],
    },
    select: {
      id: true,
      titulo: true,
      ubicacion: true,
      categoria: true,
      tags: true,
      imagenes: { select: { url: true, orden: true }, orderBy: { orden: "asc" }, take: 4 },
    },
    take: 30,
  })
  console.log(`Encontrados ${proyectos.length} proyectos:`)
  for (const p of proyectos) {
    console.log(`\n[${p.categoria}] ${p.titulo}`)
    console.log(`  ubicacion: ${p.ubicacion}`)
    console.log(`  tags: ${p.tags.join(", ") || "(none)"}`)
    console.log(`  imagenes: ${p.imagenes.length}`)
    p.imagenes.slice(0, 2).forEach((img, i) => console.log(`    ${i + 1}. ${img.url}`))
  }
  await prisma.$disconnect()
}
main().catch((e) => { console.error(e); process.exit(1) })
