import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { VALID_SERVICE_COLORS, isValidServiceColor } from '@/lib/service-colors'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const services = await prisma.servicio.findMany({
      orderBy: { orden: 'asc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
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
    
    // Validar color
    if (data.color && !isValidServiceColor(data.color)) {
      return NextResponse.json(
        { error: `Color no válido. Debe ser uno de: ${VALID_SERVICE_COLORS.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    // Generar slug a partir del nombre
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
    
    const service = await prisma.servicio.create({
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

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}