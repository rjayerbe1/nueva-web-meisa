import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Obtener proyectos existentes
  const proyectosDB = await prisma.proyectoHojaVida.findMany({
    select: {
      id: true,
      entidadContratante: true,
      objetoContrato: true,
      fechaInicio: true,
      fechaFin: true,
    },
    orderBy: { fechaInicio: 'asc' }
  });

  console.log(`\n🔍 REVISANDO DUPLICADOS\n`);
  console.log(`Proyectos en BD: ${proyectosDB.length}`);

  // Obtener proyectos de 2016 y anteriores
  const proyectos2016yAntes = proyectosDB.filter(p => new Date(p.fechaInicio).getFullYear() <= 2016);

  console.log(`\n📌 Proyectos de 2016 y anteriores en BD: ${proyectos2016yAntes.length}`);
  proyectos2016yAntes.forEach(p => {
    const año = new Date(p.fechaInicio).getFullYear();
    console.log(`\n   ${año}: ${p.entidadContratante}`);
    console.log(`      ${p.objetoContrato}`);
    console.log(`      Fechas: ${p.fechaInicio.toISOString().split('T')[0]} - ${p.fechaFin.toISOString().split('T')[0]}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
