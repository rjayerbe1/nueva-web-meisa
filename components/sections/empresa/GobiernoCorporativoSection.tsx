'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowUpRight } from 'lucide-react'
import type { GobiernoItemPublic } from '@/lib/content/empresa'

interface Props {
  items: GobiernoItemPublic[]
}

function ItemButton({ item }: { item: GobiernoItemPublic }) {
  const url = item.documentoUrl || item.linkExterno
  if (!url) {
    return (
      <p className="mt-6 text-slate-400 font-lato text-xs uppercase tracking-[0.15em]">
        Documento en actualización
      </p>
    )
  }
  const isExternal = url.startsWith('http')
  const isForm = item.tipo === 'formulario'
  const label = item.textoBoton || (isForm ? 'Diligenciar formulario' : 'Abrir PDF')
  const Icon = isForm ? ArrowUpRight : FileText

  return (
    <a
      href={url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group mt-6 inline-flex items-center justify-center gap-2.5 px-6 py-3 border border-slate-950/30 text-slate-950 font-lato font-bold text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 hover:border-slate-950 hover:bg-slate-950 hover:text-white self-start"
    >
      <Icon className="w-4 h-4" />
      {label}
    </a>
  )
}

export function GobiernoCorporativoSection({ items }: Props) {
  if (items.length === 0) return null

  const documentos = items.filter((i) => i.tipo !== 'formulario')
  const formularios = items.filter((i) => i.tipo === 'formulario')

  return (
    <section
      id="gobierno-corporativo"
      className="relative bg-white text-slate-950 py-20 md:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            Cumplimiento y transparencia
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
            Gobierno
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
            corporativo
          </h3>
        </motion.div>

        {/* Documentos — formato documento oficial */}
        {documentos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {documentos.map((doc, i) => (
              <motion.article
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-stone-50 p-8 md:p-10 flex flex-col"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                  Documento {String(i + 1).padStart(2, '0')}
                </p>
                <h4 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-4">
                  {doc.titulo}
                </h4>
                {doc.descripcion && (
                  <p className="text-slate-700 font-lato text-sm leading-relaxed flex-1">
                    {doc.descripcion}
                  </p>
                )}
                <ItemButton item={doc} />
              </motion.article>
            ))}
          </div>
        )}

        {/* Formularios — canal de denuncias y conflictos de interés */}
        {formularios.length > 0 && (
          <div className="mt-px grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 md:border-t-0">
            {formularios.map((form, i) => (
              <motion.article
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white p-8 md:p-10 flex flex-col"
              >
                <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                  Formulario
                </p>
                <h4 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] mb-4">
                  {form.titulo}
                </h4>
                {form.descripcion && (
                  <p className="text-slate-700 font-lato text-sm leading-relaxed flex-1">
                    {form.descripcion}
                  </p>
                )}
                <ItemButton item={form} />
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
