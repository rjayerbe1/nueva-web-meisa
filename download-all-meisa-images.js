const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Lista completa de todas las imágenes con los nombres exactos
const allImages = [
  // CENTROS COMERCIALES
  "Centro-campanario-1.webp",
  "Centro-campanario-2.webp", 
  "Centro-campanario-3.webp",
  "Centro-campanario-4.webp",
  "Centro-campanario-5.webp",
  "Centro-campanario-6.webp",
  "Centro-campanario-7.webp",
  
  "Centro-paseo-villa-del-rio-1-400x400.webp",
  "Centro-paseo-villa-del-rio-2-400x400.webp",
  "Centro-paseo-villa-del-rio-3-400x400.webp",
  "Centro-paseo-villa-del-rio-4-400x400.webp",
  "Centro-paseo-villa-del-rio-5-400x400.webp",
  
  "Monserrat-Plaza.jpg",
  "Monserrat-Plaza3.jpg",
  "Monserrat-Plaza-1.jpg",
  "monserrat-5.jpg",
  "Monserrat-Plaza3-1.jpg",
  "Centro-monserrat-1.webp",
  "Centro-monserrat-2.webp",
  "Centro-monserrat-3.webp",
  "Centro-monserrat-4.webp",
  "Centro-monserrat-5.webp",
  
  "Centro-unico-cali-1.webp",
  "Centro-unico-cali-2.webp",
  "Centro-unico-cali-3.webp",
  "Centro-unico-cali-4.webp",
  "Centro-unico-cali-5.webp",
  
  "Centro-unico-neiva-1.webp",
  "Centro-unico-neiva-2.webp",
  "Centro-unico-neiva-3.webp",
  "Centro-unico-neiva-4.webp",
  "Centro-unico-neiva-5.webp",
  
  "Centro-unico-barranquilla-2.webp",
  "Centro-unico-barranquilla-3.webp",
  
  "CC-ARMENIA-PLAZA-1.jpeg",
  "CC-ARMENIA-PLAZA-5.jpeg",
  "Centro-armenia-plaza-1.webp",
  "Centro-armenia-plaza-2.webp",
  "Centro-armenia-plaza-3.webp",
  "Centro-armenia-plaza-4.webp",
  
  "Centro-Comercial-Bochalema-Plaza-Cali.jpg",
  "Centro-bochalema-plaza-1.webp",
  "Centro-bochalema-plaza-2.webp",
  "Centro-bochalema-plaza-3.webp",
  "Centro-bochalema-plaza-4.webp",
  "Centro-bochalema-plaza-5.webp",
  "Centro-bochalema-plaza-6.webp",
  "Centro-bochalema-plaza-7.webp",
  "Centro-bochalema-plaza-8.webp",
  "Centro-bochalema-plaza-9.webp",
  
  // EDIFICIOS
  "Edificio-cinemateca-distrital-1.webp",
  "Edificio-cinemateca-distrital-2.webp",
  "Edificio-cinemateca-distrital-3.webp",
  "Edificio-cinemateca-distrital-4.webp",
  "Edificio-cinemateca-distrital-5.webp",
  "Edificio-cinemateca-distrital-6.webp",
  
  "Edificio-clinica-reina-victoria-1.webp",
  "Edificio-clinica-reina-victoria-2.webp",
  "Edificio-clinica-reina-victoria-3.webp",
  "Edificio-clinica-reina-victoria-4.webp",
  "Edificio-clinica-reina-victoria-5.webp",
  "Edificio-clinica-reina-victoria-6.webp",
  "Edificio-clinica-reina-victoria-7.webp",
  
  "Edificio-omega-1.webp",
  "Edificio-omega-2.webp",
  "Edificio-omega-3.webp",
  "Edificio-omega-4.webp",
  
  "Edificio-bomberos-popayan-1.webp",
  "Edificio-bomberos-popayan-2.webp",
  "Edificio-bomberos-popayan-3.webp",
  "Edificio-bomberos-popayan-4.webp",
  "Edificio-bomberos-popayan-5.webp",
  
  "Edificio-estacion-mio-guadalupe-1.webp",
  "Edificio-estacion-mio-guadalupe-2.webp",
  "Edificio-estacion-mio-guadalupe-3.webp",
  "Edificio-estacion-mio-guadalupe-4.webp",
  "Edificio-estacion-mio-guadalupe-5.webp",
  "Edificio-estacion-mio-guadalupe-6.webp",
  
  "Edificio-sena-santander-1.webp",
  "Edificio-sena-santander-2.webp",
  "Edificio-sena-santander-3.webp",
  "Edificio-sena-santander-4.webp",
  
  "Edificio-terminal-intermedio-mio-cali-1.webp",
  "Edificio-terminal-intermedio-mio-cali-2.webp",
  "Edificio-terminal-intermedio-mio-cali-3.webp",
  "Edificio-terminal-intermedio-mio-cali-4.webp",
  "Edificio-terminal-intermedio-mio-cali-5.webp",
  "Edificio-terminal-intermedio-mio-cali-6.webp",
  "Edificio-terminal-intermedio-mio-cali-7.webp",
  "Edificio-terminal-intermedio-mio-cali-8.webp",
  
  "Edificio-tequendama-parking-cali-1.webp",
  "Edificio-tequendama-parking-cali-2.webp",
  "Edificio-tequendama-parking-cali-3.webp",
  "Edificio-tequendama-parking-cali-4.webp",
  "Edificio-tequendama-parking-cali-5.webp",
  "Edificio-tequendama-parking-cali-6.webp",
  "Edificio-tequendama-parking-cali-7.webp",
  "Edificio-tequendama-parking-cali-8.webp",
  
  "Edificio-modulos-medicos-1.webp",
  "Edificio-modulos-medicos-2.webp",
  "Edificio-modulos-medicos-3.webp",
  "Edificio-modulos-medicos-4.webp",
  
  // INDUSTRIA
  "Industria-ampliacion-cargill-1-400x400.webp",
  "Industria-ampliacion-cargill-2-400x400.webp",
  "Industria-ampliacion-cargill-3-400x400.webp",
  "Industria-ampliacion-cargill-4-400x400.webp",
  "Industria-ampliacion-cargill-5-400x400.webp",
  "Industria-ampliacion-cargill-6-400x400.webp",
  
  "Industria-torre-cogeneracion-propal-1.webp",
  "Industria-torre-cogeneracion-propal-2.webp",
  "Industria-torre-cogeneracion-propal-3.webp",
  "Industria-torre-cogeneracion-propal-4.webp",
  "Industria-torre-cogeneracion-propal-5.webp",
  
  "Industria-bodega-duplex-1.webp",
  "Industria-bodega-duplex-2.webp",
  "Industria-bodega-duplex-3.webp",
  "Industria-bodega-duplex-4.webp",
  
  "Industria-bodega-intera-1.webp",
  "Industria-bodega-intera-2.webp",
  "Industria-bodega-intera-3.webp",
  "Industria-bodega-intera-4.webp",
  
  "Industria-tecnofar-1.webp",
  "Industria-tecnofar-2.webp",
  "Industria-tecnofar-3.webp",
  "Industria-tecnofar-4.webp",
  "Industria-tecnofar-5.webp",
  
  "Industria-bodega-protecnica-etapa-dos-1.webp",
  "Industria-bodega-protecnica-etapa-dos-2.webp",
  "Industria-bodega-protecnica-etapa-dos-3.webp",
  "Industria-bodega-protecnica-etapa-dos-4.webp",
  "Industria-bodega-protecnica-etapa-dos-5.webp",
  "Industria-bodega-protecnica-etapa-dos-6.webp",
  "Industria-bodega-protecnica-etapa-dos-7.webp",
  
  "Industria-tecnoquimicas-jamundi-1.webp",
  "Industria-tecnoquimicas-jamundi-2.webp",
  "Industria-tecnoquimicas-jamundi-3.webp",
  "Industria-tecnoquimicas-jamundi-4.webp",
  "Industria-tecnoquimicas-jamundi-5.webp",
  
  // PUENTES VEHICULARES
  "Puente-vehicular-nolasco-1.webp",
  "Puente-vehicular-nolasco-2.webp",
  "Puente-vehicular-nolasco-3.webp",
  
  "Puente-vehicular-carrera-cien-1.webp",
  "Puente-vehicular-carrera-cien-2.webp",
  "Puente-vehicular-carrera-cien-3.webp",
  "Puente-vehicular-carrera-cien-4.webp",
  "Puente-vehicular-carrera-cien-5.webp",
  
  "Puente-vehicular-cambrin-1.webp",
  "Puente-vehicular-cambrin-2.webp",
  "Puente-vehicular-cambrin-3.webp",
  "Puente-vehicular-cambrin-4.webp",
  "Puente-vehicular-cambrin-5.webp",
  
  "Puente-vehicular-frisoles-1.webp",
  "Puente-vehicular-frisoles-2.webp",
  
  "Puente-vehicular-la-veinti-uno-1.webp",
  "Puente-vehicular-la-veinti-uno-2.webp",
  "Puente-vehicular-la-veinti-uno-3.webp",
  "Puente-vehicular-la-veinti-uno-4.webp",
  
  "Puente-vehicular-la-paila-1.webp",
  "Puente-vehicular-la-paila-2.webp",
  "Puente-vehicular-la-paila-3.webp",
  "Puente-vehicular-la-paila-4.webp",
  "Puente-vehicular-la-paila-5.webp",
  
  "Puente-vehicular-saraconcho-1.webp",
  "Puente-vehicular-saraconcho-2.webp",
  "Puente-vehicular-saraconcho-3.webp",
  "Puente-vehicular-saraconcho-4.webp",
  
  // PUENTES PEATONALES
  "Puente peatonal escalinata curva rio cali 1.webp",
  "Puente peatonal escalinata curva rio cali 2.webp",
  "Puente peatonal escalinata curva rio cali 3.webp",
  "Puente peatonal escalinata curva rio cali 4.webp",
  "Puente peatonal escalinata curva rio cali 5.webp",
  "Puente peatonal escalinata curva rio cali 6.webp",
  
  "Puente peatonal autopista sur cali 1.webp",
  "Puente peatonal autopista sur cali 2.webp",
  "Puente peatonal autopista sur cali 3.webp",
  "Puente peatonal autopista sur cali 4.webp",
  
  "Puente peatonal la 63 cali 1.webp",
  "Puente peatonal la 63 cali 2.webp",
  "Puente peatonal la 63 cali 3.webp",
  "Puente peatonal la 63 cali 4.webp",
  
  "Puente peatonal la tertulia 1.webp",
  "Puente peatonal la tertulia 2.webp",
  "Puente peatonal la tertulia 3.webp",
  "Puente peatonal la tertulia 4.webp",
  
  "Puente peatonal terminal intermedio 1.webp",
  "Puente peatonal terminal intermedio 2.webp",
  "Puente peatonal terminal intermedio 3.webp",
  "Puente peatonal terminal intermedio 4.webp",
  "Puente peatonal terminal intermedio 5.webp",
  
  // ESCENARIOS DEPORTIVOS
  "Escenario-deportivo-compejo-acuativo-popayan-1.webp",
  "Escenario-deportivo-complejo-acuatico-popayan-2.webp",
  
  "Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp",
  "Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp",
  
  "Escenario-deportivo-coliseo-de-artes-marciales-1.webp",
  
  "Escenario-deportivo-cecun-1.webp",
  "Escenario-deportivo-cecun-2.webp",
  "Escenario-deportivo-cecun-3.webp",
  "Escenario-deportivo-cecun-4.webp",
  "Escenario-deportivo-cecun-5.webp",
  
  "Escenario-deportivo-cancha-javeriana-cali-1.webp",
  "Escenario-deportivo-cancha-javeriana-cali-2.webp",
  "Escenario-deportivo-cancha-javeriana-cali-3.webp",
  "Escenario-deportivo-cancha-javeriana-cali-4.webp",
  "Escenario-deportivo-cancha-javeriana-cali-5.webp",
  "Escenario-deportivo-cancha-javeriana-cali-6.webp",
  "Escenario-deportivo-cancha-javeriana-cali-7.webp",
  "Escenario-deportivo-cancha-javeriana-cali-8.webp",
  
  // ESTRUCTURAS MODULARES
  "Estructura-modular-cocina-oculta-1-400x400.jpeg",
  "Estructura-modular-cocina-oculta-2-400x400.webp",
  "Estructura-modular-cocina-oculta-3-400x400.webp",
  
  "Estructura-modular-modulo-oficina-1-400x400.webp",
  "Estructura-modular-modulo-oficina-2-400x400.webp",
  "Estructura-modular-modulo-oficina-3-400x400.webp",
  
  // OIL & GAS
  "Oil-gas-tanque-pulmon-1-400x400.webp",
  
  "Oil-gas-tanque-de-almacenamiento-gpl-1-400x400.webp",
  "Oil-gas-tanque-de-almacenamiento-gpl-2-400x400.webp",
  "Oil-gas-tanque-de-almacenamiento-gpl-3-400x400.webp",
  "Oil-gas-tanque-de-almacenamiento-gpl-4-400x400.webp",
  "Oil-gas-tanque-de-almacenamiento-gpl-5-400x400.webp",
  "Oil-gas-tanque-de-almacenamiento-gpl-6-400x400.webp",
  
  // CUBIERTAS Y FACHADAS
  "Cubiertas-y-fachadas-camino-viejo-1.webp",
  "Cubiertas-y-fachadas-camino-viejo-2.webp",
  
  "Cubiertas-y-fachadas-cubierta-interna-1.webp",
  "Cubiertas-y-fachadas-cubierta-interna-2.webp",
  
  "Cubiertas-y-fachadas-ips-sura-1.webp",
  "Cubiertas-y-fachadas-ips-sura-2.webp",
  
  "Cubiertas-y-fachadas-taquillas-pisoje-1.webp",
  "Cubiertas-y-fachadas-taquillas-pisoje-2.webp",
  
  "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1.webp",
  "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2.webp"
];

const baseUrl = 'https://meisa.com.co/wp-content/uploads/';
const downloadDir = './public/uploads/projects';

// Crear directorio si no existe
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
  console.log('📁 Directorio creado: ' + downloadDir);
}

async function downloadImage(url, filepath, imageName) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ success: true, imageName, filepath });
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Manejar redirecciones
        downloadImage(response.headers.location, filepath, imageName).then(resolve).catch(reject);
      } else {
        resolve({ success: false, imageName, error: `HTTP ${response.statusCode}` });
      }
    });
    
    request.on('error', (err) => {
      resolve({ success: false, imageName, error: err.message });
    });
    
    request.setTimeout(15000, () => {
      request.abort();
      resolve({ success: false, imageName, error: 'Timeout' });
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Iniciando descarga de TODAS las imágenes desde meisa.com.co...');
  console.log(`📊 Total de imágenes a descargar: ${allImages.length}`);
  console.log('🔗 URL base: ' + baseUrl);
  console.log('📁 Directorio destino: ' + downloadDir);
  console.log('');
  
  let downloadedImages = 0;
  let failedImages = 0;
  const failed = [];
  
  for (let i = 0; i < allImages.length; i++) {
    const imageName = allImages[i];
    const imageUrl = `${baseUrl}${imageName}`;
    const localPath = path.join(downloadDir, imageName);
    
    // Mostrar progreso
    const progress = `[${i + 1}/${allImages.length}]`;
    console.log(`${progress} 📥 Descargando: ${imageName}`);
    
    try {
      const result = await downloadImage(imageUrl, localPath, imageName);
      
      if (result.success) {
        downloadedImages++;
        console.log(`${progress} ✅ Descargada: ${imageName}`);
      } else {
        failedImages++;
        failed.push({ name: imageName, error: result.error });
        console.log(`${progress} ❌ Error: ${imageName} - ${result.error}`);
      }
      
      // Pequeña pausa para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      failedImages++;
      failed.push({ name: imageName, error: error.message });
      console.log(`${progress} ❌ Error: ${imageName} - ${error.message}`);
    }
  }
  
  console.log(`\n🎉 DESCARGA COMPLETADA!`);
  console.log(`📊 RESUMEN:`);
  console.log(`   📥 Total intentadas: ${allImages.length}`);
  console.log(`   ✅ Exitosas: ${downloadedImages}`);
  console.log(`   ❌ Fallidas: ${failedImages}`);
  console.log(`   📈 Tasa de éxito: ${((downloadedImages / allImages.length) * 100).toFixed(1)}%`);
  
  if (failed.length > 0) {
    console.log(`\n❌ IMÁGENES FALLIDAS:`);
    failed.forEach(f => {
      console.log(`   • ${f.name} - ${f.error}`);
    });
  }
  
  console.log(`\n📁 Todas las imágenes guardadas en: ${downloadDir}`);
  console.log(`🔗 Las imágenes ahora están disponibles en: /uploads/projects/`);
}

// Ejecutar descarga
downloadAllImages().catch(console.error);