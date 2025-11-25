const proyectos = require('../proyectos-completos.json')

// Agrupar por palabras clave en el objeto del contrato
const categorizado = {
  comercial: [],
  industrial: [],
  puentes: [],
  infraestructura: [],
  edificaciones: [],
  deportes: [],
  otros: []
}

proyectos.forEach(p => {
  const texto = (p.objetoContrato + ' ' + p.tituloDisplay + ' ' + (p.descripcionSecundaria || '')).toLowerCase()

  if (texto.includes('dollar') || texto.includes('comercial') || texto.includes('super') || texto.includes('tienda')) {
    categorizado.comercial.push(p)
  } else if (texto.includes('bodega') || texto.includes('planta') || texto.includes('industrial') || texto.includes('hangar')) {
    categorizado.industrial.push(p)
  } else if (texto.includes('puente') && !texto.includes('ciclo')) {
    categorizado.puentes.push(p)
  } else if (texto.includes('ciclo') || texto.includes('estacion') || texto.includes('terminal')) {
    categorizado.infraestructura.push(p)
  } else if (texto.includes('edificio') || texto.includes('ampliacion') || texto.includes('parqueadero') || texto.includes('piso')) {
    categorizado.edificaciones.push(p)
  } else if (texto.includes('coliseo') || texto.includes('cancha') || texto.includes('estadio') || texto.includes('deportivo')) {
    categorizado.deportes.push(p)
  } else {
    categorizado.otros.push(p)
  }
})

console.log('='.repeat(80))
console.log('PROYECTOS REALES DE MEISA POR CATEGORÍA')
console.log('='.repeat(80))

Object.keys(categorizado).forEach(cat => {
  if (categorizado[cat].length > 0) {
    console.log(`\n📁 ${cat.toUpperCase()} (${categorizado[cat].length} proyectos):`)
    categorizado[cat].slice(0, 8).forEach((p, i) => {
      const peso = parseInt(p.pesoKg) / 1000
      console.log(`   ${i + 1}. ${p.tituloDisplay}`)
      console.log(`      - ${p.objetoContrato}`)
      console.log(`      - ${peso.toFixed(1)} ton, ${p.areaM2} m²`)
    })
    if (categorizado[cat].length > 8) {
      console.log(`   ... y ${categorizado[cat].length - 8} más`)
    }
  }
})

console.log('\n' + '='.repeat(80))
console.log(`Total proyectos: ${proyectos.length}`)
