/**
 * Seed de Fase 4b: Home (/) 100% editable.
 *
 * Migra los arrays hardcoded de los 7 componentes del home:
 *   - HeroSection.specialties
 *   - StatsStrip.stats
 *   - FeaturedProjectSection.featuredProject ("Puente Ovejas")
 *   - ServicesSectionNew.services (Diseño, Fabricación, Montaje)
 *   - ClientesSection header
 *   - ContactSection copy
 *   - HomeContent orden
 *
 * Correr: npx tsx prisma/seed-home.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const ESPECIALIDADES = [
  "DISEÑO\nESTRUCTURAL",
  "FABRICACIÓN\nMETÁLICA",
  "MONTAJE\nESPECIALIZADO",
  "GESTIÓN DE\nPROYECTOS",
]

const STATS = [
  { clave: "anios_experiencia", valor: "AUTO", label: "años de experiencia" },
  { clave: "proyectos_entregados", valor: "500", label: "proyectos entregados" },
  { clave: "toneladas_mes", valor: "600", label: "toneladas / mes" },
  { clave: "colaboradores", valor: "320", label: "colaboradores" },
]

const FEATURED_PROJECT = {
  id: "default",
  nombre: "Puente Ovejas",
  ubicacion: "Doble Calzada Cali – Popayán",
  anioEntregado: "2026",
  imagen: "/images/proyectos/puente-destacado.jpg",
  descripcion:
    "Estructura metálica lanzada sobre torres de soporte, sobre el río Ovejas. Diseño, fabricación y montaje integral para la doble calzada Cali – Popayán.",
  stats: [
    { value: "600", label: "ton de acero" },
    { value: "Doble calzada", label: "vehicular" },
    { value: "2026", label: "entregado" },
  ],
  ctaTexto: "Ver todos los proyectos",
  ctaUrl: "/proyectos",
  eyebrowTexto: "Proyecto destacado",
}

const SERVICIOS_HOME = [
  {
    slug: "diseno",
    nombre: "Diseño Estructural",
    subtitulo: "Ingeniería de precisión BIM",
    descripcion: "Análisis y diseño estructural con tecnología BIM",
    video: "/videos/diseno-estructural.mp4",
    imagen:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
    color: "#3b82f6",
    overlayColor: "#1e3a8a",
    overlayOpacity: 0.4,
    hrefAncla: "/servicios#diseno",
  },
  {
    slug: "fabricacion",
    nombre: "Fabricación Metálica",
    subtitulo: "Producción 600 ton/mes",
    descripcion: "3 plantas industriales con equipos de última generación",
    video: "/videos/fabricacion-metalica.mp4",
    imagen:
      "https://images.unsplash.com/photo-1565131568475-d4004fb1be6e?w=1200&q=80",
    color: "#64748b",
    overlayColor: "#1e293b",
    overlayOpacity: 0.4,
    hrefAncla: "/servicios#fabricacion",
  },
  {
    slug: "montaje",
    nombre: "Montaje Especializado",
    subtitulo: "Instalación profesional",
    descripcion: "Equipos certificados y personal experto en alturas",
    video: "/videos/montaje-especializado.mp4",
    imagen:
      "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=1200&q=80",
    color: "#16a34a",
    overlayColor: "#15803d",
    overlayOpacity: 0.4,
    hrefAncla: "/servicios#montaje",
  },
]

const SECCION_CONFIG = {
  id: "default",
  clientesEyebrow: "Nuestros clientes",
  clientesTitulo: "Confianza construida\ndurante 30+ años",
  clientesDescripcion:
    "Empresas líderes en infraestructura, minería y construcción confían en MEISA para sus proyectos estructurales más exigentes.",
  clientesCtaTexto: "Conoce nuestra trayectoria",
  clientesCtaUrl: "/trayectoria",
  clientesProyectosTitulo: "Proyectos destacados",
  contactoEyebrow: "Contacto",
  contactoTitulo: "Hablemos de tu\npróximo proyecto",
  contactoDescripcion:
    "Treinta años construyendo estructuras metálicas en Colombia. Cuéntanos qué necesitas y recibirás una cotización personalizada.",
  contactoCta1Texto: "Solicitar cotización",
  contactoCta2Texto: "WhatsApp",
}

const ORDEN_SECCIONES = {
  id: "default",
  orden: [
    { clave: "hero", label: "Hero", activo: true },
    { clave: "stats", label: "Stats strip", activo: true },
    {
      clave: "featured-project",
      label: "Proyecto destacado",
      activo: true,
    },
    { clave: "servicios", label: "Servicios destacados", activo: true },
    {
      clave: "proyectos",
      label: "Proyectos por categoría",
      activo: true,
    },
    { clave: "clientes", label: "Clientes", activo: true },
    { clave: "contacto", label: "Contacto", activo: true },
  ],
}

async function main() {
  // Especialidades
  await prisma.homeHeroEspecialidad.deleteMany({})
  for (let i = 0; i < ESPECIALIDADES.length; i++) {
    await prisma.homeHeroEspecialidad.create({
      data: { label: ESPECIALIDADES[i], orden: i, activo: true },
    })
  }
  console.log(`✓ ${ESPECIALIDADES.length} especialidades del hero`)

  // Stats
  for (let i = 0; i < STATS.length; i++) {
    const s = STATS[i]
    await prisma.homeStat.upsert({
      where: { clave: s.clave },
      create: { ...s, orden: i, activo: true },
      update: { ...s, orden: i },
    })
  }
  console.log(`✓ ${STATS.length} stats`)

  // Featured project
  await prisma.homeFeaturedProject.upsert({
    where: { id: "default" },
    create: FEATURED_PROJECT,
    update: FEATURED_PROJECT,
  })
  console.log("✓ Proyecto destacado (singleton)")

  // Servicios destacados
  for (let i = 0; i < SERVICIOS_HOME.length; i++) {
    const s = SERVICIOS_HOME[i]
    await prisma.homeServicioDestacado.upsert({
      where: { slug: s.slug },
      create: { ...s, orden: i, activo: true },
      update: { ...s, orden: i },
    })
  }
  console.log(`✓ ${SERVICIOS_HOME.length} servicios destacados`)

  // Seccion config
  await prisma.homeSeccionConfig.upsert({
    where: { id: "default" },
    create: SECCION_CONFIG,
    update: SECCION_CONFIG,
  })
  console.log("✓ Clientes + Contacto copy (singleton)")

  // Orden
  await prisma.ordenSeccionesHome.upsert({
    where: { id: "default" },
    create: ORDEN_SECCIONES,
    update: ORDEN_SECCIONES,
  })
  console.log(`✓ Orden de secciones (${ORDEN_SECCIONES.orden.length} secciones)`)

  console.log("\n✅ Home seed completado")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
