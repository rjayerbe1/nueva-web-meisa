#!/usr/bin/env node

/**
 * Script para copiar proyectos importantes desde Trayectoria → Proyectos Principales
 * y establecer la relación entre ambas tablas
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función slugify (copia desde lib/utils.ts)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// IDs de proyectos de trayectoria que queremos copiar (los más importantes de 2023-2025)
const PROYECTOS_A_COPIAR = [
  'cmhunrt1p00053olstmn9k3c5', // Dollar City Rio Negro Calle 100 (2025)
  'cmhunrt1o00043ols3hgqgdkd', // Dollar City Chapinero (2025)
  'cmhunrt1n00033olse4cbp4a4', // Dollar City Mazuren (2025)
  'cmhunrt1h00003olsipb9iuc5', // PAVCOL - Ciclopuente Calle 98 (2024)
  'cmhunrt1m00023olsz6hzlgqv', // OMEGA - Ampliacion Omega Tercer Piso (2024)
  'cmhunrt1v000b3olsk4xubfcb', // Dollar City La Maria (2024)
  'cmhunrt1u000a3olsnls3iqzd', // Dollar City Alfaguara (2024)
  'cmhunrt22000k3olsonpzkv9a', // MHC - Estaciones de Transmilenio (2024)
  'cmhunrt27000o3olsq4y6emz2', // PAVCOL - Estación Calle 19 y Puente (2023)
  'cmhunrt24000n3olsuxbeylmx', // Consorcio Deportivo - Coliseo Menor Pereira (2023)
  'cmhunrt1x000d3olso5kf94c5', // Ingenio Providencia - Bahía de Alcoholes (2023)
]

// Mapping de categorías basado en el tipo de proyecto
const determinarCategoria = (objetoContrato, entidad) => {
  const texto = `${objetoContrato} ${entidad}`.toLowerCase()

  if (texto.includes('dollar') || texto.includes('retail') || texto.includes('comercial')) {
    return 'ESTRUCTURAS_MODULARES'
  }
  if (texto.includes('ciclopuente') || texto.includes('puente peatonal')) {
    return 'PUENTES_PEATONALES'
  }
  if (texto.includes('puente vehicular') || texto.includes('puente ')) {
    return 'PUENTES_VEHICULARES'
  }
  if (texto.includes('coliseo') || texto.includes('deportivo') || texto.includes('estadio')) {
    return 'ESCENARIOS_DEPORTIVOS'
  }
  if (texto.includes('estación') || texto.includes('transmilenio') || texto.includes('terminal')) {
    return 'ESTRUCTURAS_MODULARES'
  }
  if (texto.includes('ingenio') || texto.includes('industrial') || texto.includes('bahía') || texto.includes('hangar')) {
    return 'INDUSTRIA'
  }
  if (texto.includes('edificio') || texto.includes('ampliacion') || texto.includes('torre')) {
    return 'EDIFICIOS'
  }
  if (texto.includes('cubierta') || texto.includes('fachada')) {
    return 'CUBIERTAS_Y_FACHADAS'
  }

  return 'OTRO'
}

// Generar título limpio para el proyecto
const generarTitulo = (objetoContrato, entidad) => {
  // Quitar el cliente del inicio si está presente
  let titulo = objetoContrato

  // Si el título es muy largo, intentar simplificarlo
  if (titulo.length > 100) {
    // Tomar solo la parte principal
    const parts = titulo.split(' - ')
    titulo = parts[parts.length - 1] || titulo
  }

  // Limpiar y capitalizar
  return titulo
    .replace(/Construccion y Montaje Estructura Metalica/gi, '')
    .replace(/Construccion Estructura Metalica/gi, '')
    .replace(/Estructura Metalica/gi, '')
    .trim()
}

async function copiarProyectos() {
  console.log('🚀 Iniciando copia de proyectos importantes...\n')

  try {
    // 1. Obtener el ID del usuario admin para asignar como creador
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, name: true }
    })

    if (!adminUser) {
      throw new Error('No se encontró usuario ADMIN')
    }

    console.log(`👤 Usuario creador: ${adminUser.name}\n`)

    // 2. Obtener proyectos de trayectoria a copiar
    const proyectosTrayectoria = await prisma.proyectoHojaVida.findMany({
      where: {
        id: { in: PROYECTOS_A_COPIAR }
      }
    })

    console.log(`📋 Encontrados ${proyectosTrayectoria.length} proyectos para copiar\n`)

    const resultados = []

    // 3. Copiar cada proyecto
    for (const proyTray of proyectosTrayectoria) {
      console.log(`\n🔄 Procesando: ${proyTray.entidadContratante} - ${proyTray.objetoContrato.substring(0, 60)}...`)

      try {
        // Generar título y slug únicos
        const titulo = generarTitulo(proyTray.objetoContrato, proyTray.entidadContratante)
        let slug = slugify(titulo)

        // Verificar si ya existe un proyecto con este slug
        let counter = 1
        let slugFinal = slug
        while (await prisma.proyecto.findUnique({ where: { slug: slugFinal } })) {
          slugFinal = `${slug}-${counter}`
          counter++
        }

        // Determinar categoría
        const categoria = determinarCategoria(proyTray.objetoContrato, proyTray.entidadContratante)

        // Crear proyecto en tabla Principales
        const nuevoProyecto = await prisma.proyecto.create({
          data: {
            titulo,
            slug: slugFinal,
            descripcion: proyTray.objetoContrato,
            categoria,
            estado: 'COMPLETADO',
            prioridad: 'MEDIA',
            fechaInicio: proyTray.fechaInicio,
            fechaFin: proyTray.fechaFin || proyTray.fechaInicio,
            presupuesto: Number(proyTray.valorContrato),
            moneda: proyTray.moneda,
            cliente: proyTray.entidadContratante,
            ubicacion: proyTray.ubicacion,
            destacado: proyTray.destacado,
            visible: proyTray.visible,
            createdBy: adminUser.id,
            areaTotal: proyTray.areaM2 ? Number(proyTray.areaM2) : null,
            toneladas: proyTray.pesoKg ? Number(proyTray.pesoKg) / 1000 : null,
            progreso: {
              create: [
                { fase: 'Planificación', porcentaje: 100, completado: true, orden: 1 },
                { fase: 'Diseño', porcentaje: 100, completado: true, orden: 2 },
                { fase: 'Fabricación', porcentaje: 100, completado: true, orden: 3 },
                { fase: 'Montaje', porcentaje: 100, completado: true, orden: 4 },
                { fase: 'Finalización', porcentaje: 100, completado: true, orden: 5 }
              ]
            }
          }
        })

        // Actualizar proyecto de trayectoria para vincularlo
        await prisma.proyectoHojaVida.update({
          where: { id: proyTray.id },
          data: {
            proyectoDetalladoId: nuevoProyecto.id
          }
        })

        resultados.push({
          trayectoria: {
            id: proyTray.id,
            titulo: `${proyTray.entidadContratante} - ${proyTray.objetoContrato.substring(0, 50)}...`
          },
          principal: {
            id: nuevoProyecto.id,
            titulo: nuevoProyecto.titulo,
            slug: nuevoProyecto.slug,
            categoria: nuevoProyecto.categoria
          }
        })

        console.log(`   ✅ Creado: "${titulo}" (${categoria})`)
        console.log(`   🔗 Vinculado con Trayectoria`)

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`)
        resultados.push({
          trayectoria: {
            id: proyTray.id,
            titulo: `${proyTray.entidadContratante} - ${proyTray.objetoContrato.substring(0, 50)}...`
          },
          error: error.message
        })
      }
    }

    // 4. Mostrar resumen
    console.log('\n\n═══════════════════════════════════════════════════════════')
    console.log('                    RESUMEN DE COPIA                       ')
    console.log('═══════════════════════════════════════════════════════════\n')

    const exitosos = resultados.filter(r => !r.error)
    const fallidos = resultados.filter(r => r.error)

    console.log(`✅ Proyectos copiados exitosamente: ${exitosos.length}`)
    console.log(`❌ Proyectos con errores: ${fallidos.length}\n`)

    if (exitosos.length > 0) {
      console.log('📋 PROYECTOS COPIADOS:\n')
      exitosos.forEach((r, i) => {
        console.log(`${i + 1}. ${r.principal.titulo}`)
        console.log(`   Categoría: ${r.principal.categoria}`)
        console.log(`   Slug: ${r.principal.slug}`)
        console.log(`   🔗 Trayectoria ID: ${r.trayectoria.id}\n`)
      })
    }

    if (fallidos.length > 0) {
      console.log('\n❌ ERRORES:\n')
      fallidos.forEach((r, i) => {
        console.log(`${i + 1}. ${r.trayectoria.titulo}`)
        console.log(`   Error: ${r.error}\n`)
      })
    }

    console.log('═══════════════════════════════════════════════════════════\n')

  } catch (error) {
    console.error('❌ Error fatal:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
copiarProyectos()
  .then(() => {
    console.log('✅ Copia completada exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
