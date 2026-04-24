import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { id: params.id },
      select: { key: true },
    })
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 },
      )
    }

    const proyectos = await prisma.proyecto.findMany({
      where: { categoria: categoria.key as any },
      select: {
        id: true,
        titulo: true,
        slug: true,
        ubicacion: true,
        visible: true,
        destacado: true,
        fechaInicio: true,
        toneladas: true,
        imagenes: {
          orderBy: { orden: 'asc' },
          take: 1,
          select: { url: true, urlOptimized: true, alt: true },
        },
      },
      orderBy: [{ destacado: 'desc' }, { fechaInicio: 'desc' }],
    })

    return NextResponse.json(proyectos)
  } catch (error) {
    console.error('[admin/categories/[id]/projects GET]', error)
    return NextResponse.json(
      { error: 'Error al listar proyectos' },
      { status: 500 },
    )
  }
}
