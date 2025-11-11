import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener estadísticas generales
export async function GET() {
  try {
    const proyectos = await prisma.proyectoHojaVida.findMany({
      where: { visible: true }
    })

    // Calcular estadísticas
    const totalProyectos = proyectos.length

    const totalToneladas = proyectos.reduce((sum, p) => {
      return sum + (p.pesoKg ? Number(p.pesoKg) / 1000 : 0)
    }, 0)

    const valorTotal = proyectos.reduce((sum, p) => {
      return sum + Number(p.valorContrato)
    }, 0)

    const departamentosUnicos = Array.from(new Set(proyectos.map(p => p.departamento).filter(Boolean)))

    const ubicacionesUnicas = Array.from(new Set(proyectos.map(p => p.ubicacion)))

    // Proyectos por año
    const proyectosPorAño: Record<number, number> = {}
    proyectos.forEach(p => {
      const año = new Date(p.fechaInicio).getFullYear()
      proyectosPorAño[año] = (proyectosPorAño[año] || 0) + 1
    })

    // Departamentos con más proyectos
    const proyectosPorDepartamento: Record<string, number> = {}
    proyectos.forEach(p => {
      if (p.departamento) {
        proyectosPorDepartamento[p.departamento] = (proyectosPorDepartamento[p.departamento] || 0) + 1
      }
    })

    const stats = {
      totalProyectos,
      totalToneladas: Math.round(totalToneladas),
      valorTotal,
      valorTotalFormateado: `$${(valorTotal / 1000000000).toFixed(1)}B`,
      departamentos: departamentosUnicos.length,
      ubicaciones: ubicacionesUnicas.length,
      proyectosPorAño,
      proyectosPorDepartamento,
      añoInicio: 1996,
      añosExperiencia: new Date().getFullYear() - 1996
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json(
      { error: 'Error al calcular estadísticas' },
      { status: 500 }
    )
  }
}
