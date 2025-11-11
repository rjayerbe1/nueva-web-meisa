const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  console.log('📊 ANÁLISIS DETALLADO POR AÑO (con proyectos multi-año)\n');

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: { visible: true },
    orderBy: { fechaInicio: 'asc' }
  });

  // Agrupar proyectos por año con distribución proporcional
  const proyectosPorAnio = {};

  proyectos.forEach(proyecto => {
    const fechaInicio = new Date(proyecto.fechaInicio);
    const fechaFin = new Date(proyecto.fechaFin);
    const yearInicio = fechaInicio.getFullYear();
    const yearFin = fechaFin.getFullYear();

    if (yearInicio === yearFin) {
      // Un solo año
      if (!proyectosPorAnio[yearFin]) proyectosPorAnio[yearFin] = [];
      proyectosPorAnio[yearFin].push({
        ...proyecto,
        pesoKgProporcional: proyecto.pesoKg,
        esMultiAnio: false,
        mesesEnAnio: 12
      });
    } else {
      // Multi-año
      const mesesTotales = (yearFin - yearInicio) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth()) + 1;

      for (let year = yearInicio; year <= yearFin; year++) {
        let mesesEnAño = 0;

        if (year === yearInicio) {
          mesesEnAño = 12 - fechaInicio.getMonth();
        } else if (year === yearFin) {
          mesesEnAño = fechaFin.getMonth() + 1;
        } else {
          mesesEnAño = 12;
        }

        const proporcion = mesesEnAño / mesesTotales;

        if (!proyectosPorAnio[year]) proyectosPorAnio[year] = [];
        proyectosPorAnio[year].push({
          ...proyecto,
          pesoKgProporcional: proyecto.pesoKg ? proyecto.pesoKg * proporcion : null,
          esMultiAnio: true,
          mesesEnAnio: mesesEnAño,
          yearInicio,
          yearFin
        });
      }
    }
  });

  // Analizar cada año
  const años = Object.keys(proyectosPorAnio).sort((a, b) => Number(a) - Number(b));

  for (const año of años) {
    const proyectosAño = proyectosPorAnio[año];
    const proyectosUnicos = new Set(proyectosAño.map(p => p.id)).size;

    // Toneladas proporcionales
    const toneladasProporcionales = Math.round(
      proyectosAño.reduce((sum, p) => sum + (p.pesoKgProporcional ? Number(p.pesoKgProporcional) / 1000 : 0), 0)
    );

    // Proyectos multi-año que inician, continúan o terminan
    const multiAnioInician = proyectosAño.filter(p => p.esMultiAnio && p.yearInicio === Number(año));
    const multiAnioContinuan = proyectosAño.filter(p => p.esMultiAnio && p.yearInicio < Number(año) && p.yearFin > Number(año));
    const multiAnioTerminan = proyectosAño.filter(p => p.esMultiAnio && p.yearFin === Number(año) && p.yearInicio < Number(año));

    // Análisis de tipos de proyecto
    const tiposProyecto = {};
    proyectosAño.forEach(p => {
      const tipo = identificarTipo(p.objetoContrato, p.entidadContratante);
      tiposProyecto[tipo] = (tiposProyecto[tipo] || 0) + 1;
    });

    // Top 3 tipos
    const topTipos = Object.entries(tiposProyecto)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tipo, count]) => `${tipo} (${count})`);

    // Clientes principales
    const clientes = {};
    proyectosAño.forEach(p => {
      const cliente = p.entidadContratante.substring(0, 30);
      clientes[cliente] = (clientes[cliente] || 0) + 1;
    });
    const topClientes = Object.entries(clientes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cliente]) => cliente);

    // Ubicaciones principales
    const ubicaciones = {};
    proyectosAño.forEach(p => {
      const ub = p.ubicacion || 'Colombia';
      ubicaciones[ub] = (ubicaciones[ub] || 0) + 1;
    });
    const topUbicaciones = Object.entries(ubicaciones)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([ub]) => ub);

    // Proyectos destacados (por peso)
    const destacados = proyectosAño
      .filter(p => p.pesoKg)
      .sort((a, b) => (b.pesoKg || 0) - (a.pesoKg || 0))
      .slice(0, 3);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`📅 AÑO ${año}`);
    console.log(`${'='.repeat(80)}`);

    console.log(`\n📊 ESTADÍSTICAS:`);
    console.log(`   • Total proyectos únicos: ${proyectosUnicos}`);
    console.log(`   • Total apariciones: ${proyectosAño.length} (incluyendo multi-año)`);
    console.log(`   • Toneladas proporcionales: ${toneladasProporcionales} ton`);

    if (multiAnioInician.length > 0 || multiAnioContinuan.length > 0 || multiAnioTerminan.length > 0) {
      console.log(`\n🔄 PROYECTOS MULTI-AÑO:`);
      if (multiAnioInician.length > 0) {
        console.log(`   • Inician en ${año}: ${multiAnioInician.length} proyectos`);
      }
      if (multiAnioContinuan.length > 0) {
        console.log(`   • Continúan de años anteriores: ${multiAnioContinuan.length} proyectos`);
      }
      if (multiAnioTerminan.length > 0) {
        console.log(`   • Terminan en ${año}: ${multiAnioTerminan.length} proyectos`);
      }
    }

    console.log(`\n🏗️  TIPOS DE PROYECTO:`);
    topTipos.forEach(tipo => console.log(`   • ${tipo}`));

    console.log(`\n👥 PRINCIPALES CLIENTES:`);
    topClientes.forEach(cliente => console.log(`   • ${cliente}`));

    console.log(`\n📍 UBICACIONES PRINCIPALES:`);
    topUbicaciones.forEach(ub => console.log(`   • ${ub}`));

    if (destacados.length > 0) {
      console.log(`\n⭐ PROYECTOS DESTACADOS (por tonelaje):`);
      destacados.forEach((p, i) => {
        const toneladas = Math.round((p.pesoKg || 0) / 1000);
        console.log(`   ${i + 1}. ${p.entidadContratante} - ${p.objetoContrato.substring(0, 60)}...`);
        console.log(`      ${toneladas} ton ${p.esMultiAnio ? `(multi-año: ${p.yearInicio}-${p.yearFin})` : ''}`);
      });
    }

    console.log(`\n💡 SUGERENCIA DE TÍTULO:`);
    const tituloSugerido = generarTitulo(topTipos, toneladasProporcionales, proyectosUnicos);
    console.log(`   "${tituloSugerido}"`);
  }

  await prisma.$disconnect();
})();

function identificarTipo(objetoContrato, entidadContratante) {
  const texto = `${objetoContrato} ${entidadContratante}`.toLowerCase();

  if (texto.includes('puente') || texto.includes('viaducto')) return 'Puentes';
  if (texto.includes('bodega') || texto.includes('almacen')) return 'Bodegas Industriales';
  if (texto.includes('planta') || texto.includes('fabrica')) return 'Plantas Industriales';
  if (texto.includes('edificio') || texto.includes('torre')) return 'Edificios';
  if (texto.includes('cubierta') || texto.includes('techo')) return 'Cubiertas';
  if (texto.includes('centro comercial') || texto.includes('mall')) return 'Centros Comerciales';
  if (texto.includes('coliseo') || texto.includes('estadio') || texto.includes('escenario')) return 'Escenarios Deportivos';
  if (texto.includes('porteria') || texto.includes('porton')) return 'Porterías';
  if (texto.includes('estructura metalica') || texto.includes('estructuras metalicas')) return 'Estructuras Metálicas';
  if (texto.includes('fachada') || texto.includes('cerramiento')) return 'Fachadas y Cerramientos';

  return 'Estructuras Metálicas';
}

function generarTitulo(topTipos, toneladas, numProyectos) {
  const tipo1 = topTipos[0]?.split(' (')[0] || 'Estructuras Metálicas';
  const tipo2 = topTipos[1]?.split(' (')[0];

  if (toneladas > 3000) {
    return `${tipo1} de Gran Envergadura`;
  } else if (toneladas > 2000) {
    return tipo2 ? `${tipo1} y ${tipo2}` : tipo1;
  } else if (toneladas > 1000) {
    return tipo2 ? `${tipo1} y ${tipo2}` : tipo1;
  } else if (numProyectos > 15) {
    return `Alta Actividad en ${tipo1}`;
  } else {
    return tipo2 ? `${tipo1} y ${tipo2}` : tipo1;
  }
}
