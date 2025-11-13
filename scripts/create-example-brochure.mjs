#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📘 Creando brochure de ejemplo con sistema Fabric.js...\n')

  // Buscar cualquier categoría disponible (usar Centros Comerciales si existe)
  const categoria = await prisma.categoriaProyecto.findFirst({
    where: {
      slug: 'centros-comerciales'
    }
  })

  if (!categoria) {
    console.error('❌ No se encontró ninguna categoría de proyecto')
    console.log('💡 Ejecuta primero el seeder de categorías')
    return
  }

  // Buscar template por defecto
  const template = await prisma.brochureTemplate.findFirst()

  if (!template) {
    console.error('❌ No se encontró ningún template de brochure')
    return
  }

  // Buscar usuario admin
  const adminUser = await prisma.user.findFirst({
    where: {
      role: 'ADMIN'
    }
  })

  if (!adminUser) {
    console.error('❌ No se encontró un usuario ADMIN')
    return
  }

  // Verificar si ya existe un brochure de ejemplo
  const existing = await prisma.brochure.findFirst({
    where: {
      urlAmigable: 'ejemplo-portafolio-meisa-2025'
    }
  })

  if (existing) {
    console.log('⚠️  Ya existe un brochure de ejemplo')
    console.log('   Eliminando brochure anterior...')

    // Eliminar páginas primero
    await prisma.brochurePage.deleteMany({
      where: { brochureId: existing.id }
    })

    // Eliminar analytics
    await prisma.brochureAnalytics.deleteMany({
      where: { brochureId: existing.id }
    })

    // Eliminar brochure
    await prisma.brochure.delete({
      where: { id: existing.id }
    })

    console.log('   ✅ Brochure anterior eliminado\n')
  }

  // Crear brochure nuevo (sin categoría asignada para evitar conflicto de unique)
  const brochure = await prisma.brochure.create({
    data: {
      titulo: 'Portafolio MEISA 2025 - Ejemplo Visual',
      descripcion: 'Brochure de ejemplo creado con el nuevo editor visual tipo Canva',
      urlAmigable: 'ejemplo-portafolio-meisa-2025',
      templateId: template.id,
      categoriaId: null, // Sin categoría para evitar conflicto
      createdBy: adminUser.id,
      publicado: true,
      activo: true,
      fechaPublicacion: new Date(),
      contenido: {},
      datosPersonalizados: {},
      configuracion: {}
    }
  })

  console.log(`✅ Brochure creado: "${brochure.titulo}"`)
  console.log(`   ID: ${brochure.id}`)
  console.log(`   URL: /brochure/${brochure.urlAmigable}\n`)

  // Crear 3 páginas de ejemplo con diseños de las plantillas
  const paginas = [
    {
      nombre: 'Portada',
      orden: 0,
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
            top: 280,
            fontSize: 64,
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
            top: 370,
            fontSize: 28,
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
            top: 450,
            fontSize: 56,
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
          },
          // Nota inferior
          {
            type: 'i-text',
            left: 600,
            top: 680,
            fontSize: 16,
            fontFamily: 'Inter, sans-serif',
            fill: '#cbd5e1',
            text: 'Brochure creado con el editor visual de MEISA',
            textAlign: 'center',
            originX: 'center',
            originY: 'center'
          }
        ]
      },
      configuracion: { width: 1200, height: 800 },
      visible: true
    },
    {
      nombre: 'Acerca de MEISA',
      orden: 1,
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
          // Título
          {
            type: 'i-text',
            left: 80,
            top: 70,
            fontSize: 48,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#1e40af',
            text: 'ACERCA DE MEISA'
          },
          // Línea decorativa
          {
            type: 'rect',
            left: 80,
            top: 135,
            width: 250,
            height: 5,
            fill: '#dc2626'
          },
          // Contenido
          {
            type: 'textbox',
            left: 80,
            top: 180,
            width: 1040,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fill: '#334155',
            lineHeight: 1.6,
            text: 'METÁLICAS E INGENIERÍA S.A. - MEISA es una empresa colombiana especializada en el diseño, fabricación y montaje de estructuras metálicas de alta complejidad.\n\nCon más de 30 años de experiencia en el sector, nos hemos consolidado como líderes en la ejecución de proyectos de gran envergadura en edificaciones, puentes, naves industriales y estructuras especiales.\n\nNuestro compromiso con la calidad, innovación y cumplimiento nos ha permitido participar en los proyectos más importantes del país, trabajando con los principales constructores y desarrolladores.',
            textAlign: 'justify'
          },
          // Iconos de servicios
          {
            type: 'rect',
            left: 80,
            top: 480,
            width: 320,
            height: 250,
            fill: '#f8fafc',
            stroke: '#e2e8f0',
            strokeWidth: 2
          },
          {
            type: 'i-text',
            left: 105,
            top: 510,
            fontSize: 22,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#1e40af',
            text: '🏗️ Servicios'
          },
          {
            type: 'textbox',
            left: 105,
            top: 555,
            width: 280,
            fontSize: 16,
            fontFamily: 'Inter, sans-serif',
            fill: '#475569',
            lineHeight: 1.8,
            text: '• Diseño estructural\n• Fabricación de acero\n• Montaje e instalación\n• Consultoría técnica\n• Control de calidad'
          },
          // Estadísticas
          {
            type: 'rect',
            left: 440,
            top: 480,
            width: 320,
            height: 250,
            fill: '#1e40af',
            stroke: '#1e3a8a',
            strokeWidth: 2
          },
          {
            type: 'i-text',
            left: 600,
            top: 530,
            fontSize: 56,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff',
            text: '500+',
            textAlign: 'center',
            originX: 'center'
          },
          {
            type: 'i-text',
            left: 600,
            top: 600,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fill: '#f1f5f9',
            text: 'PROYECTOS COMPLETADOS',
            textAlign: 'center',
            originX: 'center'
          },
          // Reconocimientos
          {
            type: 'rect',
            left: 800,
            top: 480,
            width: 320,
            height: 250,
            fill: '#dc2626',
            stroke: '#991b1b',
            strokeWidth: 2
          },
          {
            type: 'i-text',
            left: 960,
            top: 530,
            fontSize: 56,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff',
            text: '30+',
            textAlign: 'center',
            originX: 'center'
          },
          {
            type: 'i-text',
            left: 960,
            top: 600,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fill: '#fef2f2',
            text: 'AÑOS DE EXPERIENCIA',
            textAlign: 'center',
            originX: 'center'
          }
        ]
      },
      configuracion: { width: 1200, height: 800 },
      visible: true
    },
    {
      nombre: 'Contáctanos',
      orden: 2,
      canvasData: {
        version: '5.3.0',
        objects: [
          // Fondo gradiente
          {
            type: 'rect',
            left: 0,
            top: 0,
            width: 1200,
            height: 800,
            fill: '#f8fafc',
            selectable: false,
            evented: false
          },
          // Panel de contacto
          {
            type: 'rect',
            left: 200,
            top: 150,
            width: 800,
            height: 500,
            fill: '#ffffff',
            stroke: '#e2e8f0',
            strokeWidth: 2,
            shadow: {
              color: 'rgba(0, 0, 0, 0.1)',
              blur: 20,
              offsetX: 0,
              offsetY: 10
            }
          },
          // Título
          {
            type: 'i-text',
            left: 600,
            top: 200,
            fontSize: 42,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#1e40af',
            text: 'CONTÁCTANOS',
            textAlign: 'center',
            originX: 'center'
          },
          // Subtítulo
          {
            type: 'i-text',
            left: 600,
            top: 260,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fill: '#64748b',
            text: 'Estamos listos para hacer realidad tu próximo proyecto',
            textAlign: 'center',
            originX: 'center'
          },
          // Información de contacto
          {
            type: 'textbox',
            left: 280,
            top: 340,
            width: 640,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fill: '#334155',
            lineHeight: 2,
            textAlign: 'center',
            text: '📧 contacto@meisa.com.co\n\n📱 +57 (1) 234 5678\n\n📍 Bogotá, Colombia\n\n🌐 www.meisa.com.co'
          },
          // Llamado a la acción
          {
            type: 'rect',
            left: 400,
            top: 560,
            width: 400,
            height: 60,
            fill: '#1e40af',
            rx: 8,
            ry: 8
          },
          {
            type: 'i-text',
            left: 600,
            top: 583,
            fontSize: 20,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff',
            text: 'SOLICITAR COTIZACIÓN',
            textAlign: 'center',
            originX: 'center',
            originY: 'center'
          }
        ]
      },
      configuracion: { width: 1200, height: 800 },
      visible: true
    }
  ]

  for (const paginaData of paginas) {
    const pagina = await prisma.brochurePage.create({
      data: {
        brochureId: brochure.id,
        ...paginaData,
        contenido: {},
        componentesData: {}
      }
    })
    console.log(`   ✅ Página "${pagina.nombre}" creada`)
  }

  console.log('\n🎉 Brochure de ejemplo completado!\n')
  console.log('📌 Accede al editor en:')
  console.log(`   http://localhost:3001/admin/brochures/${brochure.id}/builder\n`)
  console.log('👀 Vista pública en:')
  console.log(`   http://localhost:3001/brochure/${brochure.urlAmigable}\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
