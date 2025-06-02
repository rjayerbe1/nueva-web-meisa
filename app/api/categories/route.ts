import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoriaProyecto.findMany({
      where: {
        visible: true
      },
      orderBy: { orden: 'asc' }
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}