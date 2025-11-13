import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

/**
 * POST - Duplicar una plantilla de página
 * Crea una copia exacta de la plantilla con un nuevo ID y nombre modificado
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    // Buscar la plantilla original
    const originalTemplate = await prisma.pageTemplate.findUnique({
      where: { id: params.id }
    })

    if (!originalTemplate) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    // Crear el nuevo nombre (agregar " (Copia)" o " (Copia 2)", etc.)
    let newName = `${originalTemplate.nombre} (Copia)`
    let copyNumber = 1

    // Verificar si ya existe una plantilla con ese nombre
    while (await prisma.pageTemplate.findFirst({ where: { nombre: newName } })) {
      copyNumber++
      newName = `${originalTemplate.nombre} (Copia ${copyNumber})`
    }

    // Crear la plantilla duplicada
    const duplicatedTemplate = await prisma.pageTemplate.create({
      data: {
        nombre: newName,
        descripcion: originalTemplate.descripcion,
        thumbnail: originalTemplate.thumbnail,
        categoria: originalTemplate.categoria,
        canvasData: originalTemplate.canvasData,
        configuracion: originalTemplate.configuracion,
        isPublic: originalTemplate.isPublic,
        createdBy: session.user.id,
        usageCount: 0 // Resetear contador de uso
      }
    })

    return NextResponse.json(duplicatedTemplate, { status: 201 })

  } catch (error) {
    console.error('Error duplicating page template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
