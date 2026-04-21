/**
 * Seed de /procesos-tecnologias (tecnologia) y /calidad (políticas y SIG).
 *
 * Migra los arrays hardcoded de:
 *   - app/(public)/tecnologia/TecnologiaContent.tsx (tecnologiaSections, softwareCategories, equipmentCategories, digitalProcesses)
 *   - app/(public)/calidad/CalidadContent.tsx (calidadSections, sigComponents, policies)
 *
 * Idempotente. Correr: npx tsx prisma/seed-tecnologia-politicas.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/* ------------------------------------------------------------------ */
/*  GrupoSeccion — headings de las sub-secciones                      */
/* ------------------------------------------------------------------ */

const GRUPOS = [
  // /procesos-tecnologias
  {
    pagina: "tecnologia",
    clave: "diseno-analisis",
    titulo: "Diseño y Análisis",
    subtitulo: "Modelado BIM + Análisis estructural integrado",
    descripcion:
      "Utilizamos las herramientas BIM y de análisis estructural más avanzadas para diseño, coordinación multidisciplinaria y verificación de estructuras.",
    icono: "Monitor",
    orden: 0,
  },
  {
    pagina: "tecnologia",
    clave: "fabricacion-montaje",
    titulo: "Fabricación y Montaje",
    subtitulo: "Tecnologías CNC + Equipos de montaje especializados",
    descripcion:
      "Tecnologías avanzadas para fabricación de precisión y montaje de estructuras metálicas con equipamiento especializado distribuido en nuestras plantas.",
    icono: "Settings",
    orden: 1,
  },
  {
    pagina: "tecnologia",
    clave: "control-digital",
    titulo: "Control Digital",
    subtitulo: "Trazabilidad QR y calidad certificada",
    descripcion:
      "Sistemas digitales integrados que garantizan calidad y trazabilidad completa en cada proceso productivo.",
    icono: "Gauge",
    orden: 2,
  },
  // /calidad
  {
    pagina: "calidad",
    clave: "sig",
    titulo: "Sistema SIG",
    subtitulo: "Cuatro pilares de la excelencia",
    descripcion:
      "Nuestro SIG integra cuatro pilares fundamentales que aseguran la excelencia operacional.",
    icono: "Shield",
    colorGradient: "from-blue-500 to-blue-600",
    orden: 0,
  },
  {
    pagina: "calidad",
    clave: "politicas",
    titulo: "Políticas Corporativas",
    subtitulo: "Marco de actuación empresarial",
    descripcion:
      "Nuestras políticas definen el marco de actuación y los compromisos con todos nuestros grupos de interés.",
    icono: "Eye",
    colorGradient: "from-purple-500 to-purple-600",
    orden: 1,
  },
  {
    pagina: "calidad",
    clave: "cumplimiento",
    titulo: "Cumplimiento Normativo",
    subtitulo: "Estándares internacionales",
    descripcion:
      "Cumplimos rigurosamente con las normas técnicas más exigentes del sector metalmecánico.",
    icono: "FileCheck",
    colorGradient: "from-green-500 to-green-600",
    orden: 2,
  },
  {
    pagina: "calidad",
    clave: "control-calidad",
    titulo: "Control de Calidad",
    subtitulo: "Excelencia en cada etapa",
    descripcion:
      "Implementamos controles rigurosos en cada etapa del proceso para garantizar los más altos estándares.",
    icono: "Settings",
    colorGradient: "from-orange-500 to-orange-600",
    orden: 3,
  },
]

/* ------------------------------------------------------------------ */
/*  Tecnologia (software)                                             */
/* ------------------------------------------------------------------ */

const TECNOLOGIAS = [
  // BIM / Diseño
  {
    slug: "tekla-structures",
    categoria: "bim-diseno",
    nombre: "Trimble Tekla Structures",
    especialidad: "Líder mundial en BIM para estructuras",
    descripcion:
      "Software BIM líder mundial en estructuras metálicas y de concreto",
    imagen: "/images/servicios/consultoria-1.jpg",
  },
  {
    slug: "autocad",
    categoria: "bim-diseno",
    nombre: "AutoCAD",
    especialidad: "Diseño técnico 2D/3D",
    imagen: "/images/servicios/consultoria-2.jpg",
  },
  {
    slug: "safe",
    categoria: "bim-diseno",
    nombre: "SAFE",
    especialidad: "Análisis y diseño de losas y cimentaciones",
    descripcion:
      "Software especializado para el análisis y diseño de sistemas de losas y cimentaciones",
  },
  // Análisis estructural
  {
    slug: "etabs",
    categoria: "analisis-estructural",
    nombre: "ETABS",
    especialidad: "Análisis de edificios y estructuras complejas",
    descripcion:
      "Software de análisis y diseño estructural de edificios líder en la industria",
    imagen: "/images/servicios/consultoria-4.jpg",
  },
  {
    slug: "sap2000",
    categoria: "analisis-estructural",
    nombre: "SAP2000",
    especialidad: "Análisis universal de estructuras",
    descripcion:
      "Programa de análisis estructural y diseño para todo tipo de estructuras",
    imagen: "/images/servicios/consultoria-3.jpg",
  },
  {
    slug: "midas",
    categoria: "analisis-estructural",
    nombre: "Midas",
    especialidad: "BIM integrado + análisis avanzado",
    descripcion:
      "Software avanzado de análisis y diseño estructural con capacidades BIM integradas",
  },
  {
    slug: "dc-cad",
    categoria: "analisis-estructural",
    nombre: "DC-CAD Vigas y Columnas",
    especialidad: "Concreto reforzado",
    descripcion:
      "Software especializado para el diseño de elementos estructurales de concreto reforzado",
  },
  // Conexiones
  {
    slug: "idea-statica",
    categoria: "conexiones",
    nombre: "IDEA StatiCa Connection",
    especialidad: "Conexiones complejas con análisis CBFEM",
    descripcion:
      "Software revolucionario para el diseño y verificación de conexiones de acero",
    imagen: "/images/servicios/gestion-1.jpg",
  },
  // Otros
  {
    slug: "strumis",
    categoria: "otro",
    nombre: "StruM.I.S",
    especialidad: "Gestión integral de producción",
    descripcion:
      "Software líder mundial en gestión integral y control de producción para fabricantes de estructuras metálicas",
  },
  {
    slug: "fastcam",
    categoria: "otro",
    nombre: "FastCAM",
    especialidad: "Software de corte Plasma y Oxicorte",
    descripcion:
      "Proveedor líder de software de ingeniería para máquinas de corte por Plasma y Oxicorte",
  },
]

/* ------------------------------------------------------------------ */
/*  Equipos (3 categorías: corte-cnc, izaje, especializados)         */
/* ------------------------------------------------------------------ */

const EQUIPOS = [
  {
    slug: "mesas-cnc",
    categoria: "corte-cnc",
    nombre: "Corte CNC",
    descripcion: "Mesas de corte automatizado de precisión",
    specs: [
      "3 Mesas CNC distribuidas estratégicamente",
      "Control numérico computarizado",
      "Precisión milimétrica garantizada",
      "Corte hasta 150mm de espesor",
    ],
    imagen: "/images/equipo/equipo-industrial-1.jpg",
  },
  {
    slug: "puentes-grua",
    categoria: "izaje",
    nombre: "Equipos de Izaje",
    descripcion: "Sistemas de manejo de cargas pesadas",
    specs: [
      "8 Puentes grúa en total",
      "5 en Planta Popayán",
      "3 en Planta Jamundí",
      "Capacidades de 5 a 20 toneladas",
    ],
    imagen: "/images/general/industria-general.jpg",
  },
  {
    slug: "especializados",
    categoria: "especializados",
    nombre: "Equipos Especializados",
    descripcion: "Maquinaria especializada para procesos únicos",
    specs: [
      "Granalladora industrial",
      "Ensambladora de perfiles",
      "Curvadora de tejas especializada",
      "Sistemas de soldadura certificados",
    ],
    imagen: "/images/servicios/fabricacion-1.jpg",
  },
]

/* ------------------------------------------------------------------ */
/*  Procesos digitales                                                */
/* ------------------------------------------------------------------ */

const PROCESOS_DIGITALES = [
  {
    slug: "trazabilidad-qr",
    nombre: "Trazabilidad QR",
    descripcion: "Seguimiento completo mediante códigos QR",
    beneficios: [
      "Historial completo de cada pieza",
      "Ubicación en tiempo real",
      "Control de calidad digital",
    ],
    imagen: "/images/servicios/gestion-2.jpg",
  },
  {
    slug: "reportes-digitales",
    nombre: "Reportes Digitales",
    descripcion: "Documentación automática de procesos",
    beneficios: [
      "Informes en tiempo real",
      "Evidencia fotográfica",
      "Certificación digital",
    ],
    imagen: "/images/servicios/gestion-3.jpg",
  },
]

/* ------------------------------------------------------------------ */
/*  Pilares SIG                                                       */
/* ------------------------------------------------------------------ */

const PILARES = [
  {
    slug: "gestion-calidad",
    titulo: "Gestión de Calidad",
    descripcion:
      "Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios",
    icono: "Award",
    colorGradient: "from-blue-500 to-blue-600",
  },
  {
    slug: "seguridad-salud",
    titulo: "Seguridad y Salud Ocupacional",
    descripcion:
      "Protección integral de colaboradores, contratistas y visitantes",
    icono: "Shield",
    colorGradient: "from-green-500 to-green-600",
  },
  {
    slug: "gestion-ambiental",
    titulo: "Gestión Ambiental",
    descripcion:
      "Compromiso con el desarrollo sostenible y la protección del medio ambiente",
    icono: "Leaf",
    colorGradient: "from-green-600 to-green-700",
  },
  {
    slug: "gestion-riesgos",
    titulo: "Gestión de Riesgos",
    descripcion:
      "Identificación, evaluación y control de riesgos en todos los procesos",
    icono: "AlertTriangle",
    colorGradient: "from-orange-500 to-orange-600",
  },
]

/* ------------------------------------------------------------------ */
/*  Políticas corporativas                                            */
/* ------------------------------------------------------------------ */

const POLITICAS = [
  {
    slug: "calidad-total",
    titulo: "Política de Calidad Total",
    descripcion:
      "Adoptamos la Calidad Total como valor estratégico fundamental",
    compromisos: [
      "Satisfacer plenamente las necesidades y expectativas de clientes",
      "Cumplir requisitos reglamentarios aplicables",
      "Prevenir defectos y no conformidades",
      "Mejorar continuamente nuestros procesos",
      "Proporcionar recursos necesarios para el SIG",
    ],
  },
  {
    slug: "seguridad-salud-trabajo",
    titulo: "Política de Seguridad y Salud en el Trabajo",
    descripcion: "Compromiso integral con la seguridad de nuestro equipo",
    compromisos: [
      "Protección integral de colaboradores, contratistas y visitantes",
      "Identificación, evaluación y control de riesgos laborales",
      "Prevención proactiva de riesgos laborales",
      "Cumplimiento de normatividad nacional vigente",
      "Condiciones laborales seguras y saludables",
    ],
  },
  {
    slug: "transparencia-etica",
    titulo: "Política de Transparencia y Ética Empresarial",
    descripcion:
      "Integridad y transparencia en todas nuestras operaciones",
    compromisos: [
      "Programa para mitigar riesgos de corrupción y soborno",
      "Canal ético para reportes confidenciales",
      "Declaración de conflictos de interés",
      "Compromiso con la integridad empresarial",
      "Cero tolerancia a prácticas indebidas",
    ],
  },
  {
    slug: "sarlaft",
    titulo: "Política Antilavado de Activos (SARLAFT)",
    descripcion: "Cumplimiento riguroso de normativas SARLAFT",
    compromisos: [
      "Mitigación del riesgo de LA/FT",
      "Debida diligencia en relaciones comerciales",
      "Reporte de operaciones sospechosas",
      "Cumplimiento normativo SARLAFT",
      "Capacitación continua del personal",
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Execution                                                         */
/* ------------------------------------------------------------------ */

async function main() {
  // GrupoSeccion (compound unique)
  for (let i = 0; i < GRUPOS.length; i++) {
    const g = GRUPOS[i]
    await prisma.grupoSeccion.upsert({
      where: { pagina_clave: { pagina: g.pagina, clave: g.clave } },
      create: { ...g, activo: true },
      update: { ...g },
    })
  }
  console.log(`✓ ${GRUPOS.length} grupos de sección`)

  // Tecnologias
  for (let i = 0; i < TECNOLOGIAS.length; i++) {
    const t = TECNOLOGIAS[i]
    await prisma.tecnologia.upsert({
      where: { slug: t.slug },
      create: { ...t, orden: i, activo: true },
      update: { ...t, orden: i },
    })
  }
  console.log(`✓ ${TECNOLOGIAS.length} tecnologías`)

  // Equipos
  for (let i = 0; i < EQUIPOS.length; i++) {
    const e = EQUIPOS[i]
    await prisma.equipo.upsert({
      where: { slug: e.slug },
      create: { ...e, orden: i, activo: true },
      update: { ...e, orden: i },
    })
  }
  console.log(`✓ ${EQUIPOS.length} equipos`)

  // ProcesoDigital
  for (let i = 0; i < PROCESOS_DIGITALES.length; i++) {
    const p = PROCESOS_DIGITALES[i]
    await prisma.procesoDigital.upsert({
      where: { slug: p.slug },
      create: { ...p, orden: i, activo: true },
      update: { ...p, orden: i },
    })
  }
  console.log(`✓ ${PROCESOS_DIGITALES.length} procesos digitales`)

  // PilarSIG
  for (let i = 0; i < PILARES.length; i++) {
    const p = PILARES[i]
    await prisma.pilarSIG.upsert({
      where: { slug: p.slug },
      create: { ...p, orden: i, activo: true },
      update: { ...p, orden: i },
    })
  }
  console.log(`✓ ${PILARES.length} pilares SIG`)

  // Politicas
  for (let i = 0; i < POLITICAS.length; i++) {
    const p = POLITICAS[i]
    await prisma.politica.upsert({
      where: { slug: p.slug },
      create: { ...p, orden: i, activo: true },
      update: { ...p, orden: i },
    })
  }
  console.log(`✓ ${POLITICAS.length} políticas corporativas`)

  console.log("\n✅ Tecnología + Políticas seed completado")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
