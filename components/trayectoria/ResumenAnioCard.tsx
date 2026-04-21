"use client"

import { motion } from 'framer-motion'

interface ResumenAnio {
  id: string
  anio: number
  titulo: string
  descripcion: string
  categorias: string[] | null
  imagenesFeatured: string[] | null
  estadisticas: {
    proyectos: number
    toneladas: number
    m2: number
  } | null
  visible: boolean
}

interface Props {
  resumen: ResumenAnio
}

export function ResumenAnioCard({ resumen }: Props) {
  const { titulo, descripcion, categorias, imagenesFeatured } = resumen

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200"
    >
      {/* Collage de fotos - full width, arriba */}
      {imagenesFeatured && imagenesFeatured.length > 0 && (
        <div className={`grid gap-px bg-slate-200 ${
          imagenesFeatured.length === 1 ? 'grid-cols-1' :
          imagenesFeatured.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {imagenesFeatured.slice(0, 4).map((imagen, index) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-white ${
                imagenesFeatured.length === 3 && index === 0 ? 'col-span-2 aspect-[16/9]' :
                'aspect-[4/3]'
              }`}
            >
              <img
                src={imagen}
                alt={`Proyecto destacado ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Eyebrow */}
        <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
          Resumen del año
        </p>

        {/* Título brutalist */}
        <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] text-slate-950 mb-4">
          {titulo}
        </h3>

        {/* Descripción */}
        <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed mb-5">
          {descripcion}
        </p>

        {/* Categorías como badges sharp */}
        {categorias && categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
            {categorias.slice(0, 4).map((categoria, index) => (
              <span
                key={index}
                className="border border-slate-300 px-2.5 py-1 text-[10px] md:text-xs font-lato font-bold text-slate-700 uppercase tracking-wider"
              >
                {categoria}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
