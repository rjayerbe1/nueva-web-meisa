import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

/**
 * GET /api/admin/site-config
 * Obtener la configuración global del sitio
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar la configuración global (siempre hay una sola fila con key="global")
    let config = await prisma.siteConfig.findUnique({
      where: { key: 'global' }
    })

    // Si no existe, crearla con valores por defecto
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          key: 'global',
          categoryIconSize: 48
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/site-config
 * Actualizar la configuración global del sitio
 * Requiere rol ADMIN o EDITOR
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    console.log('Updating site config:', data)

    // Buscar la configuración global
    let config = await prisma.siteConfig.findUnique({
      where: { key: 'global' }
    })

    // Si no existe, crearla
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          key: 'global',
          categoryIconSize: data.categoryIconSize || 48
        }
      })
    } else {
      // Actualizar solo los campos proporcionados
      const updateData: any = {}
      if (data.categoryIconSize !== undefined) {
        updateData.categoryIconSize = data.categoryIconSize
      }

      config = await prisma.siteConfig.update({
        where: { key: 'global' },
        data: updateData
      })
    }

    console.log('✅ Configuración global actualizada:', config)

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating site config:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error as Error).message },
      { status: 500 }
    )
  }
}
