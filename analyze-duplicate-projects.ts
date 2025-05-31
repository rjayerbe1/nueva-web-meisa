#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

interface ProjectImageData {
  fecha_extraccion: string;
  total_proyectos_solicitados: number;
  total_proyectos_con_imagenes: number;
  total_imagenes_encontradas: number;
  resultados: {
    [categoria: string]: {
      [proyecto: string]: {
        post_id: number | null;
        post_title: string | null;
        total_imagenes: number;
        imagenes: any[];
        busqueda_por_patron: boolean;
        error?: string;
      }
    }
  };
}

interface ProjectFromMD {
  name: string;
  category: string;
  client?: string;
  location?: string;
  weight?: string;
  description?: string;
  images?: string[];
}

// Función para normalizar nombres de proyectos
function normalizeProjectName(name: string): string {
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

// Función para calcular similitud entre cadenas (algoritmo simple)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1: string, str2: string): number {
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

// Extraer proyectos del archivo MD
function extractProjectsFromMD(): ProjectFromMD[] {
  const projects: ProjectFromMD[] = [
    // Centros Comerciales del MD
    { name: 'Centro Comercial Campanario', category: 'CENTROS COMERCIALES', client: 'ARINSA', location: 'Popayán, Cauca', description: 'Cimentación, estructura metálica y cubiertas ampliación' },
    { name: 'Paseo Villa del Río', category: 'CENTROS COMERCIALES', client: 'Ménsula Ingenieros S.A', location: 'Bogotá, Cundinamarca', description: 'Estructura, metálica de rampas, losa y racks' },
    { name: 'Centro Comercial Monserrat', category: 'CENTROS COMERCIALES', client: 'Constructora Adriana Rivera SAS', location: 'Popayán, Cauca', description: 'Estructura Metálica y Cubierta' },
    { name: 'Centro Comercial Unico Cali', category: 'CENTROS COMERCIALES', client: 'Unitres SAS', location: 'Cali, Valle', description: 'Construcción de obra civil, estructura metálica y cubierta' },
    { name: 'Centro Comercial Unico Neiva', category: 'CENTROS COMERCIALES', client: 'Constructora Colpatria SAS', location: 'Neiva, Huila', description: 'Estructura Metálica y Cubierta' },
    { name: 'Centro Comercial Unico Barranquilla', category: 'CENTROS COMERCIALES', client: 'Centros Comerciales de la Costa SAS', location: 'Barranquilla, Atlántico', description: 'Estructura Metálica y Cubierta' },
    { name: 'Centro Comercial Armenia Plaza', category: 'CENTROS COMERCIALES', client: 'ER Inversiones', location: 'Armenia, Quindío', description: 'Estructura metálica' },
    { name: 'Centro Comercial Bochalema Plaza', category: 'CENTROS COMERCIALES', client: 'Constructora Normandía', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    
    // Edificios del MD
    { name: 'Cinemateca Distrital', category: 'EDIFICIOS', client: 'Consorcio Cine Cultura Bogotá', location: 'Bogotá, Cundinamarca', description: 'Estructura metálica' },
    { name: 'Clínica Reina Victoria', category: 'EDIFICIOS', client: 'INVERSIONES M&L GROUP S.A.S.', location: 'Popayán, Cauca', description: 'Cimentación y estructura metálica' },
    { name: 'Omega', category: 'EDIFICIOS', client: 'Omega', location: 'Cali, Valle', description: 'Estructura Metálica' },
    { name: 'Bomberos Popayán', category: 'EDIFICIOS', client: 'Cuerpo de bomberos voluntarios de Popayán', location: 'Popayán, Cauca', description: 'Estructura Metálica' },
    { name: 'Estación MIO Guadalupe', category: 'EDIFICIOS', client: 'Consorcio Metrovial SB', location: 'Cali, Valle', description: 'Estructura metálica' },
    { name: 'SENA Santander', category: 'EDIFICIOS', client: 'Sena', location: 'Santander, Cauca', description: 'Estructura Metálica' },
    { name: 'Terminal Intermedio MIO', category: 'EDIFICIOS', client: 'Consorcio Metrovial SB', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Tequendama Parking Cali', category: 'EDIFICIOS', client: 'No especificado', location: 'Cali, Valle del Cauca', description: 'Estructura metálica y obra civil' },
    { name: 'Módulos Médicos', category: 'EDIFICIOS', client: 'No especificado', location: 'No especificada', description: 'Estructuras modulares médicas' },
    
    // Industria del MD
    { name: 'Ampliación Cargill', category: 'INDUSTRIA', client: 'Cargill Colombia', location: 'Villa Rica, Cauca', description: 'Estructura metálica y cubierta ampliación' },
    { name: 'Torre Cogeneración Propal', category: 'INDUSTRIA', client: 'Propal', location: 'Yumbo, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Bodega Duplex Ingeniería', category: 'INDUSTRIA', client: 'No especificado', location: 'No especificada', description: 'Estructura metálica' },
    { name: 'Bodega Intera', category: 'INDUSTRIA', client: 'Intera SAS', location: 'Santander, Cauca', description: 'Estructura metálica' },
    { name: 'Tecnofar', category: 'INDUSTRIA', client: 'Constructora Inverteq S.A.S', location: 'Villa Rica, Cauca', description: 'Estructura metálica' },
    { name: 'Bodega Protecnica Etapa II', category: 'INDUSTRIA', client: 'Protecnica Ingenieria SAS', location: 'Yumbo, Valle', description: 'Estructura metálica, fachada y cubierta' },
    { name: 'Tecnoquímicas Jamundí', category: 'INDUSTRIA', client: 'Tecnoquímicas S.A.', location: 'Jamundí, Valle del Cauca', description: 'Estructura metálica' },
    
    // Puentes Vehiculares del MD
    { name: 'Puente Nolasco', category: 'PUENTES VEHICULARES', client: 'Consorcio del Cauca', location: 'Nátaga, Huila', description: 'Estructura metálica' },
    { name: 'Puente Carrera 100', category: 'PUENTES VEHICULARES', client: 'Consorcio Islas 2019', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Cambrin', category: 'PUENTES VEHICULARES', client: 'Consorcio Cambrin 2017', location: 'Tolima', description: 'Estructura metálica' },
    { name: 'Puente Frisoles', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Pasto', description: 'Estructura metálica' },
    { name: 'Puente La 21', category: 'PUENTES VEHICULARES', client: 'Unión Temporal Espacio 2015', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Puente La Paila', category: 'PUENTES VEHICULARES', client: 'Unión Temporal E&R', location: 'Vía Santander de Quilichao – Río Desbaratado, Cauca', description: 'Estructura metálica' },
    { name: 'Puente Saraconcho', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Bolívar, Cauca', description: 'Estructura metálica' },
    { name: 'Puente Río Negro', category: 'PUENTES VEHICULARES', client: 'No especificado', location: 'Río Negro, Cauca', description: 'Estructura metálica' },
    
    // Puentes Peatonales del MD
    { name: 'Escalinata Curva - Río Cali', category: 'PUENTES PEATONALES', client: 'UNIÓN TEMPORAL ESPACIO 2015', location: 'Cali, Valle del Cauca', description: 'Formaleta en estructura metálica' },
    { name: 'Puente Autopista Sur - Carrera 68', category: 'PUENTES PEATONALES', client: 'CONSORCIO VÍAS DE CALI S.A.S.', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Puente de la 63', category: 'PUENTES PEATONALES', client: 'No especificado', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'La Tertulia', category: 'PUENTES PEATONALES', client: 'Harold Méndez', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    { name: 'Terminal Intermedio', category: 'PUENTES PEATONALES', client: 'Consorcio Metrovial SB', location: 'Cali, Valle del Cauca', description: 'Estructura metálica' },
    
    // Escenarios Deportivos del MD
    { name: 'Complejo Acuático Popayán', category: 'ESCENARIOS DEPORTIVOS', client: 'Fondo mixto para promoción del deporte', location: 'Popayán, Cauca', description: 'Obra civil y estructura metálica' },
    { name: 'Complejo Acuático Juegos Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca', description: 'Obra civil y estructura metálica' },
    { name: 'Coliseo Mayor Juegos Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca', description: 'Obra civil y estructura metálica' },
    { name: 'Coliseo de Artes Marciales Nacionales 2012', category: 'ESCENARIOS DEPORTIVOS', client: 'MAJA S.A.S.', location: 'Popayán, Cauca', description: 'Obra civil y estructura metálica' },
    { name: 'Cecun (Universidad del Cauca)', category: 'ESCENARIOS DEPORTIVOS', client: 'Consorcio Cecun', location: 'Popayán, Cauca', description: 'Estructura metálica y cubierta edificio Cecun' },
    { name: 'Cancha Javeriana Cali', category: 'ESCENARIOS DEPORTIVOS', client: 'Pontificia Universidad Javeriana', location: 'Cali, Valle del Cauca', description: 'Estructura metálica, cerramientos y cubierta' },
    
    // Cubiertas y Fachadas del MD
    { name: 'Taquillas Pisoje', category: 'CUBIERTAS Y FACHADAS', client: 'No especificado', location: 'Colombia', description: 'Proyecto de cubiertas y fachadas' },
    { name: 'Taquillas Pisoje Comfacauca', category: 'CUBIERTAS Y FACHADAS', client: 'Comfacauca', location: 'Cauca', description: 'Proyecto de cubiertas y fachadas' }
  ];
  
  return projects;
}

async function analyzeDuplicateProjects() {
  console.log('🔍 ANÁLISIS DETALLADO DE PROYECTOS DUPLICADOS\n');
  
  // Leer datos del JSON
  const jsonData: ProjectImageData = JSON.parse(
    fs.readFileSync('/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/project-images-from-posts.json', 'utf-8')
  );
  
  // Extraer proyectos del MD
  const mdProjects = extractProjectsFromMD();
  
  // Crear lista de proyectos del JSON
  const jsonProjects: Array<{name: string, category: string, hasImages: boolean}> = [];
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
  const jsonDuplicates: Array<{project1: string, project2: string, similarity: number, category1: string, category2: string}> = [];
  
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
  
  // 2. Comparar proyectos entre JSON y MD
  console.log('🔍 2. PROYECTOS EN MD QUE PODRÍAN COINCIDIR CON JSON:\n');
  const matchingProjects: Array<{mdProject: ProjectFromMD, jsonProject: any, similarity: number}> = [];
  
  for (const mdProject of mdProjects) {
    for (const jsonProject of jsonProjects) {
      const mdName = normalizeProjectName(mdProject.name);
      const jsonName = normalizeProjectName(jsonProject.name);
      const similarity = calculateSimilarity(mdName, jsonName);
      
      if (similarity > 0.6) {
        matchingProjects.push({
          mdProject,
          jsonProject,
          similarity
        });
      }
    }
  }
  
  if (matchingProjects.length > 0) {
    matchingProjects.sort((a, b) => b.similarity - a.similarity);
    matchingProjects.forEach((match, index) => {
      console.log(`${index + 1}. Similitud: ${(match.similarity * 100).toFixed(1)}%`);
      console.log(`   MD: "${match.mdProject.name}" (${match.mdProject.category})`);
      console.log(`   JSON: "${match.jsonProject.name}" (${match.jsonProject.category})`);
      console.log(`   Cliente MD: ${match.mdProject.client || 'No especificado'}`);
      console.log(`   Ubicación MD: ${match.mdProject.location || 'No especificada'}`);
      console.log('');
    });
  }
  
  // 3. Proyectos específicos para revisar manualmente
  console.log('🔍 3. CASOS ESPECÍFICOS PARA REVISIÓN MANUAL:\n');
  
  // Terminal Intermedio vs Terminal Intermedio MIO
  const terminalCases = [
    'Terminal Intermedio MIO',
    'Terminal Intermedio'
  ];
  
  console.log('📍 CASO: Terminal Intermedio');
  terminalCases.forEach(name => {
    const found = jsonProjects.find(p => p.name.includes('Terminal Intermedio'));
    if (found) {
      console.log(`   - Encontrado en JSON: "${found.name}" (${found.category})`);
    }
  });
  
  const terminalMD = mdProjects.find(p => p.name.includes('Terminal Intermedio'));
  if (terminalMD) {
    console.log(`   - Encontrado en MD: "${terminalMD.name}" (${terminalMD.category})`);
    console.log(`     Cliente: ${terminalMD.client}`);
    console.log(`     Ubicación: ${terminalMD.location}`);
  }
  console.log('');
  
  // Taquillas Pisoje
  console.log('📍 CASO: Taquillas Pisoje');
  const taquillasJSON = jsonProjects.filter(p => p.name.toLowerCase().includes('taquillas'));
  const taquillasMD = mdProjects.filter(p => p.name.toLowerCase().includes('taquillas'));
  
  taquillasJSON.forEach(p => {
    console.log(`   - JSON: "${p.name}" (${p.category})`);
  });
  
  taquillasMD.forEach(p => {
    console.log(`   - MD: "${p.name}" (${p.category})`);
    console.log(`     Cliente: ${p.client}`);
    console.log(`     Ubicación: ${p.location}`);
  });
  console.log('');
  
  // 4. Proyectos con nombres de ubicación que podrían ser el mismo
  console.log('🔍 4. PROYECTOS CON UBICACIONES SIMILARES:\n');
  
  const locationGroups: {[key: string]: Array<{name: string, category: string, source: string, location?: string}>} = {};
  
  // Agrupar por ubicaciones del MD
  mdProjects.forEach(p => {
    if (p.location) {
      const location = p.location.toLowerCase().replace(/,.*/, '').trim(); // Solo la primera parte antes de la coma
      if (!locationGroups[location]) {
        locationGroups[location] = [];
      }
      locationGroups[location].push({
        name: p.name,
        category: p.category,
        source: 'MD',
        location: p.location
      });
    }
  });
  
  // Mostrar ubicaciones con múltiples proyectos
  Object.entries(locationGroups).forEach(([location, projects]) => {
    if (projects.length > 1) {
      console.log(`📍 UBICACIÓN: ${location.toUpperCase()}`);
      projects.forEach(p => {
        console.log(`   - "${p.name}" (${p.category}) - ${p.source}`);
        if (p.location) console.log(`     Ubicación completa: ${p.location}`);
      });
      console.log('');
    }
  });
  
  // 5. Proyectos que están solo en MD y no en JSON
  console.log('🔍 5. PROYECTOS EN MD QUE NO ESTÁN EN JSON:\n');
  
  const mdOnlyProjects = mdProjects.filter(mdProject => {
    return !matchingProjects.some(match => 
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
    console.log('✅ Todos los proyectos del MD tienen coincidencia en JSON\n');
  }
  
  // 6. Resumen final
  console.log('📋 RESUMEN DE HALLAZGOS:\n');
  console.log(`- Posibles duplicados internos en JSON: ${jsonDuplicates.length}`);
  console.log(`- Proyectos que coinciden entre MD y JSON: ${matchingProjects.length}`);
  console.log(`- Proyectos solo en MD: ${mdOnlyProjects.length}`);
  console.log(`- Ubicaciones con múltiples proyectos: ${Object.entries(locationGroups).filter(([_, projects]) => projects.length > 1).length}`);
  
  console.log('\n🎯 RECOMENDACIONES:');
  console.log('1. Revisar manualmente los casos de Terminal Intermedio vs Terminal Intermedio MIO');
  console.log('2. Verificar si "Taquillas Pisoje" y "Taquillas Pisoje Comfacauca" son proyectos diferentes');
  console.log('3. Confirmar proyectos con ubicaciones similares (especialmente en Cali y Popayán)');
  console.log('4. Investigar los proyectos que están solo en MD para determinar si faltan en la base de datos');
}

// Ejecutar el análisis
analyzeDuplicateProjects().catch(console.error);