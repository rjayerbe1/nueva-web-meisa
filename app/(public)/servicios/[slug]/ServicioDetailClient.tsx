'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, MessageSquare, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { getServiceColors } from '@/lib/service-colors'

interface ServicioData {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  capacidades: string[]
  expertise: { titulo: string; descripcion: string }
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface OtroServicio {
  id: string
  slug: string
  titulo: string
  subtitulo: string
  descripcion: string
  imagen: string
  icono: string
  color: string
  bgGradient: string
}

interface ServicioDetailClientProps {
  servicio: ServicioData
  otrosServicios: OtroServicio[]
}

export default function ServicioDetailClient({ servicio, otrosServicios }: ServicioDetailClientProps) {
  const [activeTab, setActiveTab] = useState('capacidades')
  
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Settings
    return Icon
  }

  const ServicioIcon = getIcon(servicio.icono)
  const colors = getServiceColors(servicio.color)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className={`relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br ${servicio.bgGradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mb-8 text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{servicio.titulo}</span>
            </div>

            {/* Icono y título */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ServicioIcon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {servicio.titulo}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                {servicio.subtitulo}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-white/90 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Solicitar Cotización
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
              >
                Ver Todos los Servicios
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Imagen principal */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-full h-[500px] relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>

            {/* Contenido */}
            <div className="lg:col-span-2">
              {/* Descripción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Descripción del Servicio</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {servicio.descripcion}
                </p>

                {/* Expertise destacado */}
                <div className={`bg-gradient-to-r ${colors.gradient} p-8 rounded-2xl text-white shadow-xl`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" />
                    {servicio.expertise.titulo}
                  </h3>
                  <p className="text-white/95 leading-relaxed">{servicio.expertise.descripcion}</p>
                </div>
              </motion.div>

              {/* Pestañas de contenido */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Navigation tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('capacidades')}
                    className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                      activeTab === 'capacidades'
                        ? `${colors.text} border-b-2 ${colors.border} bg-gray-50`
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Capacidades
                  </button>
                </div>

                {/* Tab content */}
                <div className="min-h-[300px]">
                  {activeTab === 'capacidades' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {servicio.capacidades.map((capacidad, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
                        >
                          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle2 className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{capacidad}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-br ${servicio.bgGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              ¿Necesitas este servicio para tu proyecto?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Nuestro equipo especializado está listo para asesorarte y desarrollar la solución perfecta
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-white/90 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                Solicitar Información
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
              >
                Ver Proyectos Similares
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Otros Servicios */}
      {otrosServicios.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Otros Servicios
              </h2>
              <p className="text-xl text-gray-600">
                Conoce nuestros otros servicios especializados
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otrosServicios.map((otroServicio, index) => {
                const OtroIcon = getIcon(otroServicio.icono)
                const otherColors = getServiceColors(otroServicio.color)
                
                return (
                  <motion.div
                    key={otroServicio.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/servicios/${otroServicio.slug}`}>
                      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer">
                        <div className={`w-16 h-16 ${otherColors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <OtroIcon className={`w-8 h-8 ${otherColors.text}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {otroServicio.titulo}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {otroServicio.descripcion}
                        </p>
                        <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all">
                          Conocer más
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}