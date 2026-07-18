"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import { PostulacionForm } from "@/components/talento/PostulacionForm"

const HERO_IMG = "https://storage.googleapis.com/meisa-imagenes/site/heroes/inst-1.webp"
const BREAK_IMG = "https://storage.googleapis.com/meisa-imagenes/site/heroes/industrial-2.webp"

type VacantePublica = {
  id: string
  slug: string
  titulo: string
  area: string | null
  ciudad: string | null
  modalidad: string | null
  tipoContrato: string | null
  descripcion: string
}

const CONTRATO_LABEL: Record<string, string> = {
  indefinido: "Término indefinido",
  fijo: "Término fijo",
  "obra-labor": "Obra o labor",
  aprendizaje: "Contrato de aprendizaje",
}

export default function TrabajaContent({
  vacantes,
  textoConsentimiento,
}: {
  vacantes: VacantePublica[]
  textoConsentimiento: string
}) {
  return (
    <main className="bg-stone-50 text-slate-950">
      {/* Hero full-bleed oscuro con foto real de planta */}
      <section className="relative h-[70vh] overflow-hidden bg-slate-950 md:h-[80vh]">
        <Image
          src={HERO_IMG}
          alt="Planta de fabricación MEISA"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/50" />
        <div className="relative z-10 flex h-full items-end px-4 pb-16 sm:px-6 md:pb-24 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl">
              <p className="mb-4 font-lato text-xs font-bold uppercase tracking-[0.2em] text-white/60 md:text-sm">
                Talento Humano
              </p>
              <h1 className="font-bebas text-5xl uppercase leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Trabaja
              </h1>
              <h2 className="font-bebas text-5xl uppercase leading-[0.95] text-white/50 sm:text-6xl md:text-7xl lg:text-8xl">
                con nosotros
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Intro editorial 2-col (Patrón A) */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <p className="mb-4 font-lato text-xs font-bold uppercase tracking-[0.2em] text-slate-400 md:text-sm">
                01 — Nuestro equipo
              </p>
              <h2 className="font-bebas text-5xl uppercase leading-[0.95] text-slate-950 md:text-6xl lg:text-7xl">
                Acero
              </h2>
              <h3 className="font-bebas text-5xl uppercase leading-[0.95] text-slate-300 md:text-6xl lg:text-7xl">
                y personas
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 lg:pt-6"
            >
              <p className="font-lato text-base leading-relaxed text-slate-700 md:text-lg">
                Desde 1996 diseñamos, fabricamos y montamos estructuras metálicas para
                puentes, edificaciones e industria en Colombia. Detrás de cada tonelada de
                acero hay soldadores, armadores, pintores, ingenieros y técnicos que hacen
                posible cada proyecto. Si quieres construir país con nosotros, este es el
                lugar para empezar.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-200 py-4">
                {["Planta en Jamundí", "Proyectos en todo el país", "Formación y certificación", "Seguridad ante todo"].map(
                  (t) => (
                    <span
                      key={t}
                      className="font-lato text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vacantes abiertas — listado editorial */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 max-w-4xl md:mb-14"
          >
            <p className="mb-4 font-lato text-xs font-bold uppercase tracking-[0.2em] text-slate-400 md:text-sm">
              02 — Convocatorias
            </p>
            <h2 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl lg:text-6xl">
              Vacantes abiertas
            </h2>
          </motion.div>

          {vacantes.length === 0 ? (
            <div className="border-y border-slate-200 py-12">
              <p className="max-w-2xl font-lato text-base leading-relaxed text-slate-700">
                En este momento no tenemos convocatorias abiertas. Déjanos tu hoja de vida
                abajo y te tendremos en cuenta cuando abra una vacante que encaje con tu
                perfil.
              </p>
            </div>
          ) : (
            <div className="border-t border-slate-200">
              {vacantes.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    href={`/trabaja-con-nosotros/${v.slug}`}
                    className="group grid grid-cols-1 gap-3 border-b border-slate-200 py-6 transition-colors hover:bg-white md:grid-cols-12 md:items-center md:gap-6 md:py-7"
                  >
                    <div className="md:col-span-6">
                      <h3 className="font-bebas text-2xl uppercase leading-tight text-slate-950 transition-colors group-hover:text-red-600 md:text-3xl">
                        {v.titulo}
                      </h3>
                      {v.area && (
                        <p className="mt-1 font-lato text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                          {v.area}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 md:col-span-4">
                      {v.ciudad && (
                        <span className="inline-flex items-center gap-1.5 font-lato text-sm text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {v.ciudad}
                        </span>
                      )}
                      {v.tipoContrato && (
                        <span className="font-lato text-sm text-slate-600">
                          {CONTRATO_LABEL[v.tipoContrato] ?? v.tipoContrato}
                        </span>
                      )}
                    </div>
                    <div className="md:col-span-2 md:text-right">
                      <span className="inline-flex items-center gap-2 font-lato text-sm font-bold uppercase tracking-wider text-slate-950">
                        Ver vacante
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image break */}
      <div className="relative h-[50vh] w-full overflow-hidden md:h-[65vh]">
        <Image
          src={BREAK_IMG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/20 to-transparent" />
      </div>

      {/* Aplicación espontánea */}
      <section className="py-20 md:py-28" id="aplicar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 max-w-4xl md:mb-14"
          >
            <p className="mb-4 font-lato text-xs font-bold uppercase tracking-[0.2em] text-slate-400 md:text-sm">
              03 — Banco de talento
            </p>
            <h2 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl lg:text-6xl">
              Déjanos tu
            </h2>
            <h3 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-300 md:text-5xl lg:text-6xl">
              hoja de vida
            </h3>
            <p className="mt-6 max-w-2xl font-lato text-base leading-relaxed text-slate-700 md:text-lg">
              ¿No ves una vacante para tu perfil? Envíanos tu hoja de vida y, si lo
              autorizas, te tendremos en cuenta para futuras convocatorias.
            </p>
          </motion.div>

          <div className="max-w-3xl">
            <PostulacionForm textoConsentimiento={textoConsentimiento} />
          </div>
        </div>
      </section>
    </main>
  )
}
