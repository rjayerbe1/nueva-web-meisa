import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { GUIAS_NAV } from '@/components/guias/OtrasGuias'
import { ServiceSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLdSchema'

// ISR: sirve desde caché 60s, regenera en background.
export const revalidate = 60

// Página PILAR del clúster SEO. Rankea la keyword nacional difícil
// ("estructuras metálicas en Colombia") y concentra el fan-in de las 14
// landings del clúster (soluciones, ciudades, guías), que enlazan hacia
// aquí con anchor de keyword. A la vez enlaza hacia abajo a todo el clúster.

const SITE_URL = 'https://meisa.com.co'
const PAGE_PATH = '/estructuras-metalicas-colombia'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`
// El hero y el image break se resuelven en runtime desde los covers de
// categoría de la DB (fotos REALES de obra MEISA — nada de stock). FALLBACK_IMG
// solo aplica si la DB no responde; OG_IMG (cover real de Puentes) alimenta el
// OpenGraph/Twitter, que son estáticos.
const FALLBACK_IMG =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'
const OG_IMG = 'https://storage.googleapis.com/meisa-imagenes/categories/1763570102114'

const META_TITLE =
  'Estructuras Metálicas en Colombia — Diseño, Fabricación y Montaje | MEISA'
const META_DESCRIPTION =
  'MEISA diseña, fabrica y monta estructuras metálicas en toda Colombia desde 1996: puentes, edificios, centros comerciales, naves industriales y escenarios deportivos en acero. Capacidad certificada y proyectos entregados en todo el país.'

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: PAGE_URL,
    images: [
      {
        url: OG_IMG,
        width: 1200,
        height: 630,
        alt: 'Estructuras metálicas en Colombia — MEISA',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMG],
  },
}

// --- Fan-out: enlaces DESCENDENTES al clúster (con anchors de keyword) ---

const SOLUCIONES = [
  {
    href: '/soluciones/edificios-en-estructura-metalica',
    titulo: 'Edificios en estructura metálica',
    descripcion:
      'Pórticos y entrepisos en acero para edificios de vivienda, oficinas y uso mixto.',
  },
  {
    href: '/soluciones/puentes-metalicos',
    titulo: 'Puentes metálicos',
    descripcion:
      'Puentes vehiculares y peatonales en acero: vigas, cerchas y sistemas mixtos.',
  },
  {
    href: '/soluciones/estructura-metalica-para-bodegas',
    titulo: 'Bodegas y naves industriales',
    descripcion:
      'Naves logísticas e industriales de gran luz, con cubierta y fachada metálica.',
  },
  {
    href: '/soluciones/estructura-metalica-centros-comerciales',
    titulo: 'Centros comerciales',
    descripcion:
      'Estructura para centros comerciales y retail: grandes luces y plazos de obra cortos.',
  },
  {
    href: '/soluciones/estructura-metalica-escenarios-deportivos',
    titulo: 'Escenarios deportivos',
    descripcion:
      'Coliseos, estadios y complejos deportivos con cubiertas de gran luz en acero.',
  },
  {
    href: '/soluciones/cubiertas-metalicas',
    titulo: 'Cubiertas y fachadas metálicas',
    descripcion:
      'Cubiertas, fachadas y sistemas de cerramiento en lámina y estructura metálica.',
  },
]

const CIUDADES = [
  {
    href: '/estructuras-metalicas/cali',
    nombre: 'Cali',
    descripcion: 'Cobertura del Valle del Cauca y el suroccidente desde Jamundí.',
  },
  {
    href: '/estructuras-metalicas/bogota',
    nombre: 'Bogotá',
    descripcion: 'Proyectos de estructura metálica en la capital y la región central.',
  },
  {
    href: '/estructuras-metalicas/popayan',
    nombre: 'Popayán',
    descripcion: 'Planta y sede histórica de MEISA, obra insignia en el Cauca.',
  },
]

const INTRO = [
  'MEISA es una empresa colombiana de estructuras metálicas fundada en 1996, con plantas en Jamundí, Villa Rica y Popayán y proyectos entregados en todo el país. Diseñamos, fabricamos y montamos acero estructural para puentes, edificios, centros comerciales, naves industriales y escenarios deportivos.',
  'Trabajamos sobre planos: cada proyecto se cotiza según su tonelaje, complejidad y logística de montaje. Bajo un mismo techo cubrimos diseño estructural, fabricación con control de calidad y montaje en obra — el mismo equipo responde por toda la cadena.',
]

const VENTAJA = [
  'Lo que nos separa no es una promesa, son toneladas montadas y proyectos verificables: MIO en Cali, escenarios de Juegos Nacionales, puentes y complejos deportivos entregados. El acero no miente.',
  'Con tres plantas de fabricación y equipo propio de montaje llegamos a obra en todo el territorio nacional, con la trazabilidad y las certificaciones que exigen los grandes contratos.',
]

const FAQ = [
  {
    pregunta: '¿Cuánto cuesta una estructura metálica en Colombia?',
    respuesta:
      'El costo se cotiza por kilogramo instalado y depende del tipo de estructura. Como referencia de mercado, la estructura liviana ronda los rangos más bajos y la especial o de puentes los más altos; el valor incluye fabricación, pintura y montaje, y excluye cimentación y acabados. Siempre se cotiza sobre planos. Ver la guía de precios de estructuras metálicas para los rangos orientativos.',
  },
  {
    pregunta: '¿MEISA trabaja en toda Colombia?',
    respuesta:
      'Sí. Con plantas en Jamundí, Villa Rica y Popayán y equipo propio de montaje, MEISA fabrica y monta estructuras metálicas en todo el país, con proyectos entregados en Cali, Bogotá, Popayán y otras regiones.',
  },
  {
    pregunta: '¿Qué tipos de estructura metálica fabrica MEISA?',
    respuesta:
      'Puentes vehiculares y peatonales, edificios en acero, centros comerciales, bodegas y naves industriales, escenarios deportivos y cubiertas metálicas. Cada tipología se resuelve con el sistema estructural que mejor se ajusta a la luz, las cargas y el plazo de obra.',
  },
  {
    pregunta: '¿MEISA hace el diseño, la fabricación y el montaje?',
    respuesta:
      'Sí. MEISA integra diseño estructural, fabricación en planta con control de calidad y montaje en obra con equipo propio. Un solo responsable por toda la cadena, desde el modelo hasta el acero montado.',
  },
]

interface ProyectoRow {
  id: string
  titulo: string
  slug: string
  ubicacion: string
  toneladas: unknown
  obraId: string | null
  obra: {
    slug: string
    titulo: string
    activa: boolean
    imagenDestacada: string | null
  } | null
  imagenes: Array<{ url: string; urlOptimized: string | null; alt: string | null }>
}

interface ProyectoCard {
  key: string
  titulo: string
  href: string
  toneladas: number
  ubicacion: string
  imagenUrl: string | null
  imagenAlt: string
}

// Top proyectos a nivel nacional, deduplicando por obra (varias fases del
// mismo edificio suman toneladas y salen como una card hacia /obras/[slug]).
function topProyectosNacionales(rows: ProyectoRow[], top: number): ProyectoCard[] {
  const cards = new Map<string, ProyectoCard>()
  for (const p of rows) {
    const ton = p.toneladas ? Number(p.toneladas) : 0
    const img = p.imagenes[0]
    const imagenUrl = img?.urlOptimized || img?.url || null
    if (p.obraId && p.obra && p.obra.activa) {
      const key = `obra:${p.obraId}`
      const ex = cards.get(key)
      if (ex) {
        ex.toneladas += ton
        continue
      }
      cards.set(key, {
        key,
        titulo: p.obra.titulo,
        href: `/obras/${p.obra.slug}`,
        toneladas: ton,
        ubicacion: p.ubicacion,
        imagenUrl: p.obra.imagenDestacada || imagenUrl,
        imagenAlt: img?.alt || p.obra.titulo,
      })
    } else {
      const key = `proyecto:${p.id}`
      cards.set(key, {
        key,
        titulo: p.titulo,
        href: `/proyectos/detalle/${p.slug}`,
        toneladas: ton,
        ubicacion: p.ubicacion,
        imagenUrl,
        imagenAlt: img?.alt || p.titulo,
      })
    }
  }
  return Array.from(cards.values())
    .sort((a, b) => b.toneladas - a.toneladas)
    .slice(0, top)
}

function formatToneladas(value: number): string {
  const floored = Math.floor(value / 100) * 100
  return floored.toLocaleString('es-CO')
}

export default async function EstructurasMetalicasColombiaPage() {
  let totalProyectos = 0
  let totalToneladas = 0
  let topCards: ProyectoCard[] = []
  let heroImg = FALLBACK_IMG
  let breakImg = FALLBACK_IMG

  try {
    const [agregados, covers, proyectos] = await Promise.all([
      prisma.proyecto.aggregate({
        where: { visible: true },
        _count: { _all: true },
        _sum: { toneladas: true },
      }),
      // Covers reales de obra por categoría (mismas fotos que el resto del sitio)
      prisma.categoriaProyecto.findMany({
        where: { key: { in: ['PUENTES', 'EDIFICACIONES', 'INDUSTRIAL', 'DEPORTES_EDUCACION'] } },
        select: { key: true, imagenCover: true },
      }),
      prisma.proyecto.findMany({
        where: { visible: true, toneladas: { not: null } },
        orderBy: { toneladas: 'desc' },
        take: 40,
        select: {
          id: true,
          titulo: true,
          slug: true,
          ubicacion: true,
          toneladas: true,
          obraId: true,
          obra: {
            select: {
              slug: true,
              titulo: true,
              activa: true,
              imagenDestacada: true,
            },
          },
          imagenes: {
            orderBy: { orden: 'asc' },
            take: 1,
            select: { url: true, urlOptimized: true, alt: true },
          },
        },
      }),
    ])
    totalProyectos = agregados._count._all
    totalToneladas = agregados._sum.toneladas ? Number(agregados._sum.toneladas) : 0
    topCards = topProyectosNacionales(proyectos, 6)

    const cover = (key: string) =>
      covers.find((c) => c.key === key)?.imagenCover || null
    // Hero: un puente (la obra más icónica de MEISA). Break: otra tipología
    // distinta para no repetir foto. Ambas son fotos reales de obra.
    heroImg = cover('PUENTES') || cover('EDIFICACIONES') || FALLBACK_IMG
    breakImg =
      cover('DEPORTES_EDUCACION') || cover('INDUSTRIAL') || cover('EDIFICACIONES') || heroImg
  } catch {
    // fallback estático (stats en 0, sin cards)
  }

  const stats = [
    { valor: String(totalProyectos || '400'), sufijo: '+', label: 'Proyectos entregados' },
    { valor: formatToneladas(totalToneladas), sufijo: '+', label: 'Toneladas de acero' },
    { valor: '30', sufijo: '+', label: 'Años desde 1996' },
    { valor: '3', sufijo: '', label: 'Plantas de fabricación' },
  ]

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* JSON-LD */}
      <ServiceSchema
        name="Estructuras metálicas en Colombia"
        description={META_DESCRIPTION}
        url={PAGE_URL}
        image={heroImg}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: 'Estructuras metálicas en Colombia', url: PAGE_URL },
        ]}
      />
      <FAQSchema items={FAQ} />

      {/* Hero full-bleed oscuro */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImg}
          alt="Estructuras metálicas en Colombia — MEISA"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/60" />
        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <div className="max-w-5xl">
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Diseño · Fabricación · Montaje — desde 1996
              </p>
              <h1 className="font-bebas uppercase leading-[0.95]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                  Estructuras metálicas
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/50">
                  en Colombia
                </span>
              </h1>
              <p className="mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                Puentes, edificios, centros comerciales, naves industriales y
                escenarios deportivos en acero. Tres plantas, equipo propio de
                montaje y proyectos entregados en todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro editorial — Patrón A + link contextual descendente */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Quiénes somos
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                Acero que
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                no miente
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {INTRO.map((parrafo) => (
                <p
                  key={parrafo.slice(0, 40)}
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip (agregados de DB) */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="border-y border-slate-200 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 md:divide-x md:divide-slate-200">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'md:pl-6' : ''}>
                <div className="font-bebas text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-slate-950">
                  {stat.valor}
                  {stat.sufijo && <span className="text-slate-300">{stat.sufijo}</span>}
                </div>
                <p className="mt-2 text-slate-500 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué construimos — 6 soluciones (fan-out descendente con anchor keyword) */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Qué construimos
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Soluciones en
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              estructura metálica
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {SOLUCIONES.map((sol, i) => (
              <Link key={sol.href} href={sol.href} className="group bg-white p-8 md:p-10 flex flex-col">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950">
                    {sol.titulo}
                  </h3>
                </div>
                <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {sol.descripcion}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                  Ver solución
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Image break */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={breakImg}
          alt="Montaje de estructura metálica de MEISA en Colombia"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
      </div>

      {/* Ventaja — por qué MEISA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Por qué MEISA
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
                Toneladas, no promesas
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {VENTAJA.map((parrafo) => (
                <p
                  key={parrafo.slice(0, 40)}
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos insignia (agregados de DB) */}
      {topCards.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="mb-12 md:mb-16 max-w-4xl">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Obra entregada
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                Proyectos
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                insignia
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              {topCards.map((card) => {
                const toneladas = card.toneladas > 0 ? Math.round(card.toneladas) : null
                return (
                  <Link key={card.key} href={card.href} className="group bg-white flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {card.imagenUrl ? (
                        <Image
                          src={card.imagenUrl}
                          alt={card.imagenAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950 flex items-end p-4">
                          <span className="font-bebas text-white/20 text-5xl uppercase leading-none">
                            MEISA
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      {toneladas !== null && (
                        <p className="font-bebas text-3xl md:text-4xl text-slate-950 leading-none mb-2">
                          {toneladas.toLocaleString('es-CO')}
                          <span className="text-slate-300 text-2xl md:text-3xl"> ton</span>
                        </p>
                      )}
                      <h3 className="font-lato font-bold text-slate-950 text-sm md:text-base leading-snug mb-2">
                        {card.titulo}
                      </h3>
                      <p className="mt-auto text-slate-500 font-lato text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {card.ubicacion}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-10">
              <Link
                href="/proyectos"
                className="group inline-flex items-center gap-3 text-slate-950 font-lato font-bold text-base md:text-lg"
              >
                <span className="relative">
                  Ver todos los proyectos de MEISA
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-950" />
                </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Cobertura nacional — 3 ciudades (fan-out descendente) */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-12 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Cobertura nacional
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
              Dónde construimos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {CIUDADES.map((ciudad) => (
              <Link key={ciudad.href} href={ciudad.href} className="group bg-white p-8 md:p-10 flex flex-col">
                <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2">
                  Estructuras metálicas en
                </p>
                <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {ciudad.nombre}
                </h3>
                <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {ciudad.descripcion}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                  Ver ciudad
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guías técnicas — fan-out a las 5 guías del clúster */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-12 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Antes de cotizar
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
              Guías técnicas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {GUIAS_NAV.map((g) => (
              <Link key={g.path} href={g.path} className="group bg-white p-8 md:p-10 flex flex-col">
                <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                  Guía
                </p>
                <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {g.titulo}
                </h3>
                <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {g.descripcion}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                  Leer guía
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Sobre el acero
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              en Colombia
            </h3>
          </div>
          <div className="border-t border-slate-200">
            {FAQ.map((item) => (
              <details key={item.pregunta} className="group border-b border-slate-200">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-lato font-bold text-slate-950 text-base md:text-lg leading-snug">
                    {item.pregunta}
                  </h3>
                  <Plus className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p
                  className="pb-6 pr-10 text-slate-700 font-lato text-sm md:text-base leading-relaxed max-w-3xl text-pretty hyphens-auto"
                  lang="es"
                >
                  {item.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — Patrón E dark */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-12 md:mb-16">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Construyamos juntos
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              Su próxima obra
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              en acero
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Cuéntenos su proyecto y lo cotizamos sobre planos. Diseño,
              fabricación y montaje de estructuras metálicas en toda Colombia.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/contacto"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
            >
              Solicitar cotización
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/proyectos"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Ver proyectos
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
