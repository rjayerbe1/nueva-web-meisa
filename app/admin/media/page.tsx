import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { Image as ImageIcon, Upload, FolderOpen, FileImage } from "lucide-react"
import MediaCard from "@/components/admin/MediaCard"
import MediaPageClient from "@/components/admin/MediaPageClient"

async function getProjectImages() {
  return await prisma.imagenProyecto.findMany({
    include: {
      proyecto: {
        select: {
          titulo: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getProjects() {
  return await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function MediaPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const [images, projects] = await Promise.all([
    getProjectImages(),
    getProjects()
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Media</h1>
          <p className="mt-2 text-lg text-gray-600">
            Administra las imágenes y archivos multimedia
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <MediaPageClient projects={projects} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Imágenes</p>
              <p className="text-2xl font-bold text-gray-900">{images.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Proyectos con Media</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(images.map(img => img.proyectoId)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileImage className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tamaño Total</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Biblioteca de Imágenes</h2>
        
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <MediaCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay imágenes</h3>
            <p className="text-gray-500 mb-4">Las imágenes subidas aparecerán aquí</p>
            <MediaPageClient projects={projects} />
          </div>
        )}
      </div>
    </div>
  )
}