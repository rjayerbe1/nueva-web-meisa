import { prisma } from "../../lib/prisma"

async function main() {
  // 1. Información de empresa
  const trayectoria = await prisma.configuracionTrayectoria.findFirst()
  console.log("=== CONFIG TRAYECTORIA ===")
  if (trayectoria) {
    console.log("Reseña histórica:")
    console.log(trayectoria.resenaHistorica?.slice(0, 400) + "...")
    console.log("\nMisión:", trayectoria.mision?.slice(0, 200))
    console.log("\nVisión:", trayectoria.vision?.slice(0, 200))
  }

  // 2. Resumen año por año (para inferir trayectoria)
  const resumenes = await prisma.resumenAnio.findMany({
    orderBy: { anio: "asc" },
    select: { anio: true, titulo: true, estadisticas: true },
  })
  console.log("\n=== RESUMENES POR AÑO ===")
  console.log(`Años cubiertos: ${resumenes.length} (${resumenes[0]?.anio} - ${resumenes[resumenes.length-1]?.anio})`)
  if (resumenes[0]) console.log(`Primer año: ${resumenes[0].anio} — ${resumenes[0].titulo}`)
  if (resumenes[resumenes.length - 1]) console.log(`Último año: ${resumenes[resumenes.length-1].anio} — ${resumenes[resumenes.length-1].titulo}`)

  // 3. Stats globales calculados de proyectos
  const proyectos = await prisma.proyecto.findMany({
    select: { categoria: true, toneladas: true, areaTotal: true, fechaInicio: true },
  })
  const totalToneladas = proyectos.reduce((sum, p) => sum + (Number(p.toneladas) || 0), 0)
  const totalArea = proyectos.reduce((sum, p) => sum + (Number(p.areaTotal) || 0), 0)
  const porCategoria: Record<string, number> = {}
  for (const p of proyectos) {
    porCategoria[p.categoria] = (porCategoria[p.categoria] || 0) + 1
  }
  const fechas = proyectos.map((p) => p.fechaInicio).filter(Boolean) as Date[]
  const minDate = fechas.length ? new Date(Math.min(...fechas.map((d) => d.getTime()))) : null

  console.log("\n=== STATS REALES DE DB ===")
  console.log(`Total proyectos: ${proyectos.length}`)
  console.log(`Total toneladas (suma): ${totalToneladas.toFixed(1)} ton`)
  console.log(`Total area (suma): ${totalArea.toFixed(1)} m²`)
  console.log(`Proyecto más antiguo: ${minDate?.toISOString().slice(0, 10)}`)
  console.log("\nPor categoría:", porCategoria)

  // 4. ProyectoHojaVida (otra fuente con peso/area)
  const hojas = await prisma.proyectoHojaVida.findMany({
    select: { pesoKg: true, areaM2: true, fechaInicio: true, categoria: true },
  })
  const totalPesoHv = hojas.reduce((s, h) => s + (Number(h.pesoKg) || 0), 0)
  const totalAreaHv = hojas.reduce((s, h) => s + (Number(h.areaM2) || 0), 0)
  const hvPorCat: Record<string, number> = {}
  for (const h of hojas) hvPorCat[h.categoria] = (hvPorCat[h.categoria] || 0) + 1
  const minDateHv = hojas.length ? new Date(Math.min(...hojas.map((h) => h.fechaInicio.getTime()))) : null
  console.log("\n=== HOJAS DE VIDA (otra fuente) ===")
  console.log(`Total: ${hojas.length}`)
  console.log(`Peso suma: ${(totalPesoHv / 1000).toFixed(1)} ton (de kg)`)
  console.log(`Area suma: ${totalAreaHv.toFixed(1)} m²`)
  console.log(`Más antiguo: ${minDateHv?.toISOString().slice(0, 10)}`)
  console.log(`Por cat:`, hvPorCat)

  await prisma.$disconnect()
}
main().catch((e) => { console.error(e); process.exit(1) })
