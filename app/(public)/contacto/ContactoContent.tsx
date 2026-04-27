"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { PlantaPublica } from "@/lib/content/plantas"

import { ProjectTypeSelector } from "@/components/contacto/ProjectTypeSelector"
import {
  ProjectStageSelector,
  type ProjectStageValue,
} from "@/components/contacto/ProjectStageSelector"
import { CityAutocomplete } from "@/components/contacto/CityAutocomplete"
import { ScaleInput, type ScaleUnit } from "@/components/contacto/ScaleInput"
import {
  FileUploadZone,
  type UploadedFile,
} from "@/components/contacto/FileUploadZone"

const HERO_IMAGE =
  "https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg"
const BREAK_IMAGE =
  "https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg"

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  empresa: z.string().optional(),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  tipoProyecto: z.string().min(1, "Selecciona un tipo de proyecto"),
  etapa: z.string().min(1, "Selecciona la etapa del proyecto"),
  escalaValor: z
    .number()
    .nullable()
    .optional()
    .or(z.literal(null))
    .or(z.nan().transform(() => null)),
  escalaUnidad: z.enum(["M2", "TON", "NA"]).nullable().optional(),
  descripcion: z
    .string()
    .min(20, "Por favor describe tu proyecto (mínimo 20 caracteres)"),
  habeasData: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el tratamiento de datos" }),
  }),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactoContentProps {
  plantas: PlantaPublica[]
}

const inputClass =
  "w-full px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-colors font-lato"
const labelClass =
  "block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-2"
const errorClass = "mt-1 text-xs text-red-500 font-lato"

export default function ContactoContent({
  plantas,
}: ContactoContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  )
  const [referencia, setReferencia] = useState<string | null>(null)
  const [adjuntos, setAdjuntos] = useState<UploadedFile[]>([])
  const [selectedPlanta, setSelectedPlanta] = useState<PlantaPublica | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      escalaValor: null,
      escalaUnidad: null,
      habeasData: undefined as unknown as true,
    },
  })

  const escalaValor = watch("escalaValor")
  const escalaUnidad = watch("escalaUnidad")

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const payload = {
        nombre: data.nombre,
        empresa: data.empresa || null,
        email: data.email,
        telefono: data.telefono,
        ciudad: data.ciudad,
        tipoProyecto: data.tipoProyecto,
        etapa: data.etapa,
        escalaValor: data.escalaValor ?? null,
        escalaUnidad: data.escalaUnidad ?? null,
        descripcion: data.descripcion,
        adjuntos,
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Error al enviar el mensaje")
      }
      setReferencia(json.referencia ?? null)
      setSubmitStatus("success")
      setAdjuntos([])
      reset()
    } catch (error) {
      setSubmitStatus("error")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative h-[80vh] md:h-[85vh] min-h-[560px] overflow-hidden bg-slate-950">
        <Image
          src={HERO_IMAGE}
          alt="MEISA — Hablemos de tu próximo proyecto"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-white/60 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-5">
                01 — Contacto
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white">
                Hablemos de tu
              </h1>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.95] text-white/40">
                próximo proyecto.
              </h2>
              <p className="mt-8 text-base md:text-lg text-white/70 font-lato leading-relaxed max-w-2xl">
                Cuéntanos lo que tienes hoy — desde una idea inicial hasta
                planos definitivos. Nuestro equipo de diseño, fabricación y
                montaje te responde en menos de 24 horas con una hoja de ruta
                clara.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section
        id="formulario-contacto"
        className="relative bg-slate-950 border-t border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Columna izquierda — header editorial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Tu solicitud
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white mb-2">
                Cuéntanos
              </h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40 mb-8">
                los detalles.
              </h3>
              <p className="text-white/60 font-lato text-base leading-relaxed mb-8 max-w-md">
                Con esta información podemos prepararte una respuesta concreta.
                Mientras más completo el envío, más rápido cotizamos o
                agendamos visita técnica.
              </p>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                    Atención directa
                  </p>
                  <a
                    href="mailto:contacto@meisa.com.co"
                    className="text-white font-lato text-sm hover:text-red-500 transition-colors"
                  >
                    contacto@meisa.com.co
                  </a>
                </div>
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                    PBX Cali
                  </p>
                  <a
                    href="tel:+5723120050"
                    className="text-white font-lato text-sm hover:text-red-500 transition-colors"
                  >
                    +57 (2) 312 0050-51-52-53
                  </a>
                </div>
                <div>
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                    Horario
                  </p>
                  <p className="text-white font-lato text-sm">
                    Lun-Vie 7:00 — 17:00 · Sáb 8:00 — 12:00
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Columna derecha — form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7"
            >
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-white/20 p-10 md:p-12"
                >
                  <CheckCircle2
                    className="w-12 h-12 text-red-600 mb-5"
                    strokeWidth={1.5}
                  />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Solicitud recibida
                  </p>
                  <h3 className="text-4xl md:text-5xl font-bebas uppercase leading-[0.95] text-white mb-4">
                    Gracias por escribirnos.
                  </h3>
                  {referencia && (
                    <div className="border-y border-white/10 py-5 my-6">
                      <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                        Tu referencia
                      </p>
                      <p className="text-white font-bebas text-3xl md:text-4xl tracking-wider">
                        {referencia}
                      </p>
                    </div>
                  )}
                  <p className="text-white/70 font-lato text-sm md:text-base mb-2">
                    Te enviamos una confirmación al correo que registraste.
                  </p>
                  <p className="text-white/60 font-lato text-sm md:text-base">
                    Nuestro equipo comercial te responderá en menos de 24 horas
                    hábiles.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitStatus("idle")
                      setReferencia(null)
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-white/60 font-lato font-bold text-xs uppercase tracking-[0.15em] hover:text-white transition-colors"
                  >
                    Enviar otra solicitud
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 md:space-y-7"
                >
                  {/* Nombre + Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className={labelClass}>
                        Nombre completo *
                      </label>
                      <input
                        {...register("nombre")}
                        id="nombre"
                        type="text"
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Tu nombre"
                      />
                      {errors.nombre && (
                        <p className={errorClass}>{errors.nombre.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="empresa" className={labelClass}>
                        Empresa <span className="text-white/30 normal-case tracking-normal font-normal">(opcional)</span>
                      </label>
                      <input
                        {...register("empresa")}
                        id="empresa"
                        type="text"
                        autoComplete="organization"
                        className={inputClass}
                        placeholder="Tu empresa"
                      />
                    </div>
                  </div>

                  {/* Email + Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p className={errorClass}>{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="telefono" className={labelClass}>
                        Teléfono *
                      </label>
                      <input
                        {...register("telefono")}
                        id="telefono"
                        type="tel"
                        autoComplete="tel"
                        className={inputClass}
                        placeholder="+57 300 123 4567"
                      />
                      {errors.telefono && (
                        <p className={errorClass}>{errors.telefono.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Ciudad autocomplete */}
                  <Controller
                    control={control}
                    name="ciudad"
                    render={({ field }) => (
                      <CityAutocomplete
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={errors.ciudad?.message}
                      />
                    )}
                  />

                  {/* Tipo de proyecto */}
                  <Controller
                    control={control}
                    name="tipoProyecto"
                    render={({ field }) => (
                      <ProjectTypeSelector
                        value={field.value || null}
                        onChange={field.onChange}
                        error={errors.tipoProyecto?.message}
                      />
                    )}
                  />

                  {/* Etapa del proyecto */}
                  <Controller
                    control={control}
                    name="etapa"
                    render={({ field }) => (
                      <ProjectStageSelector
                        value={field.value || null}
                        onChange={(v: ProjectStageValue) => field.onChange(v)}
                        error={errors.etapa?.message}
                      />
                    )}
                  />

                  {/* Escala estimada */}
                  <ScaleInput
                    valor={escalaValor ?? null}
                    unidad={(escalaUnidad ?? null) as ScaleUnit | null}
                    onChangeValor={(v) =>
                      setValue("escalaValor", v, { shouldValidate: false })
                    }
                    onChangeUnidad={(u) =>
                      setValue("escalaUnidad", u, { shouldValidate: false })
                    }
                  />

                  {/* Adjuntos */}
                  <FileUploadZone files={adjuntos} onChange={setAdjuntos} />

                  {/* Descripción */}
                  <div>
                    <label htmlFor="descripcion" className={labelClass}>
                      Descripción del proyecto *
                    </label>
                    <textarea
                      {...register("descripcion")}
                      id="descripcion"
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Cuéntanos los detalles: ubicación, alcance, plazos, restricciones técnicas o de obra…"
                    />
                    {errors.descripcion && (
                      <p className={errorClass}>{errors.descripcion.message}</p>
                    )}
                  </div>

                  {/* Habeas Data */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register("habeasData")}
                        className="w-4 h-4 mt-0.5 border border-white/30 bg-slate-900 text-red-600 focus:ring-0 focus:ring-offset-0 accent-red-600"
                      />
                      <span className="text-white/70 font-lato text-xs md:text-sm leading-relaxed group-hover:text-white transition-colors">
                        Autorizo a MEISA a tratar mis datos personales para
                        fines comerciales según su{" "}
                        <Link
                          href="/calidad"
                          className="underline underline-offset-2 hover:text-white"
                        >
                          política de tratamiento de datos
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.habeasData && (
                      <p className={errorClass}>{errors.habeasData.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        "Enviando…"
                      ) : (
                        <>
                          Enviar solicitud
                          <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    {submitStatus === "error" && (
                      <p className="mt-4 text-red-500 font-lato text-sm">
                        Hubo un error al enviar. Por favor intenta de nuevo o
                        escríbenos directo a contacto@meisa.com.co.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <Image
          src={BREAK_IMAGE}
          alt="MEISA — Estructura industrial"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/30" />
      </div>

      {/* PLANTAS */}
      <section className="relative bg-slate-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 max-w-4xl"
          >
            <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              02 — Ubicaciones
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white">
              Nuestras
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] text-white/40">
              plantas.
            </h3>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              {plantas.length} plantas industriales con cobertura nacional. Haz
              click para ver detalle de cada una.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {plantas.map((planta) => (
              <button
                key={planta.id}
                onClick={() => setSelectedPlanta(planta)}
                className="group bg-slate-950 hover:bg-slate-900 transition-colors text-left flex flex-col"
              >
                <div className="relative h-44 md:h-52 overflow-hidden border-b border-white/10">
                  <iframe
                    src={planta.mapEmbedUrl ?? ""}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-2 left-2 z-10 bg-slate-950 border border-white/20 px-2.5 py-1 flex items-center gap-1.5">
                    <MapPin
                      className="w-3 h-3 text-white"
                      strokeWidth={2.5}
                    />
                    <span className="font-lato font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white">
                      Ver detalle
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    {planta.tipo}
                  </p>
                  <h4 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-white mb-4">
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
      </section>

      {/* MODAL planta */}
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

              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                  {selectedPlanta.tipo}
                </p>
                <h3 className="text-4xl md:text-5xl font-bebas uppercase leading-[0.95] text-white mb-4">
                  {selectedPlanta.nombre}
                </h3>
                <div className="flex items-start gap-2 text-white/70">
                  <MapPin
                    className="w-4 h-4 mt-1 flex-shrink-0 text-white/40"
                    strokeWidth={2}
                  />
                  <p className="font-lato text-sm md:text-base">
                    {selectedPlanta.ubicacion}
                  </p>
                </div>
              </div>

              <div className="px-8 pt-8">
                <div className="relative h-[380px] md:h-[450px] overflow-hidden border border-white/10">
                  <iframe
                    src={selectedPlanta.mapEmbedUrl ?? ""}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
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

              <div className="p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10 mt-8">
                <div className="p-5 md:px-5 md:py-0">
                  <Phone
                    className="w-5 h-5 text-white/40 mb-3"
                    strokeWidth={2}
                  />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Teléfono
                  </p>
                  <p className="text-white font-lato text-sm">
                    {selectedPlanta.telefono}
                  </p>
                </div>
                <div className="p-5 md:px-5 md:py-0">
                  <Mail
                    className="w-5 h-5 text-white/40 mb-3"
                    strokeWidth={2}
                  />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Email
                  </p>
                  <p className="text-white font-lato text-sm break-all">
                    {selectedPlanta.email}
                  </p>
                </div>
                <div className="p-5 md:px-5 md:py-0">
                  <Clock
                    className="w-5 h-5 text-white/40 mb-3"
                    strokeWidth={2}
                  />
                  <p className="text-white/40 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                    Horario
                  </p>
                  <p className="text-white font-lato text-sm">
                    {selectedPlanta.horario}
                  </p>
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
