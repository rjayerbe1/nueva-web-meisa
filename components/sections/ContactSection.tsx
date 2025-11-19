"use client"

import { motion } from 'framer-motion'
import { Phone, Mail, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { siteConfig, getAniosExperienciaTexto } from '@/lib/site-config'

export function ContactSection() {
  // Número de WhatsApp formateado para URL
  const whatsappNumber = siteConfig.contacto.whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría solicitar información sobre sus servicios.')}`

  return (
    <section id="contacto" className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 md:py-16 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-700 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-blue-400 font-bebas uppercase text-2xl md:text-3xl lg:text-4xl mb-3">
            Estamos listos para tu proyecto
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase text-white mb-4">
            Hablemos de tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Proyecto
            </span>
          </h3>
          <p className="text-lg md:text-xl font-lato text-gray-300 max-w-3xl mx-auto whitespace-nowrap">
            Más de {getAniosExperienciaTexto()} años de experiencia respaldándonos. Contáctanos para recibir una cotización personalizada.
          </p>
        </motion.div>

        {/* CTAs principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          {/* Botón Solicitar Cotización */}
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-lato font-bold text-base md:text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            Solicitar Cotización
          </Link>

          {/* Botón WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-lato font-bold text-base md:text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </motion.div>

        {/* Contacto Directo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="text-2xl md:text-3xl font-bebas uppercase text-white text-center mb-6">
            Contacto Directo
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Teléfonos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-lg font-bebas uppercase text-white mb-3">Teléfonos</h5>
                <div className="space-y-1 mb-4">
                  <p className="text-sm font-lato text-gray-300">
                    <strong>PBX:</strong> {siteConfig.contacto.telefonoCali}
                  </p>
                  <p className="text-sm font-lato text-gray-300">
                    <strong>Móvil:</strong> {siteConfig.contacto.whatsapp}
                  </p>
                </div>
                <a
                  href={`tel:${siteConfig.contacto.whatsapp.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-lato font-semibold text-sm transition-colors duration-300"
                >
                  Llamar ahora
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-lg font-bebas uppercase text-white mb-3">Email</h5>
                <p className="text-sm font-lato text-gray-300 mb-4">
                  {siteConfig.contacto.email}
                </p>
                <a
                  href={`mailto:${siteConfig.contacto.email}`}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-lato font-semibold text-sm transition-colors duration-300"
                >
                  Enviar email
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Horario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-lg font-bebas uppercase text-white mb-3">Horario de Atención</h5>
                <div className="space-y-1">
                  <p className="text-sm font-lato text-gray-300">
                    <strong>Lunes a Viernes:</strong>
                  </p>
                  <p className="text-sm font-lato text-gray-300">7:00 AM - 5:00 PM</p>
                  <p className="text-sm font-lato text-gray-300 mt-2">
                    <strong>Sábados:</strong>
                  </p>
                  <p className="text-sm font-lato text-gray-300">8:00 AM - 12:00 PM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
