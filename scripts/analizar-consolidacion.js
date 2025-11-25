const fs = require('fs');

// Leer archivo de proyectos completos
const proyectos = JSON.parse(fs.readFileSync('./proyectos-completos.json', 'utf8'));

// Agrupar por categoría
const porCategoria = {
  industrial: [],
  edificaciones: [],
  deportes: []
};

proyectos.forEach(p => {
  const cat = p.categoria?.toLowerCase() || '';

  if (cat.includes('industrial') || cat.includes('industria')) {
    porCategoria.industrial.push(p);
  } else if (cat.includes('edificacion') || cat.includes('edificio')) {
    porCategoria.edificaciones.push(p);
  } else if (cat.includes('deport') || cat.includes('escenario')) {
    porCategoria.deportes.push(p);
  }
});

console.log('\n' + '='.repeat(80));
console.log('ANÁLISIS DE PROYECTOS REALES PARA CONSOLIDACIÓN');
console.log('='.repeat(80) + '\n');

// INDUSTRIAL
console.log('📁 INDUSTRIAL (' + porCategoria.industrial.length + ' proyectos):');
console.log('─'.repeat(80));

const tiposIndustrial = {};
porCategoria.industrial.forEach(p => {
  const nombre = p.nombre.toLowerCase();

  if (nombre.includes('bodega') || nombre.includes('tecnosur') || nombre.includes('almacen')) {
    tiposIndustrial['Bodegas'] = (tiposIndustrial['Bodegas'] || 0) + 1;
  } else if (nombre.includes('farmaceu') || nombre.includes('tecnoquimicas') || nombre.includes('tecnofar')) {
    tiposIndustrial['Farmacéuticas'] = (tiposIndustrial['Farmacéuticas'] || 0) + 1;
  } else if (nombre.includes('ingenio') || nombre.includes('providencia') || nombre.includes('azucar') || nombre.includes('sucroal')) {
    tiposIndustrial['Ingenios'] = (tiposIndustrial['Ingenios'] || 0) + 1;
  } else if (nombre.includes('frio') || nombre.includes('refrigera')) {
    tiposIndustrial['Cuartos Fríos'] = (tiposIndustrial['Cuartos Fríos'] || 0) + 1;
  } else if (nombre.includes('hangar') || nombre.includes('aeropuerto') || nombre.includes('avion')) {
    tiposIndustrial['Hangares'] = (tiposIndustrial['Hangares'] || 0) + 1;
  } else {
    tiposIndustrial['Otros'] = (tiposIndustrial['Otros'] || 0) + 1;
  }
});

Object.entries(tiposIndustrial).sort((a, b) => b[1] - a[1]).forEach(([tipo, count]) => {
  console.log(`   • ${tipo}: ${count} proyectos`);
});

console.log('\nProyectos ejemplo:');
porCategoria.industrial.slice(0, 10).forEach(p => {
  console.log(`   - ${p.nombre}`);
});

// EDIFICACIONES
console.log('\n\n📁 EDIFICACIONES (' + porCategoria.edificaciones.length + ' proyectos):');
console.log('─'.repeat(80));

const tiposEdificaciones = {};
porCategoria.edificaciones.forEach(p => {
  const nombre = p.nombre.toLowerCase();

  if (nombre.includes('parqueadero') || nombre.includes('parking')) {
    tiposEdificaciones['Parqueaderos'] = (tiposEdificaciones['Parqueaderos'] || 0) + 1;
  } else if (nombre.includes('colegio') || nombre.includes('escuela') || nombre.includes('educati')) {
    tiposEdificaciones['Educativos'] = (tiposEdificaciones['Educativos'] || 0) + 1;
  } else if (nombre.includes('cultural') || nombre.includes('teatro') || nombre.includes('museo') || nombre.includes('cinemateca')) {
    tiposEdificaciones['Culturales'] = (tiposEdificaciones['Culturales'] || 0) + 1;
  } else if (nombre.includes('oficina') || nombre.includes('corporativ') || nombre.includes('administrativ') || nombre.includes('omega')) {
    tiposEdificaciones['Oficinas/Corporativos'] = (tiposEdificaciones['Oficinas/Corporativos'] || 0) + 1;
  } else if (nombre.includes('ampliacion')) {
    tiposEdificaciones['Ampliaciones'] = (tiposEdificaciones['Ampliaciones'] || 0) + 1;
  } else {
    tiposEdificaciones['Otros'] = (tiposEdificaciones['Otros'] || 0) + 1;
  }
});

Object.entries(tiposEdificaciones).sort((a, b) => b[1] - a[1]).forEach(([tipo, count]) => {
  console.log(`   • ${tipo}: ${count} proyectos`);
});

console.log('\nProyectos ejemplo:');
porCategoria.edificaciones.slice(0, 10).forEach(p => {
  console.log(`   - ${p.nombre}`);
});

// DEPORTES
console.log('\n\n📁 DEPORTES (' + porCategoria.deportes.length + ' proyectos):');
console.log('─'.repeat(80));

const tiposDeportes = {};
porCategoria.deportes.forEach(p => {
  const nombre = p.nombre.toLowerCase();

  if (nombre.includes('coliseo') || nombre.includes('arena')) {
    tiposDeportes['Coliseos'] = (tiposDeportes['Coliseos'] || 0) + 1;
  } else if (nombre.includes('piscina') || nombre.includes('acuatico')) {
    tiposDeportes['Piscinas'] = (tiposDeportes['Piscinas'] || 0) + 1;
  } else if (nombre.includes('cubierta') || nombre.includes('cancha')) {
    tiposDeportes['Cubiertas/Canchas'] = (tiposDeportes['Cubiertas/Canchas'] || 0) + 1;
  } else if (nombre.includes('torre') || nombre.includes('iluminacion')) {
    tiposDeportes['Torres'] = (tiposDeportes['Torres'] || 0) + 1;
  } else if (nombre.includes('graderia')) {
    tiposDeportes['Graderías'] = (tiposDeportes['Graderías'] || 0) + 1;
  } else {
    tiposDeportes['Otros'] = (tiposDeportes['Otros'] || 0) + 1;
  }
});

Object.entries(tiposDeportes).sort((a, b) => b[1] - a[1]).forEach(([tipo, count]) => {
  console.log(`   • ${tipo}: ${count} proyectos`);
});

console.log('\nProyectos ejemplo:');
porCategoria.deportes.slice(0, 10).forEach(p => {
  console.log(`   - ${p.nombre}`);
});

console.log('\n' + '='.repeat(80) + '\n');
