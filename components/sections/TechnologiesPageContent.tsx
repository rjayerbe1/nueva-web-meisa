'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Cpu, 
  Layers, 
  Zap, 
  Settings, 
  Monitor,
  Database,
  BarChart3,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Factory,
  Eye,
  Target
} from 'lucide-react'

const softwareTools = [
  {
    category: 'Diseño e Ingeniería',
    tools: [
      {
        name: 'Tekla Structures',
        description: 'Software BIM líder mundial para modelado de estructuras metálicas y concreto',
        features: [
          'Modelado 3D detallado de estructuras complejas',
          'Coordinación multidisciplinaria BIM',
          'Generación automática de planos de fabricación',
          'Detección de interferencias',
          'Cuantificación exacta de materiales'
        ],
        icon: Layers,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'Suite RISA',
        description: 'Herramientas completas para análisis y diseño estructural',
        features: [
          'RISA-3D: Análisis y diseño integral de edificios',
          'RISAFloor: Diseño optimizado de sistemas de pisos',
          'RISAConnection: Diseño detallado de conexiones',
          'RISAFoundation: Cálculo de cimentaciones completas'
        ],
        icon: BarChart3,
        color: 'from-green-500 to-green-600'
      }
    ]
  },
  {
    category: 'Gestión y Producción',
    tools: [
      {
        name: 'StruM.I.S',
        description: 'Software líder en gestión integral para fabricantes de estructuras metálicas',
        features: [
          'Control de producción en tiempo real',
          'Trazabilidad completa de materiales',
          'Gestión de inventarios y compras',
          'Programación de fabricación',
          'Reportes de avance para clientes'
        ],
        icon: Database,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'FastCAM',
        description: 'Software de ingeniería para optimización de corte CNC',
        features: [
          'Programación de máquinas CNC',
          'Optimización de anidado (nesting)',
          'Máximo aprovechamiento del material',
          'Reducción de desperdicios',
          'Compatible con plasma y oxicorte'
        ],
        icon: Target,
        color: 'from-orange-500 to-orange-600'
      }
    ]
  }
]

const equipment = [
  {
    title: 'Maquinaria de Corte',
    items: [
      '3 Mesas de corte CNC distribuidas en nuestras plantas',
      'Control numérico computarizado',
      'Precisión milimétrica',
      'Capacidad para espesores diversos',
      'Alta velocidad de producción'
    ],
    icon: Wrench,
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Equipos de Izaje',
    items: [
      '8 Puentes grúa (5 en Popayán, 3 en Jamundí)',
      'Capacidad de manejo seguro de piezas pesadas',
      'Optimización de flujo en planta',
      'Seguridad certificada',
      'Mantenimiento preventivo continuo'
    ],
    icon: Factory,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Equipos Especializados',
    items: [
      'Granalladora industrial para limpieza y preparación',
      'Ensambladora de perfiles de alta precisión',
      'Curvadora de tejas para cubiertas especiales',
      'Equipos de soldadura con personal certificado',
      'Sistemas de pintura y recubrimientos'
    ],
    icon: Settings,
    color: 'from-green-500 to-green-600'
  }
]

const innovations = [
  {
    title: 'Tecnología BIM',
    description: 'La mayoría de nuestros proyectos se coordinan utilizando Building Information Modeling',
    benefits: [
      'Reducción de errores en obra',
      'Mayor precisión en fabricación',
      'Coordinación entre disciplinas',
      'Visualización 3D para clientes',
      'Detección temprana de conflictos'
    ],
    icon: Eye,
    image: '/images/technology/bim-modeling.jpg'
  },
  {
    title: 'Control de Calidad Digital',
    description: 'Sistemas digitales integrados para garantizar la excelencia en cada proceso',
    benefits: [
      'Trazabilidad mediante códigos QR',
      'Registro fotográfico de procesos',
      'Reportes digitales en tiempo real',
      'Certificados de calidad digitalizados',
      'Control de espesores digitales'
    ],
    icon: Gauge,
    image: '/images/technology/quality-control.jpg'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export function TechnologiesPageContent() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4">
                TECNOLOGÍA E INNOVACIÓN
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Tecnología de Punta al 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Servicio de la Ingeniería
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 max-w-4xl mx-auto mb-8"
            >
              En MEISA utilizamos las herramientas más avanzadas del mercado para diseñar, fabricar y montar 
              estructuras metálicas con la máxima precisión y eficiencia. Desde modelado BIM hasta control de 
              calidad digital, la tecnología es nuestro aliado para entregar excelencia.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Ver Capacidades
              </button>
              <Link
                href="/contacto"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all"
              >
                Solicitar Consultoría
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Software Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Software de Diseño e Ingeniería
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizamos las herramientas más avanzadas del mercado para garantizar 
              precisión y eficiencia en cada proyecto.
            </p>
          </motion.div>

          {softwareTools.map((category, categoryIndex) => (
            <div key={category.category} className="mb-16">
              <motion.h3 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-500 pl-4"
              >
                {category.category}
              </motion.h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {category.tools.map((tool, toolIndex) => {
                  const IconComponent = tool.icon
                  return (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: toolIndex * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-6`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">{tool.name}</h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                      
                      <div className="space-y-3">
                        {tool.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + featureIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Equipamiento Industrial
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestras 3 plantas cuentan con maquinaria de última generación para 
              garantizar la máxima precisión y eficiencia en la fabricación.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipment.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  
                  <div className="space-y-3">
                    {item.items.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Innovación en Procesos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implementamos las últimas innovaciones tecnológicas para optimizar 
              cada etapa del proceso productivo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {innovations.map((innovation, index) => {
              const IconComponent = innovation.icon
              return (
                <motion.div
                  key={innovation.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{innovation.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{innovation.description}</p>
                    
                    <div className="space-y-3">
                      {innovation.benefits.map((benefit, benefitIndex) => (
                        <motion.div
                          key={benefitIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + benefitIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Tecnología al Servicio de tus Proyectos
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Descubre cómo nuestra tecnología de punta puede optimizar tu próximo proyecto 
              de estructuras metálicas. Desde el diseño hasta el montaje, te acompañamos 
              con las mejores herramientas del mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Solicitar Consultoría
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Ver Proyectos Realizados
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}