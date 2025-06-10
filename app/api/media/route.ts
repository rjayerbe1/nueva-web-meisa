import { NextRequest, NextResponse } from 'next/server'

// Archivos multimedia reales disponibles en el sistema
const mockMediaFiles = [
  // Imágenes Hero
  {
    id: 'hero-1',
    url: '/images/hero/hero-construccion-industrial.jpg',
    name: 'hero-construccion-industrial.jpg',
    type: 'image/jpeg',
    size: 559697,
    category: 'hero',
    uploadedAt: '2024-06-10T09:22:00Z'
  },
  {
    id: 'hero-2',
    url: '/images/hero/puente-metalico.jpg',
    name: 'puente-metalico.jpg',
    type: 'image/jpeg',
    size: 387324,
    category: 'hero',
    uploadedAt: '2024-05-31T16:13:00Z'
  },
  {
    id: 'hero-3',
    url: '/images/hero/edificios.jpg',
    name: 'edificios.jpg',
    type: 'image/jpeg',
    size: 169532,
    category: 'hero',
    uploadedAt: '2024-05-31T16:13:00Z'
  },

  // Imágenes de Servicios
  {
    id: 'servicios-1',
    url: '/images/servicios/construccion-industrial-1.jpg',
    name: 'construccion-industrial-1.jpg',
    type: 'image/jpeg',
    size: 382434,
    category: 'servicios',
    uploadedAt: '2024-06-10T09:21:00Z'
  },
  {
    id: 'servicios-2',
    url: '/images/servicios/construccion-metalica-2.jpg',
    name: 'construccion-metalica-2.jpg',
    type: 'image/jpeg',
    size: 284889,
    category: 'servicios',
    uploadedAt: '2024-06-10T09:21:00Z'
  },
  {
    id: 'servicios-3',
    url: '/images/servicios/fabricacion-1.jpg',
    name: 'fabricacion-1.jpg',
    type: 'image/jpeg',
    size: 313486,
    category: 'servicios',
    uploadedAt: '2024-06-05T08:48:00Z'
  },
  {
    id: 'servicios-4',
    url: '/images/servicios/montaje-1.jpg',
    name: 'montaje-1.jpg',
    type: 'image/jpeg',
    size: 304653,
    category: 'servicios',
    uploadedAt: '2024-06-05T08:51:00Z'
  },
  {
    id: 'servicios-5',
    url: '/images/servicios/gestion-1.jpg',
    name: 'gestion-1.jpg',
    type: 'image/jpeg',
    size: 341543,
    category: 'servicios',
    uploadedAt: '2024-06-05T08:48:00Z'
  },

  // Imágenes de Tecnología
  {
    id: 'tecnologia-1',
    url: '/images/tecnologia/tecnologia-industrial-1.jpg',
    name: 'tecnologia-industrial-1.jpg',
    type: 'image/jpeg',
    size: 227531,
    category: 'tecnologia',
    uploadedAt: '2024-06-10T09:22:00Z'
  },
  {
    id: 'tecnologia-2',
    url: '/images/tecnologia/equipamiento-industrial.jpg',
    name: 'equipamiento-industrial.jpg',
    type: 'image/jpeg',
    size: 161029,
    category: 'tecnologia',
    uploadedAt: '2024-06-10T09:22:00Z'
  },
  {
    id: 'tecnologia-3',
    url: '/images/tecnologia/software-diseno-cad.jpg',
    name: 'software-diseno-cad.jpg',
    type: 'image/jpeg',
    size: 231698,
    category: 'tecnologia',
    uploadedAt: '2024-06-10T09:23:00Z'
  },

  // Imágenes de Certificaciones
  {
    id: 'certificaciones-1',
    url: '/images/certificaciones/certificacion-calidad-1.jpg',
    name: 'certificacion-calidad-1.jpg',
    type: 'image/jpeg',
    size: 495450,
    category: 'certificaciones',
    uploadedAt: '2024-06-10T09:24:00Z'
  },
  {
    id: 'certificaciones-2',
    url: '/images/certificaciones/iso-certificacion.jpg',
    name: 'iso-certificacion.jpg',
    type: 'image/jpeg',
    size: 210751,
    category: 'certificaciones',
    uploadedAt: '2024-06-10T09:24:00Z'
  },

  // Imágenes de Equipo
  {
    id: 'equipo-1',
    url: '/images/equipo/equipo-industrial-1.jpg',
    name: 'equipo-industrial-1.jpg',
    type: 'image/jpeg',
    size: 216030,
    category: 'equipo',
    uploadedAt: '2024-06-10T09:23:00Z'
  },

  // Imágenes de Empresa
  {
    id: 'empresa-1',
    url: '/images/empresa/instalaciones-planta.jpg',
    name: 'instalaciones-planta.jpg',
    type: 'image/jpeg',
    size: 170718,
    category: 'empresa',
    uploadedAt: '2024-06-10T09:23:00Z'
  },

  // Imágenes de Proyectos
  {
    id: 'proyectos-1',
    url: '/images/proyectos/obra-construccion.jpg',
    name: 'obra-construccion.jpg',
    type: 'image/jpeg',
    size: 299135,
    category: 'proyectos',
    uploadedAt: '2024-06-10T09:25:00Z'
  },
  {
    id: 'proyectos-2',
    url: '/images/projects/edificios/tequendama/TEQUENDAMA-PARKING-CALI.jpg',
    name: 'TEQUENDAMA-PARKING-CALI.jpg',
    type: 'image/jpeg',
    size: 230502,
    category: 'proyectos',
    uploadedAt: '2024-05-31T16:13:00Z'
  },
  {
    id: 'proyectos-3',
    url: '/images/projects/industria/tecnofar/TECNOFAR-1.jpg',
    name: 'TECNOFAR-1.jpg',
    type: 'image/jpeg',
    size: 491277,
    category: 'proyectos',
    uploadedAt: '2024-05-31T16:13:00Z'
  },

  // Imágenes Generales
  {
    id: 'general-1',
    url: '/images/general/industria-general.jpg',
    name: 'industria-general.jpg',
    type: 'image/jpeg',
    size: 324249,
    category: 'general',
    uploadedAt: '2024-06-10T09:26:00Z'
  },
  {
    id: 'general-2',
    url: '/images/banners/banner-proyectos-oscura.jpg',
    name: 'banner-proyectos-oscura.jpg',
    type: 'image/jpeg',
    size: 2681164,
    category: 'general',
    uploadedAt: '2024-06-02T12:37:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredFiles = mockMediaFiles

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.category === category)
    }

    // Filtrar por búsqueda
    if (search) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      files: filteredFiles,
      total: filteredFiles.length
    })
  } catch (error) {
    console.error('Error fetching media files:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener archivos multimedia' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionaron archivos' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validaciones
      if (!file.type.startsWith('image/')) {
        continue // Saltar archivos que no son imágenes
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        continue // Saltar archivos muy grandes
      }

      // En un caso real, aquí subirías el archivo a un servicio de almacenamiento
      // Por ahora simulamos la respuesta
      const newFile = {
        id: Date.now().toString() + Math.random(),
        url: `/uploads/${file.name}`, // En real, sería la URL del servicio
        name: file.name,
        type: file.type,
        size: file.size,
        category: category,
        uploadedAt: new Date().toISOString()
      }

      uploadedFiles.push(newFile)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Se subieron ${uploadedFiles.length} archivo(s) correctamente`
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { success: false, error: 'Error al subir archivos' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'ID de archivo requerido' },
        { status: 400 }
      )
    }

    // En un caso real, aquí eliminarías el archivo del servicio de almacenamiento
    
    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado correctamente'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar archivo' },
      { status: 500 }
    )
  }
}