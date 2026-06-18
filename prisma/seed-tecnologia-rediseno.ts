/**
 * Seed — Rediseño de /procesos-tecnologias (junio 2026)
 *
 * - 6 fases del flujo digital "del modelo al acero" (FaseFlujoTecnologia, nuevo)
 * - Grupo de sección "flujo" + reorden y textos de grupos existentes
 * - Software: imagen → logo oficial (Tekla) o null (wordmark en placa blanca);
 *   AutoCAD gana descripción
 * - Equipos: fotos reales de planta/proyectos en lugar de stock
 * - Procesos digitales: contenido real del sistema propio + nuevo
 *   "Gestión de producción en tiempo real"
 *
 * Idempotente: lo nuevo con upsert create-only (`update: {}`); los updates de
 * contenido canónico son deliberados y re-ejecutables. Nada se borra.
 *
 * Ejecutar: npx tsx prisma/seed-tecnologia-rediseno.ts
 */

import { prisma } from "../lib/prisma"

const IMG_CNC = "https://storage.googleapis.com/meisa-imagenes/site/about/planta-produccion.webp"
const IMG_IZAJE =
  "https://storage.googleapis.com/meisa-imagenes/site/demo/15-puente-grua-amarilla-horizontal.jpg"
const IMG_ESPECIALIZADOS =
  "https://storage.googleapis.com/meisa-imagenes/stock-brochure/plantas/1777069672231-8olzkm-Bodega_MEISA_Villa_Rica.jpg"
const IMG_GESTION =
  "https://storage.googleapis.com/meisa-imagenes/site/demo/04-montaje-grua-horizontal.jpg"

/* ------------------------------------------------------------------ */
/*  Fases del flujo digital                                            */
/* ------------------------------------------------------------------ */

const FASES = [
  {
    slug: "modelado-bim",
    titulo: "Modelado BIM",
    descripcion:
      "Cada proyecto nace como un modelo 3D inteligente: geometría, conexiones, pernos y marca única de cada pieza quedan definidos antes de fabricar.",
    herramientas: ["Tekla Structures", "AutoCAD"],
    orden: 0,
  },
  {
    slug: "analisis-estructural",
    titulo: "Análisis estructural",
    descripcion:
      "El modelo se verifica con software especializado: cargas, sismo según NSR-10, deflexiones y diseño de conexiones con análisis CBFEM.",
    herramientas: ["ETABS", "SAP2000", "Midas", "SAFE", "IDEA StatiCa"],
    orden: 1,
  },
  {
    slug: "planos-de-taller",
    titulo: "Planos de taller y despiece",
    descripcion:
      "Del modelo aprobado salen directamente los planos de taller, listas de materiales y despieces — sin transcripciones manuales que introduzcan errores.",
    herramientas: ["Tekla Structures"],
    orden: 2,
  },
  {
    slug: "nesting-y-corte",
    titulo: "Nesting y corte CNC",
    descripcion:
      "Los despieces se optimizan para aprovechar al máximo cada lámina y se envían directo a las mesas de corte por control numérico.",
    herramientas: ["FastCAM", "3 mesas CNC"],
    orden: 3,
  },
  {
    slug: "gestion-de-produccion",
    titulo: "Gestión de producción",
    descripcion:
      "La fabricación se programa y controla pieza por pieza, con avance reportado en tiempo real desde la planta e integración con el ERP corporativo.",
    herramientas: ["Sistema propio MEISA"],
    orden: 4,
  },
  {
    slug: "montaje-y-liberacion",
    titulo: "Montaje y liberación",
    descripcion:
      "Cada conjunto llega a obra identificado con su código QR y se monta con equipos propios. La liberación final queda registrada digitalmente.",
    herramientas: ["8 puentes grúa", "Trazabilidad QR"],
    orden: 5,
  },
]

/* ------------------------------------------------------------------ */
/*  Grupos                                                             */
/* ------------------------------------------------------------------ */

const GRUPO_FLUJO = {
  clave: "flujo",
  titulo: "Del modelo al acero",
  subtitulo: "Un solo hilo digital",
  descripcion:
    "El modelo BIM que aprueba el cliente es el mismo que corta la lámina, programa la producción y libera cada pieza en obra. Seis fases conectadas, cero retranscripciones.",
  orden: 0,
}

const GRUPOS_ACTUALIZAR = [
  { clave: "diseno-analisis", data: { orden: 1 } },
  { clave: "fabricacion-montaje", data: { orden: 2 } },
  {
    clave: "control-digital",
    data: {
      orden: 3,
      subtitulo: "Sistema propio de producción y calidad",
      descripcion:
        "Software desarrollado por MEISA conecta la planta con la oficina y con el cliente: avance en tiempo real, evidencia de cada inspección y trazabilidad pieza por pieza.",
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Software (tecnologías)                                             */
/* ------------------------------------------------------------------ */

// imagen: logo oficial si existe en /public/images/software/, null → la página
// renderiza un wordmark tipográfico sobre placa blanca. Subir más logos desde
// el admin (campo Imagen) cuando se consigan.
const TECNOLOGIAS_IMAGEN: Record<string, string | null> = {
  "tekla-structures": "/images/software/tekla.svg",
  autocad: null,
  safe: null,
  etabs: null,
  sap2000: null,
  midas: null,
  "dc-cad": null,
  "idea-statica": "/images/software/idea-statica.svg",
  fastcam: "/images/software/fastcam.png",
}

const TECNOLOGIAS_DESCRIPCION: Record<string, string> = {
  autocad:
    "Diseño técnico 2D/3D para planos de detalle y complemento del flujo BIM.",
}

/* ------------------------------------------------------------------ */
/*  Equipos                                                            */
/* ------------------------------------------------------------------ */

const EQUIPOS_ACTUALIZAR = [
  { slug: "mesas-cnc", data: { imagen: IMG_CNC } },
  { slug: "puentes-grua", data: { imagen: IMG_IZAJE } },
  { slug: "especializados", data: { imagen: IMG_ESPECIALIZADOS } },
]

/* ------------------------------------------------------------------ */
/*  Procesos digitales                                                 */
/* ------------------------------------------------------------------ */

const PROCESOS_ACTUALIZAR = [
  {
    slug: "trazabilidad-qr",
    data: {
      descripcion:
        "Cada pieza y conjunto lleva una etiqueta QR única que concentra su historial completo de fabricación.",
      beneficios: [
        "Historial de cada pieza: materia prima, soldadura, ensayos y pintura",
        "Verificación pública del documento escaneando el código",
        "Ubicación y estado de cada conjunto en tiempo real",
      ],
      orden: 0,
    },
  },
  {
    slug: "reportes-digitales",
    data: {
      descripcion:
        "La producción y las inspecciones se reportan desde la planta en dispositivos móviles, con evidencia fotográfica y firma digital.",
      beneficios: [
        "Informes de avance en tiempo real por proyecto y conjunto",
        "Evidencia fotográfica y firma digital en cada inspección",
        "Apps de planta que funcionan sin conexión y sincronizan solas",
      ],
      orden: 1,
    },
  },
  {
    slug: "dossier-digital",
    data: { orden: 3 },
  },
]

const PROCESO_GESTION = {
  slug: "gestion-produccion",
  nombre: "Gestión de Producción en Tiempo Real",
  descripcion:
    "Un sistema propio conecta ingeniería, planta y obra: programación de fabricación, avance por etapa (armado, soldadura, pintura) y liberaciones digitales.",
  beneficios: [
    "Avance por conjunto y por etapa visible al instante",
    "Notificaciones automáticas entre producción y calidad",
    "Integración con el ERP corporativo: compras e inventario conectados",
  ],
  imagen: IMG_GESTION,
  orden: 2,
}

/* ------------------------------------------------------------------ */

async function main() {
  // 1. Fases del flujo (create-only)
  for (const f of FASES) {
    await prisma.faseFlujoTecnologia.upsert({
      where: { slug: f.slug },
      update: {},
      create: { activo: true, ...f },
    })
  }
  console.log(`✓ Fases del flujo: ${FASES.length}`)

  // 2. Grupo flujo (create-only) + grupos existentes (update deliberado)
  await prisma.grupoSeccion.upsert({
    where: { pagina_clave: { pagina: "tecnologia", clave: "flujo" } },
    update: {},
    create: { pagina: "tecnologia", activo: true, ...GRUPO_FLUJO },
  })
  for (const g of GRUPOS_ACTUALIZAR) {
    await prisma.grupoSeccion.updateMany({
      where: { pagina: "tecnologia", clave: g.clave },
      data: g.data,
    })
  }
  console.log("✓ Grupos: flujo creado + 3 actualizados")

  // 3. Software: imágenes → logos/wordmark + descripción faltante
  for (const [slug, imagen] of Object.entries(TECNOLOGIAS_IMAGEN)) {
    await prisma.tecnologia.updateMany({ where: { slug }, data: { imagen } })
  }
  for (const [slug, descripcion] of Object.entries(TECNOLOGIAS_DESCRIPCION)) {
    await prisma.tecnologia.updateMany({ where: { slug }, data: { descripcion } })
  }
  console.log("✓ Software: imágenes y descripciones actualizadas")

  // 4. Equipos: fotos reales
  for (const e of EQUIPOS_ACTUALIZAR) {
    await prisma.equipo.updateMany({ where: { slug: e.slug }, data: e.data })
  }
  console.log("✓ Equipos: fotos actualizadas")

  // 5. Procesos digitales: contenido real + nuevo proceso
  for (const p of PROCESOS_ACTUALIZAR) {
    await prisma.procesoDigital.updateMany({ where: { slug: p.slug }, data: p.data })
  }
  await prisma.procesoDigital.upsert({
    where: { slug: PROCESO_GESTION.slug },
    update: {},
    create: { activo: true, ...PROCESO_GESTION },
  })
  console.log("✓ Procesos digitales: 3 actualizados + gestion-produccion")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
