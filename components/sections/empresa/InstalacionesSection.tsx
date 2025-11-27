'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Weight, Scale, Ruler, ExternalLink } from 'lucide-react'
import { PLANTS, COMPANY_STATS } from '@/lib/company-data'
import { useCountUp } from '@/hooks/useCountUp'

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const count = useCountUp(isInView ? value : 0, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
        {value >= 1000 ? count.toLocaleString() : count}{suffix}
      </div>
      <div className="text-gray-600 text-sm md:text-base">{label}</div>
    </motion.div>
  )
}

// Coordenadas reales para los mapas embebidos
const plantCoordinates = {
  'Planta Jamundí': { lat: 3.2487839, lng: -76.5263946, placeId: '0x8e309ea112757501:0x2cfda6d9126079df' },
  'Planta Popayán': { lat: 2.5024167, lng: -76.5598033, placeId: '0x8e30042e3d132a67:0xedbc4d22716e928a' },
  'Planta Villa Rica': { lat: 3.1878965, lng: -76.4486029, placeId: '0x8e3a7700295ca9bf:0xa6b69c2179a47088' }
}

export function InstalacionesSection() {
  return (
    <section id="instalaciones" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestras <span className="text-blue-600">Instalaciones</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            3 plantas estratégicamente ubicadas en el suroccidente colombiano,
            con capacidad para servir proyectos en todo el territorio nacional
          </p>
        </motion.div>

        {/* Plantas Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANTS.map((planta, index) => {
            const coords = plantCoordinates[planta.name as keyof typeof plantCoordinates]

            return (
              <motion.div
                key={planta.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 h-full flex flex-col">
                  {/* Mapa embebido */}
                  <div className="h-48 relative overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500!2d${coords.lng}!3d${coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${coords.placeId}!2sMetálicas+e+Ingeniería+S.A.S.!5e0!3m2!1ses!2sco!4v1700000000000`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {planta.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{planta.location}</span>
                    </p>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {planta.description}
                    </p>

                    {/* Stats */}
                    {'area' in planta && planta.area && (
                      <div className="flex gap-3 text-sm mb-4">
                        <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Ruler className="w-4 h-4 text-blue-500" />
                          <span>{planta.area.toLocaleString()} m² {'naves' in planta && planta.naves && `| ${planta.naves} ${planta.naves === 1 ? 'nave' : 'naves'}`}</span>
                        </div>
                        {'craneCapacity' in planta && planta.craneCapacity && (
                          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Weight className="w-4 h-4 text-blue-500" />
                            <span>Izaje hasta {planta.craneCapacity} ton</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link a Google Maps */}
                    <a
                      href={planta.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors mt-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
