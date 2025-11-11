import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const proyectos = await prisma.proyectoHojaVida.findMany({
    orderBy: { fechaInicio: 'desc' }
  });

  console.log(`✅ Proyectos actuales en BD: ${proyectos.length}\n`);

  // Agrupar por año
  const porAño = {};
  proyectos.forEach(p => {
    const año = new Date(p.fechaInicio).getFullYear();
    porAño[año] = (porAño[año] || 0) + 1;
  });

  console.log('📊 Proyectos por año (actuales):');
  Object.keys(porAño).sort((a, b) => Number(b) - Number(a)).forEach(año => {
    console.log(`   ${año}: ${porAño[año]} proyectos`);
  });

  const años = Object.keys(porAño).map(Number);
  console.log(`\n📅 Rango: ${Math.min(...años)} - ${Math.max(...años)}`);

  console.log('\n🔍 Muestra de proyectos:');
  proyectos.slice(0, 5).forEach(p => {
    const año = new Date(p.fechaInicio).getFullYear();
    console.log(`   ${año}: ${p.entidadContratante.substring(0, 30)} - ${p.objetoContrato.substring(0, 50)}...`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
