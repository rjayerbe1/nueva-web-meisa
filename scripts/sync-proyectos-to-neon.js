const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// URLs de bases de datos
const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Cliente para base local (lee de .env)
const localPrisma = new PrismaClient();

// Cliente para Neon
const neonPrisma = new PrismaClient({
  datasources: {
    db: { url: NEON_URL }
  }
});

async function main() {
  console.log('=== Sincronización de Proyectos Local → Neon ===\n');

  // 1. Obtener proyectos de local
  console.log('1. Obteniendo proyectos de base de datos local...');
  const proyectos = await localPrisma.proyecto.findMany({
    orderBy: { createdAt: 'asc' }
  });
  console.log(`   ✓ ${proyectos.length} proyectos encontrados\n`);

  // 2. Sincronizar a Neon
  console.log('2. Sincronizando a Neon...');
  let actualizados = 0;
  let errores = 0;

  for (const p of proyectos) {
    try {
      // Usar upsert para actualizar o crear
      await neonPrisma.proyecto.upsert({
        where: { id: p.id },
        update: {
          titulo: p.titulo,
          categoria: p.categoria,
          cliente: p.cliente,
          ubicacion: p.ubicacion,
          descripcion: p.descripcion,
          destacado: p.destacado,
          destacadoEnCategoria: p.destacadoEnCategoria,
          visible: p.visible,
          tags: p.tags,
          slug: p.slug,
          estado: p.estado,
          prioridad: p.prioridad,
          toneladas: p.toneladas,
          areaTotal: p.areaTotal
        },
        create: p
      });
      actualizados++;
      process.stdout.write(`\r   Sincronizados: ${actualizados}/${proyectos.length}`);
    } catch (e) {
      errores++;
      console.log(`\n   ✗ Error en "${p.titulo}": ${e.message}`);
    }
  }

  // 3. Eliminar proyectos que ya no existen en local
  console.log('\n\n3. Verificando proyectos eliminados...');
  const localIds = proyectos.map(p => p.id);
  const neonProyectos = await neonPrisma.proyecto.findMany({
    select: { id: true, titulo: true }
  });

  let eliminados = 0;
  for (const np of neonProyectos) {
    if (!localIds.includes(np.id)) {
      try {
        await neonPrisma.proyecto.delete({ where: { id: np.id } });
        eliminados++;
        console.log(`   ✓ Eliminado: ${np.titulo}`);
      } catch (e) {
        console.log(`   ✗ Error eliminando ${np.titulo}: ${e.message}`);
      }
    }
  }

  if (eliminados === 0) {
    console.log('   No hay proyectos para eliminar');
  }

  // 4. Resumen
  console.log('\n=== Sincronización completada ===');
  console.log(`Actualizados/Creados: ${actualizados}`);
  console.log(`Eliminados: ${eliminados}`);
  console.log(`Errores: ${errores}`);
  console.log(`Total en Neon: ${actualizados} proyectos`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  });
