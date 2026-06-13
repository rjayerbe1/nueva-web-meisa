'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'
import Image from 'next/image'
import type { EmpresaConfig } from '@/lib/content/empresa'

interface Props {
  config: EmpresaConfig | null
}

export function CreemosSection({ config }: Props) {
  const frases = config?.frasesCreemos ?? []
  const quoteText = config?.liderQuoteTexto ?? ''
  const quoteAuthor = config?.liderQuoteAutor ?? ''
  const quoteTitle = config?.liderQuoteCargo ?? ''
  const quoteImage = config?.liderQuoteImagen ?? ''
  const foundingYear = config?.fundacion ?? 1996

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Parallax responsive: CREEMOS recorre desde la primera frase hasta la
  // última. El desplazamiento ≈ distancia top-a-top entre 1ª y última línea
  // (N-1 líneas). Móvil: 5 frases × ~22px de línea ≈ 88px. Desktop: ≈150px.
  const yParallaxMobile = useTransform(scrollYProgress, [0, 0.7, 1], [0, 88, 88])
  const yParallaxDesktop = useTransform(scrollYProgress, [0, 0.7, 1], [0, 150, 150])

  return (
    <section ref={containerRef} className="relative py-16 md:py-28 overflow-hidden bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Grid: Frases (70%) | Cita del liderazgo (30%) */}
        <div className="grid md:grid-cols-10 gap-12 md:gap-10 items-center">

          {/* IZQUIERDA - Frases "Creemos" (60%) */}
          <div className="relative flex flex-col md:col-span-6">
            <div className="flex items-start w-full">
              {/* Palabra CREEMOS - Versión móvil */}
              <motion.div
                style={{ y: yParallaxMobile }}
                className="md:hidden relative z-10 mr-2 flex-shrink-0"
              >
                <h3 className="text-2xl font-bebas text-slate-950 leading-none uppercase">
                  creemos
                </h3>
              </motion.div>

              {/* Palabra CREEMOS - Versión desktop */}
              <motion.div
                style={{ y: yParallaxDesktop }}
                className="hidden md:block relative z-10 mr-3 flex-shrink-0"
              >
                <h3 className="text-4xl lg:text-5xl font-bebas text-slate-950 leading-none uppercase">
                  creemos
                </h3>
              </motion.div>

              {/* Frases animadas */}
              <div className="relative z-10 flex flex-col space-y-0 w-full">
                {frases.map((frase, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="text-xl md:text-3xl lg:text-4xl font-lato text-slate-700 leading-[1.1]"
                  >
                    {frase}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>

          {/* DERECHA - Cita del Liderazgo (40%) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative md:col-span-4"
          >
            {/* Quote icon decorativo */}
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-slate-200 rotate-180" />
            </div>

            {/* Card de la cita */}
            <div className="relative bg-white p-5 md:p-6 border border-slate-200">
              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-slate-950" />

              {/* Cita */}
              {quoteText && (
                <blockquote className="text-base md:text-lg text-slate-700 italic leading-relaxed mb-4 pt-3">
                  "{quoteText}"
                </blockquote>
              )}

              {/* Autor */}
              {(quoteAuthor || quoteTitle) && (
                <div className="flex items-center gap-3">
                  {/* Avatar con foto */}
                  {quoteImage && (
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-slate-200 relative flex-shrink-0">
                      <Image
                        src={quoteImage}
                        alt={quoteAuthor}
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                        quality={90}
                      />
                    </div>
                  )}

                  <div>
                    {quoteAuthor && (
                      <p className="font-bold text-slate-950 text-sm md:text-base">
                        {quoteAuthor}
                      </p>
                    )}
                    {quoteTitle && (
                      <p className="text-slate-500 text-xs">{quoteTitle}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Decoración esquina */}
              <div className="absolute bottom-4 right-4">
                <Quote className="w-8 h-8 text-slate-100" />
              </div>
            </div>

            {/* Badge MEISA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-slate-950 text-white px-4 py-2 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.15em]"
            >
              Desde {foundingYear}
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
