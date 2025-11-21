const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportCategoriasContent() {
  try {
    console.log('📦 Obteniendo categorías de la base de datos...')

    const categorias = await prisma.categoriaProyecto.findMany({
      where: { visible: true },
      orderBy: { orden: 'asc' }
    })

    console.log(`✅ ${categorias.length} categorías encontradas`)

    let markdown = '# Contenido de Categorías - MEISA\n\n'
    markdown += `*Exportado el: ${new Date().toLocaleString('es-CO')}*\n\n`
    markdown += '---\n\n'

    categorias.forEach((categoria, index) => {
      markdown += `## ${index + 1}. ${categoria.nombre}\n\n`

      // Información básica
      markdown += `**Slug:** \`${categoria.slug}\`\n\n`
      markdown += `**Key:** \`${categoria.key}\`\n\n`

      // Descripción corta
      if (categoria.descripcion) {
        markdown += `### 📝 Descripción Corta\n\n`
        markdown += `${categoria.descripcion}\n\n`
      }

      // Descripción ampliada
      if (categoria.descripcionAmpliada) {
        markdown += `### 📄 Descripción Ampliada\n\n`
        markdown += `${categoria.descripcionAmpliada}\n\n`
      }

      // Estadísticas
      if (categoria.estadisticas && Object.keys(categoria.estadisticas).length > 0) {
        markdown += `### 📊 Estadísticas\n\n`
        const stats = categoria.estadisticas

        if (stats.toneladasTotal) {
          markdown += `- **Toneladas Totales:** ${stats.toneladasTotal.toLocaleString()} Ton\n`
        }
        if (stats.proyectosCompletados) {
          markdown += `- **Proyectos Completados:** ${stats.proyectosCompletados}+\n`
        }
        if (stats.anosExperiencia) {
          markdown += `- **Años de Experiencia:** ${stats.anosExperiencia}+ años\n`
        }
        markdown += '\n'
      }

      // Beneficios
      if (categoria.beneficios && Array.isArray(categoria.beneficios) && categoria.beneficios.length > 0) {
        markdown += `### ✅ Beneficios\n\n`
        categoria.beneficios.forEach((beneficio, idx) => {
          markdown += `${idx + 1}. ${beneficio}\n`
        })
        markdown += '\n'
      }

      // Proceso de trabajo
      if (categoria.procesoTrabajo && Array.isArray(categoria.procesoTrabajo) && categoria.procesoTrabajo.length > 0) {
        markdown += `### 🔄 Proceso de Trabajo\n\n`
        categoria.procesoTrabajo.forEach((paso, idx) => {
          markdown += `${idx + 1}. ${paso}\n`
        })
        markdown += '\n'
      }

      // Casos de éxito
      if (categoria.casosExitoIds && Array.isArray(categoria.casosExitoIds) && categoria.casosExitoIds.length > 0) {
        markdown += `### ⭐ Casos de Éxito (IDs)\n\n`
        markdown += `\`\`\`\n${categoria.casosExitoIds.join(', ')}\n\`\`\`\n\n`
      }

      markdown += '---\n\n'
    })

    // Guardar archivo
    const outputPath = path.join(process.cwd(), 'CATEGORIAS_CONTENIDO.md')
    fs.writeFileSync(outputPath, markdown, 'utf-8')

    console.log(`\n✅ Archivo exportado exitosamente:`)
    console.log(`📁 ${outputPath}`)

    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Error al exportar contenido:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

exportCategoriasContent()
