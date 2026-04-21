import { prisma } from "@/lib/prisma"
import {
  TrayectoriaAdminTabs,
  type ProyectoHojaVidaSerializado,
} from "@/components/admin/trayectoria/TrayectoriaAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getData() {
  const [proyectosRaw, resumenes, config] = await Promise.all([
    prisma.proyectoHojaVida.findMany({
      orderBy: [{ destacado: "desc" }, { fechaInicio: "desc" }, { orden: "asc" }],
    }),
    prisma.resumenAnio.findMany({ orderBy: { anio: "desc" } }),
    prisma.configuracionTrayectoria.findFirst(),
  ])

  const proyectos: ProyectoHojaVidaSerializado[] = proyectosRaw.map((p) => ({
    id: p.id,
    entidadContratante: p.entidadContratante,
    objetoContrato: p.objetoContrato,
    tituloDisplay: p.tituloDisplay,
    descripcionSecundaria: p.descripcionSecundaria,
    fechaInicio: p.fechaInicio.toISOString(),
    fechaFin: p.fechaFin.toISOString(),
    pesoKg: p.pesoKg != null ? Number(p.pesoKg) : null,
    areaM2: p.areaM2 != null ? Number(p.areaM2) : null,
    ubicacion: p.ubicacion,
    departamento: p.departamento,
    valorContrato: Number(p.valorContrato),
    moneda: p.moneda,
    categoria: p.categoria,
    imagenes: Array.isArray(p.imagenes)
      ? p.imagenes.filter((x): x is string => typeof x === "string")
      : [],
    destacado: p.destacado,
    visible: p.visible,
    orden: p.orden,
  }))

  return { proyectos, resumenes, config }
}

export default async function TrayectoriaAdminPage() {
  const { proyectos, resumenes, config } = await getData()
  return (
    <TrayectoriaAdminTabs proyectos={proyectos} resumenes={resumenes} config={config} />
  )
}
