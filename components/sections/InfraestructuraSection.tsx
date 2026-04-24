'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, MapPin, Truck, Construction, ExternalLink, Factory, Forklift, Warehouse, Gauge, Ruler, Home, X } from 'lucide-react'
import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'

const plantas = [
  {
    id: 1,
    nombre: "Sede Principal Jamundí",
    ubicacion: "Vía Panamericana 6 Sur – 195 – Valle del Cauca",
    tipo: "Sede Administrativa y Producción",
    capacidad: "250 ton/mes",
    area: "6,000 m²",
    naves: 1,
    puentesGrua: 3,
    mesasCorte: 1,
    equiposEspeciales: ["Ensambladora de Perfiles"],
    googleMaps: "https://www.google.com/maps/place/Met%C3%A1licas+e+Ingenier%C3%ADa+S.A.S./@3.2487893,-76.5289749,17z/data=!3m1!4b1!4m6!3m5!1s0x8e309ea112757501:0x2cfda6d9126079df!8m2!3d3.2487839!4d-76.5263946!16s%2Fg%2F11c75_b9hv?entry=ttu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.090874524427!2d-76.5289749!3d3.2487893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e309ea112757501%3A0x2cfda6d9126079df!2zTWV0w6FsaWNhcyBlIEluZ2VuaWVyw61hIFMuQS5TLg!5e0!3m2!1ses!2sco!4v1699999999999",
    imagen: "https://storage.googleapis.com/meisa-imagenes/site/about/planta-produccion.webp",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    nombre: "Planta Popayán",
    ubicacion: "Bodega E13 Parque Industrial – Cauca",
    tipo: "Planta Principal de Producción",
    capacidad: "350 ton/mes",
    area: "4,400 m²",
    naves: 3,
    puentesGrua: 5,
    mesasCorte: 2,
    equiposEspeciales: [],
    googleMaps: "https://www.google.com/maps/place/Met%C3%A1licas+E+Ingenier%C3%ADa+S.A./@2.5024221,-76.5623836,17z/data=!3m1!4b1!4m6!3m5!1s0x8e30042e3d132a67:0xedbc4d22716e928a!8m2!3d2.5024167!4d-76.5598033!16s%2Fg%2F1hdzvkr66?entry=ttu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7609843675785!2d-76.5623836!3d2.5024221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30042e3d132a67%3A0xedbc4d22716e928a!2zTWV0w6FsaWNhcyBFIEluZ2VuaWVyw61hIFMuQS4!5e0!3m2!1ses!2sco!4v1699999999998",
    imagen: "https://storage.googleapis.com/meisa-imagenes/site/about/planta-produccion.webp",
    color: "from-blue-600 to-blue-700"
  },
  {
    id: 3,
    nombre: "Planta Villa Rica",
    ubicacion: "Vía Puerto Tejada – Villa Rica, Cauca",
    tipo: "Planta de Apoyo",
    capacidad: "En desarrollo",
    area: "En expansión",
    naves: 1,
    puentesGrua: 0,
    mesasCorte: 0,
    equiposEspeciales: [],
    googleMaps: "https://www.google.com/maps/place/MEISA+-+VILLA+RICA/@3.1879019,-76.4511832,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3a7700295ca9bf:0xa6b69c2179a47088!8m2!3d3.1878965!4d-76.4486029!16s%2Fg%2F11zkbv1dth?entry=ttu",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5371893449743!2d-76.4511832!3d3.1879019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3a7700295ca9bf%3A0xa6b69c2179a47088!2sMEISA%20-%20VILLA%20RICA!5e0!3m2!1ses!2sco!4v1699999999997",
    imagen: "https://storage.googleapis.com/meisa-imagenes/site/about/planta-produccion.webp",
    color: "from-slate-600 to-slate-700"
  }
]

const equiposGenerales = [
  {
    categoria: "Transporte & Montaje",
    descripcion: "Contamos con nuestro propio equipo de transporte necesario para transportar hasta 100 toneladas de materiales y estructura.",
    equipos: ["Mulas", "Cama Bajas", "Camiones", "Camionetas", "Torre Grúa", "Grúas", "Montacargas", "Elevadores", "Camión Grúa"],
    icon: Forklift,
    color: "from-slate-600 to-slate-700"
  },
  {
    categoria: "Construcción & Obra Civil",
    descripcion: "Contamos con nuestros propios equipos para construcción de obras civiles.",
    equipos: ["Planta de Concreto", "Bomba de Concreto", "Retroexcavadora", "Cargador", "Bobcat", "Mini Cargador"],
    icon: Factory,
    color: "from-blue-600 to-blue-700"
  },
  {
    categoria: "Cubiertas & Losas",
    descripcion: "Junto con nuestro personal calificado con más de 20 años de experiencia en montaje de cubiertas y fachadas.",
    equipos: ["Máquina Teja Standing Seam", "Máquina Curvadora de Teja", "Máquina Formadora de Canales", "Máquina Formadora de Steel Deck", "Soldadora de Studs"],
    icon: Warehouse,
    color: "from-gray-600 to-gray-700"
  }
]

export function InfraestructuraSection() {
  const [selectedPlanta, setSelectedPlanta] = useState<typeof plantas[0] | null>(null)

  return (
    <section id="infraestructura" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 font-bebas uppercase text-xl mb-2">Nuestra Infraestructura</h2>
          <h3 className="text-5xl md:text-6xl font-bebas uppercase text-gray-900 mb-4">
            Plantas
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"> Industriales</span>
          </h3>
          <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
            3 plantas estratégicamente ubicadas con capacidad total de 600 toneladas/mes
          </p>
        </motion.div>

        {/* Grid de plantas - Diseño Moderno y Compacto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plantas.map((planta, index) => (
            <motion.div
              key={planta.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedPlanta(planta)}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 h-full flex flex-col">
                {/* Mapa embebido más grande con efecto zoom */}
                <div className="relative h-80 overflow-hidden">
                  <motion.iframe
                    src={planta.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      pointerEvents: 'none'
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    whileHover={{ scale: 1.05 }}
                  />

                  {/* Overlay invisible para prevenir interacción con el mapa */}
                  <div className="absolute inset-0 pointer-events-none" />

                  {/* Overlay con gradiente dramático */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge flotante con glassmorphism - Ancho completo */}
                  <div className="absolute top-0 left-0 right-0">
                    <div className={`bg-gradient-to-br ${planta.color} backdrop-blur-md bg-opacity-95 px-6 py-4 shadow-2xl`}>
                      <h4 className="text-2xl font-bebas uppercase text-white mb-0.5">{planta.nombre}</h4>
                      <p className="text-white/90 text-xs font-bebas uppercase">{planta.tipo}</p>
                    </div>
                  </div>

                  {/* Badge de ubicación en la parte inferior */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <p className="text-gray-700 text-xs font-lato line-clamp-2">{planta.ubicacion}</p>
                    </div>
                  </div>
                </div>

                {/* Stats horizontales con iconos grandes */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Capacidad */}
                    <div className="flex flex-col items-center flex-1 group/stat">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planta.color} flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform duration-300`}>
                        <Gauge className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-bebas text-gray-900 leading-none mb-1 text-center">{planta.capacidad.split(' ')[0]}</p>
                      <p className="text-[9px] text-gray-500 font-bebas uppercase tracking-wide text-center whitespace-nowrap">{planta.capacidad.includes('ton') ? 'ton/mes' : planta.capacidad}</p>
                    </div>

                    <div className="w-px h-14 bg-gray-200"></div>

                    {/* Área */}
                    <div className="flex flex-col items-center flex-1 group/stat">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planta.color} flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform duration-300`}>
                        <Ruler className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-bebas text-gray-900 leading-none mb-1 text-center">{planta.area.split(' ')[0]}</p>
                      <p className="text-[9px] text-gray-500 font-bebas uppercase tracking-wide text-center whitespace-nowrap">{planta.area.includes('m²') ? 'm²' : planta.area}</p>
                    </div>

                    <div className="w-px h-14 bg-gray-200"></div>

                    {/* Naves */}
                    <div className="flex flex-col items-center flex-1 group/stat">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planta.color} flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform duration-300`}>
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-bebas text-gray-900 leading-none mb-1 text-center">{planta.naves}</p>
                      <p className="text-[9px] text-gray-500 font-bebas uppercase tracking-wide text-center">Naves</p>
                    </div>

                    <div className="w-px h-14 bg-gray-200"></div>

                    {/* Puentes Grúa */}
                    <div className="flex flex-col items-center flex-1 group/stat">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planta.color} flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform duration-300`}>
                        <Construction className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-bebas text-gray-900 leading-none mb-1 text-center">{planta.puentesGrua}</p>
                      <p className="text-[9px] text-gray-500 font-bebas uppercase tracking-wide text-center">Grúas</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sección de equipos generales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h4 className="text-3xl font-bebas uppercase text-gray-900 text-center mb-12">Equipos y Maquinaria Especializada</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equiposGenerales.map((categoria, index) => {
              const Icon = categoria.icon
              return (
                <motion.div
                  key={categoria.categoria}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${categoria.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h5 className="text-xl font-bebas uppercase text-gray-900 mb-3">{categoria.categoria}</h5>
                  <p className="text-gray-600 font-lato text-sm mb-4">{categoria.descripcion}</p>

                  <div className="space-y-2">
                    {categoria.equipos.map((equipo, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-gray-600 font-lato text-sm">{equipo}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Capacidad Total - Usando componente unificado */}
        <div className="mt-16">
          <UnifiedStatsGrid
            title="Capacidad Total Combinada"
            subtitle="Infraestructura distribuida estratégicamente para máxima eficiencia productiva"
            stats={[
              { number: "600", label: "Capacidad Total", suffix: " ton/mes" },
              { number: "10,400", label: "Área Total", suffix: " m²" },
              { number: "8", label: "Puentes Grúa", suffix: "" },
              { number: "3", label: "Mesas CNC", suffix: "" }
            ]}
            variant="compact"
            colorScheme="blue"
            columns={4}
            showDecorator={false}
          />
        </div>
      </div>

      {/* Modal de detalle de planta */}
      <AnimatePresence>
        {selectedPlanta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPlanta(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedPlanta(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header con gradiente */}
              <div className={`relative bg-gradient-to-br ${selectedPlanta.color} px-8 py-8`}>
                <h3 className="text-4xl font-bebas uppercase text-white mb-2">{selectedPlanta.nombre}</h3>
                <p className="text-white/90 font-bebas uppercase text-lg">{selectedPlanta.tipo}</p>
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <MapPin className="w-5 h-5" />
                  <p className="text-sm font-lato">{selectedPlanta.ubicacion}</p>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-8">
                {/* Mapa grande interactivo */}
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={selectedPlanta.mapEmbed}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>

                {/* Stats detalladas en grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${selectedPlanta.color} flex items-center justify-center`}>
                      <Gauge className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bebas text-gray-900 mb-1">{selectedPlanta.capacidad}</p>
                    <p className="text-xs text-gray-600 font-bebas uppercase">Capacidad</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${selectedPlanta.color} flex items-center justify-center`}>
                      <Ruler className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bebas text-gray-900 mb-1">{selectedPlanta.area}</p>
                    <p className="text-xs text-gray-600 font-bebas uppercase">Área Total</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${selectedPlanta.color} flex items-center justify-center`}>
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bebas text-gray-900 mb-1">{selectedPlanta.naves}</p>
                    <p className="text-xs text-gray-600 font-bebas uppercase">Naves Industriales</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${selectedPlanta.color} flex items-center justify-center`}>
                      <Construction className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bebas text-gray-900 mb-1">{selectedPlanta.puentesGrua}</p>
                    <p className="text-xs text-gray-600 font-bebas uppercase">Puentes Grúa</p>
                  </div>
                </div>

                {/* Botón para abrir en Google Maps */}
                <a
                  href={selectedPlanta.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r ${selectedPlanta.color} hover:shadow-xl text-white px-6 py-4 rounded-xl font-lato font-bold transition-all duration-300 group`}
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Abrir en Google Maps
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}