import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getSolucionDb, getSolucionSlugsDb } from '@/lib/content/landings'
import {
  ServiceSchema,
  BreadcrumbSchema,
  FAQSchema,
} from '@/components/seo/JsonLdSchema'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

const SITE_URL = 'https://meisa.com.co'
const FALLBACK_HERO =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'

// Cross-link a las landings locales (interlinking soluciones → ciudades).
const CIUDADES_COBERTURA = [
  { slug: 'cali', nombre: 'Cali y el Valle' },
  { slug: 'bogota', nombre: 'Bogotá' },
  { slug: 'popayan', nombre: 'Popayán y el Cauca' },
]

export async function generateStaticParams() {
  const slugs = await getSolucionSlugsDb()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const solucion = await getSolucionDb(params.slug)
  if (!solucion) {
    return { title: 'Solución no encontrada | MEISA' }
  }

  const categoria = await prisma.categoriaProyecto.findUnique({
    where: { key: solucion.categoriaEnum },
    select: { imagenCover: true },
  })
  const image = categoria?.imagenCover || FALLBACK_HERO

  return {
    title: { absolute: solucion.metaTitle },
    description: solucion.metaDescription,
    alternates: { canonical: `/soluciones/${solucion.slug}` },
    openGraph: {
      title: solucion.metaTitle,
      description: solucion.metaDescription,
      images: [{ url: image, width: 1200, height: 630, alt: solucion.keywordH1 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: solucion.metaTitle,
      description: solucion.metaDescription,
      images: [image],
    },
  }
}

function formatToneladas(value: number): string {
  // Redondea hacia abajo a la centena para comunicar "más de X"
  const floored = Math.floor(value / 100) * 100
  return floored.toLocaleString('es-CO')
}

export default async function SolucionPage({
  params,
}: {
  params: { slug: string }
}) {
  const solucion = await getSolucionDb(params.slug)
  if (!solucion) notFound()

  const [categoria, agregados, topProyectos] = await Promise.all([
    prisma.categoriaProyecto.findUnique({
      where: { key: solucion.categoriaEnum },
      select: { imagenCover: true, slug: true, nombre: true },
    }),
    prisma.proyecto.aggregate({
      where: { categoria: solucion.categoriaEnum, visible: true },
      _count: { _all: true },
      _sum: { toneladas: true },
    }),
    prisma.proyecto.findMany({
      where: {
        categoria: solucion.categoriaEnum,
        visible: true,
        toneladas: { not: null },
      },
      orderBy: { toneladas: 'desc' },
      take: 4,
      select: {
        id: true,
        titulo: true,
        slug: true,
        ubicacion: true,
        toneladas: true,
        imagenes: {
          orderBy: { orden: 'asc' },
          take: 1,
          select: { url: true, urlOptimized: true, alt: true },
        },
      },
    }),
  ])

  const heroImagen = categoria?.imagenCover || FALLBACK_HERO
  const categoriaSlug = categoria?.slug || solucion.categoriaSlug
  const totalProyectos = agregados._count._all
  const totalToneladas = agregados._sum.toneladas
    ? Number(agregados._sum.toneladas)
    : 0

  const stats = [
    { valor: String(totalProyectos), sufijo: '', label: 'Proyectos entregados' },
    {
      valor: formatToneladas(totalToneladas),
      sufijo: '+',
      label: 'Toneladas de acero',
    },
    ...solucion.statsPropios.map((s) => ({
      valor: s.valor,
      sufijo: '',
      label: s.label,
    })),
  ]

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* JSON-LD */}
      <ServiceSchema
        name={solucion.keywordH1}
        description={solucion.metaDescription}
        url={`${SITE_URL}/soluciones/${solucion.slug}`}
        image={heroImagen}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          {
            name: solucion.keywordH1,
            url: `${SITE_URL}/soluciones/${solucion.slug}`,
          },
        ]}
      />
      <FAQSchema items={solucion.faq} />

      {/* 1. Hero full-bleed oscuro con imagen */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImagen}
          alt={solucion.keywordH1}
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
                {solucion.heroEyebrow}
              </p>
              <h1 className="font-bebas uppercase leading-[0.95]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                  {solucion.heroTitulo1}
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/50">
                  {solucion.heroTitulo2}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Intro editorial — Patrón A: título 5/12 + lead 7/12 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                01 — La solución
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                Diseño, fabricación
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                y montaje
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6">
              <p
                className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                lang="es"
              >
                {solucion.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats strip — números bebas gigantes con borders inline */}
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

      {/* Secciones de contenido editorial */}
      {solucion.secciones.map((seccion, idx) => (
        <section key={seccion.titulo} className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  {String(idx + 2).padStart(2, '0')}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
                  {seccion.titulo}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pt-6 space-y-5">
                {seccion.parrafos.map((parrafo) => (
                  <p
                    key={parrafo.slice(0, 40)}
                    className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                    lang="es"
                  >
                    {parrafo}
                  </p>
                ))}
                {seccion.bullets && seccion.bullets.length > 0 && (
                  <ul className="pt-2 space-y-3">
                    {seccion.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-slate-400 mt-2.5 flex-shrink-0" />
                        <span className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 4. Tipos de estructura — tiles numerados */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Tipologías
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Tipos de estructura
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              que fabricamos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {solucion.tiposDeEstructura.map((tipo, i) => (
              <div key={tipo.nombre} className="bg-white p-8 md:p-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950">
                    {tipo.nombre}
                  </h3>
                </div>
                <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                  {tipo.descripcion}
                </p>
              </div>
            ))}
            {/* Tile de ventajas para completar el grid */}
            <div className="bg-slate-950 p-8 md:p-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-5">
                Por qué en acero
              </h3>
              <ul className="space-y-2.5">
                {solucion.ventajas.slice(0, 4).map((ventaja) => (
                  <li key={ventaja} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-white/40 mt-2 flex-shrink-0" />
                    <span className="text-white/70 font-lato text-sm leading-relaxed">
                      {ventaja}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Image break */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImagen}
          alt={`Proyectos de ${categoria?.nombre ?? 'estructuras metálicas'} — MEISA`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
      </div>

      {/* 6. Cómo trabajamos — 4 pasos numerados */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Proceso
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Cómo trabajamos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              del modelo al acero
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
            {solucion.procesoResumen.map((paso, i) => (
              <div key={paso.titulo} className="bg-stone-50 p-8 md:p-10">
                <span className="block text-slate-300 font-bebas text-5xl md:text-6xl leading-none mb-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {paso.titulo}
                </h3>
                <p className="text-slate-700 font-lato text-sm leading-relaxed">
                  {paso.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Proyectos que nos respaldan */}
      {topProyectos.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 md:mb-16">
              <div className="lg:col-span-5">
                <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Obra entregada
                </p>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                  Proyectos que
                </h2>
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                  nos respaldan
                </h3>
              </div>
              <div className="lg:col-span-7 lg:pt-6">
                <p
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {solucion.proyectosIntro}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
              {topProyectos.map((proyecto) => {
                const imagen = proyecto.imagenes[0]
                const imagenUrl = imagen?.urlOptimized || imagen?.url
                const toneladas = proyecto.toneladas
                  ? Math.round(Number(proyecto.toneladas))
                  : null
                return (
                  <Link
                    key={proyecto.id}
                    href={`/proyectos/detalle/${proyecto.slug}`}
                    className="group bg-white flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {imagenUrl ? (
                        <Image
                          src={imagenUrl}
                          alt={imagen?.alt || proyecto.titulo}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      <h3 className="font-lato font-bold text-slate-950 text-sm md:text-base leading-snug mb-2">
                        {proyecto.titulo}
                      </h3>
                      <p className="mt-auto text-slate-500 font-lato text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {proyecto.ubicacion}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-10">
              <Link
                href={`/proyectos/categoria/${categoriaSlug}`}
                className="group inline-flex items-center gap-3 text-slate-950 font-lato font-bold text-base md:text-lg"
              >
                <span className="relative">
                  Ver los {totalProyectos} proyectos de la categoría
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-950" />
                </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ — acordeón details/summary + FAQSchema */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Preguntas frecuentes
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Lo que nos
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              preguntan siempre
            </h3>
          </div>
          <div className="border-t border-slate-200">
            {solucion.faq.map((item) => (
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
          <div className="mt-10">
            <Link
              href="/precios-estructuras-metalicas"
              className="group inline-flex items-center gap-3 text-slate-950 font-lato font-bold text-base md:text-lg"
            >
              <span className="relative">
                Ver la guía completa de precios de estructuras metálicas
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-950" />
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8.5 Cobertura por ciudad — interlinking a las landings locales */}
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
            {CIUDADES_COBERTURA.map((ciudad) => (
              <Link
                key={ciudad.slug}
                href={`/estructuras-metalicas/${ciudad.slug}`}
                className="group bg-white p-8 md:p-10 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2">
                    Estructuras metálicas en
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950">
                    {ciudad.nombre}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-950" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA final — Patrón E dark */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-12 md:mb-16">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Construyamos juntos
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              Su proyecto merece
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              ingeniería real.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Envíenos los planos o el anteproyecto y reciba una cotización
              formal con alcance, plazo y peso de acero detallado.
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
              href={`/proyectos/categoria/${categoriaSlug}`}
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
