const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const proyectos2025 = await prisma.proyectoHojaVida.findMany({
    where: {
      visible: true,
      fechaFin: {
        gte: new Date('2025-01-01'),
        lt: new Date('2026-01-01')
      }
    },
    orderBy: { fechaFin: 'asc' }
  });

  console.log('🎯 PROYECTOS QUE FINALIZAN EN 2025 (CORRECTAMENTE AGRUPADOS):\n');

  proyectos2025.forEach((p, i) => {
    const inicioYear = p.fechaInicio.getFullYear();
    const finYear = p.fechaFin.getFullYear();
    const multiAnio = inicioYear !== finYear ? '📅 MULTI-AÑO' : '✓ Mismo año';
    const pesoTon = p.pesoKg ? Math.round(p.pesoKg / 1000) : 0;

    console.log(`${i+1}. [${multiAnio}] ${inicioYear} → ${finYear}`);
    console.log(`   ${p.entidadContratante.substring(0, 40)}`);
    console.log(`   ${p.objetoContrato.substring(0, 70)}...`);
    console.log(`   Peso: ${pesoTon} ton | Área: ${p.areaM2 || 0} m²`);
    console.log();
  });

  const multiAnio = proyectos2025.filter(p => p.fechaInicio.getFullYear() !== p.fechaFin.getFullYear());
  const mismoAnio = proyectos2025.filter(p => p.fechaInicio.getFullYear() === p.fechaFin.getFullYear());

  console.log('📊 RESUMEN:');
  console.log(`   Multi-año: ${multiAnio.length} proyectos`);
  console.log(`   Mismo año (2025): ${mismoAnio.length} proyectos`);
  console.log(`   TOTAL: ${proyectos2025.length} proyectos`);

  await prisma.$disconnect();
})();
