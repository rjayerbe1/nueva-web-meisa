import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface LogoAnalysis {
  clientName: string;
  logoPath: string;
  fileExists: boolean;
  fileFormat: string;
  needsConversion: boolean;
  fileSize?: number;
  isActive: boolean;
  isDestacado: boolean;
}

async function analyzeClientLogos() {
  try {
    console.log('🔍 ANÁLISIS DE LOGOS DE CLIENTES - FORMATOS');
    console.log('='.repeat(60));
    
    // Obtener todos los clientes de la base de datos
    const clients = await prisma.cliente.findMany({
      select: {
        nombre: true,
        logo: true,
        activo: true,
        destacado: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    const basePath = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public';
    const analysis: LogoAnalysis[] = [];
    let totalLogos = 0;
    let logosWebP = 0;
    let logosNeedConversion = 0;
    let logosMissing = 0;

    console.log(`📊 Total de clientes en BD: ${clients.length}`);
    console.log('');

    for (const client of clients) {
      if (client.logo && client.logo !== 'SIN LOGO') {
        totalLogos++;
        const fullPath = path.join(basePath, client.logo);
        const fileExists = fs.existsSync(fullPath);
        
        let fileSize: number | undefined;
        let fileFormat = '';
        
        if (fileExists) {
          const stats = fs.statSync(fullPath);
          fileSize = stats.size;
          fileFormat = path.extname(client.logo).toLowerCase();
        } else {
          logosMissing++;
        }

        const needsConversion = fileExists && !['.webp', '.svg'].includes(fileFormat);
        if (needsConversion) {
          logosNeedConversion++;
        } else if (fileFormat === '.webp') {
          logosWebP++;
        }

        analysis.push({
          clientName: client.nombre,
          logoPath: client.logo,
          fileExists,
          fileFormat,
          needsConversion,
          fileSize,
          isActive: client.activo,
          isDestacado: client.destacado
        });
      }
    }

    // Resumen general
    console.log('📈 RESUMEN GENERAL:');
    console.log(`Total de logos registrados: ${totalLogos}`);
    console.log(`Logos en WebP: ${logosWebP}`);
    console.log(`Logos en SVG: ${analysis.filter(a => a.fileFormat === '.svg').length}`);
    console.log(`Logos que necesitan conversión: ${logosNeedConversion}`);
    console.log(`Logos faltantes/rotos: ${logosMissing}`);
    console.log('');

    // Logos que necesitan conversión a WebP
    const needConversion = analysis.filter(a => a.needsConversion);
    if (needConversion.length > 0) {
      console.log('🔄 LOGOS QUE NECESITAN CONVERSIÓN A WEBP:');
      console.log('-'.repeat(60));
      needConversion.forEach(logo => {
        const sizeKB = logo.fileSize ? Math.round(logo.fileSize / 1024) : 0;
        const status = logo.isActive ? (logo.isDestacado ? '⭐ ACTIVO/DESTACADO' : '✅ ACTIVO') : '❌ INACTIVO';
        console.log(`${logo.clientName}`);
        console.log(`  Archivo: ${logo.logoPath}`);
        console.log(`  Formato: ${logo.fileFormat.toUpperCase()}`);
        console.log(`  Tamaño: ${sizeKB} KB`);
        console.log(`  Estado: ${status}`);
        console.log('');
      });
    }

    // Logos faltantes
    const missing = analysis.filter(a => !a.fileExists);
    if (missing.length > 0) {
      console.log('❌ LOGOS FALTANTES/ROTOS:');
      console.log('-'.repeat(60));
      missing.forEach(logo => {
        const status = logo.isActive ? (logo.isDestacado ? '⭐ ACTIVO/DESTACADO' : '✅ ACTIVO') : '❌ INACTIVO';
        console.log(`${logo.clientName}`);
        console.log(`  Ruta esperada: ${logo.logoPath}`);
        console.log(`  Estado: ${status}`);
        console.log('');
      });
    }

    // Logos ya optimizados
    const optimized = analysis.filter(a => a.fileExists && !a.needsConversion);
    console.log('✅ LOGOS YA OPTIMIZADOS (WebP/SVG):');
    console.log('-'.repeat(60));
    console.log(`Total: ${optimized.length} logos`);
    
    const webpLogos = optimized.filter(a => a.fileFormat === '.webp');
    const svgLogos = optimized.filter(a => a.fileFormat === '.svg');
    
    console.log(`- WebP: ${webpLogos.length} logos`);
    console.log(`- SVG: ${svgLogos.length} logos`);
    console.log('');

    // Clientes sin logo
    const clientsWithoutLogos = clients.filter(c => !c.logo || c.logo === 'SIN LOGO');
    if (clientsWithoutLogos.length > 0) {
      console.log('📷 CLIENTES SIN LOGO:');
      console.log('-'.repeat(60));
      clientsWithoutLogos.forEach(client => {
        const status = client.activo ? (client.destacado ? '⭐ ACTIVO/DESTACADO' : '✅ ACTIVO') : '❌ INACTIVO';
        console.log(`${client.nombre} - ${status}`);
      });
      console.log('');
    }

    // Recomendaciones
    console.log('💡 RECOMENDACIONES:');
    console.log('-'.repeat(60));
    
    if (logosNeedConversion > 0) {
      console.log(`1. PRIORIDAD ALTA: Convertir ${logosNeedConversion} logos a WebP`);
      console.log('   - Los logos PNG son especialmente pesados');
      console.log('   - WebP puede reducir el tamaño en 25-35%');
    }
    
    if (logosMissing > 0) {
      console.log(`2. PRIORIDAD MEDIA: Revisar ${logosMissing} logos faltantes`);
      console.log('   - Verificar rutas en la base de datos');
      console.log('   - Subir archivos faltantes');
    }
    
    if (clientsWithoutLogos.length > 0) {
      console.log(`3. PRIORIDAD BAJA: Agregar logos para ${clientsWithoutLogos.length} clientes`);
      console.log('   - Especialmente para clientes activos y destacados');
    }

    console.log('');
    console.log('🏁 Análisis completado.');

  } catch (error) {
    console.error('❌ Error en el análisis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeClientLogos();