const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  console.log('🔧 CORRECCIÓN MASIVA DE FECHAS CON PROBLEMAS DE TIMEZONE\n');
  console.log('Buscando proyectos con fechas sospechosas...\n');

  // Obtener todos los proyectos
  const todosProyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    orderBy: { fechaInicio: 'asc' }
  });

  console.log(`📊 Total proyectos en BD: ${todosProyectos.length}\n`);

  // Identificar proyectos con problemas
  const proyectosACorregir = [];

  todosProyectos.forEach(p => {
    const inicioHora = p.fechaInicio.getHours();
    const finHora = p.fechaFin.getHours();
    const inicioMes = p.fechaInicio.getMonth();
    const inicioDay = p.fechaInicio.getDate();
    const finMes = p.fechaFin.getMonth();
    const finDay = p.fechaFin.getDate();

    // Detectar fechas sospechosas
    const problemaInicio = (inicioHora === 19) || (inicioMes === 11 && inicioDay === 31);
    const problemaFin = (finHora === 19) || (finMes === 11 && finDay === 31);

    if (problemaInicio || problemaFin) {
      proyectosACorregir.push({
        id: p.id,
        entidad: p.entidadContratante,
        objeto: p.objetoContrato,
        fechaInicioActual: p.fechaInicio,
        fechaFinActual: p.fechaFin,
        problemaInicio,
        problemaFin
      });
    }
  });

  console.log(`⚠️  Proyectos con problemas encontrados: ${proyectosACorregir.length}\n`);

  if (proyectosACorregir.length === 0) {
    console.log('✅ No hay fechas para corregir!\n');
    await prisma.$disconnect();
    return;
  }

  console.log('🚀 Iniciando corrección...\n');

  let corregidos = 0;
  let errores = 0;

  for (const proyecto of proyectosACorregir) {
    try {
      // Extraer año, mes y día de las fechas actuales (ignorando la hora incorrecta)
      const inicioDate = new Date(proyecto.fechaInicioActual);
      const finDate = new Date(proyecto.fechaFinActual);

      // Si la hora es 19:00, es probable que el día sea el siguiente (debido al timezone)
      let inicioYear = inicioDate.getFullYear();
      let inicioMonth = inicioDate.getMonth() + 1; // getMonth() es 0-indexed
      let inicioDay = inicioDate.getDate();

      let finYear = finDate.getFullYear();
      let finMonth = finDate.getMonth() + 1;
      let finDay = finDate.getDate();

      // Si es diciembre 31 a las 19:00, probablemente debería ser enero 1 del año siguiente
      if (inicioDate.getHours() === 19 && inicioMonth === 12 && inicioDay === 31) {
        inicioYear += 1;
        inicioMonth = 1;
        inicioDay = 1;
      }

      if (finDate.getHours() === 19 && finMonth === 12 && finDay === 31) {
        finYear += 1;
        finMonth = 1;
        finDay = 1;
      }

      // Crear nuevas fechas con hora 12:00 UTC para evitar problemas de timezone
      const nuevaFechaInicio = new Date(Date.UTC(inicioYear, inicioMonth - 1, inicioDay, 12, 0, 0));
      const nuevaFechaFin = new Date(Date.UTC(finYear, finMonth - 1, finDay, 12, 0, 0));

      // Actualizar en la base de datos
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          fechaInicio: nuevaFechaInicio,
          fechaFin: nuevaFechaFin
        }
      });

      corregidos++;

      if (corregidos % 20 === 0) {
        console.log(`   ✓ Corregidos ${corregidos} de ${proyectosACorregir.length}...`);
      }

    } catch (error) {
      console.error(`   ❌ Error corrigiendo proyecto ${proyecto.id}:`, error.message);
      errores++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE CORRECCIÓN:');
  console.log('='.repeat(80));
  console.log(`✅ Proyectos corregidos exitosamente: ${corregidos}`);
  if (errores > 0) {
    console.log(`❌ Errores encontrados: ${errores}`);
  }
  console.log(`📈 Total procesados: ${proyectosACorregir.length}`);
  console.log('='.repeat(80));

  console.log('\n🎉 Corrección completada!');
  console.log('\n💡 Siguiente paso: Regenerar los resúmenes de años con:');
  console.log('   node scripts/generar-resumenes-anio.mjs\n');

  await prisma.$disconnect();
})();
