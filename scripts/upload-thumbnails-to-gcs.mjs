#!/usr/bin/env node

/**
 * Script para subir thumbnails de plantillas a Google Cloud Storage
 */

import { Storage } from '@google-cloud/storage';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// Configuración de GCS
const BUCKET_NAME = 'meisa-imagenes';
const GCS_FOLDER = 'brochures/thumbnails';

// Plantillas con thumbnails locales que necesitan subirse
const TEMPLATES_TO_FIX = [
  { nombre: 'Galería 2x2', file: '1762986479936-v2affj.png' },
  { nombre: 'Portada MEISA - Formas Geométricas', file: '1763038294941-ccd0jv.png' },
  { nombre: 'Página de Texto', file: '1762986985056-w07idu.png' },
  { nombre: 'Imagen Grande + Texto', file: '1762987026253-oozvbu.png' }
];

async function uploadThumbnails() {
  console.log('🚀 Subiendo thumbnails a Google Cloud Storage...\n');
  console.log('📦 Bucket:', BUCKET_NAME);
  console.log('📁 Carpeta:', GCS_FOLDER);
  console.log('');

  try {
    // Inicializar cliente de GCS
    const storage = new Storage({
      projectId: 'meisa-web-prod-2025'
    });
    const bucket = storage.bucket(BUCKET_NAME);

    // Verificar que el bucket existe
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error('❌ El bucket no existe:', BUCKET_NAME);
      process.exit(1);
    }
    console.log('✅ Bucket verificado\n');

    const updatedTemplates = [];

    for (const template of TEMPLATES_TO_FIX) {
      console.log('📤', template.nombre);

      const localPath = path.join(__dirname, '..', 'public', 'uploads', 'projects', template.file);

      if (!fs.existsSync(localPath)) {
        console.log('   ❌ Archivo no encontrado:', localPath);
        continue;
      }

      // Nombre del archivo en GCS
      const gcsFileName = `${GCS_FOLDER}/${template.file}`;
      const file = bucket.file(gcsFileName);

      try {
        // Subir archivo
        console.log('   📤 Subiendo...');
        await bucket.upload(localPath, {
          destination: gcsFileName,
          metadata: {
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000', // 1 año
          },
          public: true // Hacer el archivo público
        });

        // URL pública del archivo
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${gcsFileName}`;
        console.log('   ✅ Subido:', publicUrl);

        // Actualizar en base de datos LOCAL
        await prisma.pageTemplate.updateMany({
          where: { nombre: template.nombre },
          data: { thumbnail: publicUrl }
        });
        console.log('   ✅ Base de datos local actualizada\n');

        updatedTemplates.push({
          nombre: template.nombre,
          url: publicUrl
        });

      } catch (uploadError) {
        console.log('   ❌ Error al subir:', uploadError.message, '\n');
      }
    }

    console.log('✅ Proceso completado!\n');
    console.log('📊 Resumen:');
    console.log('   - Plantillas actualizadas:', updatedTemplates.length);
    console.log('');

    if (updatedTemplates.length > 0) {
      console.log('🔗 URLs actualizadas:');
      updatedTemplates.forEach(t => {
        console.log(`   - ${t.nombre}`);
        console.log(`     ${t.url}`);
      });
      console.log('');
    }

    // Exportar datos para actualizar producción
    const exportData = {
      templates: updatedTemplates,
      timestamp: new Date().toISOString()
    };

    const exportPath = '/tmp/thumbnails-updated.json';
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    console.log('💾 Datos exportados a:', exportPath);
    console.log('');
    console.log('⏭️  Siguiente paso: Actualizar base de datos de producción');
    console.log('   node scripts/update-thumbnails-in-production.mjs');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

uploadThumbnails();
