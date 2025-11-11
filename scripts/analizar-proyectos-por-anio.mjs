import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analizarProyectos() {
  console.log('📊 Analizando proyectos por año para generar mejores títulos...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      tituloDisplay: {
        not: null
      }
    },
    select: {
      tituloDisplay: true,
      descripcionSecundaria: true,
      fechaFin: true,
      entidadContratante: true
    },
    orderBy: {
      fechaFin: 'desc'
    }
  })

  // Agrupar por año
  const porAnio = {}
  proyectos.forEach(p => {
    const año = new Date(p.fechaFin).getFullYear()
    if (!porAnio[año]) {
      porAnio[año] = []
    }
    porAnio[año].push(p)
  })

  // Mostrar resumen de cada año con títulos reales
  for (const [anio, projs] of Object.entries(porAnio).sort((a, b) => b[0] - a[0])) {
    console.log(`\n━━━ AÑO ${anio} (${projs.length} proyectos) ━━━`)

    // Mostrar primeros 5 proyectos para entender el año
    projs.slice(0, 5).forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.tituloDisplay}`)
      if (p.descripcionSecundaria) {
        console.log(`   ${p.descripcionSecundaria}`)
      }
    })

    if (projs.length > 5) {
      console.log(`   ... y ${projs.length - 5} proyectos más`)
    }

    // Análisis automático de palabras clave
    const palabrasClave = {}
    projs.forEach(p => {
      const titulo = p.tituloDisplay.toLowerCase()
      const desc = (p.descripcionSecundaria || '').toLowerCase()
      const texto = `${titulo} ${desc}`

      // Categorías importantes
      const categorias = {
        'puentes': /puente|viaducto/,
        'coliseos': /coliseo|polideportivo|deportivo/,
        'bodegas': /bodega|almacén|galpón/,
        'cubiertas': /cubierta|techo/,
        'plantas': /planta|fábrica|industrial/,
        'edificios': /edificio|torre/,
        'centros comerciales': /centro comercial|mall|cc |único/,
        'estructuras': /estructura.*metálica/,
        'educación': /colegio|universidad|educación/,
        'hospitales': /hospital|clínica/
      }

      Object.entries(categorias).forEach(([cat, regex]) => {
        if (regex.test(texto)) {
          palabrasClave[cat] = (palabrasClave[cat] || 0) + 1
        }
      })
    })

    // Mostrar top 3 categorías
    const topCategorias = Object.entries(palabrasClave)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, count]) => `${cat} (${count})`)

    console.log(`\n📌 Categorías principales: ${topCategorias.join(', ')}`)
  }

  await prisma.$disconnect()
}

analizarProyectos()
