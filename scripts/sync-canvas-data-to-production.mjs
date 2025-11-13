#!/usr/bin/env node

/**
 * Script para sincronizar canvasData de plantillas a producción
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Plantillas problemáticas reportadas por el usuario
const PROBLEMATIC_TEMPLATES = [
  'Portada MEISA - Formas Geométricas',
  'Imagen Grande + Texto',
  'Página de Texto',
  'Galería 2x2'
];

async function syncCanvasData() {
  console.log('🔄 Sincronizando canvasData a producción...\n');

  try {
    // Leer datos exportados
    const templatesData = JSON.parse(fs.readFileSync('/tmp/templates-canvas-data.json', 'utf8'));

    console.log('📖 Plantillas a actualizar:', PROBLEMATIC_TEMPLATES.length);
    console.log('');

    // Conectar a producción
    const prisma = new PrismaClient({
      datasources: { db: { url: NEON_URL } }
    });

    console.log('🔗 Conectando a Neon...');
    await prisma.$connect();
    console.log('✅ Conectado\n');

    let updated = 0;
    let failed = 0;

    for (const templateName of PROBLEMATIC_TEMPLATES) {
      console.log('📝', templateName);

      const localData = templatesData[templateName];
      if (!localData) {
        console.log('   ❌ No encontrada en datos locales\n');
        failed++;
        continue;
      }

      if (!localData.canvasData || localData.objectCount === 0) {
        console.log('   ⚠️  Sin canvas data en local\n');
        continue;
      }

      try {
        // Actualizar canvasData en producción
        const result = await prisma.pageTemplate.updateMany({
          where: { nombre: templateName },
          data: { canvasData: localData.canvasData }
        });

        if (result.count > 0) {
          console.log('   ✅ Actualizada (' + localData.objectCount + ' objetos)');
          updated++;
        } else {
          console.log('   ⚠️  No encontrada en producción');
          failed++;
        }
      } catch (error) {
        console.log('   ❌ Error:', error.message);
        failed++;
      }
      console.log('');
    }

    console.log('✅ Sincronización completada!\n');
    console.log('📊 Resumen:');
    console.log('   - Actualizadas:', updated);
    console.log('   - Fallidas:', failed);
    console.log('');

    // Verificar todas las plantillas en producción
    console.log('🔍 Verificando todas las plantillas en producción...\n');
    const allTemplates = await prisma.pageTemplate.findMany({
      select: { nombre: true, canvasData: true }
    });

    allTemplates.forEach(t => {
      const objectCount = t.canvasData?.objects?.length || 0;
      const status = objectCount > 0 ? '✅' : '❌';
      console.log(status, t.nombre, '-', objectCount, 'objetos');
    });

    await prisma.$disconnect();

    console.log('');
    console.log('🎉 ¡Proceso completado!');
    console.log('');
    console.log('📝 Ahora verifica en el admin que las plantillas se carguen correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncCanvasData();
