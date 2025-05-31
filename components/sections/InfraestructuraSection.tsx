'use client'

import { motion } from 'framer-motion'
import { Building2, MapPin, Truck, Construction, ExternalLink, Factory, Forklift, Warehouse } from 'lucide-react'

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
    googleMaps: "https://goo.gl/maps/gZ8ftUnD7Wckx6A96",
    imagen: "/images/about/planta-produccion.webp",
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
    googleMaps: "https://goo.gl/maps/SnHGyu5xrNRKFhgN8",
    imagen: "/images/about/planta-produccion.webp",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 3,
    nombre: "Planta Villa Rica",
    ubicacion: "Vía Puerto Tejada – Villa Rica, Vereda Agua Azul, Cauca",
    tipo: "Planta de Apoyo",
    capacidad: "En desarrollo",
    area: "En expansión",
    naves: 1,
    puentesGrua: 0,
    mesasCorte: 0,
    equiposEspeciales: [],
    googleMaps: "https://www.google.com/maps/@3.1985885,-76.4442089,15z",
    imagen: "/images/about/planta-produccion.webp",
    color: "from-green-500 to-green-600"
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
          <h2 className="text-blue-600 font-semibold text-lg mb-2">Nuestra Infraestructura</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plantas
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"> Industriales</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            3 plantas estratégicamente ubicadas con capacidad total de 600 toneladas/mes
          </p>
        </motion.div>

        {/* Grid de plantas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plantas.map((planta, index) => (
            <motion.div
              key={planta.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                {/* Header con gradiente */}
                <div className={`h-32 bg-gradient-to-br ${planta.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 p-6">
                    <h4 className="text-xl font-bold text-white mb-2">{planta.nombre}</h4>
                    <p className="text-white/80 text-sm">{planta.tipo}</p>
                  </div>
                  {/* Decoración */}
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-16 h-16 opacity-20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Building2 className="w-full h-full text-white" />
                  </motion.div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {/* Ubicación */}
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{planta.ubicacion}</p>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{planta.capacidad}</p>
                      <p className="text-xs text-gray-500">Capacidad</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{planta.area}</p>
                      <p className="text-xs text-gray-500">Área Total</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{planta.naves}</p>
                      <p className="text-xs text-gray-500">Naves</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{planta.puentesGrua}</p>
                      <p className="text-xs text-gray-500">Puentes Grúa</p>
                    </div>
                  </div>

                  {/* Equipos especiales */}
                  {planta.equiposEspeciales.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Equipos Especiales:</p>
                      <ul className="space-y-1">
                        {planta.equiposEspeciales.map((equipo, idx) => (
                          <li key={idx} className="text-sm text-blue-600">• {equipo}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enlace a Google Maps */}
                  <a
                    href={planta.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors group"
                  >
                    Ver en Google Maps
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
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
          <h4 className="text-2xl font-bold text-gray-900 text-center mb-12">Equipos y Maquinaria Especializada</h4>
          
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
                  
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">{categoria.categoria}</h5>
                  <p className="text-gray-600 text-sm mb-4">{categoria.descripcion}</p>
                  
                  <div className="space-y-2">
                    {categoria.equipos.map((equipo, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-gray-600 text-sm">{equipo}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Resumen de capacidades */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-gray-50 border border-gray-200 rounded-2xl p-8 text-center"
        >
          <h4 className="text-xl font-bold text-gray-900 mb-4">Capacidad Total Combinada</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl font-bold text-blue-600">600</p>
              <p className="text-sm text-gray-600">Ton/mes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10,400</p>
              <p className="text-sm text-gray-600">m² área total</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">8</p>
              <p className="text-sm text-gray-600">Puentes grúa</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">Mesas CNC</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}