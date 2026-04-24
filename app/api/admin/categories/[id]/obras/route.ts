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

    const obras = await prisma.obra.findMany({
      where: { categoria: categoria.key as any },
      select: {
        id: true,
        slug: true,
        titulo: true,
        resumenCorto: true,
        activa: true,
        destacada: true,
        imagenDestacada: true,
        _count: { select: { proyectos: true } },
      },
      orderBy: [{ destacada: 'desc' }, { updatedAt: 'desc' }],
    })

    return NextResponse.json(obras)
  } catch (error) {
    console.error('[admin/categories/[id]/obras GET]', error)
    return NextResponse.json(
      { error: 'Error al listar obras' },
      { status: 500 },
    )
  }
}
