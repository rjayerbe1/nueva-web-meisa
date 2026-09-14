import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'
import { TAGS } from '@/lib/cache/tags'

export const revalidate = 3600

const getResumenes = cachedContent(
  ['api-trayectoria-resumenes'],
  [TAGS.trayectoria],
  async (soloVisibles: boolean) =>
    prisma.resumenAnio.findMany({
      where: soloVisibles ? { visible: true } : {},
      orderBy: { anio: 'desc' }
    }),
)

// GET - Listar todos los resúmenes de años
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visible = searchParams.get('visible')

    const resumenes = await getResumenes(visible === 'true')

    return NextResponse.json(resumenes, { headers: PUBLIC_API_CACHE_HEADERS })
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
