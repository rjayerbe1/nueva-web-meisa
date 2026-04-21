/**
 * Seed de contenido de Empresa (Fase 2).
 *
 * Migra los datos hoy hardcoded en lib/company-data.ts:
 *   - COMPANY_INFO        → ConfiguracionEmpresa (singleton)
 *   - LEADERSHIP_QUOTE    → ConfiguracionEmpresa
 *   - COMPANY_HISTORY     → ConfiguracionEmpresa.historiaIntro + TimelineHito
 *   - SAFETY_CONTENT      → ConfiguracionEmpresa.seguridad*
 *   - SUSTAINABILITY      → ConfiguracionEmpresa.sostenibilidad*
 *   - CORPORATE_VALUES    → CompanyValue (8)
 *   - CERTIFICATIONS      → Certificacion
 *   - STANDARDS_COMPLIANCE → Norma
 *   - CreemosSection frases → ConfiguracionEmpresa.frasesCreemos
 *
 * Idempotente: upsert por slug/codigo.
 * Correr: npx tsx prisma/seed-empresa.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const FOUNDING_YEAR = 1996
const YEARS_EXPERIENCE = new Date().getFullYear() - FOUNDING_YEAR

/* ------------------------------------------------------------------ */
/*  Configuración Empresa (singleton)                                 */
/* ------------------------------------------------------------------ */

const configuracion = {
  id: "default",
  nombre: "MEISA",
  nombreCompleto: "Metálicas e Ingeniería S.A.S.",
  mision:
    "Fortalecer la empresa a nivel nacional garantizando un crecimiento en el tiempo a través de calidad de los productos y servicios, generando rentabilidad, aumento de confianza, mayor satisfacción de clientes y colaboradores para así mantener su consolidación y talento profesional ante el mercado y llegar a nuevos clientes.",
  vision:
    "Desarrollar soluciones a proyectos con estructuras metálicas y obras civiles, logrando el balance ideal entre costos, diseño, funcionalidad y excelente calidad, cumpliendo con las normas sismo resistentes vigentes, los estándares de fabricación y montaje actuales, de la mano del talento humano y responsabilidad de los trabajadores.",
  descripcion:
    "En MEISA hemos fabricado e instalado estructuras metálicas para todo tipo de proyectos de construcción e infraestructura. Especialistas en brindar un servicio integral al cliente para culminar proyectos de manera eficiente y eficaz gestionando múltiples etapas del proyecto bajo una sola dirección.",
  fundacion: FOUNDING_YEAR,
  liderQuoteTexto:
    "En MEISA no solo construimos estructuras de acero, construimos la infraestructura que impulsa el desarrollo de Colombia. Cada proyecto es un compromiso con la excelencia y la seguridad.",
  liderQuoteAutor: "Roberto Ayerbe Camayo",
  liderQuoteCargo: "Gerente Técnico | Socio Fundador",
  liderQuoteImagen: "/images/empresa/liderazgo/roberto-ayerbe.png",
  historiaIntro: [
    `Metálicas e Ingeniería S.A.S. fue constituida en el año ${FOUNDING_YEAR} en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de Estructuras Metálicas. A lo largo de más de ${YEARS_EXPERIENCE} años, hemos participado activamente en la construcción y manejo de Proyectos y Obras Civiles en todo el territorio Nacional.`,
    "Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última tecnología, permitiéndonos ser cada vez más eficientes en los tiempos de entrega y en la reducción de costos de los proyectos.",
    "Hoy contamos con tres plantas de producción estratégicamente ubicadas en el suroccidente colombiano, con una capacidad combinada de 600 toneladas mensuales y un equipo de más de 320 colaboradores comprometidos con la excelencia.",
  ],
  frasesCreemos: [
    "en construir legado.",
    "que la calidad es primero.",
    "en estructuras que perduran.",
    "en equipos comprometidos.",
    "en pasión y disciplina.",
  ],
  seguridadTitulo: "Seguridad Laboral",
  seguridadSubtitulo: "La seguridad de nuestro equipo es nuestra prioridad #1",
  seguridadItems: [
    "Protocolos certificados de trabajo en altura",
    "Equipos de protección personal de última generación",
    "Programa de capacitación continua",
    "Supervisión permanente en obra",
    "Certificaciones en seguridad industrial",
  ],
  seguridadMeta: "Meta organizacional: Cero accidentes",
  sostenibilidadTitulo: "Sostenibilidad",
  sostenibilidadSubtitulo: "Comprometidos con el medio ambiente",
  sostenibilidadItems: [
    "Gestión responsable de residuos metálicos",
    "Optimización de cortes para minimizar desperdicios",
    "Programa de reciclaje de materiales",
    "Eficiencia energética en operaciones",
    "Proveedores con prácticas sostenibles",
  ],
  sostenibilidadCompromiso: "Compromiso con las futuras generaciones",
}

/* ------------------------------------------------------------------ */
/*  Valores corporativos                                              */
/* ------------------------------------------------------------------ */

const VALORES = [
  {
    slug: "efectividad",
    nombre: "Efectividad",
    descripcion: "Cumplimos con los objetivos propuestos de manera eficiente",
    imagen: "/images/valores/efectividad.webp",
  },
  {
    slug: "integridad",
    nombre: "Integridad",
    descripcion: "Actuamos con transparencia y honestidad en todos nuestros procesos",
    imagen: "/images/valores/integridad.webp",
  },
  {
    slug: "lealtad",
    nombre: "Lealtad",
    descripcion: "Comprometidos con nuestros clientes y colaboradores",
    imagen: "/images/valores/lealtad.webp",
  },
  {
    slug: "proactividad",
    nombre: "Proactividad",
    descripcion: "Anticipamos necesidades y tomamos iniciativas",
    imagen: "/images/valores/proactividad.webp",
  },
  {
    slug: "aprendizaje-continuo",
    nombre: "Aprendizaje Continuo",
    descripcion: "Nos desarrollamos constantemente para mejorar",
    imagen: "/images/valores/aprendizaje.webp",
  },
  {
    slug: "respeto",
    nombre: "Respeto",
    descripcion: "Valoramos a todas las personas y sus aportes",
    imagen: "/images/valores/respeto.webp",
  },
  {
    slug: "pasion",
    nombre: "Pasión",
    descripcion: "Amor por lo que hacemos y excelencia en el servicio",
    imagen: "/images/valores/pasion.webp",
  },
  {
    slug: "disciplina",
    nombre: "Disciplina",
    descripcion: "Consistencia y rigor en nuestros procesos",
    imagen: "/images/valores/disciplina.webp",
  },
]

/* ------------------------------------------------------------------ */
/*  Timeline hitos                                                    */
/* ------------------------------------------------------------------ */

const HITOS = [
  {
    periodo: "1996",
    titulo: "Fundación",
    descripcion:
      "MEISA nace en Popayán, Cauca, como un taller especializado en estructuras metálicas con la visión de ofrecer soluciones de calidad a la región suroccidental de Colombia.",
    destacado: "Inicio de operaciones",
    icono: "/images/iconos-animados/fundacion.gif",
  },
  {
    periodo: "2006-2010",
    titulo: "Expansión",
    descripcion:
      "Inauguración de la segunda planta de producción en la ciudad de Jamundí. Construcción de centros comerciales y puentes vehiculares en la región.",
    destacado: "Planta Jamundí",
    icono: "/images/iconos-animados/expansion.gif",
  },
  {
    periodo: "2011-2015",
    titulo: "Certificación",
    descripcion:
      "Obtención de la certificación RUC del Consejo Colombiano de Seguridad. Consolidación como empresa de clase nacional con estándares de calidad y seguridad.",
    destacado: "RUC Certificado",
    icono: "/images/iconos-animados/certificacion.gif",
  },
  {
    periodo: "2016-2020",
    titulo: "Proyectos Emblemáticos",
    descripcion:
      "Participación en proyectos de gran envergadura: centros comerciales, edificios corporativos, coliseos deportivos e infraestructura de transporte en todo el país.",
    destacado: "+300 proyectos",
    icono: "/images/iconos-animados/proyectos.gif",
  },
  {
    periodo: "2021-Presente",
    titulo: "Consolidación",
    descripcion:
      "Con 3 plantas operativas y tecnología BIM de última generación, participamos en proyectos industriales, comerciales y de infraestructura vial en todo el país.",
    destacado: "Presencia nacional",
    icono: "/images/iconos-animados/consolidacion.gif",
  },
]

/* ------------------------------------------------------------------ */
/*  Certificaciones                                                   */
/* ------------------------------------------------------------------ */

const CERTIFICACIONES = [
  {
    slug: "ruc",
    nombre: "RUC",
    nombreCompleto: "Registro Uniforme de Contratistas",
    descripcion:
      "Certificación del Consejo Colombiano de Seguridad en SSTA",
    emisor: "Consejo Colombiano de Seguridad (CCS)",
    importancia:
      "Requisito exigido por grandes empresas contratantes en procesos de licitación",
    beneficios: [
      "Gestión certificada en Seguridad, Salud en el Trabajo y Ambiente (SSTA)",
      "Evaluación anual por auditores profesionales del CCS",
      "Visibilidad ante grandes empresas contratantes del país",
      "Compromiso demostrado con la seguridad de los trabajadores",
    ],
    logo: "/images/certificaciones/ruc-logo.png",
  },
]

/* ------------------------------------------------------------------ */
/*  Normas                                                            */
/* ------------------------------------------------------------------ */

const NORMAS = [
  {
    codigo: "NSR-10",
    descripcion: "Norma Sismo Resistente Colombiana",
    logo: "/images/normas/nsr-10.png",
  },
  {
    codigo: "AWS D1.1",
    descripcion: "Código de Soldadura Estructural",
    logo: "/images/normas/aws.png",
  },
  {
    codigo: "AISC 360",
    descripcion: "Especificación para Edificios de Acero",
    logo: "/images/normas/aisc.png",
  },
  {
    codigo: "NTC",
    descripcion: "Normas Técnicas Colombianas",
    logo: "/images/normas/ntc.png",
  },
]

/* ------------------------------------------------------------------ */
/*  Execution                                                         */
/* ------------------------------------------------------------------ */

async function main() {
  // 1. Configuración singleton
  await prisma.configuracionEmpresa.upsert({
    where: { id: "default" },
    create: configuracion,
    update: configuracion,
  })
  console.log("✓ ConfiguracionEmpresa (singleton)")

  // 2. Valores
  for (let i = 0; i < VALORES.length; i++) {
    const v = VALORES[i]
    await prisma.companyValue.upsert({
      where: { slug: v.slug },
      create: { ...v, orden: i, activo: true },
      update: { ...v, orden: i },
    })
  }
  console.log(`✓ ${VALORES.length} valores corporativos`)

  // 3. Timeline
  // Los hitos no tienen slug único — los identificamos por periodo+titulo.
  // Si ya hay hitos idénticos, no duplicamos: delete+recreate en orden.
  await prisma.timelineHito.deleteMany({})
  for (let i = 0; i < HITOS.length; i++) {
    await prisma.timelineHito.create({
      data: { ...HITOS[i], orden: i, activo: true },
    })
  }
  console.log(`✓ ${HITOS.length} hitos del timeline`)

  // 4. Certificaciones
  for (let i = 0; i < CERTIFICACIONES.length; i++) {
    const c = CERTIFICACIONES[i]
    await prisma.certificacion.upsert({
      where: { slug: c.slug },
      create: { ...c, orden: i, activo: true },
      update: { ...c, orden: i },
    })
  }
  console.log(`✓ ${CERTIFICACIONES.length} certificaciones`)

  // 5. Normas
  for (let i = 0; i < NORMAS.length; i++) {
    const n = NORMAS[i]
    await prisma.norma.upsert({
      where: { codigo: n.codigo },
      create: { ...n, orden: i, activo: true },
      update: { ...n, orden: i },
    })
  }
  console.log(`✓ ${NORMAS.length} normas de cumplimiento`)

  console.log("\n✅ Empresa seed completado")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
