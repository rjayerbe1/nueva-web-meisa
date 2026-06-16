import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getCiudadDb, getCiudadSlugsDb } from '@/lib/content/landings'
import {
  ServiceSchema,
  BreadcrumbSchema,
  FAQSchema,
} from '@/components/seo/JsonLdSchema'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60
// Slugs válidos: tabla landings_seo (tipo CIUDAD) con fallback a
// lib/ciudades.ts — cualquier otro slug responde 404 vía notFound().

const SITE_URL = 'https://meisa.com.co'
const FALLBACK_HERO =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'

interface PageProps {
  params: { ciudad: string }
}

export async function generateStaticParams() {
  const slugs = await getCiudadSlugsDb()
  return slugs.map((ciudad) => ({ ciudad }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ciudad = await getCiudadDb(params.ciudad)
  if (!ciudad) return {}

  const ogImage = ciudad.heroImagen || FALLBACK_HERO

  return {
    title: { absolute: ciudad.metaTitle },
    description: ciudad.metaDescription,
    alternates: { canonical: `/estructuras-metalicas/${ciudad.slug}` },
    openGraph: {
      title: ciudad.metaTitle,
      description: ciudad.metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${ciudad.h1} — MEISA`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ciudad.metaTitle,
      description: ciudad.metaDescription,
      images: [ogImage],
    },
  }
}

function formatToneladas(value: number): string {
  const floored = Math.floor(value / 100) * 100
  return floored.toLocaleString('es-CO')
}

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
    esCadena: boolean
    activa: boolean
    imagenDestacada: string | null
  } | null
  imagenes: Array<{ url: string; urlOptimized: string | null; alt: string | null }>
}

// Card del listado de proyectos destacados. Puede representar un proyecto
// individual o una OBRA que agrupa varias fases/proyectos de la misma ciudad.
interface ProyectoCard {
  key: string
  titulo: string
  href: string
  toneladas: number
  ubicacion: string
  imagenUrl: string | null
  imagenAlt: string
  /** Cantidad de proyectos agrupados (1 = card individual) */
  proyectosAgrupados: number
  /** Solo aplica a cards agrupadas: 'fases' (mismo edificio) o 'proyectos' (cadena) */
  etiquetaGrupo: string | null
}

// Agrupa los proyectos por obra: si varios proyectos del listado pertenecen a
// la misma Obra (fases del mismo edificio o cadena), se muestran como UNA
// sola card con las toneladas sumadas y link a /obras/[slug]. Los proyectos
// sin obra (o cuya obra solo tiene un proyecto en esta ciudad) quedan como
// card individual hacia /proyectos/detalle/[slug].
function agruparPorObra(proyectos: ProyectoRow[], top: number): ProyectoCard[] {
  const cards = new Map<string, ProyectoCard & { _row: ProyectoRow }>()

  for (const p of proyectos) {
    const toneladas = p.toneladas ? Number(p.toneladas) : 0
    const imagen = p.imagenes[0]
    const imagenUrl = imagen?.urlOptimized || imagen?.url || null

    if (p.obraId && p.obra && p.obra.activa) {
      const key = `obra:${p.obraId}`
      const existente = cards.get(key)
      if (existente) {
        existente.toneladas += toneladas
        existente.proyectosAgrupados += 1
      } else {
        // Los proyectos vienen ordenados por toneladas desc, así que el
        // primero de cada obra es la fase principal: su portada es el
        // fallback de imagen y su ubicación representa la card.
        cards.set(key, {
          key,
          titulo: p.obra.titulo,
          href: `/obras/${p.obra.slug}`,
          toneladas,
          ubicacion: p.ubicacion,
          imagenUrl: p.obra.imagenDestacada || imagenUrl,
          imagenAlt: imagen?.alt || p.obra.titulo,
          proyectosAgrupados: 1,
          etiquetaGrupo: p.obra.esCadena ? 'proyectos' : 'fases',
          _row: p,
        })
      }
    } else {
      const key = `proyecto:${p.id}`
      cards.set(key, {
        key,
        titulo: p.titulo,
        href: `/proyectos/detalle/${p.slug}`,
        toneladas,
        ubicacion: p.ubicacion,
        imagenUrl,
        imagenAlt: imagen?.alt || p.titulo,
        proyectosAgrupados: 1,
        etiquetaGrupo: null,
        _row: p,
      })
    }
  }

  return Array.from(cards.values())
    .map((card) => {
      // Obra con un solo proyecto en esta ciudad → se muestra como el
      // proyecto individual (evita titular una card con el nombre de una
      // cadena nacional por un único local).
      if (card.proyectosAgrupados === 1 && card.etiquetaGrupo !== null) {
        const p = card._row
        const imagen = p.imagenes[0]
        return {
          ...card,
          titulo: p.titulo,
          href: `/proyectos/detalle/${p.slug}`,
          imagenUrl: imagen?.urlOptimized || imagen?.url || null,
          imagenAlt: imagen?.alt || p.titulo,
          etiquetaGrupo: null,
        }
      }
      return card
    })
    .sort((a, b) => b.toneladas - a.toneladas)
    .slice(0, top)
    .map(({ _row, ...card }) => card)
}

export default async function EstructurasMetalicasCiudadPage({
  params,
}: PageProps) {
  const ciudad = await getCiudadDb(params.ciudad)
  if (!ciudad) notFound()

  const whereCiudad = {
    visible: true,
    OR: ciudad.terminosUbicacion.map((termino) => ({
      ubicacion: { contains: termino, mode: 'insensitive' as const },
    })),
  }

  let heroImagen = ciudad.heroImagen || FALLBACK_HERO
  let totalProyectos = 0
  let totalToneladas = 0
  let topCards: ProyectoCard[] = []

  try {
    const [categoria, agregados, proyectos] = await Promise.all([
      prisma.categoriaProyecto.findUnique({
        where: { key: ciudad.heroCategoriaKey },
        select: { imagenCover: true },
      }),
      prisma.proyecto.aggregate({
        where: whereCiudad,
        _count: { _all: true },
        _sum: { toneladas: true },
      }),
      // Se traen todos los proyectos con tonelaje de la ciudad (no solo 6)
      // para que la suma por obra sea completa antes de recortar el top.
      prisma.proyecto.findMany({
        where: { ...whereCiudad, toneladas: { not: null } },
        orderBy: { toneladas: 'desc' },
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
              esCadena: true,
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
    if (!ciudad.heroImagen && categoria?.imagenCover) heroImagen = categoria.imagenCover
    totalProyectos = agregados._count._all
    totalToneladas = agregados._sum.toneladas
      ? Number(agregados._sum.toneladas)
      : 0
    topCards = agruparPorObra(proyectos, 6)
  } catch {
    // fallback estático
  }

  const stats = [
    {
      valor: String(totalProyectos),
      sufijo: '',
      label: ciudad.statProyectosLabel,
    },
    {
      valor: formatToneladas(totalToneladas),
      sufijo: '+',
      label: ciudad.statToneladasLabel,
    },
    ...ciudad.statsFijas,
  ]

  const pageUrl = `${SITE_URL}/estructuras-metalicas/${ciudad.slug}`

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* JSON-LD */}
      <ServiceSchema
        name={ciudad.h1}
        description={ciudad.metaDescription}
        url={pageUrl}
        image={heroImagen}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: ciudad.h1, url: pageUrl },
        ]}
      />
      <FAQSchema items={ciudad.faq} />

      {/* Hero full-bleed oscuro */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImagen}
          alt={`${ciudad.h1} — MEISA`}
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
                {ciudad.heroEyebrow}
              </p>
              <h1 className="font-bebas uppercase leading-[0.95]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                  {ciudad.heroTitulo1}
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/50">
                  {ciudad.heroTitulo2}
                </span>
              </h1>
              <p className="mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                {ciudad.heroDescripcion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro editorial — Patrón A */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {ciudad.introEyebrow}
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                {ciudad.introTitulo1}
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                {ciudad.introTitulo2}
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {ciudad.intro.map((parrafo) => (
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

      {/* Stats strip */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="border-y border-slate-200 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 md:divide-x md:divide-slate-200">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'md:pl-6' : ''}>
                <div className="font-bebas text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-slate-950">
                  {stat.valor}
                  {stat.sufijo && (
                    <span className="text-slate-300">{stat.sufijo}</span>
                  )}
                </div>
                <p className="mt-2 text-slate-500 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué construimos — tiles numerados */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {ciudad.seccionesEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              {ciudad.seccionesTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {ciudad.seccionesTitulo2}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {ciudad.secciones.map((item, i) => (
              <div key={item.nombre} className="bg-white p-8 md:p-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950">
                    {item.nombre}
                  </h3>
                </div>
                <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image break */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImagen}
          alt={`Proyectos de estructura metálica de MEISA en ${ciudad.nombre}`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
      </div>

      {/* Ventaja local / logística */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {ciudad.ventajaEyebrow}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
                {ciudad.ventajaTitulo}
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {ciudad.ventaja.map((parrafo) => (
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

      {/* Proyectos destacados (agrupados por obra) */}
      {topCards.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 md:mb-16">
              <div className="lg:col-span-5">
                <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Obra entregada
                </p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                  Proyectos
                </h2>
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                  {ciudad.proyectosTitulo2}
                </h3>
              </div>
              <div className="lg:col-span-7 lg:pt-6">
                <p
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {ciudad.proyectosDescripcion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              {topCards.map((card) => {
                const toneladas =
                  card.toneladas > 0 ? Math.round(card.toneladas) : null
                return (
                  <Link
                    key={card.key}
                    href={card.href}
                    className="group bg-white flex flex-col"
                  >
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
                          <span className="text-slate-300 text-2xl md:text-3xl">
                            {' '}
                            ton
                          </span>
                        </p>
                      )}
                      {card.etiquetaGrupo && (
                        <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
                          Obra completa · {card.proyectosAgrupados}{' '}
                          {card.etiquetaGrupo}
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

      {/* FAQ */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              {ciudad.faqTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {ciudad.faqTitulo2}
            </h3>
          </div>
          <div className="border-t border-slate-200">
            {ciudad.faq.map((item) => (
              <details
                key={item.pregunta}
                className="group border-b border-slate-200"
              >
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

      {/* Soluciones relacionadas */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-12 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Siga explorando
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
              Soluciones relacionadas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            {ciudad.relacionadas.map((rel) => (
              <Link
                key={rel.href}
                href={rel.href}
                className="group bg-white p-8 md:p-10 flex flex-col"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                  {rel.eyebrow}
                </p>
                <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {rel.titulo}
                </h3>
                <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {rel.descripcion}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                  Ver más
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — Patrón E dark */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-12 md:mb-16">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {ciudad.ctaEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              {ciudad.ctaTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              {ciudad.ctaTitulo2}
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {ciudad.ctaDescripcion}
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
