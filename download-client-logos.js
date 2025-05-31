#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { logosToDownload } = require('./extract-client-logos.js');

// Directorio donde guardar los logos
const DOWNLOAD_DIR = path.join(__dirname, 'public', 'images', 'clients');

// Crear directorio si no existe
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  console.log(`✅ Directorio creado: ${DOWNLOAD_DIR}`);
}

// Función para descargar un archivo
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, filename);
    
    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Ya existe: ${filename}`);
      resolve({ filename, status: 'exists' });
      return;
    }
    
    const protocol = url.startsWith('https:') ? https : http;
    
    console.log(`⬇️  Descargando: ${filename}`);
    
    const file = fs.createWriteStream(filePath);
    
    const request = protocol.get(url, (response) => {
      // Verificar código de respuesta
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Descargado: ${filename}`);
        resolve({ filename, status: 'downloaded' });
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(filePath, () => {}); // Eliminar archivo parcial
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(filePath, () => {}); // Eliminar archivo parcial
      reject(err);
    });
  });
}

// Función principal de descarga
async function downloadAllLogos() {
  console.log('🚀 Iniciando descarga de logos de clientes...');
  console.log(`📁 Guardando en: ${DOWNLOAD_DIR}`);
  console.log(`📋 Total de logos: ${logosToDownload.length}\n`);
  
  const results = {
    downloaded: [],
    exists: [],
    errors: []
  };
  
  for (let i = 0; i < logosToDownload.length; i++) {
    const logo = logosToDownload[i];
    
    try {
      console.log(`[${i + 1}/${logosToDownload.length}] ${logo.filename}`);
      
      const result = await downloadFile(logo.url, logo.filename);
      
      if (result.status === 'downloaded') {
        results.downloaded.push(logo.filename);
      } else if (result.status === 'exists') {
        results.exists.push(logo.filename);
      }
      
      // Pequeña pausa entre descargas para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error descargando ${logo.filename}:`, error.message);
      results.errors.push({
        filename: logo.filename,
        error: error.message
      });
    }
  }
  
  // Reporte final
  console.log('\n=== REPORTE FINAL ===');
  console.log(`✅ Descargados: ${results.downloaded.length}`);
  console.log(`⏭️  Ya existían: ${results.exists.length}`);
  console.log(`❌ Errores: ${results.errors.length}`);
  
  if (results.downloaded.length > 0) {
    console.log('\n📥 Archivos descargados:');
    results.downloaded.forEach(filename => console.log(`  - ${filename}`));
  }
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errores encontrados:');
    results.errors.forEach(error => console.log(`  - ${error.filename}: ${error.error}`));
  }
  
  console.log(`\n📁 Los logos están guardados en: ${DOWNLOAD_DIR}`);
  console.log('🎉 ¡Descarga completada!');
  
  return results;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  downloadAllLogos().catch(console.error);
}

module.exports = { downloadAllLogos, DOWNLOAD_DIR };