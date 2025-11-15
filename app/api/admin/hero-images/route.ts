import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { defaultHeroImages, HeroImageConfig } from '@/lib/hero-config'

// GET - Obtener configuración actual de imágenes del Hero
export async function GET() {
  try {
    const config = await prisma.configuracionSitio.findUnique({
      where: { clave: 'hero_images' }
    })

    if (!config) {
      // Si no existe configuración, devolver las imágenes por defecto
      return NextResponse.json({
        success: true,
        data: defaultHeroImages
      })
    }

    const heroImages: HeroImageConfig = JSON.parse(config.valor)
    return NextResponse.json({
      success: true,
      data: heroImages
    })
  } catch (error) {
    console.error('Error obteniendo imágenes del hero:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo configuración' },
      { status: 500 }
    )
  }
}

// POST - Actualizar configuración de imágenes del Hero (solo admins)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { leftColumn, centerTop, centerBottom, rightTop, rightBottom } = body

    // Validar que todas las imágenes estén presentes
    if (!leftColumn || !centerTop || !centerBottom || !rightTop || !rightBottom) {
      return NextResponse.json(
        { success: false, error: 'Todas las imágenes son requeridas' },
        { status: 400 }
      )
    }

    const heroConfig: HeroImageConfig = {
      leftColumn,
      centerTop,
      centerBottom,
      rightTop,
      rightBottom,
    }

    // Guardar o actualizar en la base de datos
    await prisma.configuracionSitio.upsert({
      where: { clave: 'hero_images' },
      create: {
        clave: 'hero_images',
        valor: JSON.stringify(heroConfig),
        tipo: 'JSON',
        descripcion: 'Configuración de imágenes del Hero Section',
        categoria: 'hero'
      },
      update: {
        valor: JSON.stringify(heroConfig),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: heroConfig
    })
  } catch (error) {
    console.error('Error actualizando imágenes del hero:', error)
    return NextResponse.json(
      { success: false, error: 'Error guardando configuración' },
      { status: 500 }
    )
  }
}
