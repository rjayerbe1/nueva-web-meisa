import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/site-config
 * Obtener la configuración pública del sitio (sin autenticación)
 * Solo devuelve datos públicos como categoryIconSize
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar la configuración global (siempre hay una sola fila con key="global")
    let config = await prisma.siteConfig.findUnique({
      where: { key: 'global' },
      select: {
        categoryIconSize: true
        // Aquí solo seleccionamos campos públicos
      }
    })

    // Si no existe, devolver valores por defecto
    if (!config) {
      config = {
        categoryIconSize: 48
      }
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching public site config:', error)
    // Devolver valores por defecto en caso de error
    return NextResponse.json({
      categoryIconSize: 48
    })
  }
}
