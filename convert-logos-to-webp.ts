import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

interface LogoConversion {
  clientName: string;
  oldPath: string;
  newPath: string;
  originalSize: number;
  newSize?: number;
  compressionRatio?: number;
  success: boolean;
}

async function convertLogosToWebP() {
  try {
    console.log('🔄 CONVERSIÓN DE LOGOS PNG A WEBP');
    console.log('='.repeat(50));
    
    const basePath = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public';
    
    // Lista de logos PNG que necesitan conversión
    const logosToConvert = [
      'cliente-construandes.png',
      'cliente-crystal.png',
      'cliente-d1.png',
      'cliente-dollarcity.png',
      'cliente-grupo-prodigyo.png',
      'cliente-pavimentos-colombia.png',
      'cliente-tecnofar.png'
    ];

    const conversions: LogoConversion[] = [];
    
    console.log(`📋 Logos a convertir: ${logosToConvert.length}`);
    console.log('');

    for (const logoFile of logosToConvert) {
      const oldPath = path.join(basePath, 'images/clients', logoFile);
      const newFileName = logoFile.replace('.png', '.webp');
      const newPath = path.join(basePath, 'images/clients', newFileName);
      
      if (!fs.existsSync(oldPath)) {
        console.log(`❌ Archivo no encontrado: ${logoFile}`);
        continue;
      }

      const originalStats = fs.statSync(oldPath);
      const originalSize = originalStats.size;
      
      console.log(`🔄 Convirtiendo: ${logoFile}`);
      console.log(`   Tamaño original: ${Math.round(originalSize / 1024)} KB`);
      
      try {
        // Convertir usando cwebp (parte de libwebp)
        // Calidad 85 para mantener buena calidad visual con compresión efectiva
        const command = `cwebp -q 85 "${oldPath}" -o "${newPath}"`;
        
        await execAsync(command);
        
        if (fs.existsSync(newPath)) {
          const newStats = fs.statSync(newPath);
          const newSize = newStats.size;
          const compressionRatio = ((originalSize - newSize) / originalSize) * 100;
          
          console.log(`   ✅ Convertido exitosamente`);
          console.log(`   Nuevo tamaño: ${Math.round(newSize / 1024)} KB`);
          console.log(`   Compresión: ${compressionRatio.toFixed(1)}%`);
          
          // Actualizar la base de datos
          const clientName = getClientNameFromFile(logoFile);
          if (clientName) {
            await updateClientLogo(clientName, `/images/clients/${newFileName}`);
            console.log(`   📝 Base de datos actualizada para: ${clientName}`);
          }
          
          conversions.push({
            clientName: clientName || 'Desconocido',
            oldPath: logoFile,
            newPath: newFileName,
            originalSize,
            newSize,
            compressionRatio,
            success: true
          });
          
          console.log('');
        } else {
          throw new Error('El archivo WebP no fue creado');
        }
        
      } catch (error) {
        console.log(`   ❌ Error en conversión: ${error}`);
        conversions.push({
          clientName: getClientNameFromFile(logoFile) || 'Desconocido',
          oldPath: logoFile,
          newPath: newFileName,
          originalSize,
          success: false
        });
        console.log('');
      }
    }
    
    // Resumen de conversiones
    console.log('📊 RESUMEN DE CONVERSIONES:');
    console.log('-'.repeat(50));
    
    const successful = conversions.filter(c => c.success);
    const failed = conversions.filter(c => !c.success);
    
    console.log(`✅ Conversiones exitosas: ${successful.length}`);
    console.log(`❌ Conversiones fallidas: ${failed.length}`);
    
    if (successful.length > 0) {
      const totalOriginalSize = successful.reduce((sum, c) => sum + c.originalSize, 0);
      const totalNewSize = successful.reduce((sum, c) => sum + (c.newSize || 0), 0);
      const totalCompressionRatio = ((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100;
      
      console.log(`📈 Ahorro total de espacio: ${Math.round((totalOriginalSize - totalNewSize) / 1024)} KB`);
      console.log(`📉 Compresión promedio: ${totalCompressionRatio.toFixed(1)}%`);
    }
    
    console.log('');
    
    if (successful.length > 0) {
      console.log('✅ CONVERSIONES EXITOSAS:');
      successful.forEach(conversion => {
        console.log(`- ${conversion.clientName}: ${conversion.oldPath} → ${conversion.newPath}`);
        console.log(`  Compresión: ${conversion.compressionRatio?.toFixed(1)}%`);
      });
      console.log('');
    }
    
    if (failed.length > 0) {
      console.log('❌ CONVERSIONES FALLIDAS:');
      failed.forEach(conversion => {
        console.log(`- ${conversion.clientName}: ${conversion.oldPath}`);
      });
      console.log('');
    }
    
    console.log('💡 PASOS SIGUIENTES:');
    console.log('1. Verificar que las imágenes WebP se ven correctamente en el sitio');
    console.log('2. Si todo está bien, eliminar los archivos PNG originales');
    console.log('3. Hacer commit de los cambios en git');
    
    console.log('');
    console.log('🏁 Conversión completada.');
    
  } catch (error) {
    console.error('❌ Error en la conversión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getClientNameFromFile(fileName: string): string | null {
  const nameMap: { [key: string]: string } = {
    'cliente-construandes.png': 'Construandes',
    'cliente-crystal.png': 'Crystal SAS',
    'cliente-d1.png': 'D1 SAS',
    'cliente-dollarcity.png': 'Dollarcity',
    'cliente-grupo-prodigyo.png': 'Grupo Constructor Prodigyo SA',
    'cliente-pavimentos-colombia.png': 'Pavimentos Colombia SAS',
    'cliente-tecnofar.png': 'Tecnofar TQ SAS'
  };
  
  return nameMap[fileName] || null;
}

async function updateClientLogo(clientName: string, newLogoPath: string) {
  try {
    await prisma.cliente.updateMany({
      where: {
        nombre: clientName
      },
      data: {
        logo: newLogoPath
      }
    });
  } catch (error) {
    console.error(`Error actualizando logo para ${clientName}:`, error);
  }
}

convertLogosToWebP();