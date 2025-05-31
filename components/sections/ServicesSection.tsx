'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { 
  DesignModel, 
  FabricationModel, 
  AssemblyModel, 
  CivilWorkModel 
} from '../three/models/ServiceModels'
import { ArrowRight, Ruler, Factory, Wrench, Building } from 'lucide-react'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  model: React.ReactNode
  color: string
  delay: number
}

function ServiceCard({ title, description, icon, model, color, delay }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className={`
        relative h-[450px] rounded-2xl overflow-hidden
        bg-gradient-to-br from-gray-900 to-gray-800
        border border-gray-700 
        transition-all duration-500 transform
        ${isHovered ? 'scale-105 shadow-2xl border-opacity-50' : 'scale-100 shadow-xl'}
      `}>
        {/* Modelo 3D */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[3, 3, 3]} fov={40} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color={color} />
              {model}
            </Suspense>
          </Canvas>
        </div>
        
        {/* Overlay gradient */}
        <div className={`
          absolute inset-0 z-10
          bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent
          transition-opacity duration-500
          ${isHovered ? 'opacity-90' : 'opacity-95'}
        `} />
        
        {/* Contenido */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6">
          {/* Icono */}
          <div className={`
            w-12 h-12 mb-4 rounded-lg flex items-center justify-center
            bg-gradient-to-br ${color} 
            transition-transform duration-500
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            {icon}
          </div>
          
          {/* Título */}
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          
          {/* Descripción */}
          <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>
          
          {/* CTA */}
          <div className={`
            flex items-center gap-2 text-white font-medium
            transition-all duration-300
            ${isHovered ? 'translate-x-2' : 'translate-x-0'}
          `}>
            <span>Conocer más</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        
        {/* Efecto de brillo en hover */}
        <div className={`
          absolute inset-0 z-30 pointer-events-none
          bg-gradient-to-tr from-transparent via-white/10 to-transparent
          transition-opacity duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />
      </div>
    </motion.div>
  )
}

export function ServicesSection() {
  const services = [
    {
      title: "Diseño Estructural",
      description: "Consultoría especializada en ingeniería estructural con tecnología BIM y modelado 3D para optimizar cada proyecto.",
      icon: <Ruler className="w-6 h-6 text-white" />,
      model: <DesignModel isHovered={false} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Fabricación",
      description: "Producción de estructuras metálicas con tecnología de punta, capacidad de 600 toneladas mensuales y los más altos estándares de calidad.",
      icon: <Factory className="w-6 h-6 text-white" />,
      model: <FabricationModel isHovered={false} />,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Montaje",
      description: "Instalación profesional con equipo certificado, maquinaria especializada y estrictos protocolos de seguridad.",
      icon: <Wrench className="w-6 h-6 text-white" />,
      model: <AssemblyModel isHovered={false} />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Obra Civil",
      description: "Soluciones integrales de construcción que complementan nuestras estructuras metálicas para proyectos llave en mano.",
      icon: <Building className="w-6 h-6 text-white" />,
      model: <CivilWorkModel isHovered={false} />,
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluciones integrales en estructuras metálicas desde el diseño hasta la entrega final
          </p>
        </motion.div>
        
        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              delay={index * 0.1}
            />
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            Ver todos los servicios
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}