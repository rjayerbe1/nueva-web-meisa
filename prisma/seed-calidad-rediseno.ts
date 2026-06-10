/**
 * Seed — Rediseño de /calidad (junio 2026)
 *
 * Contenido real del proceso de calidad de MEISA: 7 etapas de control con
 * puntos, sección de trazabilidad digital, normas ampliadas y textos de grupos.
 *
 * Idempotente y anti-clobber:
 *  - Lo NUEVO se crea con upsert + `update: {}` (re-ejecutar no pisa ediciones del admin).
 *  - Solo se actualizan deliberadamente los textos canónicos de grupos existentes,
 *    las descripciones de las 4 normas viejas y la descripción del RUC.
 *  - Nada se borra: las 4 etapas viejas quedan `activo: false`.
 *
 * Ejecutar: npx tsx prisma/seed-calidad-rediseno.ts
 */

import { prisma } from "../lib/prisma"

const IMG_TRAZABILIDAD_BREAK =
  "https://storage.googleapis.com/meisa-imagenes/projects/industria-bodega-duplex/bodega-duplex-01-industria-bodega-duplex-01-Industria-bodega-duplex-1-1600x1600.webp"
const IMG_DOSSIER =
  "https://storage.googleapis.com/meisa-imagenes/projects/industria-ampliacion-cargill/ampliacion-cargill-02-industria-ampliacion-cargill-02-Industria-ampliacion-cargill-2-1600x1600.webp"

/* ------------------------------------------------------------------ */
/*  Grupos de sección (página calidad)                                 */
/* ------------------------------------------------------------------ */

const GRUPOS_NUEVOS = [
  {
    clave: "intro",
    titulo: "Calidad\nverificable",
    subtitulo: "01 — Sistema Integrado de Gestión",
    descripcion:
      "En MEISA la calidad no es una declaración: es un sistema documentado que acompaña cada pieza desde el certificado de colada de la materia prima hasta el dossier final entregado al cliente. Soldadores calificados bajo AWS D1.1, procedimientos WPS/PQR propios, inspección CWI y ensayos no destructivos sustentan cada liberación — con evidencia trazable, disponible para interventorías y procesos de licitación.",
    orden: 1,
  },
  {
    clave: "trazabilidad",
    titulo: "Trazabilidad\ndigital",
    subtitulo: "Sistema digital de calidad",
    descripcion:
      "Cada pieza fabricada en MEISA lleva un código QR que concentra su historial completo: materia prima, soldadura, ensayos, pintura y liberación. La interventoría no espera un dossier al final de la obra — lo consulta mientras la fabricación avanza.",
    imagenFondo: IMG_TRAZABILIDAD_BREAK,
    orden: 4,
  },
]

const GRUPOS_ACTUALIZAR = [
  {
    clave: "control-calidad",
    data: {
      subtitulo: "Del certificado de colada a la liberación final",
      descripcion:
        "Cada proyecto avanza a través de siete etapas de control documentadas. Ninguna pieza pasa a la siguiente fase sin verificación registrada.",
      orden: 3,
    },
  },
  {
    clave: "cumplimiento",
    data: {
      subtitulo: "Certificación y normas de referencia",
      descripcion:
        "Diseñamos, fabricamos y montamos bajo los códigos que rigen la construcción en acero en Colombia y los estándares internacionales de soldadura, materiales y recubrimientos.",
      orden: 5,
    },
  },
  { clave: "hero", data: { orden: 0 } },
  { clave: "sig", data: { orden: 2 } },
  { clave: "politicas", data: { orden: 6 } },
]

/* ------------------------------------------------------------------ */
/*  Etapas de control de calidad (7 nuevas)                            */
/* ------------------------------------------------------------------ */

const ETAPAS_VIEJAS = ["diseno", "fabricacion", "montaje", "liberacion"]

const ETAPAS = [
  {
    slug: "ingenieria-y-diseno",
    titulo: "Ingeniería y diseño",
    descripcion:
      "Toda fabricación parte de planos de taller revisados y aprobados. La ingeniería de detalle define juntas, tolerancias y secuencias de armado antes de cortar el primer perfil.",
    puntos: [
      "Revisión y aprobación de planos de taller antes de liberar a producción",
      "Definición de juntas y símbolos de soldadura según AWS D1.1",
      "Listas de materiales y despieces con marca única por elemento",
      "Control de revisiones: solo planos vigentes circulan en planta",
    ],
    orden: 0,
  },
  {
    slug: "recepcion-materia-prima",
    titulo: "Recepción de materia prima",
    descripcion:
      "Cada lote de acero ingresa con su certificado de calidad de siderúrgica y queda vinculado a las piezas que se fabrican con él.",
    puntos: [
      "Verificación de certificados de calidad de siderúrgica contra orden de compra",
      "Trazabilidad de colada: cada pieza asociada a su certificado de origen",
      "Inspección visual y dimensional de perfiles, láminas y conectores",
      "Segregación e identificación de material no conforme",
    ],
    orden: 1,
  },
  {
    slug: "corte-y-armado",
    titulo: "Corte y armado",
    descripcion:
      "El control dimensional acompaña el corte y el armado de conjuntos: cada pieza se verifica contra plano antes de autorizar la soldadura definitiva.",
    puntos: [
      "Verificación dimensional de piezas cortadas contra planos de taller",
      "Control de escuadría, contraflechas y tolerancias de armado",
      "Punteo y presentación de conjuntos verificados antes de soldadura final",
      "Identificación de cada conjunto con su marca de fabricación",
    ],
    orden: 2,
  },
  {
    slug: "soldadura-calificada",
    titulo: "Soldadura calificada",
    descripcion:
      "Soldamos bajo procedimientos WPS respaldados por registros de calificación PQR propios, ejecutados por soldadores calificados y supervisados por inspector CWI.",
    puntos: [
      "Procedimientos de soldadura WPS soportados en registros PQR",
      "Soldadores calificados bajo AWS D1.1 con registro WPQ vigente",
      "Supervisión de inspector de soldadura certificado CWI",
      "Control de material de aporte, precalentamiento y parámetros de aplicación",
    ],
    orden: 3,
  },
  {
    slug: "ensayos-no-destructivos",
    titulo: "Ensayos no destructivos",
    descripcion:
      "Las soldaduras se verifican mediante ensayos no destructivos según el tipo de junta y los requisitos del proyecto.",
    puntos: [
      "Inspección visual (VT) al 100% de las soldaduras",
      "Tintas penetrantes (PT) para discontinuidades superficiales",
      "Ultrasonido (UT) en juntas a tope y de penetración completa",
      "Criterios de aceptación según AWS D1.1 y especificación del proyecto",
      "Registro de resultados vinculado a cada conjunto inspeccionado",
    ],
    orden: 4,
  },
  {
    slug: "limpieza-y-pintura",
    titulo: "Limpieza y pintura",
    descripcion:
      "La preparación de superficie con granalla y el sistema de recubrimiento se controlan con mediciones instrumentadas, registradas por conjunto.",
    puntos: [
      "Granallado con verificación de grado de limpieza y perfil de anclaje (SSPC)",
      "Medición de espesores de película seca por capa aplicada",
      "Pruebas de adherencia y continuidad según especificación del proyecto",
      "Inspección final de acabado antes de despacho",
    ],
    orden: 5,
  },
  {
    slug: "liberacion-y-dossier",
    titulo: "Liberación y dossier digital",
    descripcion:
      "Cada conjunto se libera digitalmente con su evidencia completa. El dossier de calidad se construye durante la fabricación — no al final — y el cliente lo consulta en tiempo real.",
    puntos: [
      "Liberación digital por conjunto con evidencia fotográfica",
      "Dossier digital: certificados de materia prima, ensayos, espesores y liberaciones",
      "Acceso del cliente y la interventoría en tiempo real",
      "Historial completo de cada pieza consultable por código QR",
    ],
    orden: 6,
  },
]

/* ------------------------------------------------------------------ */
/*  Normas (8)                                                         */
/* ------------------------------------------------------------------ */

const NORMAS_ACTUALIZAR = [
  {
    codigo: "NSR-10",
    descripcion:
      "Reglamento Colombiano de Construcción Sismo Resistente. Título F: diseño, fabricación y montaje de estructuras de acero.",
    categoria: "Diseño estructural",
    logo: null,
    orden: 0,
  },
  {
    codigo: "AWS D1.1",
    descripcion:
      "Structural Welding Code — Steel. Rige procedimientos, calificación de soldadores e inspección de soldadura estructural.",
    categoria: "Soldadura",
    logo: null,
    orden: 1,
  },
  {
    codigo: "AISC 360",
    descripcion:
      "Specification for Structural Steel Buildings. Especificación para el diseño y construcción de edificaciones en acero.",
    categoria: "Diseño estructural",
    logo: null,
    orden: 2,
  },
  {
    codigo: "NTC",
    descripcion:
      "Normas Técnicas Colombianas (ICONTEC) aplicables a materiales, soldadura y recubrimientos.",
    categoria: "Materiales",
    logo: null,
    orden: 5,
  },
]

const NORMAS_NUEVAS = [
  {
    codigo: "CCP-14",
    descripcion:
      "Norma Colombiana de Diseño de Puentes (basada en AASHTO LRFD), adoptada por INVÍAS y el Ministerio de Transporte.",
    categoria: "Puentes",
    orden: 3,
  },
  {
    codigo: "ASTM",
    descripcion:
      "Estándares de materiales: A36, A572, A325/A490, entre otros, para perfiles, láminas y pernos estructurales.",
    categoria: "Materiales",
    orden: 4,
  },
  {
    codigo: "SSPC",
    descripcion:
      "Estándares de preparación de superficie y aplicación de recubrimientos protectores: grados de limpieza y perfil de anclaje.",
    categoria: "Recubrimientos",
    orden: 6,
  },
  {
    codigo: "SG-SST",
    descripcion:
      "Sistema de Gestión de Seguridad y Salud en el Trabajo — Decreto 1072 de 2015 y Resolución 0312 de 2019.",
    categoria: "Seguridad y salud",
    orden: 7,
  },
]

/* ------------------------------------------------------------------ */
/*  Proceso digital nuevo (dossier) + RUC                              */
/* ------------------------------------------------------------------ */

const PROCESO_DOSSIER = {
  slug: "dossier-digital",
  nombre: "Dossier Digital de Calidad",
  descripcion:
    "El expediente de calidad del proyecto se construye en línea durante la fabricación y se comparte con el cliente desde el primer día.",
  beneficios: [
    "Certificados de materia prima, ensayos y registros de pintura en un solo expediente",
    "Liberaciones digitales por conjunto con evidencia fotográfica",
    "Acceso permanente del cliente y la interventoría, actualizado en tiempo real",
  ],
  imagen: IMG_DOSSIER,
  orden: 2,
}

const RUC_DESCRIPCION =
  "Evaluación anual del Consejo Colombiano de Seguridad al sistema de gestión en Seguridad, Salud en el Trabajo y Ambiente (SSTA), requisito habitual de los grandes contratantes del sector industrial y de infraestructura."

/* ------------------------------------------------------------------ */

async function main() {
  // 1. Grupos nuevos (create-only)
  for (const g of GRUPOS_NUEVOS) {
    await prisma.grupoSeccion.upsert({
      where: { pagina_clave: { pagina: "calidad", clave: g.clave } },
      update: {},
      create: { pagina: "calidad", activo: true, ...g },
    })
  }
  console.log("✓ Grupos nuevos: intro, trazabilidad")

  // 2. Grupos existentes: textos canónicos + reorden (update deliberado, una vez)
  for (const g of GRUPOS_ACTUALIZAR) {
    await prisma.grupoSeccion.updateMany({
      where: { pagina: "calidad", clave: g.clave },
      data: g.data,
    })
  }
  console.log("✓ Grupos existentes actualizados (textos + orden)")

  // 3. Etapas viejas → inactivas
  const viejas = await prisma.etapaControlCalidad.updateMany({
    where: { slug: { in: ETAPAS_VIEJAS } },
    data: { activo: false },
  })
  console.log(`✓ Etapas viejas desactivadas: ${viejas.count}`)

  // 4. Etapas nuevas (create-only)
  for (const e of ETAPAS) {
    await prisma.etapaControlCalidad.upsert({
      where: { slug: e.slug },
      update: {},
      create: { activo: true, ...e },
    })
  }
  console.log(`✓ Etapas nuevas: ${ETAPAS.length}`)

  // 5. Normas existentes: descripciones canónicas (update deliberado)
  for (const n of NORMAS_ACTUALIZAR) {
    await prisma.norma.updateMany({
      where: { codigo: n.codigo },
      data: {
        descripcion: n.descripcion,
        categoria: n.categoria,
        logo: n.logo,
        orden: n.orden,
      },
    })
  }
  // 6. Normas nuevas (create-only)
  for (const n of NORMAS_NUEVAS) {
    await prisma.norma.upsert({
      where: { codigo: n.codigo },
      update: {},
      create: { activo: true, ...n },
    })
  }
  console.log("✓ Normas: 4 actualizadas + 4 nuevas")

  // 7. Proceso digital dossier (create-only)
  await prisma.procesoDigital.upsert({
    where: { slug: PROCESO_DOSSIER.slug },
    update: {},
    create: { activo: true, ...PROCESO_DOSSIER },
  })
  console.log("✓ ProcesoDigital dossier-digital")

  // 8. RUC: descripción canónica (update deliberado)
  await prisma.certificacion.updateMany({
    where: { slug: "ruc" },
    data: { descripcion: RUC_DESCRIPCION },
  })
  console.log("✓ Certificación RUC actualizada")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
