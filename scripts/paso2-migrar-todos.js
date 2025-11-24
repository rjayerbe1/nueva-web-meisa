const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function generateSlug(title, existingSlugs = []) {
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)

  let finalSlug = slug
  let counter = 2
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`
    counter++
  }

  return finalSlug
}

async function migrarTodosLosProyectos() {
  console.log('='.repeat(80))
  console.log('PASO 2: MIGRAR TODOS LOS PROYECTOS FALTANTES')
  console.log('='.repeat(80))
  console.log()

  // 1. Obtener proyectos de HojaVida sin vincular
  console.log('🔍 Buscando proyectos sin migrar...\n')

  const sinVincular = await prisma.proyectoHojaVida.findMany({
    where: {
      proyectoDetalladoId: null
    },
    orderBy: { fechaInicio: 'desc' }
  })

  console.log(`Total proyectos por migrar: ${sinVincular.length}`)
  console.log()

  // 2. Obtener usuario admin
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    throw new Error('No se encontró usuario ADMIN')
  }

  console.log(`👤 Usuario creador: ${adminUser.email}`)
  console.log()

  // 3. Obtener slugs existentes
  const existingProjects = await prisma.proyecto.findMany({
    select: { slug: true }
  })
  const existingSlugs = existingProjects.map(p => p.slug)

  // 4. Migrar cada proyecto
  console.log('📦 Iniciando migración...')
  console.log()

  let creados = 0
  let errores = 0
  const estadisticas = {}

  for (const hojaVida of sinVincular) {
    try {
      // Obtener categoría desde ProyectoHojaVida
      const categoria = await prisma.proyectoHojaVida.findUnique({
        where: { id: hojaVida.id },
        select: { categoria: true }
      })

      if (!categoria || !categoria.categoria) {
        console.log(`⚠️  Proyecto sin categoría: ${hojaVida.tituloDisplay || hojaVida.objetoContrato}`)
        errores++
        continue
      }

      const slug = generateSlug(hojaVida.tituloDisplay || hojaVida.objetoContrato, existingSlugs)
      existingSlugs.push(slug)

      // Crear proyecto
      const nuevoProyecto = await prisma.proyecto.create({
        data: {
          titulo: hojaVida.tituloDisplay || hojaVida.objetoContrato,
          codigoInterno: null,
          descripcion: hojaVida.objetoContrato,
          categoria: categoria.categoria,
          estado: 'COMPLETADO',
          prioridad: 'MEDIA',
          fechaInicio: hojaVida.fechaInicio,
          fechaFin: hojaVida.fechaFin,
          fechaEstimada: hojaVida.fechaFin,
          presupuesto: hojaVida.valorContrato,
          moneda: hojaVida.moneda || 'COP',
          cliente: hojaVida.entidadContratante,
          ubicacion: hojaVida.departamento
            ? `${hojaVida.ubicacion}, ${hojaVida.departamento}`
            : hojaVida.ubicacion,
          tags: [],
          destacado: hojaVida.destacado || false,
          destacadoEnCategoria: false,
          visible: hojaVida.visible !== false,
          slug: slug,
          createdBy: adminUser.id,
          areaTotal: hojaVida.areaM2,
          toneladas: hojaVida.pesoKg ? Number(hojaVida.pesoKg) / 1000 : null,
        }
      })

      // Vincular con hoja de vida
      await prisma.proyectoHojaVida.update({
        where: { id: hojaVida.id },
        data: { proyectoDetalladoId: nuevoProyecto.id }
      })

      // Estadísticas
      if (!estadisticas[categoria.categoria]) {
        estadisticas[categoria.categoria] = 0
      }
      estadisticas[categoria.categoria]++

      creados++

      if (creados % 10 === 0) {
        console.log(`  ✅ [${creados}/${sinVincular.length}] proyectos migrados...`)
      }

    } catch (error) {
      console.error(`  ❌ Error con "${hojaVida.tituloDisplay}":`, error.message)
      errores++
    }
  }

  console.log()
  console.log('='.repeat(80))
  console.log('RESUMEN DE MIGRACIÓN:')
  console.log('='.repeat(80))
  console.log(`✅ Proyectos creados: ${creados}`)
  console.log(`❌ Errores: ${errores}`)
  console.log()

  console.log('📊 Distribución por categoría:')
  console.log('-'.repeat(80))
  Object.entries(estadisticas)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} proyectos`)
    })
  console.log()

  console.log('='.repeat(80))
  console.log('✅ PASO 2 COMPLETADO')
  console.log('='.repeat(80))
  console.log()

  await prisma.$disconnect()
  return { creados, errores, estadisticas }
}

migrarTodosLosProyectos()
  .then(result => {
    console.log(`✅ Migración completada: ${result.creados} proyectos creados`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
