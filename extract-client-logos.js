// Script para extraer URLs de logos de clientes desde el HTML de meisa.com.co
// Analizar el HTML del carousel de clientes y extraer todas las URLs de imágenes

const clientLogosUrls = [
  // Protecnica
  "https://meisa.com.co/wp-content/uploads/2023/04/Protecnica_ingenieria.webp",
  
  // Constructora Normandia
  "https://meisa.com.co/wp-content/uploads/2023/04/Constructora-Normandia.webp",
  
  // Arinsa Constructora
  "https://meisa.com.co/wp-content/uploads/2023/04/Arinsa-Constructora.webp",
  
  // Pollos Bucanero
  "https://meisa.com.co/wp-content/uploads/2023/04/Pollosbucanero-logo-e1682387456202.webp",
  
  // Tecnoquímicas
  "https://meisa.com.co/wp-content/uploads/2023/04/tecnoquimicas-e1682386092534.webp",
  
  // Jaramillo Constructora
  "https://meisa.com.co/wp-content/uploads/2023/04/Jaramillo-Constructora.webp",
  
  // Unicentro Cali
  "https://meisa.com.co/wp-content/uploads/2023/04/Unicentro-Cali-e1682384734916.webp",
  
  // Royal Films
  "https://meisa.com.co/wp-content/uploads/2023/04/Royal-Films-1.webp",
  
  // Constructora Concreto
  "https://meisa.com.co/wp-content/uploads/2023/04/Constructora-Concreto.webp",
  
  // Smurfit Kappa
  "https://meisa.com.co/wp-content/uploads/2023/04/smurfit_kappa.webp",
  
  // SENA
  "https://meisa.com.co/wp-content/uploads/2023/04/Sena-logo.webp",
  
  // Seguridad Omega
  "https://meisa.com.co/wp-content/uploads/2023/04/Seguridad-Omega-e1682387342390.webp",
  
  // SAINC
  "https://meisa.com.co/wp-content/uploads/2023/04/Sainc-logo-e1682387390864.webp",
  
  // Mensula Ingenieros
  "https://meisa.com.co/wp-content/uploads/2023/04/Mensula-ingenieros.webp",
  
  // Johnson & Johnson
  "https://meisa.com.co/wp-content/uploads/2023/04/Johnson-johnson.webp",
  
  // Mayagüez
  "https://meisa.com.co/wp-content/uploads/2023/04/Mayaguez-logo.webp",
  
  // Ingenio María Luisa
  "https://meisa.com.co/wp-content/uploads/2023/04/ingenio-maria-luisa-scaled-e1682387540571.webp",
  
  // Manuelita
  "https://meisa.com.co/wp-content/uploads/2023/04/Azucar-Manuelita.webp",
  
  // Consorcio Edificar
  "https://meisa.com.co/wp-content/uploads/2023/04/Consorcio-Edificar-e1682387686401.webp",
  
  // Comfacauca
  "https://meisa.com.co/wp-content/uploads/2023/04/comfacauca-logo.webp",
  
  // Cargill
  "https://meisa.com.co/wp-content/uploads/2023/04/Cargill-Logo-e1682387837398.webp",
  
  // SURA
  "https://meisa.com.co/wp-content/uploads/2023/04/SURA-logo.webp",
  
  // Ingenio Providencia
  "https://meisa.com.co/wp-content/uploads/2023/04/Ingenio-Providencia.webp",
  
  // Colpatria
  "https://meisa.com.co/wp-content/uploads/2023/04/Colpatria-Constructora.webp",
  
  // Éxito
  "https://meisa.com.co/wp-content/uploads/2023/04/Exito-Logo.webp"
];

// Función para generar nombres de archivo amigables
function generateFileName(url) {
  const urlParts = url.split('/');
  const originalName = urlParts[urlParts.length - 1];
  
  // Mapeo de nombres específicos para mejor organización
  const nameMapping = {
    'Protecnica_ingenieria.webp': 'cliente-protecnica.webp',
    'Constructora-Normandia.webp': 'cliente-normandia.webp',
    'Arinsa-Constructora.webp': 'cliente-arinsa.webp',
    'Pollosbucanero-logo-e1682387456202.webp': 'cliente-pollos-bucanero.webp',
    'tecnoquimicas-e1682386092534.webp': 'cliente-tecnoquimicas.webp',
    'Jaramillo-Constructora.webp': 'cliente-jaramillo.webp',
    'Unicentro-Cali-e1682384734916.webp': 'cliente-unicentro.webp',
    'Royal-Films-1.webp': 'cliente-royal-films.webp',
    'Constructora-Concreto.webp': 'cliente-concreto.webp',
    'smurfit_kappa.webp': 'cliente-smurfit-kappa.webp',
    'Sena-logo.webp': 'cliente-sena.webp',
    'Seguridad-Omega-e1682387342390.webp': 'cliente-seguridad-omega.webp',
    'Sainc-logo-e1682387390864.webp': 'cliente-sainc.webp',
    'Mensula-ingenieros.webp': 'cliente-mensula.webp',
    'Johnson-johnson.webp': 'cliente-johnson-johnson.webp',
    'Mayaguez-logo.webp': 'cliente-mayaguez.webp',
    'ingenio-maria-luisa-scaled-e1682387540571.webp': 'cliente-ingenio-maria-luisa.webp',
    'Azucar-Manuelita.webp': 'cliente-manuelita.webp',
    'Consorcio-Edificar-e1682387686401.webp': 'cliente-consorcio-edificar.webp',
    'comfacauca-logo.webp': 'cliente-comfacauca.webp',
    'Cargill-Logo-e1682387837398.webp': 'cliente-cargill.webp',
    'SURA-logo.webp': 'cliente-sura.webp',
    'Ingenio-Providencia.webp': 'cliente-ingenio-providencia.webp',
    'Colpatria-Constructora.webp': 'cliente-colpatria.webp',
    'Exito-Logo.webp': 'cliente-exito.webp'
  };
  
  return nameMapping[originalName] || `cliente-${originalName}`;
}

// Generar lista con URLs y nombres de archivo
const logosToDownload = clientLogosUrls.map(url => ({
  url: url,
  filename: generateFileName(url),
  originalName: url.split('/').pop()
}));

console.log('=== LOGOS DE CLIENTES EXTRAÍDOS ===');
console.log(`Total de logos encontrados: ${logosToDownload.length}`);
console.log('\nListado de logos:');

logosToDownload.forEach((logo, index) => {
  console.log(`${index + 1}. ${logo.filename}`);
  console.log(`   URL: ${logo.url}`);
  console.log('');
});

// Exportar para uso en scripts de descarga
module.exports = {
  clientLogosUrls,
  logosToDownload,
  generateFileName
};

// Si se ejecuta directamente
if (require.main === module) {
  console.log('\n=== COMANDOS DE DESCARGA ===');
  console.log('Para descargar todos los logos, ejecuta:');
  console.log('node download-client-logos.js');
}