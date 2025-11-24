const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportTrayectoriaCatalogada() {
  try {
    console.log('📦 Obteniendo proyectos de la trayectoria...')

    // Obtener todos los proyectos ordenados por fecha
    const proyectos = await prisma.proyectoHojaVida.findMany({
      orderBy: [
        { fechaInicio: 'desc' }
      ]
    })

    console.log(`✅ ${proyectos.length} proyectos encontrados`)

    let markdown = '# Proyectos MEISA - Trayectoria Completa para Catalogar\n\n'
    markdown += `*Exportado el: ${new Date().toLocaleString('es-CO')}*\n\n`
    markdown += `**Total de proyectos:** ${proyectos.length}\n\n`
    markdown += '---\n\n'

    // Agrupar por año para mejor visualización
    const proyectosPorAño = {}

    proyectos.forEach(proyecto => {
      const año = new Date(proyecto.fechaInicio).getFullYear()
      if (!proyectosPorAño[año]) {
        proyectosPorAño[año] = []
      }
      proyectosPorAño[año].push(proyecto)
    })

    // Ordenar años descendente
    const añosOrdenados = Object.keys(proyectosPorAño).sort((a, b) => b - a)

    // Generar markdown por año
    añosOrdenados.forEach(año => {
      const proyectosDelAño = proyectosPorAño[año]

      // Calcular totales del año
      const toneladasAño = proyectosDelAño.reduce((sum, p) => sum + (p.pesoKg ? p.pesoKg / 1000 : 0), 0)
      const areaAño = proyectosDelAño.reduce((sum, p) => sum + (p.areaM2 || 0), 0)

      markdown += `## AÑO ${año}\n\n`
      markdown += `**Proyectos:** ${proyectosDelAño.length} | **Toneladas:** ${toneladasAño.toFixed(0)} ton | **Área:** ${areaAño.toLocaleString()} m²\n\n`

      proyectosDelAño.forEach((proyecto, index) => {
        markdown += `### ${index + 1}. ${proyecto.objetoContrato}\n\n`
        markdown += `- **Cliente:** ${proyecto.entidadContratante}\n`
        markdown += `- **Ubicación:** ${proyecto.ubicacion}${proyecto.departamento ? `, ${proyecto.departamento}` : ''}\n`
        markdown += `- **Período:** ${new Date(proyecto.fechaInicio).toLocaleDateString('es-CO')} → ${new Date(proyecto.fechaFin).toLocaleDateString('es-CO')}\n`

        if (proyecto.pesoKg) {
          markdown += `- **Peso:** ${(proyecto.pesoKg / 1000).toFixed(2)} toneladas (${proyecto.pesoKg.toLocaleString()} kg)\n`
        }

        if (proyecto.areaM2) {
          markdown += `- **Área:** ${proyecto.areaM2.toLocaleString()} m²\n`
        }

        if (proyecto.valorContrato && proyecto.valorContrato > 0) {
          markdown += `- **Valor:** $${proyecto.valorContrato.toLocaleString('es-CO')} COP\n`
        }

        markdown += `- **Categoría sugerida:** [PENDIENTE CLASIFICAR]\n`
        markdown += '\n'
      })

      markdown += '---\n\n'
    })

    // Agregar sección de categorías al final
    markdown += '\n\n# GUÍA DE CATEGORIZACIÓN\n\n'
    markdown += 'Por favor, revisa cada proyecto y asigna la categoría correspondiente:\n\n'
    markdown += '## Categorías Disponibles:\n\n'
    markdown += '1. **COMERCIAL** - Centros comerciales, locales comerciales, retail, plazas comerciales\n'
    markdown += '2. **EDIFICACIONES** - Edificios institucionales, residenciales, corporativos, culturales\n'
    markdown += '3. **INDUSTRIA** - Plantas industriales, bodegas, centros de distribución, facilidades de producción\n'
    markdown += '4. **PUENTES VEHICULARES** - Puentes para tráfico vehicular, viaductos\n'
    markdown += '5. **PUENTES PEATONALES** - Puentes peatonales, ciclopuentes, pasarelas\n'
    markdown += '6. **ESCENARIOS DEPORTIVOS** - Coliseos, estadios, canchas, complejos deportivos\n'
    markdown += '7. **OTROS** - Proyectos que no encajan en las categorías anteriores\n\n'

    // Guardar archivo
    const outputPath = path.join(process.cwd(), 'TRAYECTORIA_PARA_CATALOGAR.md')
    fs.writeFileSync(outputPath, markdown, 'utf-8')

    console.log(`\n✅ Archivo exportado exitosamente:`)
    console.log(`📁 ${outputPath}`)
    console.log(`\n📊 Resumen:`)
    console.log(`   - Total proyectos: ${proyectos.length}`)
    console.log(`   - Años cubiertos: ${añosOrdenados[añosOrdenados.length - 1]} - ${añosOrdenados[0]}`)

    const toneladasTotales = proyectos.reduce((sum, p) => sum + (p.pesoKg ? p.pesoKg / 1000 : 0), 0)
    const areaTotales = proyectos.reduce((sum, p) => sum + (p.areaM2 || 0), 0)

    console.log(`   - Toneladas totales: ${toneladasTotales.toFixed(0)} ton`)
    console.log(`   - Área total: ${areaTotales.toLocaleString()} m²`)

    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Error al exportar:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

exportTrayectoriaCatalogada()
