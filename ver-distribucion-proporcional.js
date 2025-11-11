const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  console.log('📊 ANÁLISIS DE DISTRIBUCIÓN PROPORCIONAL DE TONELADAS\n');

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    orderBy: { fechaInicio: 'asc' }
  });

  // Ejemplo: Proyectos que cruzan 2024-2025
  const proyectos2024_2025 = proyectos.filter(p => {
    const yearInicio = p.fechaInicio.getFullYear();
    const yearFin = p.fechaFin.getFullYear();
    return (yearInicio === 2024 && yearFin === 2025) || (yearInicio === 2023 && yearFin === 2025);
  });

  console.log(`🔍 Proyectos que cruzan de 2024 a 2025 (o 2023-2025):\n`);

  proyectos2024_2025.forEach((p, i) => {
    const yearInicio = p.fechaInicio.getFullYear();
    const yearFin = p.fechaFin.getFullYear();
    const pesoTotalTon = p.pesoKg ? Math.round(p.pesoKg / 1000) : 0;

    // Calcular distribución
    const mesesTotales = (yearFin - yearInicio) * 12 + (p.fechaFin.getMonth() - p.fechaInicio.getMonth()) + 1;

    let distribucion = {};
    for (let year = yearInicio; year <= yearFin; year++) {
      let mesesEnAño = 0;

      if (year === yearInicio) {
        mesesEnAño = 12 - p.fechaInicio.getMonth();
      } else if (year === yearFin) {
        mesesEnAño = p.fechaFin.getMonth() + 1;
      } else {
        mesesEnAño = 12;
      }

      const proporcion = mesesEnAño / mesesTotales;
      const toneladasAño = Math.round(pesoTotalTon * proporcion);

      distribucion[year] = {
        meses: mesesEnAño,
        toneladas: toneladasAño,
        porcentaje: Math.round(proporcion * 100)
      };
    }

    console.log(`${i + 1}. ${p.entidadContratante.substring(0, 40)}`);
    console.log(`   ${p.objetoContrato.substring(0, 70)}...`);
    console.log(`   Período: ${p.fechaInicio.toISOString().split('T')[0]} → ${p.fechaFin.toISOString().split('T')[0]}`);
    console.log(`   Total: ${pesoTotalTon} ton | Meses: ${mesesTotales} meses`);
    console.log(`   Distribución:`);

    Object.entries(distribucion).forEach(([year, data]) => {
      console.log(`     • ${year}: ${data.toneladas} ton (${data.meses} meses = ${data.porcentaje}%)`);
    });
    console.log();
  });

  // Resumen total
  console.log('\n📈 RESUMEN POR AÑO (con distribución proporcional):\n');

  const distribucionPorAnio = {};

  proyectos.forEach(p => {
    const yearInicio = p.fechaInicio.getFullYear();
    const yearFin = p.fechaFin.getFullYear();
    const pesoKg = p.pesoKg || 0;

    if (yearInicio === yearFin) {
      // Un solo año
      distribucionPorAnio[yearFin] = (distribucionPorAnio[yearFin] || 0) + pesoKg;
    } else {
      // Multi-año
      const mesesTotales = (yearFin - yearInicio) * 12 + (p.fechaFin.getMonth() - p.fechaInicio.getMonth()) + 1;

      for (let year = yearInicio; year <= yearFin; year++) {
        let mesesEnAño = 0;

        if (year === yearInicio) {
          mesesEnAño = 12 - p.fechaInicio.getMonth();
        } else if (year === yearFin) {
          mesesEnAño = p.fechaFin.getMonth() + 1;
        } else {
          mesesEnAño = 12;
        }

        const proporcion = mesesEnAño / mesesTotales;
        distribucionPorAnio[year] = (distribucionPorAnio[year] || 0) + (pesoKg * proporcion);
      }
    }
  });

  const añosOrdenados = Object.keys(distribucionPorAnio).sort((a, b) => Number(b) - Number(a));

  añosOrdenados.slice(0, 10).forEach(año => {
    const toneladas = Math.round(distribucionPorAnio[año] / 1000);
    console.log(`   ${año}: ${toneladas} toneladas`);
  });

  await prisma.$disconnect();
})();
