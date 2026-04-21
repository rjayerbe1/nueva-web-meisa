"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ChevronRight, X, FileText } from "lucide-react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { PlantaPublica } from '@/lib/content/plantas'
import type { ContactoData } from '@/lib/content/servicios-contacto'

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  tipoProyecto: z.string().min(1, 'Seleccione un tipo de proyecto'),
  ubicacionProyecto: z.string().optional(),
  tamanoProyecto: z.string().optional(),
  serviciosRequeridos: z.array(z.string()).optional(),
  plazoDeseado: z.string().optional(),
  descripcion: z.string().min(20, 'Por favor describa su proyecto (mínimo 20 caracteres)'),
  tienePlanos: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactoContentProps {
  plantas: PlantaPublica[]
  contactoData: ContactoData
}

export default function ContactoContent({
  plantas,
  contactoData,
}: ContactoContentProps) {
  const tiposProyecto = contactoData.tiposProyecto.map((o) => o.label)
  const serviciosDisponibles = contactoData.serviciosContacto.map((o) => o.label)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedPlanta, setSelectedPlanta] = useState<PlantaPublica | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = {
        ...data,
        mensaje: data.descripcion,
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje')
      }

      setSubmitStatus('success')
      reset()

      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/planta-produccion.webp"
            alt="MEISA Contacto"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-gray-300 mb-6"
          >
            <Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">Contacto</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Contáctanos
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
          >
            Expertos en diseño, fabricación y montaje de estructuras metálicas
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section: Form + Contact Info + Locations */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT COLUMN: Contact Form */}
            <motion.div
              id="formulario-contacto"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 sticky top-24">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitar Cotización</h2>
                  <p className="text-gray-600 text-sm">Cuéntanos sobre tu proyecto y te contactaremos pronto</p>
                </div>

                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                      ¡Mensaje enviado!
                    </h4>
                    <p className="text-gray-600">
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nombre y Empresa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          {...register('nombre')}
                          type="text"
                          id="nombre"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Tu nombre"
                        />
                        {errors.nombre && (
                          <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                          Empresa
                        </label>
                        <input
                          {...register('empresa')}
                          type="text"
                          id="empresa"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Tu empresa"
                        />
                      </div>
                    </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="tu@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          {...register('telefono')}
                          type="tel"
                          id="telefono"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="+57 300 123 4567"
                        />
                        {errors.telefono && (
                          <p className="mt-1 text-sm text-red-500">{errors.telefono.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Ciudad */}
                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        {...register('ciudad')}
                        type="text"
                        id="ciudad"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Tu ciudad"
                      />
                      {errors.ciudad && (
                        <p className="mt-1 text-sm text-red-500">{errors.ciudad.message}</p>
                      )}
                    </div>

                    {/* Tipo de Proyecto */}
                    <div>
                      <label htmlFor="tipoProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Proyecto *
                      </label>
                      <select
                        {...register('tipoProyecto')}
                        id="tipoProyecto"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Seleccione un tipo</option>
                        {tiposProyecto.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                      {errors.tipoProyecto && (
                        <p className="mt-1 text-sm text-red-500">{errors.tipoProyecto.message}</p>
                      )}
                    </div>

                    {/* Ubicación y Tamaño del Proyecto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ubicacionProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                          Ubicación del Proyecto
                        </label>
                        <input
                          {...register('ubicacionProyecto')}
                          type="text"
                          id="ubicacionProyecto"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Ej: Cali, Valle del Cauca"
                        />
                      </div>

                      <div>
                        <label htmlFor="tamanoProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                          Tamaño Aproximado
                        </label>
                        <input
                          {...register('tamanoProyecto')}
                          type="text"
                          id="tamanoProyecto"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Ej: 500 m², 50 toneladas"
                        />
                      </div>
                    </div>

                    {/* Servicios requeridos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Servicios Requeridos
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {serviciosDisponibles.map((servicio) => (
                          <label key={servicio} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              value={servicio}
                              {...register('serviciosRequeridos')}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                              {servicio}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Plazo Deseado */}
                    <div>
                      <label htmlFor="plazoDeseado" className="block text-sm font-medium text-gray-700 mb-2">
                        Plazo Deseado
                      </label>
                      <select
                        {...register('plazoDeseado')}
                        id="plazoDeseado"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Seleccione un plazo</option>
                        <option value="urgente">Urgente (menos de 1 mes)</option>
                        <option value="1-3-meses">1-3 meses</option>
                        <option value="3-6-meses">3-6 meses</option>
                        <option value="mas-6-meses">Más de 6 meses</option>
                        <option value="por-definir">Por definir</option>
                      </select>
                    </div>

                    {/* Descripción del Proyecto */}
                    <div>
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Proyecto *
                      </label>
                      <textarea
                        {...register('descripcion')}
                        id="descripcion"
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        placeholder="Cuéntanos los detalles de tu proyecto..."
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-sm text-red-500">{errors.descripcion.message}</p>
                      )}
                    </div>

                    {/* Tiene Planos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ¿Cuenta con planos o diseños?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="si"
                            {...register('tienePlanos')}
                            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="no"
                            {...register('tienePlanos')}
                            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="parcial"
                            {...register('tienePlanos')}
                            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Parcialmente</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-sm text-center">
                        Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Contact Info + Locations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Información de Contacto</h3>

                <div className="space-y-3">
                  {/* Teléfonos */}
                  <div className="group bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1 text-sm">Teléfonos</h4>
                        <div className="space-y-0.5">
                          <p className="text-gray-600 text-xs">PBX: +57 (2) 312 0050-51-52-53</p>
                          <p className="text-gray-600 text-xs">Móvil: +57 (310) 432 7227</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1 text-sm">Email</h4>
                        <p className="text-gray-600 text-xs">contacto@meisa.com.co</p>
                      </div>
                    </div>
                  </div>

                  {/* Horarios */}
                  <div className="group bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-1 text-sm">Horario de Atención</h4>
                        <div className="space-y-0.5">
                          <p className="text-gray-600 text-xs">Lun-Vie: 7:00 AM - 5:00 PM</p>
                          <p className="text-gray-600 text-xs">Sáb: 8:00 AM - 12:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Ubicaciones</span></h3>
                <p className="text-sm text-gray-600 mb-4">
                  Visítanos en cualquiera de nuestras tres plantas industriales
                </p>

                <div className="space-y-4">
                  {plantas.map((planta, index) => (
                    <motion.div
                      key={planta.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedPlanta(planta)}
                      className="group cursor-pointer"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-blue-300">
                        {/* Map Preview */}
                        <div className="relative h-36 overflow-hidden">
                          <iframe
                            src={planta.mapEmbedUrl ?? ''}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="pointer-events-none"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1.5 rounded-full shadow-lg">
                              <p className="text-blue-600 font-semibold text-sm">Ver detalles</p>
                            </div>
                          </div>

                          {/* Title Badge */}
                          <div className="absolute top-0 left-0 right-0">
                            <div className={`bg-gradient-to-br ${planta.colorGradient ?? 'from-blue-500 to-blue-600'} backdrop-blur-md bg-opacity-95 px-3 py-2 shadow-2xl`}>
                              <h4 className="text-sm font-bold text-white">{planta.nombre}</h4>
                              <p className="text-white/90 text-xs font-medium">{planta.tipo}</p>
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <div className="space-y-1.5">
                            <p className="flex items-start gap-2 text-gray-700">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-600" />
                              <span className="text-xs leading-snug">{planta.ubicacion}</span>
                            </p>
                            <p className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                              <span className="text-xs">{planta.telefono}</span>
                            </p>
                            <p className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                              <span className="text-xs">{planta.horario}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal for Map Details */}
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
              {/* Close button */}
              <button
                onClick={() => setSelectedPlanta(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Header with gradient */}
              <div className={`relative bg-gradient-to-br ${selectedPlanta.colorGradient ?? 'from-blue-500 to-blue-600'} px-8 py-8`}>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedPlanta.nombre}</h3>
                <p className="text-white/90 text-lg">{selectedPlanta.tipo}</p>
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <MapPin className="w-5 h-5" />
                  <p className="text-sm">{selectedPlanta.ubicacion}</p>
                </div>
              </div>

              {/* Large interactive map */}
              <div className="p-8">
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={selectedPlanta.mapEmbedUrl ?? ''}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Teléfono</h4>
                    <p className="text-gray-600 text-sm">{selectedPlanta.telefono}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600 text-sm">{selectedPlanta.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Horario</h4>
                    <p className="text-gray-600 text-sm">{selectedPlanta.horario}</p>
                  </div>
                </div>

                {/* Google Maps button */}
                <a
                  href={selectedPlanta.googleMapsUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r ${selectedPlanta.colorGradient ?? 'from-blue-500 to-blue-600'} hover:shadow-xl text-white px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 group`}
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Abrir en Google Maps
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para comenzar tu proyecto?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Nuestro equipo está preparado para convertir tu visión en realidad
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+573104327227"
                className="group px-8 py-4 bg-white hover:bg-gray-100 text-blue-700 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Llamar Ahora
              </a>
              <a
                href="#formulario-contacto"
                className="group px-8 py-4 bg-blue-800/50 backdrop-blur-sm hover:bg-blue-800/70 text-white rounded-xl font-semibold border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Enviar Mensaje
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
