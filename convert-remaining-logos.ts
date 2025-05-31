import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function convertRemainingLogos() {
  try {
    console.log('🔄 CONVERSIÓN DE LOGOS PNG RESTANTES');
    console.log('='.repeat(50));
    
    const basePath = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public/images/clients';
    
    // Logos PNG adicionales que necesitan conversión
    const additionalLogos = [
      { file: 'cliente-comfacauca.png', client: 'Comfacauca' },
      { file: 'cliente-consorcio-edificar.png', client: 'Consorcio Edificar' },
      { file: 'cliente-mayaguez.png', client: 'Mayagüez' },
      { file: 'cliente-royal-films.png', client: 'Royal Films' },
      { file: 'cliente-sena.png', client: 'SENA' }
    ];

    console.log(`📋 Logos adicionales a convertir: ${additionalLogos.length}`);
    console.log('');

    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let successful = 0;
    let failed = 0;

    for (const { file, client } of additionalLogos) {
      const oldPath = path.join(basePath, file);
      const newFileName = file.replace('.png', '.webp');
      const newPath = path.join(basePath, newFileName);
      
      if (!fs.existsSync(oldPath)) {
        console.log(`❌ Archivo no encontrado: ${file}`);
        continue;
      }

      const originalStats = fs.statSync(oldPath);
      const originalSize = originalStats.size;
      totalOriginalSize += originalSize;
      
      console.log(`🔄 Convirtiendo: ${file}`);
      console.log(`   Cliente: ${client}`);
      console.log(`   Tamaño original: ${Math.round(originalSize / 1024)} KB`);
      
      try {
        // Convertir usando cwebp con calidad 85
        const command = `cwebp -q 85 "${oldPath}" -o "${newPath}"`;
        
        await execAsync(command);
        
        if (fs.existsSync(newPath)) {
          const newStats = fs.statSync(newPath);
          const newSize = newStats.size;
          const compressionRatio = ((originalSize - newSize) / originalSize) * 100;
          totalNewSize += newSize;
          
          console.log(`   ✅ Convertido exitosamente`);
          console.log(`   Nuevo tamaño: ${Math.round(newSize / 1024)} KB`);
          console.log(`   Compresión: ${compressionRatio.toFixed(1)}%`);
          
          // Actualizar la base de datos
          await updateClientLogo(client, `/images/clients/${newFileName}`);
          console.log(`   📝 Base de datos actualizada para: ${client}`);
          
          successful++;
          console.log('');
        } else {
          throw new Error('El archivo WebP no fue creado');
        }
        
      } catch (error) {
        console.log(`   ❌ Error en conversión: ${error}`);
        failed++;
        console.log('');
      }
    }
    
    // Resolver el problema con cliente-d1.png
    console.log('🔧 RESOLVIENDO PROBLEMA CON cliente-d1.png');
    console.log('-'.repeat(50));
    
    const corruptFile = path.join(basePath, 'cliente-d1.png');
    if (fs.existsSync(corruptFile)) {
      console.log('❌ cliente-d1.png está corrupto (es un archivo HTML)');
      console.log('💡 Recomendación: Reemplazar con un archivo PNG válido del logo de D1');
      console.log('   El cliente D1 SAS necesita un logo válido');
    }
    
    console.log('');
    console.log('📊 RESUMEN FINAL:');
    console.log('-'.repeat(50));
    console.log(`✅ Conversiones exitosas: ${successful}`);
    console.log(`❌ Conversiones fallidas: ${failed}`);
    
    if (successful > 0) {
      const totalCompressionRatio = ((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100;
      console.log(`📈 Ahorro total de espacio: ${Math.round((totalOriginalSize - totalNewSize) / 1024)} KB`);
      console.log(`📉 Compresión promedio: ${totalCompressionRatio.toFixed(1)}%`);
    }
    
    console.log('');
    console.log('🏁 Conversión completada.');
    
  } catch (error) {
    console.error('❌ Error en la conversión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateClientLogo(clientName: string, newLogoPath: string) {
  try {
    const result = await prisma.cliente.updateMany({
      where: {
        nombre: {
          contains: clientName,
          mode: 'insensitive'
        }
      },
      data: {
        logo: newLogoPath
      }
    });
    
    if (result.count === 0) {
      console.log(`   ⚠️ No se encontró cliente con nombre: ${clientName}`);
    }
  } catch (error) {
    console.error(`   ❌ Error actualizando logo para ${clientName}:`, error);
  }
}

convertRemainingLogos();