const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Lista completa de imágenes a descargar
const projectImages = {
  'centro-comercial-campanario': [
    'Centro-campanario-1.webp',
    'Centro-campanario-2.webp', 
    'Centro-campanario-3.webp',
    'Centro-campanario-4.webp',
    'Centro-campanario-5.webp',
    'Centro-campanario-6.webp',
    'Centro-campanario-7.webp'
  ],
  'paseo-villa-del-rio': [
    'Centro-paseo-villa-del-rio-1-400x400.webp',
    'Centro-paseo-villa-del-rio-2-400x400.webp',
    'Centro-paseo-villa-del-rio-3-400x400.webp',
    'Centro-paseo-villa-del-rio-4-400x400.webp',
    'Centro-paseo-villa-del-rio-5-400x400.webp'
  ],
  'centro-comercial-monserrat': [
    'Monserrat-Plaza.jpg',
    'Monserrat-Plaza3.jpg',
    'Monserrat-Plaza-1.jpg',
    'monserrat-5.jpg',
    'Monserrat-Plaza3-1.jpg',
    'Centro-monserrat-1.webp',
    'Centro-monserrat-2.webp',
    'Centro-monserrat-3.webp',
    'Centro-monserrat-4.webp',
    'Centro-monserrat-5.webp'
  ],
  'centro-comercial-unico-cali': [
    'Centro-unico-cali-1.webp',
    'Centro-unico-cali-2.webp',
    'Centro-unico-cali-3.webp',
    'Centro-unico-cali-4.webp',
    'Centro-unico-cali-5.webp'
  ],
  'centro-comercial-unico-neiva': [
    'Centro-unico-neiva-1.webp',
    'Centro-unico-neiva-2.webp',
    'Centro-unico-neiva-3.webp',
    'Centro-unico-neiva-4.webp',
    'Centro-unico-neiva-5.webp'
  ],
  'centro-comercial-unico-barranquilla': [
    'Centro-unico-barranquilla-2.webp',
    'Centro-unico-barranquilla-3.webp'
  ],
  'centro-comercial-armenia-plaza': [
    'CC-ARMENIA-PLAZA-1.jpeg',
    'CC-ARMENIA-PLAZA-5.jpeg',
    'Centro-armenia-plaza-1.webp',
    'Centro-armenia-plaza-2.webp',
    'Centro-armenia-plaza-3.webp',
    'Centro-armenia-plaza-4.webp'
  ],
  'centro-comercial-bochalema-plaza': [
    'Centro-Comercial-Bochalema-Plaza-Cali.jpg',
    'Centro-bochalema-plaza-1.webp',
    'Centro-bochalema-plaza-2.webp',
    'Centro-bochalema-plaza-3.webp',
    'Centro-bochalema-plaza-4.webp',
    'Centro-bochalema-plaza-5.webp',
    'Centro-bochalema-plaza-6.webp',
    'Centro-bochalema-plaza-7.webp',
    'Centro-bochalema-plaza-8.webp',
    'Centro-bochalema-plaza-9.webp'
  ],
  'cinemateca-distrital': [
    'Edificio-cinemateca-distrital-1.webp',
    'Edificio-cinemateca-distrital-2.webp',
    'Edificio-cinemateca-distrital-3.webp',
    'Edificio-cinemateca-distrital-4.webp',
    'Edificio-cinemateca-distrital-5.webp',
    'Edificio-cinemateca-distrital-6.webp'
  ],
  'clinica-reina-victoria': [
    'Edificio-clinica-reina-victoria-1.webp',
    'Edificio-clinica-reina-victoria-2.webp',
    'Edificio-clinica-reina-victoria-3.webp',
    'Edificio-clinica-reina-victoria-4.webp',
    'Edificio-clinica-reina-victoria-5.webp',
    'Edificio-clinica-reina-victoria-6.webp',
    'Edificio-clinica-reina-victoria-7.webp'
  ],
  'edificio-omega': [
    'Edificio-omega-1.webp',
    'Edificio-omega-2.webp',
    'Edificio-omega-3.webp',
    'Edificio-omega-4.webp'
  ],
  'estacion-de-bomberos-popayan': [
    'Edificio-bomberos-popayan-1.webp',
    'Edificio-bomberos-popayan-2.webp',
    'Edificio-bomberos-popayan-3.webp',
    'Edificio-bomberos-popayan-4.webp',
    'Edificio-bomberos-popayan-5.webp'
  ],
  'estacion-mio-guadalupe': [
    'Edificio-estacion-mio-guadalupe-1.webp',
    'Edificio-estacion-mio-guadalupe-2.webp',
    'Edificio-estacion-mio-guadalupe-3.webp',
    'Edificio-estacion-mio-guadalupe-4.webp',
    'Edificio-estacion-mio-guadalupe-5.webp',
    'Edificio-estacion-mio-guadalupe-6.webp'
  ]
  // Continuar con el resto de proyectos...
};

const baseUrl = 'https://meisa.com.co/wp-content/uploads/';
const downloadDir = './public/uploads/projects';

// Crear directorio si no existe
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Manejar redirecciones
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Iniciando descarga de imágenes desde meisa.com.co...');
  
  let totalImages = 0;
  let downloadedImages = 0;
  let failedImages = 0;
  
  for (const [projectSlug, images] of Object.entries(projectImages)) {
    console.log(`\n📁 Descargando ${projectSlug}...`);
    
    for (const imageName of images) {
      totalImages++;
      const imageUrl = `${baseUrl}${imageName}`;
      const localPath = path.join(downloadDir, imageName);
      
      try {
        console.log(`   📥 ${imageName}...`);
        await downloadImage(imageUrl, localPath);
        downloadedImages++;
        console.log(`   ✅ ${imageName} descargada`);
        
        // Pequeña pausa para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        failedImages++;
        console.log(`   ❌ Error descargando ${imageName}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n📊 Resumen de descarga:`);
  console.log(`   Total: ${totalImages}`);
  console.log(`   Exitosas: ${downloadedImages}`);
  console.log(`   Fallidas: ${failedImages}`);
  console.log(`\n🎉 Descarga completada!`);
}

downloadAllImages().catch(console.error);