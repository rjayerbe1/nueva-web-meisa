'use client'

import { motion } from 'framer-motion'
import { Award, Building, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import type { EmpresaConfig, Valor, Hito } from '@/lib/content/empresa'

interface Props {
  config: EmpresaConfig | null
  valores: Valor[]
  hitos: Hito[]
}

export function QuienesSomosSection({ config, valores, hitos }: Props) {
  const foundingYear = config?.fundacion ?? 1996
  const yearsExperience = new Date().getFullYear() - foundingYear
  const nombreCompleto =
    config?.nombreCompleto ?? "Metálicas e Ingeniería S.A.S."
  const mision = config?.mision ?? ""
  const vision = config?.vision ?? ""
  const introParagraphs = config?.historiaIntro ?? []
  // Si no hay intro en DB, compone una básica; el admin permite editarla.
  const primerParrafo = introParagraphs[0]

  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Historia en 2 columnas editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              01 — Nuestra esencia
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
              Quiénes
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
              somos
            </h3>
          </motion.div>

          {primerParrafo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 lg:pt-6"
            >
              <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-950">{nombreCompleto}</span>{" "}
                {primerParrafo
                  .replace(nombreCompleto + " ", "")
                  .replace(nombreCompleto, "")}
              </p>
            </motion.div>
          )}
        </div>

        {/* Timeline horizontal */}
        {hitos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bebas uppercase leading-[0.95] text-slate-950 mb-10 text-center">
              Nuestra Trayectoria
            </h3>

            <div className="relative">
              {hitos.length > 1 && (
                <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-300" />
              )}

              <div
                className="grid grid-cols-1 gap-4"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(hitos.length, 5)}, minmax(0, 1fr))`,
                }}
              >
                {hitos.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Icono */}
                    {item.icono && (
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg z-10 mb-4 flex items-center justify-center border-2 border-blue-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.icono}
                          alt={item.titulo}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    )}

                    {/* Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all w-full text-center">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold mb-2">
                        {item.periodo}
                      </span>
                      <h4 className="font-bold text-gray-900 mb-2">{item.titulo}</h4>
                      <p className="text-sm text-gray-600 leading-snug">
                        {item.descripcion}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Highlights compactos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-16 border-y border-slate-200 py-5"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <span className="font-lato font-semibold text-slate-700 text-xs md:text-sm uppercase tracking-[0.15em]">3 plantas de producción</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-500" />
            <span className="font-lato font-semibold text-slate-700 text-xs md:text-sm uppercase tracking-[0.15em]">Certificación RUC</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-500" />
            <span className="font-lato font-semibold text-slate-700 text-xs md:text-sm uppercase tracking-[0.15em]">Tecnología BIM</span>
          </div>
        </motion.div>

        {/* Misión + Visión en 2 columnas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20"
        >
          {mision && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/iconos-animados/mision.gif"
                  alt="Misión"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-tight text-slate-950">
                  Misión
                </h3>
              </div>
              <p className="text-slate-700 font-lato text-base leading-relaxed">
                {mision}
              </p>
            </div>
          )}

          {vision && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/iconos-animados/vision.gif"
                  alt="Visión"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-tight text-slate-950">
                  Visión
                </h3>
              </div>
              <p className="text-slate-700 font-lato text-base leading-relaxed">
                {vision}
              </p>
            </div>
          )}
        </motion.div>

        {/* Valores Corporativos — sección propia full-width */}
        {valores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-slate-200 pt-12 md:pt-16"
          >
            <div className="mb-10 max-w-4xl">
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-3">
                Lo que nos define
              </p>
              <h3 className="text-4xl md:text-5xl font-bebas uppercase leading-[0.95] text-slate-950">
                Valores Corporativos
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-10">
              {valores.map((valor, index) => (
                <motion.div
                  key={valor.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform group-hover:scale-110">
                    {valor.imagen && (
                      <Image
                        src={valor.imagen}
                        alt={valor.nombre}
                        width={80}
                        height={80}
                        className="object-contain max-w-full max-h-full"
                      />
                    )}
                  </div>
                  <span className="mt-3 text-xs md:text-sm font-lato font-semibold text-slate-700 leading-tight min-h-[2.5em] flex items-start justify-center">
                    {valor.nombre}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
