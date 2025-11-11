"use client"

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 shadow-md border border-blue-100"
    >
      {/* Título destacado */}
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        {titulo}
      </h3>

      {/* Collage de fotos - Solo si hay imágenes */}
      {imagenesFeatured && imagenesFeatured.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          imagenesFeatured.length === 1 ? 'grid-cols-1' :
          imagenesFeatured.length === 2 ? 'grid-cols-2' :
          imagenesFeatured.length === 3 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {imagenesFeatured.slice(0, 4).map((imagen, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden ${
                imagenesFeatured.length === 3 && index === 0 ? 'col-span-2' :
                imagenesFeatured.length === 4 && index < 2 ? 'aspect-[4/3]' :
                'aspect-[4/3]'
              }`}
            >
              <img
                src={imagen}
                alt={`Proyecto destacado ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Descripción */}
      <p className="text-slate-700 text-sm leading-relaxed mb-4">
        {descripcion}
      </p>

      {/* Categorías principales */}
      {categorias && categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categorias.slice(0, 3).map((categoria, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium"
            >
              {categoria}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}
