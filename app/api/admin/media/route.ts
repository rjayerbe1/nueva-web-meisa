import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { generateImagePath, ensureDirectoryExists, getNextImageIndex, generateFileNameWithDimensions } from '@/lib/image-utils'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const images = await prisma.imagenProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching media:', error)
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
    console.log('[Media API] Received data:', JSON.stringify(data, null, 2))

    // Si la URL viene del upload API, reorganizar el archivo (solo si hay proyecto)
    let finalUrl = data.url
    if (data.proyectoId && data.url && data.originalFileName) {
      // Obtener información del proyecto
      const proyecto = await prisma.proyecto.findUnique({
        where: { id: data.proyectoId },
        select: {
          titulo: true,
          categoria: true,
          imagenes: {
            select: { url: true }
          }
        }
      })

      if (!proyecto) {
        return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
      }

      try {
        // Obtener siguiente índice de imagen
        const imageIndex = getNextImageIndex(proyecto.imagenes)

        // Generar nueva ruta organizada
        const newImagePath = generateImagePath(
          proyecto.categoria,
          proyecto.titulo,
          data.originalFileName,
          imageIndex
        )

        // Asegurar que el directorio existe
        ensureDirectoryExists(path.dirname(newImagePath))

        // Mover archivo desde upload temporal a estructura organizada
        const currentPath = path.join(process.cwd(), 'public', data.url.replace('/images/', 'images/'))
        const newPath = path.join(process.cwd(), 'public', 'images', 'projects', newImagePath)

        if (fs.existsSync(currentPath)) {
          fs.renameSync(currentPath, newPath)
          finalUrl = `/images/projects/${newImagePath}`
        }
      } catch (moveError) {
        console.error('Error reorganizando archivo:', moveError)
        // Continuar con URL original si falla la reorganización
      }
    }
    
    // Asegurar que proyectoId sea null si está vacío o no existe
    const proyectoId = data.proyectoId && data.proyectoId.trim() !== '' ? data.proyectoId : null

    const createData = {
      url: finalUrl,
      alt: data.descripcion || 'Imagen del proyecto',
      descripcion: data.descripcion || null,
      proyectoId: proyectoId,
    }
    console.log('[Media API] Create data:', JSON.stringify(createData, null, 2))
    console.log('[Media API] proyectoId exists?', proyectoId !== null)

    const image = proyectoId
      ? await prisma.imagenProyecto.create({
          data: createData,
          include: {
            proyecto: {
              select: {
                titulo: true,
              }
            }
          }
        })
      : await prisma.imagenProyecto.create({
          data: createData,
        })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}