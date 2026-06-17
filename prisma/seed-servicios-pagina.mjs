/**
 * Crea/actualiza el singleton ServiciosPagina con el contenido actual de
 * /servicios, para que el admin (/admin/services → tab "Página") muestre los
 * valores reales y se puedan editar. Token {anios} se resuelve al renderizar.
 *
 * Correr:  node prisma/seed-servicios-pagina.mjs
 */
import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'

loadEnv({ path: '.env.local' })
const prisma = new PrismaClient()

const data = {
  heroEyebrow: 'Servicios integrales — {anios}+ años de experiencia',
  heroTitulo1: 'Soluciones',
  heroTitulo2: 'en acero.',
  heroParrafo:
    'Diseñamos, fabricamos en plantas propias y montamos en obra. Un solo equipo controla todo el flujo —del modelo BIM al acero instalado— bajo un mismo Sistema Integrado de Gestión.',
  stats: [
    { clave: 'anios', valor: 'AUTO', sufijo: '+', label: 'Años de experiencia' },
    { clave: 'proyectos', valor: 'AUTO', sufijo: '+', label: 'Proyectos entregados' },
    { clave: 'toneladas', valor: 'AUTO', sufijo: '+', label: 'Toneladas de acero' },
    { clave: 'm2', valor: 'AUTO', sufijo: '+', label: 'm² construidos' },
  ],
  procesoEyebrow: 'Metodología',
  procesoTitulo1: 'Proceso',
  procesoTitulo2: 'integral.',
  procesoParrafo:
    'Un enfoque sistemático que garantiza resultados excepcionales en cada proyecto, desde la conceptualización hasta la entrega final.',
  sectoresEyebrow: 'Dónde trabajamos',
  sectoresTitulo1: 'Sectores',
  sectoresTitulo2: 'que atendemos.',
  sectoresParrafo:
    'Seis frentes en los que hemos construido en acero a lo largo del país. Cada uno con su propia ingeniería, normativa y logística.',
  sectores: [
    { label: 'Edificaciones', desc: 'Edificios institucionales, oficinas y vivienda en altura.', slug: 'edificios-en-estructura-metalica' },
    { label: 'Bodegas e industria', desc: 'Naves industriales, bodegas y plantas de proceso.', slug: 'estructura-metalica-para-bodegas' },
    { label: 'Centros comerciales', desc: 'Construcción y ampliación de centros comerciales.', slug: 'estructura-metalica-centros-comerciales' },
    { label: 'Puentes', desc: 'Puentes vehiculares y peatonales en acero.', slug: 'puentes-metalicos' },
    { label: 'Escenarios deportivos', desc: 'Coliseos, estadios y complejos deportivos.', slug: 'estructura-metalica-escenarios-deportivos' },
    { label: 'Cubiertas y fachadas', desc: 'Cubiertas de gran luz y fachadas metálicas.', slug: 'cubiertas-metalicas' },
  ],
  ctaEyebrow: 'Trabajemos juntos',
  ctaTitulo1: 'Tu próximo',
  ctaTitulo2: 'proyecto.',
  ctaParrafo:
    'Con {anios}+ años de experiencia, más de 260 proyectos y 32.000 toneladas entregadas, estamos listos para ejecutar tu visión en acero.',
  ctaPrimarioTexto: 'Solicitar cotización',
  ctaPrimarioHref: '/contacto',
  ctaSecundarioTexto: 'Ver proyectos',
  ctaSecundarioHref: '/proyectos',
}

await prisma.serviciosPagina.upsert({
  where: { id: 'default' },
  update: data,
  create: { id: 'default', ...data },
})

console.log('✅ ServiciosPagina (default) sembrado.')
await prisma.$disconnect()
