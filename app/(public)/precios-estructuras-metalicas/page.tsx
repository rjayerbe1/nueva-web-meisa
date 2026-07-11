import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getGuiaDb, getSolucionesDb } from '@/lib/content/landings'
import { getGuiaFallback, type GuiaPreciosContenido } from '@/lib/guias'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLdSchema'
import { OtrasGuias } from '@/components/guias/OtrasGuias'
import { QuickQuoteForm } from '@/components/contacto/QuickQuoteForm'
import { WhatsAppCTA } from '@/components/contacto/WhatsAppCTA'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

const SITE_URL = 'https://meisa.com.co'
const FALLBACK_HERO =
  'https://storage.googleapis.com/meisa-imagenes/site/hero/hero-construccion-industrial.jpg'

const SLUG = 'precios-estructuras-metalicas'

async function getGuiaPrecios() {
  const guia = (await getGuiaDb(SLUG)) ?? getGuiaFallback(SLUG)!
  const fallback = getGuiaFallback(SLUG)!
  // Seguridad: si la fila en DB cambió de variante, usar el config en código.
  const contenido =
    guia.contenido.variante === 'precios'
      ? guia.contenido
      : (fallback.contenido as GuiaPreciosContenido)
  return {
    metaTitle: guia.metaTitle,
    metaDescription: guia.metaDescription,
    contenido,
    updatedAt: guia.updatedAt ?? null,
  }
}

/** "julio de 2026" — mes/año de la última revisión de precios (es-CO). */
function formatMesRevision(fecha: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(fecha)
}

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription, contenido, updatedAt } = await getGuiaPrecios()
  const ogImage = contenido.heroImagen || FALLBACK_HERO
  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Precios de estructuras metálicas en Colombia — MEISA',
        },
      ],
      // Señal de frescura: cada guardado en /admin/landings renueva
      // modifiedTime (Google la lee para el "fecha —" del snippet).
      type: 'article',
      ...(updatedAt ? { modifiedTime: updatedAt.toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  }
}

/** Renderiza **negrita** dentro de un párrafo editable. */
function renderConNegrita(texto: string) {
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return partes.map((parte, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-bold text-slate-950">
        {parte}
      </span>
    ) : (
      <span key={i}>{parte}</span>
    ),
  )
}

export default async function PreciosEstructurasMetalicasPage() {
  const [{ contenido, updatedAt }, soluciones] = await Promise.all([
    getGuiaPrecios(),
    getSolucionesDb(),
  ])

  let heroImagen = contenido.heroImagen || FALLBACK_HERO
  try {
    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { key: 'INDUSTRIAL' },
      select: { imagenCover: true },
    })
    if (!contenido.heroImagen && categoria?.imagenCover) heroImagen = categoria.imagenCover
  } catch {
    // fallback estático
  }

  return (
    <main className="bg-stone-50 text-slate-950">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          {
            name: contenido.breadcrumbName,
            url: `${SITE_URL}/${SLUG}`,
          },
        ]}
      />
      <FAQSchema items={contenido.faq} />

      {/* Hero full-bleed oscuro */}
      <section className="relative h-screen md:h-[85vh] overflow-hidden bg-slate-950">
        <Image
          src={heroImagen}
          alt="Estructura metálica industrial fabricada y montada por MEISA"
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
                {contenido.heroEyebrow}
              </p>
              <h1 className="font-bebas uppercase leading-[0.95]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                  {contenido.heroTitulo1}
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/50">
                  {contenido.heroTitulo2}
                </span>
              </h1>
              <p className="mt-8 text-white/80 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
                {contenido.heroSub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo se cotiza — Patrón A */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {contenido.cotizacionEyebrow}
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                {contenido.cotizacionTitulo1}
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                {contenido.cotizacionTitulo2}
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {contenido.cotizacionParrafos.map((parrafo) => (
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

      {/* Tabla de rangos */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-12 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {contenido.rangosEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              {contenido.rangosTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {contenido.rangosTitulo2}
            </h3>
            <p className="mt-6 text-slate-500 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.15em]">
              {contenido.rangosSubtitulo}
            </p>
            {updatedAt && (
              <p className="mt-3 inline-flex items-center gap-2 border border-slate-300 px-3 py-1.5 text-slate-700 font-lato font-bold text-[11px] md:text-xs uppercase tracking-[0.15em]">
                <span className="w-1.5 h-1.5 bg-red-600" aria-hidden="true" />
                Rangos revisados: {formatMesRevision(updatedAt)}
              </p>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-5 md:p-6 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.15em] text-slate-500">
                    Tipo de estructura
                  </th>
                  <th className="text-left p-5 md:p-6 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.15em] text-slate-500 hidden md:table-cell">
                    Ejemplos
                  </th>
                  <th className="text-right p-5 md:p-6 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">
                    COP / kg instalado
                  </th>
                </tr>
              </thead>
              <tbody>
                {contenido.rangos.map((fila) => (
                  <tr
                    key={fila.tipo}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="p-5 md:p-6 align-top">
                      <span className="font-lato font-bold text-slate-950 text-sm md:text-base">
                        {fila.tipo}
                      </span>
                      <span className="block md:hidden mt-1 text-slate-500 font-lato text-xs leading-relaxed">
                        {fila.ejemplos}
                      </span>
                    </td>
                    <td className="p-5 md:p-6 align-top text-slate-600 font-lato text-sm leading-relaxed hidden md:table-cell">
                      {fila.ejemplos}
                    </td>
                    <td className="p-5 md:p-6 align-top text-right">
                      <span className="font-bebas text-2xl md:text-3xl text-slate-950 whitespace-nowrap">
                        {fila.rango}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-slate-600 font-lato text-sm md:text-base leading-relaxed max-w-3xl">
            <span className="font-bold text-slate-950">Nota:</span>{' '}
            {contenido.rangosNota}
          </p>
        </div>
      </section>

      {/* Captura ligera — el usuario acaba de ver los rangos, momento de máxima intención */}
      <QuickQuoteForm
        tema="la guía de precios de estructura metálica"
        origen="guia:/precios-estructuras-metalicas"
        titulo="¿Quieres un estimado real para tu proyecto?"
        subtitulo="Los rangos de arriba son orientativos. Déjanos tus datos y te enviamos un estimado ajustado a tu obra en menos de 24 horas hábiles."
      />

      {/* Image break */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImagen}
          alt="Montaje de estructura metálica — MEISA"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
      </div>

      {/* Qué hace variar el precio */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {contenido.factoresEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              {contenido.factoresTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {contenido.factoresTitulo2}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {contenido.factores.map((factor, i) => (
              <div key={factor.titulo} className="bg-white p-8 md:p-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-slate-300 font-bebas text-4xl md:text-5xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-slate-950">
                    {factor.titulo}
                  </h3>
                </div>
                <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                  {factor.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversión aproximada a m² */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                {contenido.conversionEyebrow}
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
                {contenido.conversionTitulo1}
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
                {contenido.conversionTitulo2}
              </h3>
            </div>
            <div className="lg:col-span-7 lg:pt-6 space-y-5">
              {contenido.conversionParrafos.map((parrafo) => (
                <p
                  key={parrafo.slice(0, 40)}
                  className="text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {renderConNegrita(parrafo)}
                </p>
              ))}
            </div>
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
              {contenido.faqTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              {contenido.faqTitulo2}
            </h3>
          </div>
          <div className="border-t border-slate-200">
            {contenido.faq.map((item) => (
              <details key={item.pregunta} className="group border-b border-slate-200">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-lato font-bold text-slate-950 text-base md:text-lg leading-snug">
                    {item.pregunta}
                  </h3>
                  <Plus className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p
                  className="pb-6 md:pr-12 text-slate-700 font-lato text-sm md:text-base leading-relaxed text-pretty hyphens-auto"
                  lang="es"
                >
                  {item.respuesta}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Soluciones relacionadas — cross-links */}
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
            {soluciones.map((solucion) => (
              <Link
                key={solucion.slug}
                href={`/soluciones/${solucion.slug}`}
                className="group bg-white p-8 md:p-10 flex flex-col"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                  Solución
                </p>
                <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                  {solucion.keywordH1}
                </h3>
                <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                  {solucion.metaDescription}
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

      {/* Otras guías técnicas — cross-links del clúster */}
      <OtrasGuias currentPath={`/${SLUG}`} />

      {/* CTA final — Patrón E dark */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-12 md:mb-16">
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              {contenido.ctaEyebrow}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              {contenido.ctaTitulo1}
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              {contenido.ctaTitulo2}
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {contenido.ctaDescripcion}
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
            <WhatsAppCTA
              origen="guia:/precios-estructuras-metalicas"
              mensaje="Hola MEISA, vi la guía de precios y quisiera un estimado para mi proyecto."
            />
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
