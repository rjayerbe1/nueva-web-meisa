#!/usr/bin/env node

/**
 * Script para limpiar URLs de localhost en canvasData de producción
 */

import { PrismaClient } from '@prisma/client';

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function cleanLocalhostUrls() {
  console.log('🧹 Limpiando URLs de localhost en producción...\n');

  const prisma = new PrismaClient({
    datasources: { db: { url: NEON_URL } }
  });

  try {
    console.log('🔗 Conectando a Neon...');
    await prisma.$connect();
    console.log('✅ Conectado\n');

    // Obtener todas las plantillas
    const templates = await prisma.pageTemplate.findMany({
      select: { id: true, nombre: true, canvasData: true }
    });

    console.log(`📋 Revisando ${templates.length} plantillas...\n`);

    let cleaned = 0;
    let hasLocalhostUrls = [];

    for (const template of templates) {
      if (!template.canvasData || !template.canvasData.objects) {
        continue;
      }

      let modified = false;
      const canvasData = JSON.parse(JSON.stringify(template.canvasData));

      // Revisar cada objeto
      for (const obj of canvasData.objects) {
        if (obj.src && obj.src.includes('localhost:3000')) {
          console.log(`⚠️  ${template.nombre}`);
          console.log(`   Encontrada URL de localhost: ${obj.src}`);

          hasLocalhostUrls.push({
            nombre: template.nombre,
            url: obj.src
          });

          // Eliminar el objeto con localhost
          const index = canvasData.objects.indexOf(obj);
          canvasData.objects.splice(index, 1);
          modified = true;

          console.log(`   ❌ Objeto eliminado\n`);
        }
      }

      // Si se modificó, actualizar en DB
      if (modified) {
        await prisma.pageTemplate.update({
          where: { id: template.id },
          data: { canvasData }
        });
        cleaned++;
        console.log(`   ✅ Plantilla actualizada\n`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   - Plantillas limpiadas: ${cleaned}`);
    console.log(`   - Plantillas con localhost: ${hasLocalhostUrls.length}\n`);

    if (hasLocalhostUrls.length > 0) {
      console.log('⚠️  Plantillas que tenían URLs de localhost:');
      hasLocalhostUrls.forEach(item => {
        console.log(`   - ${item.nombre}`);
        console.log(`     URL: ${item.url}`);
      });
      console.log('');
    }

    // Verificar todas las plantillas
    console.log('🔍 Verificando plantillas después de la limpieza...\n');
    const allTemplates = await prisma.pageTemplate.findMany({
      select: { nombre: true, canvasData: true }
    });

    allTemplates.forEach(t => {
      const objectCount = t.canvasData?.objects?.length || 0;
      const hasLocalhost = JSON.stringify(t.canvasData || {}).includes('localhost:3000');
      const status = hasLocalhost ? '❌ LOCALHOST' : objectCount > 0 ? '✅' : '⚠️  vacío';
      console.log(status, t.nombre, '-', objectCount, 'objetos');
    });

    await prisma.$disconnect();

    console.log('\n✅ Proceso completado!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanLocalhostUrls();
