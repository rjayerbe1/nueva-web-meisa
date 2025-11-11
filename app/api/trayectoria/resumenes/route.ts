import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Listar todos los resúmenes de años
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visible = searchParams.get('visible')

    const where = visible === 'true' ? { visible: true } : {}

    const resumenes = await prisma.resumenAnio.findMany({
      where,
      orderBy: { anio: 'desc' }
    })

    return NextResponse.json(resumenes)
  } catch (error) {
    console.error('Error fetching resúmenes:', error)
    return NextResponse.json(
      { error: 'Error al obtener resúmenes' },
      { status: 500 }
    )
  }
}

// POST - Crear o actualizar resumen (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const resumen = await prisma.resumenAnio.upsert({
      where: { anio: body.anio },
      update: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categorias: body.categorias || null,
        imagenesFeatured: body.imagenesFeatured || null,
        estadisticas: body.estadisticas || null,
        visible: body.visible !== false
      },
      create: {
        anio: body.anio,
        titulo: body.titulo,
        descripcion: body.descripcion,
        categorias: body.categorias || null,
        imagenesFeatured: body.imagenesFeatured || null,
        estadisticas: body.estadisticas || null,
        visible: body.visible !== false
      }
    })

    return NextResponse.json(resumen)
  } catch (error) {
    console.error('Error creating/updating resumen:', error)
    return NextResponse.json(
      { error: 'Error al crear/actualizar resumen' },
      { status: 500 }
    )
  }
}
