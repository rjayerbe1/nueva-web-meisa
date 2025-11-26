const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const proyectos = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      categoria: true,
      ubicacion: true
    },
    orderBy: [
      { categoria: 'asc' },
      { titulo: 'asc' }
    ]
  });

  console.log('Total proyectos:', proyectos.length);
  console.log('\n=== TODOS LOS TÍTULOS POR CATEGORÍA ===\n');

  const porCategoria = {};
  proyectos.forEach(p => {
    if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
    porCategoria[p.categoria].push(p);
  });

  Object.keys(porCategoria).forEach(cat => {
    console.log('\n--- ' + cat.toUpperCase() + ' (' + porCategoria[cat].length + ' proyectos) ---');
    porCategoria[cat].forEach((p, i) => {
      console.log(`  ${i+1}. ${p.titulo} | ${p.ubicacion}`);
    });
  });

  // Análisis de patrones
  console.log('\n\n=== ANÁLISIS DE PATRONES ===\n');

  // Títulos muy cortos (posiblemente incompletos)
  const cortos = proyectos.filter(p => p.titulo.length < 15);
  if (cortos.length > 0) {
    console.log('\n--- Títulos muy cortos (<15 caracteres) ---');
    cortos.forEach(p => console.log(`  • "${p.titulo}" (${p.categoria})`));
  }

  // Títulos muy largos
  const largos = proyectos.filter(p => p.titulo.length > 60);
  if (largos.length > 0) {
    console.log('\n--- Títulos muy largos (>60 caracteres) ---');
    largos.forEach(p => console.log(`  • "${p.titulo}" (${p.categoria})`));
  }

  // Títulos en minúsculas (posiblemente mal formateados)
  const minusculas = proyectos.filter(p => p.titulo === p.titulo.toLowerCase());
  if (minusculas.length > 0) {
    console.log('\n--- Títulos todo en minúsculas ---');
    minusculas.forEach(p => console.log(`  • "${p.titulo}" (${p.categoria})`));
  }

  // Títulos que empiezan con artículos
  const conArticulo = proyectos.filter(p => /^(el|la|los|las|un|una)\s/i.test(p.titulo));
  if (conArticulo.length > 0) {
    console.log('\n--- Títulos que empiezan con artículo ---');
    conArticulo.forEach(p => console.log(`  • "${p.titulo}" (${p.categoria})`));
  }

  // Títulos duplicados
  const titulos = proyectos.map(p => p.titulo.toLowerCase());
  const duplicados = proyectos.filter((p, i) =>
    titulos.indexOf(p.titulo.toLowerCase()) !== i
  );
  if (duplicados.length > 0) {
    console.log('\n--- Posibles títulos duplicados ---');
    duplicados.forEach(p => console.log(`  • "${p.titulo}" (${p.categoria})`));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
