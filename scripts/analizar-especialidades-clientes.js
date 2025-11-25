const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function analizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ANÁLISIS: ESPECIALIDADES Y PROYECTOS POR CATEGORÍA')
    console.log('='.repeat(80) + '\n')

    const categorias = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    const proyectos = await prisma.proyecto.findMany({
      where: { visible: true },
      select: {
        titulo: true,
        categoria: true,
        ubicacion: true
      }
    })

    const analisis = {}

    // Mapeo de slugs a enum values
    const slugToEnum = {
      'deportes-educacion': 'DEPORTES_EDUCACION',
      'edificaciones': 'EDIFICACIONES',
      'puentes': 'PUENTES',
      'industrial': 'INDUSTRIAL',
      'comercial': 'COMERCIAL'
    }

    for (const categoria of categorias) {
      const enumValue = slugToEnum[categoria.slug]
      const proyectosCategoria = enumValue
        ? proyectos.filter(p => p.categoria === enumValue)
        : []

      analisis[categoria.slug] = {
        nombre: categoria.nombre,
        slug: categoria.slug,
        totalProyectos: proyectosCategoria.length,
        especialidades: categoria.especialidades || [],
        proyectosEjemplo: proyectosCategoria.slice(0, 10).map(p => ({
          titulo: p.titulo,
          ubicacion: p.ubicacion
        }))
      }

      console.log(`\n📁 ${categoria.nombre.toUpperCase()}`)
      console.log(`   Total proyectos: ${proyectosCategoria.length}`)
      console.log(`   Especialidades actuales: ${categoria.especialidades?.length || 0}`)

      if (categoria.especialidades && categoria.especialidades.length > 0) {
        categoria.especialidades.forEach((esp, idx) => {
          console.log(`\n   ${idx + 1}. ${esp.titulo}`)
          console.log(`      Descripción actual: ${esp.descripcion.substring(0, 100)}...`)
          console.log(`      Palabras: ${esp.descripcion.split(' ').length}`)
          console.log(`      Proyectos ejemplo: ${esp.proyectosEjemplo?.join(', ') || 'ninguno'}`)
        })
      }
    }

    // Guardar análisis completo
    const filename = `./analisis-especialidades-${Date.now()}.json`
    fs.writeFileSync(filename, JSON.stringify(analisis, null, 2))
    console.log(`\n\n💾 Análisis completo guardado en: ${filename}`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analizar()
