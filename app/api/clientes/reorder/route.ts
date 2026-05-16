import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const items: Array<{ id: string; orden: number }> = Array.isArray(body?.items) ? body.items : []

    if (items.length === 0) {
      return NextResponse.json({ error: 'items requerido' }, { status: 400 })
    }

    for (const it of items) {
      if (typeof it?.id !== 'string' || !Number.isFinite(it?.orden)) {
        return NextResponse.json({ error: 'items inválidos' }, { status: 400 })
      }
    }

    await prisma.$transaction(
      items.map((it) =>
        prisma.cliente.update({
          where: { id: it.id },
          data: { orden: it.orden },
        })
      )
    )

    return NextResponse.json({ ok: true, count: items.length })
  } catch (error) {
    console.error('Error reordenando clientes:', error)
    return NextResponse.json({ error: 'Error al reordenar' }, { status: 500 })
  }
}
