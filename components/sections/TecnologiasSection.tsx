'use client'

import { motion } from 'framer-motion'
import { Monitor, Settings, Layers, Home, Link as LinkIcon, Building, Cpu, Scissors } from 'lucide-react'

const tecnologias = [
  {
    id: 1,
    nombre: "Tekla Structures",
    descripcion: "Software BIM líder mundial en estructura metálicas y de concreto",
    categoria: "Diseño BIM",
    icon: Monitor,
    color: "from-slate-600 to-slate-700",
    features: ["Modelado 3D", "BIM", "Estructuras metálicas", "Estructuras de concreto"]
  },
  {
    id: 2,
    nombre: "RISA-3D",
    descripcion: "Paquete integrado de software para el análisis y el diseño de edificios",
    categoria: "Análisis Estructural",
    icon: Settings,
    color: "from-blue-600 to-blue-700",
    features: ["Análisis 3D", "Diseño de edificios", "Cálculo estructural", "Integración completa"]
  },
  {
    id: 3,
    nombre: "RISA Steel",
    descripcion: "Permite diseñar acero, hormigón, aluminio, mampostería, madera para estructuras industriales y comerciales",
    categoria: "Diseño Multi-material",
    icon: Building,
    color: "from-gray-600 to-gray-700",
    features: ["Diseño de acero", "Hormigón", "Aluminio", "Mampostería", "Madera"]
  },
  {
    id: 4,
    nombre: "RISAFloor",
    descripcion: "Diseña sistemas de pisos y trabaja con RISA-3D y RISAFoundation",
    categoria: "Sistemas de Pisos",
    icon: Layers,
    color: "from-slate-500 to-slate-600",
    features: ["Sistemas de pisos", "Integración RISA-3D", "RISAFoundation", "Diseño optimizado"]
  },
  {
    id: 5,
    nombre: "RISAConnection",
    descripcion: "Solución para diseño de conexiones. Memorias de cálculo de ingeniería le dan la capacidad para comprobar rápidamente todos los aspectos del diseño",
    categoria: "Conexiones",
    icon: LinkIcon,
    color: "from-blue-700 to-blue-800",
    features: ["Diseño de conexiones", "Memorias de cálculo", "Verificación rápida", "Ingeniería detallada"]
  },
  {
    id: 6,
    nombre: "RISAFoundation",
    descripcion: "Diseño de cimentaciones completas, incluyendo losas, zapatas, vigas de amarre y muros",
    categoria: "Cimentaciones",
    icon: Home,
    color: "from-gray-700 to-gray-800",
    features: ["Cimentaciones completas", "Losas", "Zapatas", "Vigas de amarre", "Muros"]
  },
  {
    id: 7,
    nombre: "StruM.I.S",
    descripcion: "Software líder mundial en gestión integral y control de producción para fabricantes de estructuras metálicas",
    categoria: "Gestión de Producción",
    icon: Cpu,
    color: "from-slate-700 to-slate-800",
    features: ["Gestión integral", "Control de producción", "Fabricantes", "Líder mundial"]
  },
  {
    id: 8,
    nombre: "FastCAM",
    descripcion: "Proveedor líder de software de ingeniería para máquina de corte por Plasma y Oxicorte",
    categoria: "Fabricación CNC",
    icon: Scissors,
    color: "from-blue-800 to-gray-700",
    features: ["Corte por Plasma", "Oxicorte", "Máquinas CNC", "Ingeniería de corte"]
  }
]

export function TecnologiasSection() {
  return (
    <section id="tecnologias" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-400 font-semibold text-lg mb-2">Tecnología de Vanguardia</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Software
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-300"> Especializado</span>
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            8 herramientas tecnológicas de clase mundial que nos permiten ofrecer diseños precisos, 
            fabricación eficiente y gestión integral de proyectos
          </p>
        </motion.div>

        {/* Grid de tecnologías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tecnologias.map((tech, index) => {
            const Icon = tech.icon
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  {/* Icono y categoría */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
                      {tech.categoria}
                    </span>
                  </div>

                  {/* Nombre del software */}
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-300 group-hover:to-blue-400 transition-all">
                    {tech.nombre}
                  </h4>

                  {/* Descripción */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {tech.descripcion}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {tech.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.color}`} />
                        <span className="text-xs text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Decoración animada */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-8 h-8 opacity-10"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${tech.color}`} />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Sección de flujo de trabajo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl p-8 border border-gray-600"
        >
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-white mb-4">Flujo de Trabajo Integrado</h4>
            <p className="text-gray-300">
              Desde el diseño conceptual hasta la fabricación final, nuestro stack tecnológico 
              garantiza precisión y eficiencia en cada etapa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-white mb-2">1. Diseño BIM</h5>
              <p className="text-sm text-gray-300">Tekla Structures para modelado 3D completo</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-white mb-2">2. Análisis</h5>
              <p className="text-sm text-gray-300">Suite RISA para cálculos estructurales</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-white mb-2">3. Gestión</h5>
              <p className="text-sm text-gray-300">StruM.I.S para control de producción</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-white mb-2">4. Fabricación</h5>
              <p className="text-sm text-gray-300">FastCAM para corte CNC preciso</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}