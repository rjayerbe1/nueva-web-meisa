import { Metadata } from 'next'
import { TrayectoriaClient } from './TrayectoriaClient'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/lib/site-config'

// Force dynamic rendering (no static generation during build)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Nuestra Trayectoria | MEISA',
  description: `${siteConfig.empresa.aniosExperiencia} años construyendo Colombia. Conoce los proyectos más importantes que hemos desarrollado desde 1996.`,
}

async function getProyectos() {
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    orderBy: [
      { destacado: 'desc' },
      { fechaInicio: 'desc' },
      { orden: 'asc' }
    ]
  })

  return proyectos.map((proyecto) => ({
    id: proyecto.id,
    entidadContratante: proyecto.entidadContratante,
    objetoContrato: proyecto.objetoContrato,
    fechaInicio: proyecto.fechaInicio.toISOString(),
    fechaFin: proyecto.fechaFin ? proyecto.fechaFin.toISOString() : null,
    ubicacion: proyecto.ubicacion,
    departamento: proyecto.departamento,
    valorContrato: Number(proyecto.valorContrato),
    pesoKg: proyecto.pesoKg ? Number(proyecto.pesoKg) : null,
    areaM2: proyecto.areaM2 ? Number(proyecto.areaM2) : null,
    imagenes: Array.isArray(proyecto.imagenes)
      ? proyecto.imagenes.filter((item): item is string => typeof item === 'string')
      : null,
    visible: proyecto.visible,
    destacado: proyecto.destacado,
  }))
}

async function getStats() {
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true }
  })

  const totalProyectos = proyectos.length

  const totalToneladas = Math.round(
    proyectos.reduce((sum, p) => sum + (p.pesoKg ? Number(p.pesoKg) / 1000 : 0), 0)
  )

  const valorTotal = proyectos.reduce((sum, p) => sum + Number(p.valorContrato), 0)
  const departamentosUnicos = new Set(proyectos.map((p) => p.departamento).filter(Boolean))
  const ubicacionesUnicas = new Set(proyectos.map((p) => p.ubicacion))

  const proyectosPorAño: Record<number, number> = {}
  const proyectosPorDepartamento: Record<string, number> = {}

  proyectos.forEach((proyecto) => {
    const año = new Date(proyecto.fechaInicio).getFullYear()
    proyectosPorAño[año] = (proyectosPorAño[año] || 0) + 1

    if (proyecto.departamento) {
      proyectosPorDepartamento[proyecto.departamento] =
        (proyectosPorDepartamento[proyecto.departamento] || 0) + 1
    }
  })

  return {
    totalProyectos,
    totalToneladas,
    valorTotal,
    valorTotalFormateado: `$${(valorTotal / 1000000000).toFixed(1)}B`,
    departamentos: departamentosUnicos.size,
    ubicaciones: ubicacionesUnicas.size,
    proyectosPorAño,
    proyectosPorDepartamento,
    añoInicio: 1996,
    añosExperiencia: siteConfig.empresa.aniosExperiencia
  }
}

export default async function TrayectoriaPage() {
  const [proyectos, stats] = await Promise.all([
    getProyectos(),
    getStats()
  ])

  return <TrayectoriaClient proyectos={proyectos} stats={stats} />
}
