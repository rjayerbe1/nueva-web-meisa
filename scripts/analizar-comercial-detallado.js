const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const proyectos = await prisma.proyecto.findMany({
    where: { categoria: 'COMERCIAL' },
    select: {
      id: true,
      titulo: true,
      ubicacion: true,
      cliente: true,
      descripcion: true,
      toneladas: true
    },
    orderBy: { titulo: 'asc' }
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log(`ANÁLISIS DETALLADO - CATEGORÍA COMERCIAL (${proyectos.length} proyectos)`);
  console.log(`${'='.repeat(80)}\n`);

  let output = `# ANÁLISIS DETALLADO - CATEGORÍA COMERCIAL
# Total: ${proyectos.length} proyectos
# Fecha: ${new Date().toLocaleDateString('es-CO')}

## CRITERIOS PARA UN BUEN TÍTULO DE OBRA COMERCIAL:

1. **Tipo de estructura**: Centro Comercial, Local, Mezanine, Almacén, etc.
2. **Nombre identificador**: Nombre del proyecto/edificio, NO del cliente
3. **Sin redundancias**: No repetir ciudad si ya está en ubicación

## FORMATO IDEAL:
   "[Tipo] [Nombre del Proyecto/Edificio]"

   Ejemplos:
   - "Centro Comercial Único Cali" ✓
   - "Local Comercial Natura Park" ✓
   - "Mezanine Almacén Éxito" ✓

## FORMATO A EVITAR:
   "[Nombre Cliente] - [Descripción]"

   El cliente va en el campo CLIENTE, no en el título.

================================================================================
ANÁLISIS PROYECTO POR PROYECTO
================================================================================

`;

  proyectos.forEach((p, i) => {
    const tieneGuion = p.titulo.includes(' - ');
    const partes = tieneGuion ? p.titulo.split(' - ') : [null, p.titulo];
    const posibleCliente = partes[0];
    const posibleObra = partes[1] || p.titulo;

    // Detectar patrones
    const ciudadEnTitulo = p.ubicacion.split(',')[0].trim();
    const tituloTieneCiudad = p.titulo.toLowerCase().includes(ciudadEnTitulo.toLowerCase()) && ciudadEnTitulo.length > 3;

    // Detectar si empieza con nombre de empresa/persona
    const empiezaConCliente = tieneGuion && (
      /^[A-Z][a-záéíóú]+ (y |& |de )?[A-Z]/.test(posibleCliente) || // Nombre persona
      /^(CC |Almacen|Banco|Carrefour|Royal|Dollar|UT |Consorcio|Construc|Ing\.|Arq\.)/.test(posibleCliente) ||
      /S\.?A\.?S?\.?$|Ltda\.?$/i.test(posibleCliente) // Termina en S.A., S.A.S., Ltda
    );

    console.log(`${i+1}. ${p.titulo}`);
    console.log(`   Cliente BD: ${p.cliente}`);
    console.log(`   Ubicación: ${p.ubicacion}`);

    output += `\n### ${i+1}. "${p.titulo}"\n`;
    output += `- **Cliente en BD**: ${p.cliente}\n`;
    output += `- **Ubicación**: ${p.ubicacion}\n`;
    if (p.toneladas) output += `- **Toneladas**: ${p.toneladas}\n`;

    // Análisis
    let problemas = [];
    let propuesta = p.titulo;

    if (tieneGuion && empiezaConCliente) {
      problemas.push(`❌ Tiene el cliente "${posibleCliente}" en el título`);
      propuesta = posibleObra;
    }

    if (tituloTieneCiudad) {
      problemas.push(`⚠️ Ciudad "${ciudadEnTitulo}" está en título y ubicación`);
      // Si quitamos la ciudad del título propuesto
      const sinCiudad = propuesta.replace(new RegExp(`\\s*${ciudadEnTitulo}\\s*`, 'gi'), ' ').trim();
      if (sinCiudad.length > 10) {
        propuesta = sinCiudad;
      }
    }

    if (p.titulo.length < 15) {
      problemas.push(`❌ Título muy corto, falta contexto`);
    }

    if (p.titulo.length > 55) {
      problemas.push(`⚠️ Título muy largo, simplificar`);
    }

    if (/^Estructura metálica/i.test(p.titulo)) {
      problemas.push(`❌ Título genérico, usar nombre específico del proyecto`);
    }

    // Sugerir mejora
    if (problemas.length === 0) {
      output += `- **Estado**: ✅ OK\n`;
      console.log(`   ✅ OK\n`);
    } else {
      output += `- **Problemas**:\n`;
      problemas.forEach(prob => {
        output += `  - ${prob}\n`;
        console.log(`   ${prob}`);
      });

      // Generar propuesta mejorada
      if (propuesta !== p.titulo) {
        // Limpiar propuesta
        propuesta = propuesta.trim();
        // Asegurar que empiece con mayúscula
        propuesta = propuesta.charAt(0).toUpperCase() + propuesta.slice(1);

        output += `- **📝 PROPUESTA**: "${propuesta}"\n`;
        console.log(`   📝 PROPUESTA: "${propuesta}"`);
      }
      console.log('');
    }
  });

  // Guardar archivo
  const filePath = './ANALISIS_COMERCIAL_DETALLADO.md';
  fs.writeFileSync(filePath, output);
  console.log(`\n✅ Archivo guardado: ${filePath}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
