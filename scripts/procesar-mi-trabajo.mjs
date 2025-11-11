/**
 * Script para procesar el archivo MI-TRABAJO-TITULOS-DESCRIPCIONES.md
 * y generar los archivos JSON finales
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const miTrabajoPath = path.join(__dirname, 'MI-TRABAJO-TITULOS-DESCRIPCIONES.md')
const content = fs.readFileSync(miTrabajoPath, 'utf-8')

const titulos = {}
const descripciones = {}

// Regex para extraer secciones por año
const yearRegex = /## (\d{4})\n[\s\S]*?\*\*TÍTULO:\*\* "(.*?)"\n\n\*\*DESCRIPCIÓN:\*\* "(.*?)"/g

let match
while ((match = yearRegex.exec(content)) !== null) {
  const year = match[1]
  const titulo = match[2]
  const descripcion = match[3]

  titulos[year] = titulo
  descripciones[year] = descripcion

  console.log(`✓ Procesado año ${year}`)
}

// Guardar archivos JSON
fs.writeFileSync(
  path.join(__dirname, 'titulos-anos-propuestos.json'),
  JSON.stringify(titulos, null, 2)
)

fs.writeFileSync(
  path.join(__dirname, 'descripciones-anos-propuestas.json'),
  JSON.stringify(descripciones, null, 2)
)

console.log('\n✅ Archivos JSON generados:')
console.log('   - titulos-anos-propuestos.json')
console.log('   - descripciones-anos-propuestas.json')
console.log(`\nTotal años procesados: ${Object.keys(titulos).length}`)
