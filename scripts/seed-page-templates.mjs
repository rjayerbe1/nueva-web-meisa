#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Plantillas prediseñadas con datos de Fabric.js
const templates = [
  {
    nombre: 'Portada Estándar MEISA',
    descripcion: 'Portada con logo MEISA, título grande y subtítulo para brochures',
    categoria: 'Portadas',
    thumbnail: null,
    isPublic: true,
    configuracion: {
      width: 1200,
      height: 800
    },
    canvasData: {
      version: '5.3.0',
      objects: [
        // Fondo azul MEISA
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 800,
          fill: '#1e40af',
          selectable: false,
          evented: false
        },
        // Título principal
        {
          type: 'i-text',
          left: 600,
          top: 300,
          width: 800,
          fontSize: 72,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'PORTAFOLIO DE PROYECTOS',
          textAlign: 'center',
          originX: 'center',
          originY: 'center'
        },
        // Subtítulo
        {
          type: 'i-text',
          left: 600,
          top: 400,
          width: 600,
          fontSize: 32,
          fontFamily: 'Inter, sans-serif',
          fill: '#f8fafc',
          text: 'METÁLICAS E INGENIERÍA S.A.',
          textAlign: 'center',
          originX: 'center',
          originY: 'center'
        },
        // Año
        {
          type: 'i-text',
          left: 600,
          top: 480,
          fontSize: 48,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#dc2626',
          text: '2025',
          textAlign: 'center',
          originX: 'center',
          originY: 'center'
        },
        // Línea decorativa
        {
          type: 'rect',
          left: 400,
          top: 520,
          width: 400,
          height: 4,
          fill: '#dc2626'
        }
      ]
    }
  },
  {
    nombre: 'Proyecto 3 Fotos - Horizontal',
    descripcion: 'Layout para proyecto con 3 imágenes horizontales, título y descripción',
    categoria: 'Proyectos',
    thumbnail: null,
    isPublic: true,
    configuracion: {
      width: 1200,
      height: 800
    },
    canvasData: {
      version: '5.3.0',
      objects: [
        // Fondo blanco
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 800,
          fill: '#ffffff',
          selectable: false,
          evented: false
        },
        // Barra superior azul
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 120,
          fill: '#1e40af',
          selectable: false
        },
        // Título del proyecto
        {
          type: 'i-text',
          left: 60,
          top: 35,
          fontSize: 42,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#ffffff',
          text: 'NOMBRE DEL PROYECTO'
        },
        // Subtítulo/Cliente
        {
          type: 'i-text',
          left: 60,
          top: 85,
          fontSize: 20,
          fontFamily: 'Inter, sans-serif',
          fill: '#f8fafc',
          text: 'Cliente - Ubicación'
        },
        // Placeholder Imagen 1
        {
          type: 'rect',
          left: 60,
          top: 160,
          width: 340,
          height: 240,
          fill: '#e5e7eb',
          stroke: '#9ca3af',
          strokeWidth: 2
        },
        {
          type: 'i-text',
          left: 230,
          top: 270,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fill: '#6b7280',
          text: 'Imagen 1',
          originX: 'center',
          originY: 'center'
        },
        // Placeholder Imagen 2
        {
          type: 'rect',
          left: 430,
          top: 160,
          width: 340,
          height: 240,
          fill: '#e5e7eb',
          stroke: '#9ca3af',
          strokeWidth: 2
        },
        {
          type: 'i-text',
          left: 600,
          top: 270,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fill: '#6b7280',
          text: 'Imagen 2',
          originX: 'center',
          originY: 'center'
        },
        // Placeholder Imagen 3
        {
          type: 'rect',
          left: 800,
          top: 160,
          width: 340,
          height: 240,
          fill: '#e5e7eb',
          stroke: '#9ca3af',
          strokeWidth: 2
        },
        {
          type: 'i-text',
          left: 970,
          top: 270,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fill: '#6b7280',
          text: 'Imagen 3',
          originX: 'center',
          originY: 'center'
        },
        // Sección de descripción
        {
          type: 'i-text',
          left: 60,
          top: 440,
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'Descripción del Proyecto'
        },
        // Texto de descripción
        {
          type: 'textbox',
          left: 60,
          top: 490,
          width: 1080,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fill: '#334155',
          text: 'Escriba aquí la descripción detallada del proyecto, incluyendo características técnicas, materiales utilizados, plazos de ejecución y cualquier otro detalle relevante que destaque la calidad y profesionalismo de MEISA.',
          textAlign: 'justify'
        },
        // Datos técnicos
        {
          type: 'rect',
          left: 60,
          top: 630,
          width: 360,
          height: 120,
          fill: '#f1f5f9',
          stroke: '#cbd5e1',
          strokeWidth: 1
        },
        {
          type: 'i-text',
          left: 80,
          top: 650,
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: '📏 ÁREA: 500 m²'
        },
        {
          type: 'i-text',
          left: 80,
          top: 680,
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: '⏱️ DURACIÓN: 6 meses'
        },
        {
          type: 'i-text',
          left: 80,
          top: 710,
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: '📅 AÑO: 2025'
        }
      ]
    }
  },
  {
    nombre: 'Galería 2x2',
    descripcion: 'Página con 4 imágenes en cuadrícula 2x2 con títulos',
    categoria: 'Galerías',
    thumbnail: null,
    isPublic: true,
    configuracion: {
      width: 1200,
      height: 800
    },
    canvasData: {
      version: '5.3.0',
      objects: [
        // Fondo blanco
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 800,
          fill: '#ffffff',
          selectable: false,
          evented: false
        },
        // Título de galería
        {
          type: 'i-text',
          left: 60,
          top: 40,
          fontSize: 48,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'GALERÍA DE IMÁGENES'
        },
        // Línea decorativa
        {
          type: 'rect',
          left: 60,
          top: 105,
          width: 300,
          height: 4,
          fill: '#dc2626'
        },
        // Imagen 1
        {
          type: 'rect',
          left: 60,
          top: 140,
          width: 520,
          height: 280,
          fill: '#e5e7eb',
          stroke: '#1e40af',
          strokeWidth: 3
        },
        {
          type: 'i-text',
          left: 320,
          top: 270,
          fontSize: 20,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#6b7280',
          text: 'Imagen 1',
          originX: 'center',
          originY: 'center'
        },
        // Imagen 2
        {
          type: 'rect',
          left: 620,
          top: 140,
          width: 520,
          height: 280,
          fill: '#e5e7eb',
          stroke: '#1e40af',
          strokeWidth: 3
        },
        {
          type: 'i-text',
          left: 880,
          top: 270,
          fontSize: 20,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#6b7280',
          text: 'Imagen 2',
          originX: 'center',
          originY: 'center'
        },
        // Imagen 3
        {
          type: 'rect',
          left: 60,
          top: 460,
          width: 520,
          height: 280,
          fill: '#e5e7eb',
          stroke: '#1e40af',
          strokeWidth: 3
        },
        {
          type: 'i-text',
          left: 320,
          top: 590,
          fontSize: 20,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#6b7280',
          text: 'Imagen 3',
          originX: 'center',
          originY: 'center'
        },
        // Imagen 4
        {
          type: 'rect',
          left: 620,
          top: 460,
          width: 520,
          height: 280,
          fill: '#e5e7eb',
          stroke: '#1e40af',
          strokeWidth: 3
        },
        {
          type: 'i-text',
          left: 880,
          top: 590,
          fontSize: 20,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#6b7280',
          text: 'Imagen 4',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  },
  {
    nombre: 'Página de Texto',
    descripcion: 'Página simple con título y área de texto largo',
    categoria: 'Contenido',
    thumbnail: null,
    isPublic: true,
    configuracion: {
      width: 1200,
      height: 800
    },
    canvasData: {
      version: '5.3.0',
      objects: [
        // Fondo blanco
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 800,
          fill: '#ffffff',
          selectable: false,
          evented: false
        },
        // Franja lateral azul
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 20,
          height: 800,
          fill: '#1e40af',
          selectable: false
        },
        // Título principal
        {
          type: 'i-text',
          left: 80,
          top: 80,
          fontSize: 54,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'TÍTULO DE LA SECCIÓN'
        },
        // Línea decorativa roja
        {
          type: 'rect',
          left: 80,
          top: 150,
          width: 200,
          height: 5,
          fill: '#dc2626'
        },
        // Área de contenido
        {
          type: 'textbox',
          left: 80,
          top: 200,
          width: 1040,
          fontSize: 18,
          fontFamily: 'Inter, sans-serif',
          fill: '#334155',
          lineHeight: 1.6,
          text: 'Este es un espacio para contenido de texto largo. Puede incluir descripciones detalladas de servicios, información técnica, procesos de trabajo, o cualquier contenido relevante.\n\nMEISA - Metálicas e Ingeniería S.A. se especializa en proyectos de estructuras metálicas de alta complejidad, ofreciendo soluciones integrales desde el diseño hasta la construcción.\n\nNuestros servicios incluyen:\n• Diseño estructural\n• Fabricación de estructuras metálicas\n• Montaje e instalación\n• Control de calidad\n\nPuede modificar este texto y adaptarlo a sus necesidades específicas.',
          textAlign: 'justify'
        }
      ]
    }
  },
  {
    nombre: 'Imagen Grande + Texto',
    descripcion: 'Layout con imagen destacada grande y texto descriptivo',
    categoria: 'Proyectos',
    thumbnail: null,
    isPublic: true,
    configuracion: {
      width: 1200,
      height: 800
    },
    canvasData: {
      version: '5.3.0',
      objects: [
        // Fondo blanco
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 1200,
          height: 800,
          fill: '#ffffff',
          selectable: false,
          evented: false
        },
        // Título
        {
          type: 'i-text',
          left: 60,
          top: 50,
          fontSize: 42,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'PROYECTO DESTACADO'
        },
        // Imagen principal grande
        {
          type: 'rect',
          left: 60,
          top: 130,
          width: 700,
          height: 500,
          fill: '#e5e7eb',
          stroke: '#1e40af',
          strokeWidth: 3
        },
        {
          type: 'i-text',
          left: 410,
          top: 370,
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#6b7280',
          text: 'Imagen Principal',
          originX: 'center',
          originY: 'center'
        },
        // Panel de información lateral
        {
          type: 'rect',
          left: 800,
          top: 130,
          width: 340,
          height: 500,
          fill: '#f8fafc',
          stroke: '#cbd5e1',
          strokeWidth: 2
        },
        // Texto lateral
        {
          type: 'i-text',
          left: 830,
          top: 160,
          fontSize: 28,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#1e40af',
          text: 'Detalles'
        },
        {
          type: 'textbox',
          left: 830,
          top: 220,
          width: 280,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fill: '#334155',
          lineHeight: 1.5,
          text: 'Descripción del proyecto destacado.\n\n📍 Ubicación: [Ciudad]\n\n🏗️ Tipo: Estructura metálica\n\n📏 Dimensiones: [Medidas]\n\n⏱️ Duración: [Tiempo]\n\n✅ Estado: Completado'
        },
        // Logo o marca de agua MEISA
        {
          type: 'i-text',
          left: 60,
          top: 670,
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fill: '#94a3b8',
          text: 'MEISA - Metálicas e Ingeniería S.A.'
        }
      ]
    }
  }
]

async function main() {
  console.log('🌱 Seeding page templates...\n')

  // Buscar un usuario admin para asignar como creador
  const adminUser = await prisma.user.findFirst({
    where: {
      role: 'ADMIN'
    }
  })

  if (!adminUser) {
    console.error('❌ Error: No se encontró un usuario ADMIN en la base de datos')
    console.log('💡 Crea primero un usuario admin antes de ejecutar este script')
    return
  }

  console.log(`✅ Usuario admin encontrado: ${adminUser.email}\n`)

  for (const template of templates) {
    try {
      // Verificar si ya existe una plantilla con el mismo nombre
      const existing = await prisma.pageTemplate.findFirst({
        where: { nombre: template.nombre }
      })

      if (existing) {
        console.log(`⏭️  Plantilla "${template.nombre}" ya existe, saltando...`)
        continue
      }

      const created = await prisma.pageTemplate.create({
        data: {
          ...template,
          createdBy: adminUser.id
        }
      })

      console.log(`✅ Creada: "${created.nombre}" (${created.categoria})`)
    } catch (error) {
      console.error(`❌ Error creando "${template.nombre}":`, error.message)
    }
  }

  console.log('\n🎉 Seeding completado!')

  // Mostrar resumen
  const totalTemplates = await prisma.pageTemplate.count()
  console.log(`\n📊 Total de plantillas en base de datos: ${totalTemplates}`)
}

main()
  .catch((e) => {
    console.error('❌ Error general:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
