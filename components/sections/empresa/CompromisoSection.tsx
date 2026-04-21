'use client'

import { motion } from 'framer-motion'
import { Shield, Leaf, Award, CheckCircle } from 'lucide-react'
import type {
  EmpresaConfig,
  CertificacionItem,
  NormaItem,
} from '@/lib/content/empresa'

interface Props {
  config: EmpresaConfig | null
  certificaciones: CertificacionItem[]
  normas: NormaItem[]
}

export function CompromisoSection({ config, certificaciones, normas }: Props) {
  const seguridad = {
    titulo: config?.seguridadTitulo ?? 'Seguridad Laboral',
    items: config?.seguridadItems ?? [],
    meta: config?.seguridadMeta ?? '',
  }
  const sostenibilidad = {
    titulo: config?.sostenibilidadTitulo ?? 'Sostenibilidad',
    items: config?.sostenibilidadItems ?? [],
    compromiso: config?.sostenibilidadCompromiso ?? '',
  }
  const principal = certificaciones[0]

  return (
    <section id="compromiso" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mb-16"
        >
          <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            03 — Cómo trabajamos
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
            Nuestro
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
            compromiso
          </h3>
          <p className="mt-6 text-slate-700 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
            Seguridad, sostenibilidad y cumplimiento normativo en cada proyecto.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna 1: Seguridad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {seguridad.titulo}
              </h3>
            </div>
            <ul className="space-y-2">
              {seguridad.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            {seguridad.meta && (
              <p className="text-blue-600 font-semibold text-sm mt-4">
                {seguridad.meta}
              </p>
            )}
          </motion.div>

          {/* Columna 2: Sostenibilidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {sostenibilidad.titulo}
              </h3>
            </div>
            <ul className="space-y-2">
              {sostenibilidad.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            {sostenibilidad.compromiso && (
              <p className="text-green-600 font-semibold text-sm mt-4">
                {sostenibilidad.compromiso}
              </p>
            )}
          </motion.div>

          {/* Columna 3: Certificación y Normas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Certificación y Normas
              </h3>
            </div>

            {/* Certificación principal */}
            {principal && (
              <div className="flex items-center gap-3 mb-4">
                {principal.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={principal.logo}
                    alt={`Logo ${principal.nombre}`}
                    className="h-10 object-contain"
                  />
                )}
                <div>
                  <p className="text-gray-700 text-sm font-medium">
                    {principal.nombreCompleto ?? principal.nombre}
                  </p>
                  {principal.emisor && (
                    <p className="text-gray-500 text-xs">{principal.emisor}</p>
                  )}
                </div>
              </div>
            )}

            {/* Normas */}
            {normas.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                  Normas que cumplimos
                </p>
                <div className="flex flex-wrap gap-2">
                  {normas.map((norm) => (
                    <span
                      key={norm.id}
                      className="border border-slate-300 text-slate-700 px-2.5 py-1 text-xs font-lato font-bold uppercase tracking-wider"
                      title={norm.descripcion}
                    >
                      {norm.codigo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
