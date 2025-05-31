import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los clientes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const mostrarEnHome = searchParams.get('mostrarEnHome')
    const activo = searchParams.get('activo')

    const where: any = {}
    
    if (sector) {
      where.sector = sector
    }
    
    if (mostrarEnHome !== null) {
      where.mostrarEnHome = mostrarEnHome === 'true'
    }
    
    if (activo !== null) {
      where.activo = activo === 'true'
    } else {
      where.activo = true // Por defecto solo activos
    }

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: [
        { destacado: 'desc' },
        { orden: 'asc' },
        { nombre: 'asc' }
      ]
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Error fetching clientes:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Generar slug si no existe
    if (!data.slug) {
      data.slug = data.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        logo: data.logo,
        logoBlanco: data.logoBlanco,
        descripcion: data.descripcion,
        sitioWeb: data.sitioWeb,
        sector: data.sector,
        proyectoDestacado: data.proyectoDestacado,
        capacidadProyecto: data.capacidadProyecto,
        ubicacionProyecto: data.ubicacionProyecto,
        mostrarEnHome: data.mostrarEnHome ?? true,
        destacado: data.destacado ?? false,
        orden: data.orden ?? 0,
        activo: data.activo ?? true,
        slug: data.slug
      }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error creating cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}