'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Building2, Package, Calendar, FileText } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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

const tiposProyecto = [
  'Estructura metálica para edificación',
  'Estructura industrial',
  'Cubierta metálica',
  'Puente o pasarela',
  'Tanque o recipiente',
  'Escalera metálica',
  'Mantenimiento o reparación',
  'Otro tipo de proyecto'
]

const serviciosDisponibles = [
  'Diseño estructural',
  'Fabricación',
  'Montaje',
  'Pintura y acabados',
  'Mantenimiento'
]

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Error al enviar el mensaje')

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
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-700 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header con CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <div className="bg-blue-600/20 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-500/30">
              <p className="text-blue-400 font-semibold text-sm">Estamos listos para tu proyecto</p>
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Hablemos de tu{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Proyecto
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Más de 20 años de experiencia respaldándonos. Contáctanos para recibir una cotización personalizada.
          </p>

          {/* CTAs principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#formulario-cotizacion"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Solicitar Cotización
            </a>
            <a
              href="tel:+573104327227"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Llamar Ahora
            </a>
          </div>
        </motion.div>

        {/* Grid: Contacto Directo + Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contacto Directo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-8">Contacto Directo</h3>

            <div className="space-y-6">
              {/* Teléfonos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2 text-lg">Teléfonos</h4>
                      <div className="space-y-1">
                        <p className="text-gray-300">PBX: +57 (2) 312 0050-51-52-53</p>
                        <p className="text-gray-300">Móvil: +57 (310) 432 7227</p>
                        <a
                          href="tel:+573104327227"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors font-medium group/link"
                        >
                          Llamar ahora
                          <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2 text-lg">Email</h4>
                      <p className="text-gray-300 mb-2">contacto@meisa.com.co</p>
                      <a
                        href="mailto:contacto@meisa.com.co"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors font-medium group/link"
                      >
                        Enviar email
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Horarios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2 text-lg">Horario de Atención</h4>
                      <div className="space-y-1">
                        <p className="text-gray-300">Lunes a Viernes: 7:00 AM - 5:00 PM</p>
                        <p className="text-gray-300">Sábados: 8:00 AM - 12:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Formulario de Cotización Comercial */}
          <motion.div
            id="formulario-cotizacion"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Solicitar Cotización</h3>
                  <p className="text-gray-400 text-sm">Cuéntanos sobre tu proyecto</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Datos de contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-200 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('nombre')}
                      type="text"
                      id="nombre"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-gray-200 mb-2">
                      Empresa
                    </label>
                    <input
                      {...register('empresa')}
                      type="text"
                      id="empresa"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Tu empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-200 mb-2">
                      Teléfono *
                    </label>
                    <input
                      {...register('telefono')}
                      type="tel"
                      id="telefono"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="+57 300 123 4567"
                    />
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-400">{errors.telefono.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-200 mb-2">
                    Ciudad *
                  </label>
                  <input
                    {...register('ciudad')}
                    type="text"
                    id="ciudad"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Tu ciudad"
                  />
                  {errors.ciudad && (
                    <p className="mt-1 text-sm text-red-400">{errors.ciudad.message}</p>
                  )}
                </div>

                {/* Información del proyecto */}
                <div>
                  <label htmlFor="tipoProyecto" className="block text-sm font-medium text-gray-200 mb-2">
                    Tipo de Proyecto *
                  </label>
                  <select
                    {...register('tipoProyecto')}
                    id="tipoProyecto"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposProyecto.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                  {errors.tipoProyecto && (
                    <p className="mt-1 text-sm text-red-400">{errors.tipoProyecto.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ubicacionProyecto" className="block text-sm font-medium text-gray-200 mb-2">
                      Ubicación del Proyecto
                    </label>
                    <input
                      {...register('ubicacionProyecto')}
                      type="text"
                      id="ubicacionProyecto"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ej: Cali, Valle del Cauca"
                    />
                  </div>

                  <div>
                    <label htmlFor="tamanoProyecto" className="block text-sm font-medium text-gray-200 mb-2">
                      Tamaño Aproximado
                    </label>
                    <input
                      {...register('tamanoProyecto')}
                      type="text"
                      id="tamanoProyecto"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ej: 500 m², 50 toneladas"
                    />
                  </div>
                </div>

                {/* Servicios requeridos */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Servicios Requeridos
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviciosDisponibles.map((servicio) => (
                      <label key={servicio} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          value={servicio}
                          {...register('serviciosRequeridos')}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                          {servicio}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="plazoDeseado" className="block text-sm font-medium text-gray-200 mb-2">
                    Plazo Deseado
                  </label>
                  <select
                    {...register('plazoDeseado')}
                    id="plazoDeseado"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Seleccione un plazo</option>
                    <option value="urgente">Urgente (menos de 1 mes)</option>
                    <option value="1-3-meses">1-3 meses</option>
                    <option value="3-6-meses">3-6 meses</option>
                    <option value="mas-6-meses">Más de 6 meses</option>
                    <option value="por-definir">Por definir</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-200 mb-2">
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    {...register('descripcion')}
                    id="descripcion"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Cuéntanos los detalles de tu proyecto..."
                  />
                  {errors.descripcion && (
                    <p className="mt-1 text-sm text-red-400">{errors.descripcion.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    ¿Cuenta con planos o diseños?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="si"
                        {...register('tienePlanos')}
                        className="w-4 h-4 border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        {...register('tienePlanos')}
                        className="w-4 h-4 border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="parcial"
                        {...register('tienePlanos')}
                        className="w-4 h-4 border-gray-600 bg-gray-900/50 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Parcialmente</span>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full px-6 py-4 rounded-xl font-semibold text-white
                      transition-all duration-300 transform flex items-center justify-center gap-2
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Cotización
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-400">
                      ¡Cotización enviada exitosamente! Nos pondremos en contacto contigo pronto.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
                  >
                    <p className="text-red-400 text-center">
                      Hubo un error al enviar la cotización. Por favor, intenta nuevamente o contáctanos directamente.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
