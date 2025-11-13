#!/usr/bin/env node

/**
 * Script para actualizar URLs de thumbnails en base de datos de producción (Neon)
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function updateProductionThumbnails() {
  console.log('🔄 Actualizando thumbnails en base de datos de PRODUCCIÓN (Neon)...\n');

  try {
    // Leer datos exportados
    const exportData = JSON.parse(fs.readFileSync('/tmp/thumbnails-updated.json', 'utf8'));

    console.log('📖 Datos cargados:');
    console.log('   - Plantillas a actualizar:', exportData.templates.length);
    console.log('   - Timestamp:', exportData.timestamp);
    console.log('');

    // Conectar a base de datos de producción
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: NEON_URL
        }
      }
    });

    console.log('🔗 Conectando a Neon...');
    await prisma.$connect();
    console.log('✅ Conectado\n');

    // Actualizar cada plantilla
    for (const template of exportData.templates) {
      console.log('📝', template.nombre);

      try {
        const result = await prisma.pageTemplate.updateMany({
          where: { nombre: template.nombre },
          data: { thumbnail: template.url }
        });

        if (result.count > 0) {
          console.log('   ✅ Actualizada (' + result.count + ' registro(s))');
          console.log('   🔗', template.url);
        } else {
          console.log('   ⚠️  No se encontró la plantilla');
        }
      } catch (updateError) {
        console.log('   ❌ Error:', updateError.message);
      }
      console.log('');
    }

    console.log('✅ Actualización completada!\n');

    // Verificar resultado
    console.log('🔍 Verificando URLs en producción...');
    const templates = await prisma.pageTemplate.findMany({
      select: { nombre: true, thumbnail: true }
    });

    console.log('');
    templates.forEach(t => {
      if (t.thumbnail) {
        const isGCS = t.thumbnail.includes('storage.googleapis.com');
        const isSVG = t.thumbnail.startsWith('data:image/svg');
        const status = isGCS ? '✅ GCS' : isSVG ? '✅ SVG' : '⚠️  Local';
        console.log(status, '-', t.nombre);
      } else {
        console.log('❌ Sin thumbnail -', t.nombre);
      }
    });

    console.log('');
    console.log('🎉 ¡Sincronización completa!');
    console.log('');
    console.log('📝 Próximos pasos:');
    console.log('   1. Verificar en el admin que los thumbnails se vean');
    console.log('   2. Si todo funciona, hacer commit de los cambios');
    console.log('   3. Los thumbnails ahora están en Google Cloud Storage');

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProductionThumbnails();
