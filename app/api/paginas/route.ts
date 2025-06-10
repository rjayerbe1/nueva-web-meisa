import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const incluirSecciones = searchParams.get('incluirSecciones') === 'true'

    if (slug) {
      // Obtener página específica por slug
      const pagina = await prisma.pagina.findUnique({
        where: { slug },
        include: incluirSecciones ? {
          secciones: {
            where: { visible: true },
            orderBy: { orden: 'asc' }
          }
        } : undefined
      })

      if (!pagina) {
        return NextResponse.json(
          { error: 'Página no encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json(pagina)
    }

    // Obtener todas las páginas
    const paginas = await prisma.pagina.findMany({
      where: { activa: true },
      orderBy: { titulo: 'asc' }
    })

    return NextResponse.json(paginas)
  } catch (error) {
    console.error('Error al obtener páginas:', error)
    return NextResponse.json(
      { error: 'Error al obtener páginas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const pagina = await prisma.pagina.create({
      data: {
        slug: data.slug,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contenido: data.contenido || {},
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        imagenHero: data.imagenHero,
        imagenBanner: data.imagenBanner,
        activa: data.activa ?? true
      }
    })

    return NextResponse.json(pagina, { status: 201 })
  } catch (error) {
    console.error('Error al crear página:', error)
    return NextResponse.json(
      { error: 'Error al crear página' },
      { status: 500 }
    )
  }
}