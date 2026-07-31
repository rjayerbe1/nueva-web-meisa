'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface ContactoConfig {
  pbx?: string | null
  movil?: string | null
  email?: string | null
  horarioSemana?: string | null
  horarioSabado?: string | null
  whatsappNumero?: string | null
}

export interface ContactSectionCopy {
  eyebrow?: string | null
  titulo?: string | null
  descripcion?: string | null
  cta1?: string | null
  cta2?: string | null
}

interface ContactSectionProps {
  config?: ContactoConfig | null
  copy?: ContactSectionCopy | null
  foundingYear?: number
}

export function ContactSection({
  config,
  copy,
  foundingYear = 1996,
}: ContactSectionProps = {}) {
  const yearsExperience = new Date().getFullYear() - foundingYear
  // Sin fallback hardcodeado: el número sale de ConfiguracionContacto
  // (/admin/contacto). Si no hay, se ocultan los CTA de WhatsApp/llamada en vez
  // de mandar a un número viejo pegado en el código.
  const whatsappNumber = (config?.whatsappNumero ?? '').replace(/\D/g, '')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, me gustaría solicitar información sobre sus servicios.'
      )}`
    : null

  const eyebrow = copy?.eyebrow || 'Contacto'
  const titulo =
    copy?.titulo ||
    'Hablemos de tu\npróximo proyecto'
  const tituloLineas = titulo.split('\n')
  const descripcion =
    copy?.descripcion ||
    `Más de ${yearsExperience}+ años respaldándonos. Cuéntanos qué necesitas construir y recibirás una cotización personalizada.`
  const cta1Text = copy?.cta1 || 'Solicitar cotización'
  const cta2Text = copy?.cta2 || 'WhatsApp'

  const pbx = config?.pbx || '+57 (2) 312 0050'
  const movil = config?.movil || '+57 (310) 432 7227'
  const email = config?.email || 'contacto@meisa.com.co'
  const horarioSemana = config?.horarioSemana || 'Lun – Vie · 7:00 AM – 5:00 PM'
  const horarioSabado = config?.horarioSabado || 'Sáb · 8:00 AM – 12:00 PM'

  return (
    <section id="contacto" className="relative bg-slate-950 text-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </p>
          {tituloLineas.map((linea, i) => (
            <h2
              key={i}
              className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]"
            >
              {linea}
            </h2>
          ))}
          <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
            {descripcion}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-16 md:mb-20"
        >
          <Link
            href="/contacto"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
          >
            {cta1Text}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:border-white hover:bg-white hover:text-slate-950"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {cta2Text}
          </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-white/10 pt-12 md:pt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:divide-x md:divide-white/10">
            <div className="md:pr-10">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-white/70" strokeWidth={2.5} />
                <span className="text-white/50 font-lato text-xs uppercase tracking-[0.2em]">
                  Teléfonos
                </span>
              </div>
              <p className="font-lato text-white text-base md:text-lg mb-1">
                {pbx}
              </p>
              <p className="font-lato text-white/70 text-sm md:text-base mb-4">
                Móvil {movil}
              </p>
              {whatsappNumber && (
                <a
                  href={`tel:${whatsappNumber}`}
                  className="group inline-flex items-center gap-2 text-white font-lato font-bold text-sm transition-colors hover:text-white"
                >
                  Llamar ahora
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>

            <div className="md:px-10">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-white/70" strokeWidth={2.5} />
                <span className="text-white/50 font-lato text-xs uppercase tracking-[0.2em]">
                  Email
                </span>
              </div>
              <p className="font-lato text-white text-base md:text-lg mb-8 break-all">
                {email}
              </p>
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-2 text-white font-lato font-bold text-sm transition-colors hover:text-white"
              >
                Enviar email
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="md:pl-10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-white/70" strokeWidth={2.5} />
                <span className="text-white/50 font-lato text-xs uppercase tracking-[0.2em]">
                  Horario
                </span>
              </div>
              <p className="font-lato text-white text-base md:text-lg mb-1">
                {horarioSemana}
              </p>
              <p className="font-lato text-white/70 text-sm md:text-base">
                {horarioSabado}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
