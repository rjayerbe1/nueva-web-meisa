import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener configuración
export async function GET() {
  try {
    const config = await prisma.configuracionTrayectoria.findFirst()

    if (!config) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración (requiere autenticación)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Buscar configuración existente
    const existingConfig = await prisma.configuracionTrayectoria.findFirst()

    let config
    if (existingConfig) {
      // Actualizar existente
      config = await prisma.configuracionTrayectoria.update({
        where: { id: existingConfig.id },
        data: {
          resenaHistorica: body.resenaHistorica,
          mision: body.mision,
          vision: body.vision,
          valores: body.valores
        }
      })
    } else {
      // Crear nueva
      config = await prisma.configuracionTrayectoria.create({
        data: {
          resenaHistorica: body.resenaHistorica,
          mision: body.mision,
          vision: body.vision,
          valores: body.valores
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
}
