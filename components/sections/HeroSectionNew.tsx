'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowDown, Play, Award, Shield, Zap } from 'lucide-react'

export function HeroSectionNew() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-construccion-industrial.jpg"
          alt="Estructuras metálicas MEISA"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40" />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid-pattern.svg')] bg-center bg-repeat" />
      </div>
      
      {/* Elementos flotantes animados */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-24 h-24 bg-blue-600/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-16 w-32 h-32 bg-blue-700/30 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-500/15 rounded-full blur-lg"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-2 bg-blue-100/90 text-blue-600 text-sm font-semibold rounded-full mb-8 backdrop-blur-sm"
          >
            🏗️ LÍDERES EN ESTRUCTURAS METÁLICAS DESDE 1996
          </motion.div>
          
          {/* Título principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            <span className="block">Estructuras</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Metálicas
            </span>
          </motion.h1>
          
          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Más de <span className="font-semibold text-blue-400">29 años</span> diseñando, 
            fabricando y montando estructuras metálicas con{' '}
            <span className="font-semibold text-blue-400">tecnología de vanguardia</span>{' '}
            y calidad certificada ISO 9001
          </motion.p>
          
          {/* Tarjeta de misión */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h2>
            <p className="text-lg text-gray-200">
              "Diseñar, fabricar y montar estructuras metálicas con los más altos estándares 
              de calidad, cumpliendo los tiempos de entrega acordados y contribuyendo al 
              desarrollo de la infraestructura nacional."
            </p>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <Link
              href="/contacto"
              className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                Solicitar Cotización
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/servicios"
              className="group px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Ver Servicios
              </span>
            </Link>
          </motion.div>

          {/* Características destacadas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { icon: Award, text: "29+ Años", desc: "de experiencia" },
              { icon: Shield, text: "ISO 9001", desc: "Certificación" },
              { icon: Zap, text: "600 ton/mes", desc: "Capacidad" }
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{item.text}</div>
                    <div className="text-sm text-gray-300">{item.desc}</div>
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* Indicador de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="inline-block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <ArrowDown className="w-8 h-8 text-white/80 mx-auto" />
              <p className="text-white/80 text-sm mt-2 font-medium">Descubre más</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}