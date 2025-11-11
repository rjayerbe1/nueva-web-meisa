const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  // Find all projects where start year != end year
  const allProyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      fechaInicio: true,
      fechaFin: true
    }
  });

  const multiAnioProyectos = allProyectos.filter(p => {
    const yearInicio = p.fechaInicio.getFullYear();
    const yearFin = p.fechaFin.getFullYear();
    return yearInicio !== yearFin;
  });

  console.log(`Total proyectos multi-año: ${multiAnioProyectos.length}`);
  console.log('\nProyectos que cruzan años:\n');

  multiAnioProyectos.forEach((p, i) => {
    const yearInicio = p.fechaInicio.getFullYear();
    const yearFin = p.fechaFin.getFullYear();
    console.log(`${i+1}. ${p.entidadContratante.substring(0, 35)} - ${yearInicio} → ${yearFin}`);
    console.log(`   ${p.objetoContrato.substring(0, 60)}...`);
  });

  // Count by year difference
  const byYearDiff = {};
  multiAnioProyectos.forEach(p => {
    const diff = p.fechaFin.getFullYear() - p.fechaInicio.getFullYear();
    byYearDiff[diff] = (byYearDiff[diff] || 0) + 1;
  });

  console.log('\nProyectos por diferencia de años:');
  Object.keys(byYearDiff).sort().forEach(diff => {
    console.log(`  ${diff} año(s): ${byYearDiff[diff]} proyectos`);
  });

  // Count by final year
  const byFinalYear = {};
  multiAnioProyectos.forEach(p => {
    const yearFin = p.fechaFin.getFullYear();
    byFinalYear[yearFin] = (byFinalYear[yearFin] || 0) + 1;
  });

  console.log('\nProyectos multi-año por año de finalización:');
  Object.keys(byFinalYear).sort((a,b) => b-a).forEach(year => {
    console.log(`  ${year}: ${byFinalYear[year]} proyectos`);
  });

  await prisma.$disconnect();
})();
