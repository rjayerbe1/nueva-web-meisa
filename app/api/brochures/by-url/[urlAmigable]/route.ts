import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { urlAmigable: string } }
) {
  try {
    // Buscar brochure publicado por URL amigable
    const brochure = await prisma.brochure.findUnique({
      where: {
        urlAmigable: params.urlAmigable
      },
      include: {
        template: {
          include: {
            pages: {
              orderBy: { orden: 'asc' }
            }
          }
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            key: true
          }
        },
        pages: {
          where: { visible: true },
          orderBy: { orden: 'asc' }
        }
      }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Solo permitir acceso si está publicado y activo
    if (!brochure.publicado || !brochure.activo) {
      return NextResponse.json({ error: "Brochure no disponible" }, { status: 403 })
    }

    // Incrementar contador de vistas (opcional)
    try {
      await prisma.brochureAnalytics.upsert({
        where: {
          brochureId: brochure.id
        },
        update: {
          vistas: {
            increment: 1
          }
        },
        create: {
          brochureId: brochure.id,
          vistas: 1,
          descargas: 0,
          compartidos: 0
        }
      })
    } catch (analyticsError) {
      console.error('Error updating analytics:', analyticsError)
      // No fallar si hay error en analytics
    }

    return NextResponse.json(brochure)

  } catch (error) {
    console.error('Error obteniendo brochure por URL:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
