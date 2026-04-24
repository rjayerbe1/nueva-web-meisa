"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, X, ArrowRight } from "lucide-react"
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

// Clases reusables para inputs (dark brutalist, sin rounded)
const inputClass =
  "w-full px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-colors font-lato"
const labelClass =
  "block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-2"
const errorClass = "mt-1 text-xs text-red-500 font-lato"

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
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = { ...data, mensaje: data.descripcion }
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Error al enviar el mensaje')
      setSubmitStatus('success')
      reset()
      setTimeout(() => setSubmitStatus('idle'), 6000)
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero full-bleed dark con imagen */}
      <section className="relative h-[70vh] md:h-[75vh] min-h-[500px] overflow-hidden bg-slate-950">
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/about/planta-produccion.webp"
          alt="MEISA — Contacto"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/60" />

        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-5">
                Construyamos juntos
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                Hablemos de
              </h1>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/50">
                tu proyecto.
              </h2>
              <p className="mt-8 text-base md:text-lg text-white/70 font-lato leading-relaxed max-w-2xl">
                Cuéntanos sobre tu proyecto estructural. Nuestro equipo de diseño, fabricación y
                montaje te responde en menos de 24 horas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main section: Form + Info + Plantas */}
      <section className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* FORM (col-span-7) */}
            <motion.div
              id="formulario-contacto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Solicitar cotización
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-white mb-8">
                Cuéntanos
                <span className="block text-white/40">los detalles.</span>
              </h2>

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-white/20 p-10 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-red-600 mx-auto mb-5" strokeWidth={1.5} />
                  <h3 className="text-3xl font-bebas uppercase leading-[0.95] text-white mb-3">
                    Mensaje enviado
                  </h3>
                  <p className="text-white/70 font-lato text-sm md:text-base max-w-md mx-auto">
                    Te responderemos en menos de 24 horas al correo que registraste.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nombre + Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className={labelClass}>Nombre completo *</label>
                      <input {...register('nombre')} type="text" id="nombre" className={inputClass} placeholder="Tu nombre" />
                      {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="empresa" className={labelClass}>Empresa</label>
                      <input {...register('empresa')} type="text" id="empresa" className={inputClass} placeholder="Tu empresa" />
                    </div>
                  </div>

                  {/* Email + Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email *</label>
                      <input {...register('email')} type="email" id="email" className={inputClass} placeholder="tu@email.com" />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="telefono" className={labelClass}>Teléfono *</label>
                      <input {...register('telefono')} type="tel" id="telefono" className={inputClass} placeholder="+57 300 123 4567" />
                      {errors.telefono && <p className={errorClass}>{errors.telefono.message}</p>}
                    </div>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label htmlFor="ciudad" className={labelClass}>Ciudad *</label>
                    <input {...register('ciudad')} type="text" id="ciudad" className={inputClass} placeholder="Tu ciudad" />
                    {errors.ciudad && <p className={errorClass}>{errors.ciudad.message}</p>}
                  </div>

                  {/* Tipo de proyecto */}
                  <div>
                    <label htmlFor="tipoProyecto" className={labelClass}>Tipo de proyecto *</label>
                    <select {...register('tipoProyecto')} id="tipoProyecto" className={inputClass}>
                      <option value="">Seleccione un tipo</option>
                      {tiposProyecto.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    {errors.tipoProyecto && <p className={errorClass}>{errors.tipoProyecto.message}</p>}
                  </div>

                  {/* Ubicación + Tamaño */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ubicacionProyecto" className={labelClass}>Ubicación del proyecto</label>
                      <input {...register('ubicacionProyecto')} type="text" id="ubicacionProyecto" className={inputClass} placeholder="Cali, Valle del Cauca" />
                    </div>
                    <div>
                      <label htmlFor="tamanoProyecto" className={labelClass}>Tamaño aproximado</label>
                      <input {...register('tamanoProyecto')} type="text" id="tamanoProyecto" className={inputClass} placeholder="500 m² · 50 toneladas" />
                    </div>
                  </div>

                  {/* Servicios requeridos */}
                  <div>
                    <label className={labelClass}>Servicios requeridos</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {serviciosDisponibles.map((servicio) => (
                        <label key={servicio} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            value={servicio}
                            {...register('serviciosRequeridos')}
                            className="w-4 h-4 border border-white/30 bg-slate-900 text-red-600 focus:ring-0 focus:ring-offset-0 accent-red-600"
                          />
                          <span className="text-white/70 font-lato text-sm group-hover:text-white transition-colors">
                            {servicio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Plazo */}
                  <div>
                    <label htmlFor="plazoDeseado" className={labelClass}>Plazo deseado</label>
                    <select {...register('plazoDeseado')} id="plazoDeseado" className={inputClass}>
                      <option value="">Seleccione un plazo</option>
                      <option value="urgente">Urgente (menos de 1 mes)</option>
                      <option value="1-3-meses">1-3 meses</option>
                      <option value="3-6-meses">3-6 meses</option>
                      <option value="mas-6-meses">Más de 6 meses</option>
                      <option value="por-definir">Por definir</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label htmlFor="descripcion" className={labelClass}>Descripción del proyecto *</label>
                    <textarea
                      {...register('descripcion')}
                      id="descripcion"
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Cuéntanos los detalles de tu proyecto..."
                    />
                    {errors.descripcion && <p className={errorClass}>{errors.descripcion.message}</p>}
                  </div>

                  {/* Planos */}
                  <div>
                    <label className={labelClass}>¿Cuentas con planos o diseños?</label>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { value: 'si', label: 'Sí' },
                        { value: 'no', label: 'No' },
                        { value: 'parcial', label: 'Parcialmente' },
                      ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="radio"
                            value={opt.value}
                            {...register('tienePlanos')}
                            className="w-4 h-4 border border-white/30 bg-slate-900 text-red-600 focus:ring-0 focus:ring-offset-0 accent-red-600"
                          />
                          <span className="text-white/70 font-lato text-sm group-hover:text-white transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit — botón rojo brutalist */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        Enviar mensaje
                        <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 font-lato text-sm">
                      Hubo un error al enviar. Por favor intenta de nuevo.
                    </p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Info + Plantas (col-span-5) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 space-y-12 lg:space-y-16"
            >
              {/* Info de contacto */}
              <div>
                <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Información
                </p>
                <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] text-white mb-8">
                  Canales directos
                </h3>

                <div className="divide-y divide-white/10 border-y border-white/10">
                  <div className="flex items-start gap-4 py-5">
                    <Phone className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Teléfonos</p>
                      <p className="text-white font-lato text-sm">PBX: +57 (2) 312 0050-51-52-53</p>
                      <p className="text-white font-lato text-sm">Móvil: +57 310 432 7227</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-5">
                    <Mail className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Email</p>
                      <a href="mailto:contacto@meisa.com.co" className="text-white font-lato text-sm hover:text-red-500 transition-colors">
                        contacto@meisa.com.co
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-5">
                    <Clock className="w-5 h-5 text-white/60 mt-1 flex-shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Horario</p>
                      <p className="text-white font-lato text-sm">Lun-Vie: 7:00 AM — 5:00 PM</p>
                      <p className="text-white font-lato text-sm">Sáb: 8:00 AM — 12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plantas */}
              <div>
                <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                  Ubicaciones
                </p>
                <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] text-white mb-2">
                  Nuestras plantas
                </h3>
                <p className="text-white/60 font-lato text-sm mb-6">
                  {plantas.length} plantas industriales — haz click para ver detalle.
                </p>

                <div className="space-y-px bg-white/10">
                  {plantas.map((planta) => (
                    <button
                      key={planta.id}
                      onClick={() => setSelectedPlanta(planta)}
                      className="group w-full bg-slate-950 hover:bg-slate-900 transition-colors text-left"
                    >
                      <div className="relative h-36 overflow-hidden border-b border-white/10">
                        <iframe
                          src={planta.mapEmbedUrl ?? ''}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        {/* Overlay bloquea click a Google + muestra nombre */}
                        <div className="absolute top-2 left-2 z-10 bg-slate-950 border border-white/20 px-2.5 py-1 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-white" strokeWidth={2.5} />
                          <span className="font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white">
                            Ver detalle
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                          {planta.tipo}
                        </p>
                        <h4 className="text-xl md:text-2xl font-bebas uppercase leading-[0.95] text-white mb-3">
                          {planta.nombre}
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          <p className="flex items-start gap-2 text-white/70 font-lato">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/40" />
                            <span>{planta.ubicacion}</span>
                          </p>
                          <p className="flex items-center gap-2 text-white/70 font-lato">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                            <span>{planta.telefono}</span>
                          </p>
                          <p className="flex items-center gap-2 text-white/70 font-lato">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
                            <span>{planta.horario}</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal planta — sharp, sin blur */}
      <AnimatePresence>
        {selectedPlanta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"
            onClick={() => setSelectedPlanta(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-slate-950 border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPlanta(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-950 border border-white/20 hover:border-white hover:bg-white hover:text-slate-950 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                  {selectedPlanta.tipo}
                </p>
                <h3 className="text-4xl md:text-5xl font-bebas uppercase leading-[0.95] text-white mb-4">
                  {selectedPlanta.nombre}
                </h3>
                <div className="flex items-start gap-2 text-white/70">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-white/40" strokeWidth={2} />
                  <p className="font-lato text-sm md:text-base">{selectedPlanta.ubicacion}</p>
                </div>
              </div>

              {/* Mapa */}
              <div className="px-8 pt-8">
                <div className="relative h-[380px] md:h-[450px] overflow-hidden border border-white/10">
                  <iframe
                    src={selectedPlanta.mapEmbedUrl ?? ''}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  {/* Overlay reemplaza el botón Maps de Google con nuestro propio link */}
                  {selectedPlanta.googleMapsUrl && (
                    <a
                      href={selectedPlanta.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 left-2 z-10 bg-slate-950 border border-white/20 px-2.5 py-1 flex items-center gap-1.5 hover:bg-white hover:border-white hover:text-slate-950 transition-colors"
                    >
                      <MapPin className="w-3 h-3" strokeWidth={2.5} />
                      <span className="font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em]">
                        Ver en Maps
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* Info grid */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10 mt-8">
                <div className="p-5 md:px-5 md:py-0">
                  <Phone className="w-5 h-5 text-white/40 mb-3" strokeWidth={2} />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Teléfono</p>
                  <p className="text-white font-lato text-sm">{selectedPlanta.telefono}</p>
                </div>
                <div className="p-5 md:px-5 md:py-0">
                  <Mail className="w-5 h-5 text-white/40 mb-3" strokeWidth={2} />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Email</p>
                  <p className="text-white font-lato text-sm break-all">{selectedPlanta.email}</p>
                </div>
                <div className="p-5 md:px-5 md:py-0">
                  <Clock className="w-5 h-5 text-white/40 mb-3" strokeWidth={2} />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Horario</p>
                  <p className="text-white font-lato text-sm">{selectedPlanta.horario}</p>
                </div>
              </div>

              {selectedPlanta.googleMapsUrl && (
                <div className="px-8 pb-8">
                  <a
                    href={selectedPlanta.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
                  >
                    Abrir en Google Maps
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
