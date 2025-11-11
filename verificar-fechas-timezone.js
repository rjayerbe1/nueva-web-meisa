const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  // Verificar proyectos con fechas sospechosas (zona horaria incorrecta)
  // Buscar fechas que terminen en 19:00:00 (UTC-5) o que sean del año anterior al esperado

  const todosProyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    orderBy: { fechaInicio: 'asc' }
  });

  console.log('🔍 VERIFICANDO POSIBLES PROBLEMAS DE ZONA HORARIA\n');
  console.log('Buscando fechas sospechosas (termina en 19:00:00 o año desplazado):\n');

  let problemasEncontrados = 0;

  // Agrupar problemas por año
  const problemasPorAnio = {};

  todosProyectos.forEach(p => {
    const inicioHora = p.fechaInicio.getHours();
    const finHora = p.fechaFin.getHours();
    const inicioMes = p.fechaInicio.getMonth();
    const inicioDay = p.fechaInicio.getDate();
    const finMes = p.fechaFin.getMonth();
    const finDay = p.fechaFin.getDate();

    // Detectar fechas sospechosas:
    // 1. Hora es 19:00 (típico de UTC-5 mal convertido)
    // 2. Es 31 de diciembre del año anterior (típico error de timezone)
    const problemaInicio = (inicioHora === 19) || (inicioMes === 11 && inicioDay === 31);
    const problemaFin = (finHora === 19) || (finMes === 11 && finDay === 31);

    if (problemaInicio || problemaFin) {
      const anioEsperado = p.fechaInicio.getFullYear();
      if (!problemasPorAnio[anioEsperado]) {
        problemasPorAnio[anioEsperado] = [];
      }

      problemasPorAnio[anioEsperado].push({
        proyecto: p,
        problemaInicio,
        problemaFin
      });

      problemasEncontrados++;
    }
  });

  if (problemasEncontrados === 0) {
    console.log('✅ No se encontraron problemas de zona horaria!\n');
  } else {
    console.log(`⚠️  Se encontraron ${problemasEncontrados} proyectos con posibles problemas de zona horaria:\n`);

    Object.keys(problemasPorAnio).sort().forEach(anio => {
      const problemas = problemasPorAnio[anio];
      console.log(`\n📅 AÑO ${anio}: ${problemas.length} proyectos con problemas`);
      console.log('─'.repeat(80));

      problemas.forEach((item, i) => {
        const p = item.proyecto;
        console.log(`\n${i+1}. ${p.entidadContratante.substring(0, 40)}`);
        console.log(`   ${p.objetoContrato.substring(0, 70)}...`);

        if (item.problemaInicio) {
          console.log(`   ⚠️  Inicio: ${p.fechaInicio.toISOString()} (${p.fechaInicio.toString()})`);
        }
        if (item.problemaFin) {
          console.log(`   ⚠️  Fin:    ${p.fechaFin.toISOString()} (${p.fechaFin.toString()})`);
        }
      });
    });

    console.log('\n\n📊 RESUMEN POR AÑO:');
    Object.keys(problemasPorAnio).sort((a, b) => b - a).forEach(anio => {
      console.log(`   ${anio}: ${problemasPorAnio[anio].length} proyectos con fechas sospechosas`);
    });
  }

  await prisma.$disconnect();
})();
