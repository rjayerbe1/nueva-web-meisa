#!/usr/bin/env node

// Lista de clientes de los últimos años sin duplicados
const clientesRecientes = [
  { nit: "19146113", nombre: "MARIO ALBERTO HUERTAS COTES" },
  { nit: "860024586", nombre: "PAVIMENTOS COLOMBIA SAS - PAVCOL SAS" },
  { nit: "800228069", nombre: "URBANIZADORA Y CONSTRUCTORA ANDES SA - CONSTRUANDES" },
  { nit: "890300466", nombre: "TECNOQUIMICAS SA" },
  { nit: "900354637", nombre: "HIDALGO E HIDALGO COLOMBIA SAS - CASAHIDALGO S.A.S" },
  { nit: "901482428", nombre: "CONSORCIO VIAS COLOMBIA 066 - CASAHIDALGO" },
  { nit: "817003055", nombre: "TECNOFAR TQ SAS" },
  { nit: "900616294", nombre: "CONSTRUCTORA INVERTEQ SAS" },
  { nit: "890901672", nombre: "CRYSTAL SAS" },
  { nit: "900276962", nombre: "D1 SAS" },
  { nit: "805014934", nombre: "CONSTRUCCIONES INGENIERIA SAS" },
  { nit: "800001965", nombre: "SEGURIDAD OMEGA LIMITADA" },
  { nit: "900943243", nombre: "SURAMERICA COMERCIAL SAS - DOLLARCITY" },
  { nit: "891300959", nombre: "SUCROAL SA" },
  { nit: "800160728", nombre: "AYERBE OTOYA SAS" },
  { nit: "900393426", nombre: "VERSION URBANA SAS - CARLOS ARBOLEDA" },
  { nit: "900612118", nombre: "SERVICIOS ESTRATEGICOS COMPARTIDOS SAS - UNICO" },
  { nit: "901525747", nombre: "CONSORCIO CONSTRUCTOR NUEVA MALLA VIAL DEL VALLE" },
  { nit: "900260056", nombre: "AVICOLA POLLO LISTO SAS" },
  { nit: "817000102", nombre: "ASOCIACION DE AUTORIDADES DEL CONSEJO TERRITORIAL - JUAN TAMA" },
  { nit: "901502006", nombre: "CONSTRUCCIÓN Y ADMINISTRACIÓN S.A. - CASASUCOL S.A" },
  { nit: "890333023", nombre: "SIDERURGICA DEL OCCIDENTE SAS SIDOC SAS" },
  { nit: "900341710", nombre: "MASSEQ PROYECTOS E INGENIERIA SAS" },
  { nit: "901312085", nombre: "COMPAÑIA DE INVERSIONES Y CONSULTORA ACGM SAS" },
  { nit: "76288109", nombre: "OROZCO RIVERA OSCAR" },
  { nit: "891300238", nombre: "INGENIO PROVIDENCIA S.A." },
  { nit: "805019337", nombre: "ASTRELEC SAS" },
  { nit: "901308424", nombre: "ESTRUMETALICAS WR SAS" },
  { nit: "900485750", nombre: "JJVM SAS" },
  { nit: "900399765", nombre: "NUEVO URBANISMO INMOBILIARIA SAS" },
  { nit: "16682948", nombre: "JARAMILLO BOTERO LUIS FERNANDO" },
  { nit: "900882382", nombre: "MUSIDIN SAS" },
  { nit: "901666728", nombre: "CONSORCIO DEPORTIVOS GAMJ" },
  { nit: "901394392", nombre: "DENOMINACION JUDIA ORTODOXA CENTRO ISRAELITA DE BENEFICENCIA DE CALI" },
  { nit: "900652085", nombre: "CAMPOFRESCO ALIMENTOS SAS" },
  { nit: "800100280", nombre: "COMBUSTIBLES JUANCHITO SAS" },
  { nit: "900241902", nombre: "GRUPO CONSTRUCTOR PRODIGYO SA" },
  { nit: "810002618", nombre: "INGENIEROS CALDERON Y JARAMILLO SAS" },
  { nit: "811046565", nombre: "GRUPO EMPRESARIAL AGREGADOS SAS" },
  { nit: "901223597", nombre: "PUERTO 125 SAS" },
  { nit: "900776814", nombre: "EMCO INGENIERIA SAS" },
  { nit: "901666019", nombre: "UNION TEMPORAL COMPLEJO ACUATICO PEREIRA" },
  { nit: "901558032", nombre: "RIO LILY SAS" },
  { nit: "891500182", nombre: "CAJA DE COMPENSACION FAMILIAR DEL CAUCA" },
  { nit: "805000482", nombre: "ESTRUCTURAS Y TECHOS SAS" },
  { nit: "817000808", nombre: "TECNOSUR SAS" },
  { nit: "805017350", nombre: "HEMATO ONCOLOGOS SA" },
  { nit: "900400177", nombre: "SICON SAS" },
  { nit: "830054076", nombre: "FIDEICOMISOS SOCIEDAD FIDUCIARIA DE OCCIDENTE SA" }
];

// Función para limpiar nombres de empresa
function limpiarNombreEmpresa(nombre: string): string {
  return nombre
    .replace(/ - .+$/, '') // Eliminar todo después del primer " - "
    .replace(/\s+SA$/, ' SA')
    .replace(/\s+SAS$/, ' SAS')
    .replace(/\s+LIMITADA$/, ' LIMITADA')
    .replace(/\s+S\.A\.$/, ' S.A.')
    .replace(/\s+S\.A\.S$/, ' S.A.S')
    .trim();
}

// Función para determinar sector
function determinarSector(nombre: string): string {
  const nombreLower = nombre.toLowerCase();
  
  if (nombreLower.includes('construccion') || nombreLower.includes('constructor') || 
      nombreLower.includes('urbanizadora') || nombreLower.includes('ingenieria') ||
      nombreLower.includes('estructuras') || nombreLower.includes('pavimentos')) {
    return 'CONSTRUCCION';
  }
  
  if (nombreLower.includes('tecnoquimicas') || nombreLower.includes('tecnofar') ||
      nombreLower.includes('crystal') || nombreLower.includes('avicola') ||
      nombreLower.includes('alimentos') || nombreLower.includes('ingenio') ||
      nombreLower.includes('sucroal') || nombreLower.includes('siderurgica')) {
    return 'INDUSTRIAL';
  }
  
  if (nombreLower.includes('d1') || nombreLower.includes('dollarcity') ||
      nombreLower.includes('comercial') || nombreLower.includes('puerto')) {
    return 'COMERCIAL';
  }
  
  if (nombreLower.includes('caja de compensacion') || nombreLower.includes('asociacion') ||
      nombreLower.includes('fiduciaria') || nombreLower.includes('seguridad') ||
      nombreLower.includes('centro israelita')) {
    return 'INSTITUCIONAL';
  }
  
  return 'OTRO';
}

// Procesar clientes con información básica
const clientesProcesados = clientesRecientes.map(cliente => {
  const nombreLimpio = limpiarNombreEmpresa(cliente.nombre);
  const sector = determinarSector(cliente.nombre);
  
  return {
    nit: cliente.nit,
    nombreOriginal: cliente.nombre,
    nombreLimpio: nombreLimpio,
    sector: sector,
    slug: nombreLimpio.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  };
});

console.log('=== CLIENTES RECIENTES PROCESADOS ===');
console.log(`Total de clientes únicos: ${clientesProcesados.length}`);
console.log('');

// Agrupar por sector
const clientesPorSector = clientesProcesados.reduce((acc, cliente) => {
  if (!acc[cliente.sector]) {
    acc[cliente.sector] = [];
  }
  acc[cliente.sector].push(cliente);
  return acc;
}, {} as Record<string, typeof clientesProcesados>);

Object.entries(clientesPorSector).forEach(([sector, clientes]) => {
  console.log(`=== SECTOR ${sector} (${clientes.length} clientes) ===`);
  clientes.forEach(cliente => {
    console.log(`${cliente.nombreLimpio} (NIT: ${cliente.nit})`);
  });
  console.log('');
});

// Clientes prioritarios (grandes empresas conocidas)
const clientesPrioritarios = clientesProcesados.filter(cliente => {
  const nombre = cliente.nombreLimpio.toLowerCase();
  return nombre.includes('tecnoquimicas') ||
         nombre.includes('d1') ||
         nombre.includes('dollarcity') ||
         nombre.includes('crystal') ||
         nombre.includes('construandes') ||
         nombre.includes('pavimentos colombia') ||
         nombre.includes('ingenio providencia') ||
         nombre.includes('comfacauca') ||
         nombre.includes('tecnofar');
});

console.log('=== CLIENTES PRIORITARIOS PARA LOGOS ===');
clientesPrioritarios.forEach(cliente => {
  console.log(`${cliente.nombreLimpio} - ${cliente.sector}`);
});

export { clientesProcesados, clientesPrioritarios, limpiarNombreEmpresa, determinarSector };