#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Colores MEISA del PDF
const MEISA_BLUE = '#1e40af'
const MEISA_RED = '#dc2626'
const MEISA_DARK_BLUE = '#1e3a8a'
const WHITE = '#ffffff'
const GRAY_100 = '#f3f4f6'
const GRAY_800 = '#1f2937'

// Dimensiones estándar
const WIDTH = 1200
const HEIGHT = 800

/**
 * 1. Portada MEISA - Formas Geométricas
 * Inspirado en la portada del PDF con formas geométricas azules y rojas
 */
function createPortadaTemplate() {
  return {
    version: '5.3.0',
    objects: [
      // Fondo blanco
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: WHITE,
        selectable: false
      },
      // Diagonal azul grande (esquina superior derecha)
      {
        type: 'polygon',
        left: 700,
        top: 0,
        width: 500,
        height: 400,
        fill: MEISA_BLUE,
        points: [
          { x: 0, y: 0 },
          { x: 500, y: 0 },
          { x: 500, y: 400 },
          { x: 200, y: 400 }
        ],
        opacity: 0.9
      },
      // Diagonal roja (esquina inferior izquierda)
      {
        type: 'polygon',
        left: 0,
        top: 500,
        width: 400,
        height: 300,
        fill: MEISA_RED,
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 0 },
          { x: 0, y: 300 }
        ],
        opacity: 0.9
      },
      // Rectángulo azul claro decorativo
      {
        type: 'rect',
        left: 150,
        top: 250,
        width: 300,
        height: 8,
        fill: MEISA_BLUE,
        opacity: 0.6
      },
      // Área para logo MEISA (placeholder)
      {
        type: 'rect',
        left: 100,
        top: 100,
        width: 200,
        height: 100,
        fill: GRAY_100,
        stroke: MEISA_BLUE,
        strokeWidth: 2,
        rx: 8,
        ry: 8
      },
      {
        type: 'text',
        left: 150,
        top: 140,
        text: 'LOGO',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: MEISA_BLUE,
        textAlign: 'center'
      },
      // Título principal
      {
        type: 'textbox',
        left: 100,
        top: 300,
        width: 700,
        text: 'PORTAFOLIO\nEDIFICACIONES',
        fontSize: 64,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: MEISA_DARK_BLUE,
        lineHeight: 1.2
      },
      // Subtítulo
      {
        type: 'textbox',
        left: 100,
        top: 480,
        width: 500,
        text: 'Metálicas e Ingeniería S.A.',
        fontSize: 28,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        fill: GRAY_800
      },
      // Año o línea decorativa
      {
        type: 'text',
        left: 100,
        top: 550,
        text: '2025',
        fontSize: 36,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: MEISA_RED
      }
    ]
  }
}

/**
 * 2. Proyecto Hero - Imagen Completa
 * Imagen de fondo con overlay y texto
 */
function createProyectoHeroTemplate() {
  return {
    version: '5.3.0',
    objects: [
      // Placeholder para imagen de fondo
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: GRAY_100,
        selectable: false
      },
      {
        type: 'text',
        left: WIDTH / 2 - 100,
        top: HEIGHT / 2 - 80,
        text: '[IMAGEN PROYECTO]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af',
        textAlign: 'center'
      },
      // Overlay oscuro
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: '#000000',
        opacity: 0.4,
        selectable: false
      },
      // Contenedor de texto inferior
      {
        type: 'rect',
        left: 0,
        top: HEIGHT - 200,
        width: WIDTH,
        height: 200,
        fill: 'rgba(0, 0, 0, 0.7)',
        selectable: false
      },
      // Título del proyecto
      {
        type: 'textbox',
        left: 80,
        top: HEIGHT - 160,
        width: WIDTH - 160,
        text: 'NOMBRE DEL PROYECTO',
        fontSize: 48,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: WHITE,
        lineHeight: 1.2
      },
      // Descripción
      {
        type: 'textbox',
        left: 80,
        top: HEIGHT - 80,
        width: 600,
        text: 'Descripción breve del proyecto y características principales',
        fontSize: 18,
        fontFamily: 'Inter, sans-serif',
        fill: WHITE,
        opacity: 0.9
      }
    ]
  }
}

/**
 * 3. Proyecto - Bloques Horizontales
 * Imagen central con bloques de color a los lados
 */
function createProyectoBloqueHorizontalTemplate() {
  const imageWidth = 700
  const imageLeft = (WIDTH - imageWidth) / 2
  const sideBlockWidth = (WIDTH - imageWidth) / 2

  return {
    version: '5.3.0',
    objects: [
      // Fondo blanco
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: WHITE,
        selectable: false
      },
      // Bloque azul izquierdo
      {
        type: 'rect',
        left: 0,
        top: 150,
        width: sideBlockWidth,
        height: 500,
        fill: MEISA_BLUE
      },
      // Bloque rojo derecho
      {
        type: 'rect',
        left: imageLeft + imageWidth,
        top: 150,
        width: sideBlockWidth,
        height: 500,
        fill: MEISA_RED
      },
      // Área de imagen central
      {
        type: 'rect',
        left: imageLeft,
        top: 150,
        width: imageWidth,
        height: 500,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: imageLeft + imageWidth / 2 - 80,
        top: 380,
        text: '[IMAGEN]',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Barra superior con título
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: 120,
        fill: MEISA_DARK_BLUE
      },
      {
        type: 'textbox',
        left: 60,
        top: 35,
        width: WIDTH - 120,
        text: 'TÍTULO DEL PROYECTO',
        fontSize: 36,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: WHITE,
        textAlign: 'center'
      }
    ]
  }
}

/**
 * 4. Detalles - Split Azul
 * 60% imagen izquierda + 40% panel azul derecho
 */
function createDetallesSplitAzulTemplate() {
  const splitPoint = WIDTH * 0.6

  return {
    version: '5.3.0',
    objects: [
      // Área de imagen izquierda
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: splitPoint,
        height: HEIGHT,
        fill: GRAY_100,
        selectable: false
      },
      {
        type: 'text',
        left: splitPoint / 2 - 80,
        top: HEIGHT / 2 - 20,
        text: '[IMAGEN]',
        fontSize: 28,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Panel azul derecho
      {
        type: 'rect',
        left: splitPoint,
        top: 0,
        width: WIDTH - splitPoint,
        height: HEIGHT,
        fill: MEISA_BLUE,
        selectable: false
      },
      // Contenido del panel
      {
        type: 'rect',
        left: splitPoint + 40,
        top: 80,
        width: 80,
        height: 8,
        fill: MEISA_RED
      },
      {
        type: 'textbox',
        left: splitPoint + 40,
        top: 120,
        width: WIDTH - splitPoint - 80,
        text: 'CARACTERÍSTICAS',
        fontSize: 32,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: WHITE,
        lineHeight: 1.3
      },
      {
        type: 'textbox',
        left: splitPoint + 40,
        top: 200,
        width: WIDTH - splitPoint - 80,
        text: '• Detalle importante 1\n\n• Detalle importante 2\n\n• Detalle importante 3\n\n• Detalle importante 4',
        fontSize: 18,
        fontFamily: 'Inter, sans-serif',
        fill: WHITE,
        lineHeight: 1.8
      }
    ]
  }
}

/**
 * 5. Detalles - Split Rojo
 * Panel rojo izquierdo + 60% imagen derecha
 */
function createDetallesSplitRojoTemplate() {
  const splitPoint = WIDTH * 0.4

  return {
    version: '5.3.0',
    objects: [
      // Panel rojo izquierdo
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: splitPoint,
        height: HEIGHT,
        fill: MEISA_RED,
        selectable: false
      },
      // Contenido del panel
      {
        type: 'rect',
        left: 40,
        top: 80,
        width: 80,
        height: 8,
        fill: WHITE
      },
      {
        type: 'textbox',
        left: 40,
        top: 120,
        width: splitPoint - 80,
        text: 'ESPECIFICACIONES',
        fontSize: 32,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: WHITE,
        lineHeight: 1.3
      },
      {
        type: 'textbox',
        left: 40,
        top: 200,
        width: splitPoint - 80,
        text: '• Especificación 1\n\n• Especificación 2\n\n• Especificación 3\n\n• Especificación 4',
        fontSize: 18,
        fontFamily: 'Inter, sans-serif',
        fill: WHITE,
        lineHeight: 1.8
      },
      // Área de imagen derecha
      {
        type: 'rect',
        left: splitPoint,
        top: 0,
        width: WIDTH - splitPoint,
        height: HEIGHT,
        fill: GRAY_100,
        selectable: false
      },
      {
        type: 'text',
        left: splitPoint + (WIDTH - splitPoint) / 2 - 80,
        top: HEIGHT / 2 - 20,
        text: '[IMAGEN]',
        fontSize: 28,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      }
    ]
  }
}

/**
 * 6. Detalles - Texto + Imagen
 * Texto izquierda (40%) + Imágenes apiladas derecha (60%)
 */
function createDetallesTextoImagenTemplate() {
  const splitPoint = WIDTH * 0.4
  const imageHeight = (HEIGHT - 40) / 2

  return {
    version: '5.3.0',
    objects: [
      // Fondo blanco
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: WHITE,
        selectable: false
      },
      // Panel de texto izquierdo
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: splitPoint,
        height: HEIGHT,
        fill: GRAY_100,
        selectable: false
      },
      {
        type: 'rect',
        left: 40,
        top: 60,
        width: 100,
        height: 8,
        fill: MEISA_BLUE
      },
      {
        type: 'textbox',
        left: 40,
        top: 100,
        width: splitPoint - 80,
        text: 'DESCRIPCIÓN DEL PROYECTO',
        fontSize: 28,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: MEISA_DARK_BLUE,
        lineHeight: 1.3
      },
      {
        type: 'textbox',
        left: 40,
        top: 200,
        width: splitPoint - 80,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        fill: GRAY_800,
        lineHeight: 1.6
      },
      // Imagen superior derecha
      {
        type: 'rect',
        left: splitPoint + 20,
        top: 20,
        width: WIDTH - splitPoint - 40,
        height: imageHeight,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: splitPoint + (WIDTH - splitPoint) / 2 - 50,
        top: imageHeight / 2 + 10,
        text: '[IMAGEN 1]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Imagen inferior derecha
      {
        type: 'rect',
        left: splitPoint + 20,
        top: imageHeight + 40,
        width: WIDTH - splitPoint - 40,
        height: imageHeight,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: splitPoint + (WIDTH - splitPoint) / 2 - 50,
        top: imageHeight + 40 + imageHeight / 2 - 10,
        text: '[IMAGEN 2]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      }
    ]
  }
}

/**
 * 7. Galería - Grid 4 Imágenes
 * Grid 2x2 con panel inferior de información
 */
function createGaleriaGridTemplate() {
  const gridGap = 20
  const imageSize = (WIDTH - gridGap * 3) / 2
  const gridHeight = imageSize * 2 + gridGap
  const panelHeight = HEIGHT - gridHeight - 40

  return {
    version: '5.3.0',
    objects: [
      // Fondo blanco
      {
        type: 'rect',
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT,
        fill: WHITE,
        selectable: false
      },
      // Imagen 1 (superior izquierda)
      {
        type: 'rect',
        left: gridGap,
        top: gridGap,
        width: imageSize,
        height: imageSize,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: gridGap + imageSize / 2 - 60,
        top: gridGap + imageSize / 2 - 15,
        text: '[IMAGEN 1]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Imagen 2 (superior derecha)
      {
        type: 'rect',
        left: imageSize + gridGap * 2,
        top: gridGap,
        width: imageSize,
        height: imageSize,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: imageSize + gridGap * 2 + imageSize / 2 - 60,
        top: gridGap + imageSize / 2 - 15,
        text: '[IMAGEN 2]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Imagen 3 (inferior izquierda)
      {
        type: 'rect',
        left: gridGap,
        top: imageSize + gridGap * 2,
        width: imageSize,
        height: imageSize,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: gridGap + imageSize / 2 - 60,
        top: imageSize + gridGap * 2 + imageSize / 2 - 15,
        text: '[IMAGEN 3]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Imagen 4 (inferior derecha)
      {
        type: 'rect',
        left: imageSize + gridGap * 2,
        top: imageSize + gridGap * 2,
        width: imageSize,
        height: imageSize,
        fill: GRAY_100,
        stroke: '#d1d5db',
        strokeWidth: 2
      },
      {
        type: 'text',
        left: imageSize + gridGap * 2 + imageSize / 2 - 60,
        top: imageSize + gridGap * 2 + imageSize / 2 - 15,
        text: '[IMAGEN 4]',
        fontSize: 20,
        fontFamily: 'Inter, sans-serif',
        fill: '#9ca3af'
      },
      // Panel inferior de información
      {
        type: 'rect',
        left: gridGap,
        top: gridHeight + 40,
        width: WIDTH - gridGap * 2,
        height: panelHeight,
        fill: MEISA_BLUE
      },
      {
        type: 'textbox',
        left: 60,
        top: gridHeight + 70,
        width: WIDTH - 120,
        text: 'GALERÍA DEL PROYECTO',
        fontSize: 32,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fill: WHITE
      },
      {
        type: 'textbox',
        left: 60,
        top: gridHeight + 130,
        width: WIDTH - 120,
        text: 'Descripción de las imágenes de la galería y detalles relevantes del proyecto',
        fontSize: 18,
        fontFamily: 'Inter, sans-serif',
        fill: WHITE,
        opacity: 0.9
      }
    ]
  }
}

// Thumbnails SVG para cada categoría
const THUMBNAILS = {
  'Portadas': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="%23ffffff"/%3E%3Cpolygon points="700,0 1200,0 1200,400 900,400" fill="%231e40af" opacity="0.9"/%3E%3Cpolygon points="0,500 200,500 0,800" fill="%23dc2626" opacity="0.9"/%3E%3Crect x="150" y="250" width="300" height="8" fill="%231e40af" opacity="0.6"/%3E%3C/svg%3E',

  'Proyectos': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="%23f3f4f6"/%3E%3Crect width="1200" height="800" fill="%23000000" opacity="0.4"/%3E%3Crect y="600" width="1200" height="200" fill="%23000000" opacity="0.7"/%3E%3C/svg%3E',

  'Galerías': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="%23ffffff"/%3E%3Crect x="20" y="20" width="570" height="370" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3Crect x="610" y="20" width="570" height="370" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3Crect x="20" y="410" width="570" height="370" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3Crect x="610" y="410" width="570" height="370" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3C/svg%3E',

  'Contenido': 'data:image/svg+xml,%3Csvg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1200" height="800" fill="%23ffffff"/%3E%3Crect width="480" height="800" fill="%23f3f4f6"/%3E%3Crect x="500" y="20" width="680" height="360" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3Crect x="500" y="400" width="680" height="360" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/%3E%3C/svg%3E'
}

async function main() {
  console.log('🎨 Creando plantillas basadas en PDF MEISA...\n')

  const templates = [
    {
      nombre: 'Portada MEISA - Formas Geométricas',
      descripcion: 'Portada con formas geométricas en azul y rojo, ideal para páginas de presentación y covers de brochures',
      categoria: 'Portadas',
      canvasData: createPortadaTemplate(),
      thumbnail: THUMBNAILS['Portadas']
    },
    {
      nombre: 'Proyecto Hero - Imagen Completa',
      descripcion: 'Página hero con imagen de fondo completa y overlay oscuro, perfecta para presentar proyectos de forma impactante',
      categoria: 'Proyectos',
      canvasData: createProyectoHeroTemplate(),
      thumbnail: THUMBNAILS['Proyectos']
    },
    {
      nombre: 'Proyecto - Bloques Horizontales',
      descripcion: 'Layout con imagen central y bloques de color laterales, ideal para destacar proyectos con diseño moderno',
      categoria: 'Proyectos',
      canvasData: createProyectoBloqueHorizontalTemplate(),
      thumbnail: THUMBNAILS['Proyectos']
    },
    {
      nombre: 'Detalles - Split Azul',
      descripcion: 'Layout dividido con imagen a la izquierda y panel de información azul a la derecha',
      categoria: 'Contenido',
      canvasData: createDetallesSplitAzulTemplate(),
      thumbnail: THUMBNAILS['Contenido']
    },
    {
      nombre: 'Detalles - Split Rojo',
      descripcion: 'Layout dividido con panel de información rojo a la izquierda e imagen a la derecha',
      categoria: 'Contenido',
      canvasData: createDetallesSplitRojoTemplate(),
      thumbnail: THUMBNAILS['Contenido']
    },
    {
      nombre: 'Detalles - Texto + Imagen',
      descripcion: 'Layout con texto descriptivo a la izquierda e imágenes apiladas a la derecha',
      categoria: 'Contenido',
      canvasData: createDetallesTextoImagenTemplate(),
      thumbnail: THUMBNAILS['Contenido']
    },
    {
      nombre: 'Galería - Grid 4 Imágenes',
      descripcion: 'Grid 2x2 de imágenes con panel de información inferior, perfecto para galerías de proyectos',
      categoria: 'Galerías',
      canvasData: createGaleriaGridTemplate(),
      thumbnail: THUMBNAILS['Galerías']
    }
  ]

  console.log(`📋 Insertando ${templates.length} plantillas...\n`)

  let created = 0
  let errors = 0

  for (const template of templates) {
    try {
      const result = await prisma.pageTemplate.create({
        data: {
          nombre: template.nombre,
          descripcion: template.descripcion,
          categoria: template.categoria,
          thumbnail: template.thumbnail,
          canvasData: template.canvasData,
          configuracion: {
            width: WIDTH,
            height: HEIGHT
          },
          isPublic: true,
          createdBy: 'system' // Plantillas del sistema basadas en PDF MEISA
        }
      })

      console.log(`✅ Creada: "${result.nombre}" (${result.categoria})`)
      created++
    } catch (error) {
      console.error(`❌ Error creando "${template.nombre}":`, error.message)
      errors++
    }
  }

  console.log(`\n🎉 Proceso completado!`)
  console.log(`✅ Creadas: ${created}`)
  if (errors > 0) {
    console.log(`❌ Errores: ${errors}`)
  }

  // Mostrar resumen
  const total = await prisma.pageTemplate.count()
  console.log(`\n📊 Total de plantillas en BD: ${total}`)
}

main()
  .catch((e) => {
    console.error('❌ Error general:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
