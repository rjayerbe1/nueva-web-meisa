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

    // Si la URL viene del upload API, reorganizar el archivo
    let finalUrl = data.url
    if (data.url && data.originalFileName) {
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
    
    const image = await prisma.imagenProyecto.create({
      data: {
        url: finalUrl,
        alt: data.descripcion || 'Imagen del proyecto',
        descripcion: data.descripcion || null,
        proyectoId: data.proyectoId,
      },
      include: {
        proyecto: {
          select: {
            titulo: true,
          }
        }
      }
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}