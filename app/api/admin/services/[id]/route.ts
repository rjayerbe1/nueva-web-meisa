import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { VALID_SERVICE_COLORS, isValidServiceColor } from '@/lib/service-colors'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const service = await prisma.servicio.findUnique({
      where: { id: params.id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validar color
    if (data.color && !isValidServiceColor(data.color)) {
      return NextResponse.json(
        { error: `Color no válido. Debe ser uno de: ${VALID_SERVICE_COLORS.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    // Generar nuevo slug si el nombre cambió
    const slug = data.nombre
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const service = await prisma.servicio.update({
      where: { id: params.id },
      data: {
        nombre: data.nombre,
        titulo: data.titulo || null,
        subtitulo: data.subtitulo || null,
        slug: slug,
        descripcion: data.descripcion,
        caracteristicas: data.caracteristicas || [],
        capacidades: data.capacidades || [],
        tecnologias: data.tecnologias || null,
        normativas: data.normativas || null,
        equipamiento: data.equipamiento || null,
        certificaciones: data.certificaciones || null,
        metodologia: data.metodologia || null,
        ventajas: data.ventajas || null,
        equipos: data.equipos || null,
        seguridad: data.seguridad || null,
        expertiseTitulo: data.expertiseTitulo || null,
        expertiseDescripcion: data.expertiseDescripcion || null,
        orden: data.orden || 999,
        icono: data.icono || null,
        imagen: data.imagen || null,
        color: data.color || 'blue',
        bgGradient: data.bgGradient || null,
        destacado: data.destacado || false,
        activo: data.activo !== undefined ? data.activo : true,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.servicio.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Servicio eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}