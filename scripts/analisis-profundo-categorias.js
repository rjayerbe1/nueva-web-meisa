const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function analizarProyectosProfundo() {
  try {
    console.log('='.repeat(100))
    console.log('ANÁLISIS PROFUNDO DE PROYECTOS POR CATEGORÍA ACTUAL')
    console.log('='.repeat(100))
    console.log()

    const categorias = [
      'COMERCIAL',
      'EDIFICACIONES',
      'INDUSTRIA',
      'PUENTES_VEHICULARES',
      'PUENTES_PEATONALES',
      'ESCENARIOS_DEPORTIVOS'
    ]

    let totalProyectos = 0

    for (const categoria of categorias) {
      console.log('\n' + '='.repeat(100))
      console.log(`📦 CATEGORÍA: ${categoria}`)
      console.log('='.repeat(100))

      const proyectos = await prisma.proyecto.findMany({
        where: { categoria },
        orderBy: { fechaInicio: 'desc' },
        select: {
          id: true,
          titulo: true,
          cliente: true,
          descripcion: true,
          ubicacion: true,
          toneladas: true,
          areaTotal: true,
          fechaInicio: true,
          fechaFin: true,
          presupuesto: true,
          slug: true,
          hojaVida: {
            select: {
              id: true,
              objetoContrato: true,
              entidadContratante: true
            }
          }
        }
      })

      console.log(`\nTotal proyectos: ${proyectos.length}`)
      console.log()

      // Agrupar por tipo/cliente para identificar patrones
      const porCliente = {}
      const porTipo = {}
      const porAnio = {}

      proyectos.forEach(p => {
        const year = new Date(p.fechaInicio).getFullYear()
        const cliente = p.cliente || 'Sin cliente'

        // Agrupar por cliente
        if (!porCliente[cliente]) porCliente[cliente] = []
        porCliente[cliente].push(p)

        // Agrupar por año
        if (!porAnio[year]) porAnio[year] = 0
        porAnio[year]++

        // Identificar tipo por palabras clave
        const titulo = p.titulo.toLowerCase()
        let tipo = 'Otros'

        if (titulo.includes('puente') || titulo.includes('ciclopuente')) tipo = 'Puentes'
        else if (titulo.includes('cc ') || titulo.includes('centro comercial') || titulo.includes('local')) tipo = 'Comercial'
        else if (titulo.includes('bodega') || titulo.includes('planta') || titulo.includes('ingenio')) tipo = 'Industrial'
        else if (titulo.includes('coliseo') || titulo.includes('cancha') || titulo.includes('deportiv')) tipo = 'Deportivo'
        else if (titulo.includes('edificio') || titulo.includes('parqueadero') || titulo.includes('torre')) tipo = 'Edificación'
        else if (titulo.includes('estacion') || titulo.includes('terminal')) tipo = 'Transporte'
        else if (titulo.includes('acueducto') || titulo.includes('viaducto')) tipo = 'Viaductos/Acueductos'

        if (!porTipo[tipo]) porTipo[tipo] = []
        porTipo[tipo].push(p)
      })

      // Mostrar distribución por tipo
      console.log('📊 DISTRIBUCIÓN POR TIPO:')
      console.log('-'.repeat(100))
      Object.entries(porTipo)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([tipo, projs]) => {
          console.log(`  ${tipo}: ${projs.length} proyectos`)
        })

      // Mostrar clientes principales
      console.log()
      console.log('👥 CLIENTES PRINCIPALES (más de 2 proyectos):')
      console.log('-'.repeat(100))
      Object.entries(porCliente)
        .filter(([_, projs]) => projs.length > 2)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([cliente, projs]) => {
          console.log(`  ${cliente}: ${projs.length} proyectos`)
        })

      // Mostrar distribución por año
      console.log()
      console.log('📅 DISTRIBUCIÓN POR AÑO:')
      console.log('-'.repeat(100))
      Object.entries(porAnio)
        .sort((a, b) => b[0] - a[0])
        .slice(0, 10)
        .forEach(([year, count]) => {
          const bar = '█'.repeat(Math.ceil(count / 2))
          console.log(`  ${year}: ${bar} (${count})`)
        })

      // Listar todos los proyectos con detalles
      console.log()
      console.log('📋 LISTA COMPLETA DE PROYECTOS:')
      console.log('-'.repeat(100))

      proyectos.forEach((p, idx) => {
        const year = new Date(p.fechaInicio).getFullYear()
        const tons = p.toneladas ? `${Number(p.toneladas).toFixed(1)} ton` : 'N/A'
        const area = p.areaTotal ? `${Number(p.areaTotal).toFixed(0)} m²` : 'N/A'
        const vinculado = p.hojaVida ? '🔗' : '  '

        console.log()
        console.log(`${vinculado} ${idx + 1}. [${year}] ${p.titulo}`)
        console.log(`   Cliente: ${p.cliente}`)
        console.log(`   Ubicación: ${p.ubicacion}`)
        console.log(`   Toneladas: ${tons} | Área: ${area}`)
        if (p.descripcion && p.descripcion.length > 100) {
          console.log(`   Descripción: ${p.descripcion.substring(0, 97)}...`)
        } else if (p.descripcion) {
          console.log(`   Descripción: ${p.descripcion}`)
        }
        console.log(`   Slug: ${p.slug}`)
      })

      totalProyectos += proyectos.length
    }

    // Resumen global
    console.log()
    console.log('\n' + '='.repeat(100))
    console.log('📊 RESUMEN GLOBAL')
    console.log('='.repeat(100))
    console.log(`Total proyectos en base de datos: ${totalProyectos}`)
    console.log()

    // Identificar proyectos problemáticos (duplicados o con datos incorrectos)
    console.log('⚠️  PROYECTOS CON POSIBLES PROBLEMAS:')
    console.log('-'.repeat(100))

    // Buscar proyectos con 490 toneladas (valor placeholder incorrecto)
    const proyectosCon490 = await prisma.proyecto.count({
      where: {
        toneladas: 490
      }
    })
    console.log(`Proyectos con 490 toneladas (valor placeholder): ${proyectosCon490}`)

    // Buscar posibles duplicados por título similar
    const todosProyectos = await prisma.proyecto.findMany({
      select: { titulo: true, id: true }
    })

    const titulosNormalizados = new Map()
    const duplicados = []

    todosProyectos.forEach(p => {
      const normalizado = p.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')

      if (titulosNormalizados.has(normalizado)) {
        duplicados.push({
          titulo1: titulosNormalizados.get(normalizado),
          titulo2: p.titulo
        })
      } else {
        titulosNormalizados.set(normalizado, p.titulo)
      }
    })

    console.log(`Posibles duplicados detectados: ${duplicados.length}`)
    if (duplicados.length > 0 && duplicados.length < 20) {
      console.log()
      console.log('Lista de duplicados:')
      duplicados.forEach((d, idx) => {
        console.log(`  ${idx + 1}. "${d.titulo1}" ≈ "${d.titulo2}"`)
      })
    }

    console.log()
    console.log('='.repeat(100))
    console.log('✅ ANÁLISIS COMPLETADO')
    console.log('='.repeat(100))

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

analizarProyectosProfundo()
