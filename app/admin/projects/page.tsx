import { prisma } from "@/lib/prisma"
import {
  ProjectsAdminTabs,
  type ProyectoSerializado,
} from "@/components/admin/projects/ProjectsAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getData() {
  const [proyectosRaw, categorias] = await Promise.all([
    prisma.proyecto.findMany({
      orderBy: [{ destacado: "desc" }, { ordenFrontend: "asc" }, { createdAt: "desc" }],
      include: {
        imagenes: { where: { tipo: "PORTADA" }, take: 1, select: { url: true } },
      },
    }),
    prisma.categoriaProyecto.findMany({ orderBy: { orden: "asc" } }),
  ])

  const proyectos: ProyectoSerializado[] = proyectosRaw.map((p: any) => ({
    id: p.id,
    titulo: p.titulo,
    slug: p.slug,
    descripcion: p.descripcion,
    cliente: p.cliente,
    ubicacion: p.ubicacion,
    categoria: p.categoria,
    estado: p.estado,
    prioridad: p.prioridad,
    fechaInicio: p.fechaInicio.toISOString(),
    fechaFin: p.fechaFin ? p.fechaFin.toISOString() : null,
    fechaEstimada: p.fechaEstimada ? p.fechaEstimada.toISOString() : null,
    presupuesto: p.presupuesto != null ? Number(p.presupuesto) : null,
    costoReal: p.costoReal != null ? Number(p.costoReal) : null,
    moneda: p.moneda,
    areaTotal: p.areaTotal != null ? Number(p.areaTotal) : null,
    toneladas: p.toneladas != null ? Number(p.toneladas) : null,
    codigoInterno: p.codigoInterno,
    destacado: p.destacado,
    destacadoEnCategoria: p.destacadoEnCategoria,
    visible: p.visible,
    ordenFrontend: p.ordenFrontend,
    tags: p.tags,
    portada: p.imagenes?.[0]?.url ?? null,
  }))

  return { proyectos, categorias }
}

export default async function ProjectsAdminPage() {
  const { proyectos, categorias } = await getData()
  return <ProjectsAdminTabs proyectos={proyectos} categorias={categorias} />
}
