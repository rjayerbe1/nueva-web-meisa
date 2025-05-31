import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, CategoriaEnum } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const categorias = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validar que el key sea válido
    if (!Object.values(CategoriaEnum).includes(data.key)) {
      return NextResponse.json({ error: 'Clave de categoría inválida' }, { status: 400 })
    }

    // Generar slug si no se proporciona
    const slug = data.slug || data.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()

    const categoria = await prisma.categoriaProyecto.create({
      data: {
        key: data.key,
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        slug,
        imagenCover: data.imagenCover || null,
        icono: data.icono || null,
        color: data.color || null,
        colorSecundario: data.colorSecundario || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        orden: data.orden || 0,
        visible: data.visible !== undefined ? data.visible : true,
        destacada: data.destacada !== undefined ? data.destacada : false,
      }
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con esa clave o slug' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}