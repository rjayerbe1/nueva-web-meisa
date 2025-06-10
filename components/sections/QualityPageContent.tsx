'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  FileCheck,
  Users,
  Settings,
  Leaf,
  Target,
  ArrowRight,
  BarChart3,
  Clock,
  Zap,
  AlertTriangle,
  Eye,
  Lock
} from 'lucide-react'

const sigComponents = [
  {
    title: 'Gestión de Calidad',
    description: 'Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios',
    icon: Award,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Seguridad y Salud Ocupacional',
    description: 'Protección integral de colaboradores, contratistas y visitantes',
    icon: Shield,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Gestión Ambiental',
    description: 'Compromiso con el desarrollo sostenible y la protección del medio ambiente',
    icon: Leaf,
    color: 'from-green-600 to-green-700'
  },
  {
    title: 'Gestión de Riesgos',
    description: 'Identificación, evaluación y control de riesgos en todos los procesos',
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600'
  }
]

const policies = [
  {
    title: 'Política de Calidad Total',
    description: 'Adoptamos la Calidad Total como valor estratégico fundamental',
    commitments: [
      'Satisfacer plenamente las necesidades y expectativas de clientes',
      'Cumplir requisitos reglamentarios aplicables',
      'Prevenir defectos y no conformidades',
      'Mejorar continuamente nuestros procesos',
      'Proporcionar recursos necesarios para el SIG'
    ],
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Política de Seguridad y Salud en el Trabajo',
    description: 'Compromiso integral con la seguridad de nuestro equipo',
    commitments: [
      'Protección integral de colaboradores, contratistas y visitantes',
      'Identificación, evaluación y control de riesgos laborales',
      'Prevención proactiva de riesgos laborales',
      'Cumplimiento de normatividad nacional vigente',
      'Condiciones laborales seguras y saludables'
    ],
    icon: Shield,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Política de Transparencia y Ética Empresarial',
    description: 'Integridad y transparencia en todas nuestras operaciones',
    commitments: [
      'Programa para mitigar riesgos de corrupción y soborno',
      'Canal ético para reportes confidenciales',
      'Declaración de conflictos de interés',
      'Compromiso con la integridad empresarial',
      'Cero tolerancia a prácticas indebidas'
    ],
    icon: Eye,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Política Antilavado de Activos',
    description: 'Cumplimiento riguroso de normativas SARLAFT',
    commitments: [
      'Mitigación del riesgo de LA/FT',
      'Debida diligencia en relaciones comerciales',
      'Reporte de operaciones sospechosas',
      'Cumplimiento normativo SARLAFT',
      'Capacitación continua del personal'
    ],
    icon: Lock,
    color: 'from-red-500 to-red-600'
  }
]

const standards = [
  {
    category: 'Normas Técnicas',
    items: [
      { name: 'NSR-10', description: 'Norma Sismo Resistente Colombiana' },
      { name: 'AWS', description: 'American Welding Society' },
      { name: 'AISC', description: 'American Institute of Steel Construction' },
      { name: 'ICONTEC', description: 'Normas técnicas colombianas aplicables' }
    ]
  },
  {
    category: 'Estándares de Fabricación',
    items: [
      { name: 'Tolerancias', description: 'Según normas internacionales' },
      { name: 'Soldadura', description: 'Procedimientos calificados' },
      { name: 'Ensayos', description: 'No destructivos cuando se requieren' },
      { name: 'Materiales', description: 'Certificados de calidad' }
    ]
  },
  {
    category: 'Protocolos de Seguridad',
    items: [
      { name: 'Alturas', description: 'Trabajo seguro en alturas' },
      { name: 'Cargas', description: 'Manejo de cargas críticas' },
      { name: 'Espacios', description: 'Espacios confinados' },
      { name: 'Emergencias', description: 'Plan de emergencias' }
    ]
  }
]

const qualityControl = [
  {
    stage: 'En Diseño',
    processes: [
      'Revisión por pares de ingenieros',
      'Verificación de cálculos estructurales',
      'Validación contra normas vigentes',
      'Aprobación del cliente'
    ],
    icon: FileCheck,
    color: 'from-blue-500 to-blue-600'
  },
  {
    stage: 'En Fabricación',
    processes: [
      'Inspección de materias primas',
      'Control dimensional continuo',
      'Verificación de soldaduras',
      'Pruebas de pintura y recubrimientos',
      'Liberación por inspector SIG'
    ],
    icon: Settings,
    color: 'from-orange-500 to-orange-600'
  },
  {
    stage: 'En Montaje',
    processes: [
      'Check list pre-montaje',
      'Verificación de torques',
      'Control de verticalidad y alineación',
      'Protocolo de entrega final'
    ],
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600'
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

export function QualityPageContent() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-600 text-sm font-semibold rounded-full mb-4">
                CALIDAD Y CERTIFICACIONES
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Nuestro Compromiso con la 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Excelencia
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 max-w-4xl mx-auto mb-8"
            >
              MEISA cuenta con un robusto Sistema Integrado de Gestión (SIG) que garantiza calidad, 
              seguridad, cumplimiento normativo y mejora continua en todos nuestros procesos. 
              Más de 27 años de excelencia en seguridad respaldan nuestro compromiso con la calidad.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Conocer SIG
              </button>
              <Link
                href="/contacto"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all"
              >
                Solicitar Certificaciones
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SIG Components */}
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
              Sistema Integrado de Gestión (SIG)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro SIG integra cuatro pilares fundamentales que aseguran la excelencia 
              operacional y el cumplimiento de los más altos estándares.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sigComponents.map((component, index) => {
              const IconComponent = component.icon
              return (
                <motion.div
                  key={component.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${component.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{component.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{component.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Policies Section */}
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
              Políticas Corporativas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestras políticas definen el marco de actuación y los compromisos 
              que asumimos con todos nuestros grupos de interés.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {policies.map((policy, index) => {
              const IconComponent = policy.icon
              return (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${policy.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{policy.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{policy.description}</p>
                  
                  <div className="space-y-3">
                    {policy.commitments.map((commitment, commitmentIndex) => (
                      <motion.div
                        key={commitmentIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + commitmentIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{commitment}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Standards Section */}
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
              Cumplimiento Normativo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cumplimos rigurosamente con las normas técnicas más exigentes del sector 
              metalmecánico nacional e internacional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {standards.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                  {category.category}
                </h3>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + itemIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col"
                    >
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <span className="text-gray-600 text-sm">{item.description}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Control Section */}
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
              Control de Calidad
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implementamos controles rigurosos en cada etapa del proceso para 
              garantizar que cada proyecto cumpla con los más altos estándares.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualityControl.map((stage, index) => {
              const IconComponent = stage.icon
              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{stage.stage}</h3>
                  
                  <div className="space-y-3">
                    {stage.processes.map((process, processIndex) => (
                      <motion.div
                        key={processIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + processIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{process}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Calidad que Trasciende en cada Proyecto
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Nuestro compromiso con la calidad, seguridad y cumplimiento normativo 
              nos ha posicionado como líderes en el sector metalmecánico colombiano. 
              Más de 27 años de excelencia operacional y cientos de proyectos exitosos 
              respaldan nuestra trayectoria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Solicitar Certificaciones
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
              >
                Ver Proyectos Certificados
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}