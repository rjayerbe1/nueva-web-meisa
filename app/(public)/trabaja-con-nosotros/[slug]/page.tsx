import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase, Clock, MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { DEFAULT_CONSENTIMIENTO } from "@/lib/talento/consentimiento"
import { PostulacionForm } from "@/components/talento/PostulacionForm"

export const revalidate = 60

const HERO_IMG = "https://storage.googleapis.com/meisa-imagenes/site/heroes/inst-2.webp"

const CONTRATO_LABEL: Record<string, string> = {
  indefinido: "Término indefinido",
  fijo: "Término fijo",
  "obra-labor": "Obra o labor",
  aprendizaje: "Contrato de aprendizaje",
}

const JORNADA_LABEL: Record<string, string> = {
  FULL_TIME: "Tiempo completo",
  PART_TIME: "Medio tiempo",
  TEMPORARY: "Temporal",
  CONTRACTOR: "Contratista",
  INTERN: "Práctica / aprendiz",
}

async function getVacante(slug: string) {
  const config = await prisma.configuracionTalento.findUnique({ where: { id: "default" } })
  if (!config?.paginaPublicaActiva) return null
  const vacante = await prisma.vacante.findUnique({ where: { slug } })
  if (!vacante || vacante.estado !== "ABIERTA") return null
  return { vacante, config }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getVacante(params.slug)
  if (!data) return {}
  const { vacante } = data
  const description = `${vacante.titulo} en MEISA${vacante.ciudad ? ` — ${vacante.ciudad}` : ""}. Postúlate en línea.`
  return {
    title: { absolute: `${vacante.titulo} | Trabaja en MEISA` },
    description,
    alternates: { canonical: `/trabaja-con-nosotros/${vacante.slug}` },
    openGraph: { title: `${vacante.titulo} | MEISA`, description, type: "website" },
  }
}

// JSON-LD JobPosting — hace la vacante elegible para Google for Jobs.
// Campos obligatorios: title, description, datePosted, hiringOrganization,
// jobLocation (addressCountry). validThrough si hay fecha de cierre.
function buildJobPostingJsonLd(v: {
  titulo: string
  slug: string
  descripcion: string
  requisitos: string[]
  responsabilidades: string[]
  ciudad: string | null
  jornada: string | null
  modalidad: string | null
  salarioMin: number | null
  salarioMax: number | null
  salarioVisible: boolean
  fechaPublicacion: Date | null
  fechaCierre: Date | null
  createdAt: Date
  id: string
}) {
  const descriptionHtml = [
    `<p>${v.descripcion}</p>`,
    v.responsabilidades.length
      ? `<p><strong>Responsabilidades:</strong></p><ul>${v.responsabilidades.map((r) => `<li>${r}</li>`).join("")}</ul>`
      : "",
    v.requisitos.length
      ? `<p><strong>Requisitos:</strong></p><ul>${v.requisitos.map((r) => `<li>${r}</li>`).join("")}</ul>`
      : "",
  ].join("")

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: v.titulo,
    description: descriptionHtml,
    datePosted: (v.fechaPublicacion ?? v.createdAt).toISOString().slice(0, 10),
    identifier: {
      "@type": "PropertyValue",
      name: "MEISA",
      value: v.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "MEISA — Metálicas e Ingeniería S.A.S.",
      sameAs: "https://meisa.com.co",
      logo: "https://meisa.com.co/images/logo/logo-meisa.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.ciudad ?? "Jamundí",
        addressRegion: "Valle del Cauca",
        addressCountry: "CO",
      },
    },
    directApply: true,
  }
  if (v.fechaCierre) jsonLd.validThrough = v.fechaCierre.toISOString().slice(0, 10)
  if (v.jornada) jsonLd.employmentType = v.jornada
  if (v.modalidad === "remoto") jsonLd.jobLocationType = "TELECOMMUTE"
  if (v.salarioVisible && v.salarioMin) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "COP",
      value: {
        "@type": "QuantitativeValue",
        minValue: v.salarioMin,
        ...(v.salarioMax ? { maxValue: v.salarioMax } : {}),
        unitText: "MONTH",
      },
    }
  }
  return jsonLd
}

export default async function VacanteDetallePage({
  params,
}: {
  params: { slug: string }
}) {
  const data = await getVacante(params.slug)
  if (!data) notFound()
  const { vacante, config } = data
  const jsonLd = buildJobPostingJsonLd(vacante)
  const salarioTxt =
    vacante.salarioVisible && vacante.salarioMin
      ? `$${vacante.salarioMin.toLocaleString("es-CO")}${vacante.salarioMax ? ` – $${vacante.salarioMax.toLocaleString("es-CO")}` : ""} COP/mes`
      : null

  return (
    <main className="bg-stone-50 text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero compacto oscuro */}
      <section className="relative overflow-hidden bg-slate-950 pb-16 pt-32 md:pb-20 md:pt-40">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-slate-950/40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <Link
            href="/trabaja-con-nosotros"
            className="mb-6 inline-flex items-center gap-2 font-lato text-xs font-bold uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Todas las vacantes
          </Link>
          <p className="mb-3 font-lato text-xs font-bold uppercase tracking-[0.2em] text-white/60 md:text-sm">
            {vacante.area ?? "Convocatoria"}
          </p>
          <h1 className="max-w-4xl font-bebas text-4xl uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {vacante.titulo}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {vacante.ciudad && (
              <span className="inline-flex items-center gap-1.5 font-lato text-sm text-white/70">
                <MapPin className="h-4 w-4 text-white/40" />
                {vacante.ciudad}
              </span>
            )}
            {vacante.tipoContrato && (
              <span className="inline-flex items-center gap-1.5 font-lato text-sm text-white/70">
                <Briefcase className="h-4 w-4 text-white/40" />
                {CONTRATO_LABEL[vacante.tipoContrato] ?? vacante.tipoContrato}
              </span>
            )}
            {vacante.jornada && (
              <span className="inline-flex items-center gap-1.5 font-lato text-sm text-white/70">
                <Clock className="h-4 w-4 text-white/40" />
                {JORNADA_LABEL[vacante.jornada] ?? vacante.jornada}
              </span>
            )}
            {salarioTxt && (
              <span className="font-lato text-sm font-semibold text-white">{salarioTxt}</span>
            )}
          </div>
        </div>
      </section>

      {/* Contenido de la vacante */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="whitespace-pre-line font-lato text-base leading-relaxed text-slate-700 md:text-lg">
                {vacante.descripcion}
              </p>

              {vacante.responsabilidades.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 font-bebas text-2xl uppercase text-slate-950 md:text-3xl">
                    Responsabilidades
                  </h2>
                  <ul className="space-y-2.5">
                    {vacante.responsabilidades.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 bg-slate-400" />
                        <span className="font-lato text-base leading-relaxed text-slate-700">
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vacante.requisitos.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 font-bebas text-2xl uppercase text-slate-950 md:text-3xl">
                    Requisitos
                  </h2>
                  <ul className="space-y-2.5">
                    {vacante.requisitos.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 bg-slate-400" />
                        <span className="font-lato text-base leading-relaxed text-slate-700">
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vacante.beneficios.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 font-bebas text-2xl uppercase text-slate-950 md:text-3xl">
                    Beneficios
                  </h2>
                  <ul className="space-y-2.5">
                    {vacante.beneficios.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 bg-slate-400" />
                        <span className="font-lato text-base leading-relaxed text-slate-700">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Formulario */}
            <div className="lg:col-span-5" id="aplicar">
              <div className="lg:sticky lg:top-28">
                <PostulacionForm
                  vacanteSlug={vacante.slug}
                  vacanteTitulo={vacante.titulo}
                  elegibleReferidos={vacante.elegibleReferidos}
                  textoConsentimiento={
                    config.textoConsentimiento?.trim() || DEFAULT_CONSENTIMIENTO
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
