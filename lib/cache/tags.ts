/**
 * Tags de caché del contenido público (una por tabla o familia de tablas).
 *
 * Por qué existe: Neon cobra por horas de cómputo despierto y se suspende
 * solo tras 5 min sin consultas. Con ~2.300 páginas/día (casi todo
 * rastreadores) cada render tocaba Postgres y la base nunca dormía. Todo lo
 * que lee el sitio público sale del snapshot (lib/content/snapshot.ts), cuyas
 * entradas llevan estas tags, y cualquier escritura del admin las invalida
 * (lib/prisma.ts → lib/cache/revalidate.ts) para que un cambio se vea al
 * instante sin esperar el TTL.
 */
export const PUBLIC_CACHE_TTL = 3600 // 1 hora, en segundos

export const TAGS = {
  configuracionEmpresa: 'configuracion_empresa',
  configuracionContacto: 'configuracion_contacto',
  configuracionSitio: 'configuracion_sitio',
  configuracionTalento: 'configuracion_talento',
  configuracionWhatsApp: 'configuracion_whatsapp',
  configuracionTrayectoria: 'configuracion_trayectoria',
  plantas: 'plantas',
  socialLinks: 'social_links',
  menuItems: 'menu_items',
  footerLinks: 'footer_links',
  categoriasProyecto: 'categorias_proyecto',
  landingsSeo: 'landings_seo',
  empresa: 'empresa', // valores, hitos, certificaciones, normas, gobierno
  home: 'home', // hero especialidades, stats, featured, servicios destacados, config, orden
  servicios: 'servicios', // Servicio + ServiciosPagina + ProcesoFase
  formOptions: 'form_options',
  tecnologia: 'tecnologia', // grupos, tecnologias, equipos, procesos digitales, fases flujo
  calidad: 'calidad', // pilares SIG, politicas, etapas control
  proyectos: 'proyectos', // Proyecto + imágenes + progreso
  obras: 'obras',
  brochures: 'brochures',
  clientes: 'clientes',
  contactosWhatsApp: 'contactos_whatsapp',
  vacantes: 'vacantes',
  trayectoria: 'trayectoria', // ProyectoHojaVida + ResumenAnio
} as const

export type PublicTag = (typeof TAGS)[keyof typeof TAGS]

/**
 * Modelo Prisma (nombre del delegate, en camelCase) → tags que invalida una
 * escritura sobre él. Los modelos que NO aparecen aquí (usuarios, mensajes
 * del formulario, candidatos, sesiones de chat, media library, etc.) no
 * afectan al sitio público y sus escrituras no tocan el caché.
 */
export const MODEL_TAGS: Record<string, PublicTag[]> = {
  configuracionEmpresa: [TAGS.configuracionEmpresa],
  configuracionContacto: [TAGS.configuracionContacto],
  configuracionSitio: [TAGS.configuracionSitio],
  configuracionTalento: [TAGS.configuracionTalento],
  configuracionWhatsApp: [TAGS.configuracionWhatsApp],
  configuracionTrayectoria: [TAGS.configuracionTrayectoria],
  plant: [TAGS.plantas],
  socialLink: [TAGS.socialLinks],
  menuItem: [TAGS.menuItems],
  footerLink: [TAGS.footerLinks],
  categoriaProyecto: [TAGS.categoriasProyecto],
  landingSeo: [TAGS.landingsSeo],
  companyValue: [TAGS.empresa],
  timelineHito: [TAGS.empresa],
  certificacion: [TAGS.empresa],
  norma: [TAGS.empresa],
  gobiernoItem: [TAGS.empresa],
  homeHeroEspecialidad: [TAGS.home],
  homeStat: [TAGS.home],
  homeFeaturedProject: [TAGS.home],
  homeServicioDestacado: [TAGS.home],
  homeSeccionConfig: [TAGS.home],
  ordenSeccionesHome: [TAGS.home],
  servicio: [TAGS.servicios],
  serviciosPagina: [TAGS.servicios],
  procesoFase: [TAGS.servicios],
  formOption: [TAGS.formOptions],
  grupoSeccion: [TAGS.tecnologia, TAGS.calidad],
  tecnologia: [TAGS.tecnologia],
  equipo: [TAGS.tecnologia],
  procesoDigital: [TAGS.tecnologia, TAGS.calidad],
  faseFlujoTecnologia: [TAGS.tecnologia],
  pilarSIG: [TAGS.calidad],
  politica: [TAGS.calidad],
  etapaControlCalidad: [TAGS.calidad],
  proyecto: [TAGS.proyectos],
  imagenProyecto: [TAGS.proyectos],
  progresoProyecto: [TAGS.proyectos],
  documentoProyecto: [TAGS.proyectos],
  obra: [TAGS.obras],
  brochure: [TAGS.brochures],
  cliente: [TAGS.clientes],
  contactoWhatsApp: [TAGS.contactosWhatsApp],
  vacante: [TAGS.vacantes],
  proyectoHojaVida: [TAGS.trayectoria],
  resumenAnio: [TAGS.trayectoria],
}
