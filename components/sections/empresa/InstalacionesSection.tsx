'use client'

import { motion } from 'framer-motion'
import { MapPin, Weight, Ruler } from 'lucide-react'
import type { PlantaPublica } from '@/lib/content/plantas'

interface Props {
  plantas: PlantaPublica[]
}

export function InstalacionesSection({ plantas }: Props) {
  if (plantas.length === 0) return null

  return (
    <section id="instalaciones" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mb-16"
        >
          <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            02 — Dónde fabricamos
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-950">
            Nuestras
          </h2>
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-slate-300">
            instalaciones
          </h3>
          <p className="mt-6 text-slate-700 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
            {plantas.length} plantas estratégicamente ubicadas en el suroccidente colombiano, con capacidad para servir proyectos en todo el territorio nacional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {plantas.map((planta, index) => (
            <motion.div
              key={planta.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white border border-slate-200 hover:border-slate-400 transition-colors duration-300 h-full flex flex-col">
                {planta.mapEmbedUrl && (
                  <div className="h-48 relative overflow-hidden border-b border-slate-200">
                    <iframe
                      src={planta.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    {/* Overlay clickable que tapa el botón "Maps" de Google y lo reemplaza por nuestro link */}
                    {planta.googleMapsUrl ? (
                      <a
                        href={planta.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/map absolute top-2 left-2 z-10 bg-white border border-slate-200 px-2.5 py-1 flex items-center gap-1.5 shadow-sm hover:bg-slate-950 hover:border-slate-950 transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-slate-600 group-hover/map:text-white transition-colors" strokeWidth={2.5} />
                        <span className="font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-slate-700 group-hover/map:text-white transition-colors">
                          Ver en Maps
                        </span>
                      </a>
                    ) : (
                      <div className="absolute top-2 left-2 z-10 bg-white border border-slate-200 px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                        <MapPin className="w-3 h-3 text-slate-600" strokeWidth={2.5} />
                        <span className="font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-slate-700">
                          Ubicación
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-400 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Planta {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-4">
                    {planta.nombre}
                  </h3>

                  <p className="text-slate-600 font-lato text-sm flex items-start gap-2 mb-4 leading-relaxed">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{planta.ubicacion}</span>
                  </p>

                  {planta.descripcion && (
                    <p className="text-slate-700 font-lato text-sm mb-5 flex-1 leading-relaxed">
                      {planta.descripcion}
                    </p>
                  )}

                  {(planta.areaM2 || planta.capacidadGruaTon) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 py-3 border-y border-slate-200 mb-5">
                      {planta.areaM2 && (
                        <div className="flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-lato font-semibold text-slate-700 text-[11px] uppercase tracking-[0.12em]">
                            {planta.areaM2.toLocaleString('es-CO')} m²
                            {planta.naves && ` · ${planta.naves} ${planta.naves === 1 ? 'nave' : 'naves'}`}
                          </span>
                        </div>
                      )}
                      {planta.capacidadGruaTon && (
                        <div className="flex items-center gap-1.5">
                          <Weight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-lato font-semibold text-slate-700 text-[11px] uppercase tracking-[0.12em]">
                            Izaje {planta.capacidadGruaTon} ton
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
