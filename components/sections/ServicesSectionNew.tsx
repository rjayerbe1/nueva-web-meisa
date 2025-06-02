'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Cpu, 
  Hammer, 
  Building2, 
  Settings,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Timer,
  Award
} from 'lucide-react'

const services = [
  {
    id: 'diseno',
    title: 'Consultoría en Diseño Estructural',
    subtitle: 'Ingeniería de precisión',
    description: 'Gracias a un equipo de ingenieros altamente calificado y a la mejor tecnología en análisis estructural, brindamos soluciones óptimas de diseño conforme a los requerimientos del cliente.',
    icon: Cpu,
    image: '/images/services/diseno-estructural.jpg',
    capabilities: [
      'Análisis y optimización de cargas estructurales',
      'Diseño según normas sismo resistentes NSR-10',
      'Modelado 3D con tecnología BIM - Tekla Structures',
      'Software especializado: RISA-3D, RISAFloor, RISAConnection'
    ],
    stats: { value: '5+', label: 'Software BIM especializados' },
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'fabricacion',
    title: 'Fabricación de Estructuras Metálicas',
    subtitle: 'Producción industrial de 600 ton/mes',
    description: 'Con 3 plantas industriales y capacidad de 600 toneladas/mes, contamos con personal capacitado y equipos modernos para la fabricación de estructuras metálicas.',
    icon: Hammer,
    image: '/images/services/industria.jpg',
    capabilities: [
      'Corte con mesas CNC de alta precisión',
      'Soldadura con personal certificado AWS',
      'Limpieza por granallado y pintura anticorrosiva',
      '8 Puentes grúa distribuidos en 3 plantas'
    ],
    stats: { value: '600', label: 'Ton/mes capacidad total' },
    color: 'from-slate-500 to-slate-700',
    bgColor: 'from-slate-500/10 to-slate-700/10'
  },
  {
    id: 'montaje',
    title: 'Montaje de Estructuras Metálicas',
    subtitle: 'Instalación profesional certificada',
    description: 'Contamos con personal experimentado que, siguiendo estrictos protocolos de seguridad de trabajo en alturas y utilizando equipos de izaje especializados, logra terminar los proyectos exitosamente.',
    icon: Building2,
    image: '/images/services/montaje.jpg',
    capabilities: [
      'Grúas y equipos de izaje certificados',
      'Personal con certificación en alturas',
      'Supervisión por inspectores SIG',
      'Experiencia: puentes hasta 180m (Puente La Floresta)'
    ],
    stats: { value: '62+', label: 'Proyectos ejecutados' },
    color: 'from-green-600 to-green-700',
    bgColor: 'from-green-600/10 to-green-700/10'
  },
  {
    id: 'construccion',
    title: 'Construcción de Obra Civil',
    subtitle: 'Servicio integral llave en mano',
    description: 'Para brindar un servicio integral, realizamos todas las obras civiles complementarias que requiera el cliente, desde la cimentación hasta los acabados.',
    icon: Settings,
    image: '/images/services/industria.jpg',
    capabilities: [
      'Estudios de suelos y cimentaciones',
      'Construcción de bases y pedestales',
      'Obras de concreto reforzado',
      'Coordinación integral de proyectos'
    ],
    stats: { value: '27+', label: 'Años experiencia' },
    color: 'from-purple-500 to-violet-500',
    bgColor: 'from-purple-500/10 to-violet-500/10'
  },
]

const benefits = [
  { icon: Shield, title: 'Calidad Garantizada', desc: 'Normas internacionales' },
  { icon: Timer, title: 'Entregas Puntuales', desc: 'Cumplimiento 100%' },
  { icon: Award, title: 'Experiencia Comprobada', desc: '29+ años' },
  { icon: Zap, title: 'Tecnología Avanzada', desc: 'Equipos modernos' }
]

export function ServicesSection() {
  const [activeService, setActiveService] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section 
      ref={containerRef}
      id="servicios"
      className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            Nuestros Servicios
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Soluciones integrales en 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-blue-200 to-slate-400">
              acero
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ofrecemos servicios completos desde el diseño hasta el mantenimiento, 
            garantizando la <span className="text-blue-400 font-semibold">excelencia en cada etapa</span> del proyecto.
          </p>
        </motion.div>

        {/* Beneficios principales */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl mb-4 group-hover:border-blue-500/50 transition-all">
                <benefit.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
              <p className="text-gray-400 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Servicios principales - Diseño tipo tarjetas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Tarjeta principal */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/50 transition-all duration-300">
                {/* Header con imagen */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  
                  {/* Icono flotante */}
                  <div className={`absolute top-4 left-4 p-3 bg-gradient-to-br ${service.color} rounded-xl shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Estadística */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="text-white font-bold text-lg">{service.stats.value}</div>
                    <div className="text-gray-300 text-xs">{service.stats.label}</div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-blue-400 text-sm font-medium mb-1">{service.subtitle}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Capacidades */}
                  <div className="space-y-2 mb-6">
                    {service.capabilities.map((capability, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-400 text-sm">{capability}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/servicios#${service.id}`}
                    className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors group/link"
                  >
                    Conocer más detalles
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Efecto de brillo en hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section rediseñada */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
              }} />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para tu próximo proyecto?
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Con <span className="text-blue-400 font-semibold">tecnología BIM avanzada</span> y 
                <span className="text-blue-400 font-semibold"> equipos especializados</span>, transformamos 
                tus ideas en realidades de acero duraderas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Solicitar cotización
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/proyectos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Ver proyectos realizados
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}