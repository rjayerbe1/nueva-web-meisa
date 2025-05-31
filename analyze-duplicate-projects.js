#!/usr/bin/env node
const fs = require('fs');

// Función para normalizar nombres de proyectos
function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/centro comercial\s+/gi, '')
    .replace(/edificio\s+/gi, '')
    .replace(/puente\s+(vehicular|peatonal)\s+/gi, '')
    .replace(/escenario deportivo\s+/gi, '')
    .replace(/terminal\s+intermedio\s+mio/gi, 'terminal intermedio')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función para calcular similitud entre cadenas
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Proyectos del MD
function getMDProjects() {
  return [
    // Centros Comerciales del MD
    { name: 'Centro Comercial Campanario', category: 'CENTROS COMERCIALES', client: 'ARINSA', location: 'Popayán, Cauca' },
    { name: 'Paseo Villa del Río', category: 'CENTROS COMERCIALES', client: 'Ménsula Ingenieros S.A', location: 'Bogotá, Cundinamarca' },
    { name: 'Centro Comercial Monserrat', category: 'CENTROS COMERCIALES', client: 'Constructora Adriana Rivera SAS', location: 'Popayán, Cauca' },
    { name: 'Centro Comercial Unico Cali', category: 'CENTROS COMERCIALES', client: 'Unitres SAS', location: 'Cali, Valle' },
    { name: 'Centro Comercial Unico Neiva', category: 'CENTROS COMERCIALES', client: 'Constructora Colpatria SAS', location: 'Neiva, Huila' },
    { name: 'Centro Comercial Unico Barranquilla', category: 'CENTROS COMERCIALES', client: 'Centros Comerciales de la Costa SAS', location: 'Barranquilla, Atlántico' },
    { name: 'Centro Comercial Armenia Plaza', category: 'CENTROS COMERCIALES', client: 'ER Inversiones', location: 'Armenia, Quindío' },
    { name: 'Centro Comercial Bochalema Plaza', category: 'CENTROS COMERCIALES', client: 'Constructora Normandía', location: 'Cali, Valle del Cauca' },
    
    // Edificios del MD
    { name: 'Cinemateca Distrital', category: 'EDIFICIOS', client: 'Consorcio Cine Cultura Bogotá', location: 'Bogotá, Cundinamarca' },
    { name: 'Clínica Reina Victoria', category: 'EDIFICIOS', client: 'INVERSIONES M&L GROUP S.A.S.', location: 'Popayán, Cauca' },
    { name: 'Omega', category: 'EDIFICIOS', client: 'Omega', location: 'Cali, Valle' },
    { name: 'Bomberos Popayán', category: 'EDIFICIOS', client: 'Cuerpo de bomberos voluntarios de Popayán', location: 'Popayán, Cauca' },
    { name: 'Estación MIO Guadalupe', category: 'EDIFICIOS', client: 'Consorcio Metrovial SB', location: 'Cali, Valle' },
    { name: 'SENA Santander', category: 'EDIFICIOS', client: 'Sena', location: 'Santander, Cauca' },
    { name: 'Terminal Intermedio MIO', category: 'EDIFICIOS', client: 'Consorcio Metrovial SB', location: 'Cali, Valle del Cauca' },
    { name: 'Tequendama Parking Cali', category: 'EDIFICIOS', client: 'No especificado', location: 'Cali, Valle del Cauca' },
    { name: 'Módulos Médicos', category: 'EDIFICIOS', client: 'No especificado', location: 'No especificada' },
    
    // Industria del MD
    { name: 'Ampliación Cargill', category: 'INDUSTRIA', client: 'Cargill Colombia', location: 'Villa Rica, Cauca' },
    { name: 'Torre Cogeneración Propal', category: 'INDUSTRIA', client: 'Propal', location: 'Yumbo, Valle del Cauca' },
    { name: 'Bodega Duplex Ingeniería', category: 'INDUSTRIA', client: 'No especificado', location: 'No especificada' },
    { name: 'Bodega Intera', category: 'INDUSTRIA', client: 'Intera SAS', location: 'Santander, Cauca' },
    { name: 'Tecnofar', category: 'INDUSTRIA', client: 'Constructora Inverteq S.A.S', location: 'Villa Rica, Cauca' },
    { name: 'Bodega Protecnica Etapa II', category: 'INDUSTRIA', client: 'Protecnica Ingenieria SAS', location: 'Yumbo, Valle' },
    { name: 'Tecnoquímicas Jamundí', category: 'INDUSTRIA', client: 'Tecnoquímicas S.A.', location: 'Jamundí, Valle del Cauca' },
    
    // Puentes Vehiculares del MD
    { name: 'Puente Nolasco', category: 'PUENTES VEHICULARES', client: 'Consorcio del Cauca', location: 'Nátaga, Huila' },
    { name: 'Puente Carrera 100', category: 'PUENTES VEHICULARES', client: 'Consorcio Islas 2019', location: 'Cali, Valle del Cauca' },
    { name: 'Cambrin', category: 'PUENTES VEHICULARES', client: 'Consorcio Cambrin 2017', location: 'Tolima' },
    { name: 'Puente Frisoles', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Pasto' },
    { name: 'Puente La 21', category: 'PUENTES VEHICULARES', client: 'Unión Temporal Espacio 2015', location: 'Cali, Valle del Cauca' },
    { name: 'Puente La Paila', category: 'PUENTES VEHICULARES', client: 'Unión Temporal E&R', location: 'Vía Santander de Quilichao, Cauca' },
    { name: 'Puente Saraconcho', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Bolívar, Cauca' },
    { name: 'Puente Río Negro', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Río Negro, Cauca' },
    
    // Puentes Peatonales del MD
    { name: 'Escalinata Curva - Río Cali', category: 'PUENTES PEATONALES', client: 'UNIÓN TEMPORAL ESPACIO 2015', location: 'Cali, Valle del Cauca' },
    { name: 'Puente Autopista Sur - Carrera 68', category: 'PUENTES PEATONALES', client: 'CONSORCIO VÍAS DE CALI S.A.S.', location: 'Cali, Valle del Cauca' },
    { name: 'Puente de la 63', category: 'PUENTES PEATONALES', client: 'No especificado', location: 'Cali, Valle del Cauca' },
    { name: 'La Tertulia', category: 'PUENTES PEATONALES', client: 'Harold Méndez', location: 'Cali, Valle del Cauca' },
    { name: 'Terminal Intermedio', category: 'PUENTES PEATONALES', client: 'Consorcio Metrovial SB', location: 'Cali, Valle del Cauca' },
    
    // Escenarios Deportivos del MD
    { name: 'Complejo Acuático Popayán', category: 'ESCENARIOS DEPORTIVOS', client: 'Fondo mixto para promoción del deporte', location: 'Popayán, Cauca' },
    { name: 'Complejo Acuático Juegos Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca' },
    { name: 'Coliseo Mayor Juegos Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca' },
    { name: 'Coliseo de Artes Marciales Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca' },
    { name: 'Cecun (Universidad del Cauca)', category: 'ESCENARIOS DEPORTIVOS', client: 'Consorcio Cecun', location: 'Popayán, Cauca' },
    { name: 'Cancha Javeriana Cali', category: 'ESCENARIOS DEPORTIVOS', client: 'Pontificia Universidad Javeriana', location: 'Cali, Valle del Cauca' },
    
    // Cubiertas y Fachadas del MD
    { name: 'Taquillas Pisoje', category: 'CUBIERTAS Y FACHADAS', client: 'No especificado', location: 'Colombia' },
    { name: 'Taquillas Pisoje Comfacauca', category: 'CUBIERTAS Y FACHADAS', client: 'Comfacauca', location: 'Cauca' }
  ];
}

function analyzeDuplicateProjects() {
  console.log('🔍 ANÁLISIS DETALLADO DE PROYECTOS DUPLICADOS\n');
  
  // Leer datos del JSON
  const jsonData = JSON.parse(
    fs.readFileSync('./project-images-from-posts.json', 'utf-8')
  );
  
  // Extraer proyectos del MD
  const mdProjects = getMDProjects();
  
  // Crear lista de proyectos del JSON
  const jsonProjects = [];
  for (const [categoria, proyectos] of Object.entries(jsonData.resultados)) {
    for (const [nombre, datos] of Object.entries(proyectos)) {
      jsonProjects.push({
        name: nombre,
        category: categoria,
        hasImages: datos.total_imagenes > 0
      });
    }
  }
  
  console.log('📊 RESUMEN GENERAL:');
  console.log(`- Proyectos en JSON: ${jsonProjects.length}`);
  console.log(`- Proyectos en MD: ${mdProjects.length}`);
  console.log('');
  
  // 1. Buscar variaciones de nombres similares dentro del JSON
  console.log('🔍 1. POSIBLES DUPLICADOS DENTRO DEL JSON:\n');
  const jsonDuplicates = [];
  
  for (let i = 0; i < jsonProjects.length; i++) {
    for (let j = i + 1; j < jsonProjects.length; j++) {
      const name1 = normalizeProjectName(jsonProjects[i].name);
      const name2 = normalizeProjectName(jsonProjects[j].name);
      const similarity = calculateSimilarity(name1, name2);
      
      if (similarity > 0.7 && name1 !== name2) {
        jsonDuplicates.push({
          project1: jsonProjects[i].name,
          project2: jsonProjects[j].name,
          similarity: similarity,
          category1: jsonProjects[i].category,
          category2: jsonProjects[j].category
        });
      }
    }
  }
  
  if (jsonDuplicates.length > 0) {
    jsonDuplicates.sort((a, b) => b.similarity - a.similarity);
    jsonDuplicates.forEach((dup, index) => {
      console.log(`${index + 1}. Similitud: ${(dup.similarity * 100).toFixed(1)}%`);
      console.log(`   - "${dup.project1}" (${dup.category1})`);
      console.log(`   - "${dup.project2}" (${dup.category2})`);
      console.log('');
    });
  } else {
    console.log('✅ No se encontraron duplicados evidentes dentro del JSON\n');
  }
  
  // 2. Casos específicos para revisar manualmente
  console.log('🔍 2. CASOS ESPECÍFICOS DETECTADOS:\n');
  
  // Terminal Intermedio vs Terminal Intermedio MIO
  console.log('📍 CASO: Terminal Intermedio');
  const terminalJSON = jsonProjects.filter(p => p.name.includes('Terminal Intermedio'));
  const terminalMD = mdProjects.filter(p => p.name.includes('Terminal Intermedio'));
  
  console.log('   JSON:');
  terminalJSON.forEach(p => {
    console.log(`   - "${p.name}" (${p.category}) - Imágenes: ${p.hasImages ? 'SÍ' : 'NO'}`);
  });
  
  console.log('   MD:');
  terminalMD.forEach(p => {
    console.log(`   - "${p.name}" (${p.category})`);
    console.log(`     Cliente: ${p.client}`);
    console.log(`     Ubicación: ${p.location}`);
  });
  console.log('');
  
  // Taquillas Pisoje
  console.log('📍 CASO: Taquillas Pisoje');
  const taquillasJSON = jsonProjects.filter(p => p.name.toLowerCase().includes('taquillas'));
  const taquillasMD = mdProjects.filter(p => p.name.toLowerCase().includes('taquillas'));
  
  console.log('   JSON:');
  taquillasJSON.forEach(p => {
    console.log(`   - "${p.name}" (${p.category}) - Imágenes: ${p.hasImages ? 'SÍ' : 'NO'}`);
  });
  
  console.log('   MD:');
  taquillasMD.forEach(p => {
    console.log(`   - "${p.name}" (${p.category})`);
    console.log(`     Cliente: ${p.client}`);
    console.log(`     Ubicación: ${p.location}`);
  });
  console.log('');
  
  // 3. Comparar similitudes entre JSON y MD
  console.log('🔍 3. COINCIDENCIAS ENTRE JSON Y MD (Similitud > 80%):\n');
  const highMatches = [];
  
  for (const mdProject of mdProjects) {
    for (const jsonProject of jsonProjects) {
      const mdName = normalizeProjectName(mdProject.name);
      const jsonName = normalizeProjectName(jsonProject.name);
      const similarity = calculateSimilarity(mdName, jsonName);
      
      if (similarity > 0.8) {
        highMatches.push({
          mdProject,
          jsonProject,
          similarity
        });
      }
    }
  }
  
  if (highMatches.length > 0) {
    highMatches.sort((a, b) => b.similarity - a.similarity);
    highMatches.forEach((match, index) => {
      console.log(`${index + 1}. Similitud: ${(match.similarity * 100).toFixed(1)}%`);
      console.log(`   MD: "${match.mdProject.name}" (${match.mdProject.category})`);
      console.log(`   JSON: "${match.jsonProject.name}" (${match.jsonProject.category}) - Imágenes: ${match.jsonProject.hasImages ? 'SÍ' : 'NO'}`);
      console.log(`   Cliente MD: ${match.mdProject.client || 'No especificado'}`);
      console.log(`   Ubicación MD: ${match.mdProject.location || 'No especificada'}`);
      console.log('');
    });
  }
  
  // 4. Proyectos ubicados en las mismas ciudades
  console.log('🔍 4. PROYECTOS POR CIUDAD (posibles duplicados):\n');
  
  const ciudades = {};
  
  // Agrupar proyectos del MD por ciudad
  mdProjects.forEach(p => {
    if (p.location) {
      const ciudad = p.location.split(',')[0].trim().toLowerCase();
      if (!ciudades[ciudad]) {
        ciudades[ciudad] = { md: [], json: [] };
      }
      ciudades[ciudad].md.push(p);
    }
  });
  
  // Buscar proyectos del JSON en las mismas ciudades
  jsonProjects.forEach(p => {
    Object.keys(ciudades).forEach(ciudad => {
      if (p.name.toLowerCase().includes(ciudad) || 
          (ciudad === 'cali' && p.name.toLowerCase().includes('cali')) ||
          (ciudad === 'popayán' && p.name.toLowerCase().includes('popayan'))) {
        ciudades[ciudad].json.push(p);
      }
    });
  });
  
  // Mostrar ciudades con múltiples proyectos
  Object.entries(ciudades).forEach(([ciudad, projects]) => {
    const totalProjects = projects.md.length + projects.json.length;
    if (totalProjects > 1) {
      console.log(`📍 CIUDAD: ${ciudad.toUpperCase()}`);
      console.log(`   Proyectos MD: ${projects.md.length}`);
      console.log(`   Proyectos JSON: ${projects.json.length}`);
      
      projects.md.forEach(p => {
        console.log(`   - MD: "${p.name}" (${p.category}) - Cliente: ${p.client}`);
      });
      
      projects.json.forEach(p => {
        console.log(`   - JSON: "${p.name}" (${p.category}) - Imágenes: ${p.hasImages ? 'SÍ' : 'NO'}`);
      });
      console.log('');
    }
  });
  
  // 5. Proyectos que están solo en MD
  console.log('🔍 5. PROYECTOS EN MD SIN CORRESPONDENCIA EN JSON:\n');
  
  const mdOnlyProjects = mdProjects.filter(mdProject => {
    return !highMatches.some(match => 
      match.mdProject.name === mdProject.name && match.similarity > 0.8
    );
  });
  
  if (mdOnlyProjects.length > 0) {
    mdOnlyProjects.forEach((project, index) => {
      console.log(`${index + 1}. "${project.name}" (${project.category})`);
      console.log(`   Cliente: ${project.client}`);
      console.log(`   Ubicación: ${project.location}`);
      console.log('');
    });
  } else {
    console.log('✅ Todos los proyectos del MD tienen alta correspondencia en JSON\n');
  }
  
  // 6. Proyectos sin imágenes en JSON
  console.log('🔍 6. PROYECTOS EN JSON SIN IMÁGENES:\n');
  const noImagesProjects = jsonProjects.filter(p => !p.hasImages);
  
  if (noImagesProjects.length > 0) {
    noImagesProjects.forEach((project, index) => {
      console.log(`${index + 1}. "${project.name}" (${project.category})`);
    });
    console.log('');
  }
  
  // 7. Resumen final
  console.log('📋 RESUMEN DE HALLAZGOS:\n');
  console.log(`- Posibles duplicados internos en JSON: ${jsonDuplicates.length}`);
  console.log(`- Proyectos con alta coincidencia MD-JSON: ${highMatches.length}`);
  console.log(`- Proyectos solo en MD: ${mdOnlyProjects.length}`);
  console.log(`- Proyectos sin imágenes en JSON: ${noImagesProjects.length}`);
  
  console.log('\n🎯 CASOS CRÍTICOS PARA REVISIÓN MANUAL:');
  console.log('1. ❗ Terminal Intermedio vs Terminal Intermedio MIO - Verificar si son el mismo proyecto');
  console.log('2. ❗ Taquillas Pisoje vs Taquillas Pisoje Comfacauca - Verificar si son proyectos diferentes');
  console.log('3. ⚠️ Proyectos en MD sin imágenes en JSON - Investigar por qué faltan');
  console.log('4. ⚠️ Proyectos con similitud 70-80% - Verificar manualmente');
}

// Ejecutar el análisis
analyzeDuplicateProjects();