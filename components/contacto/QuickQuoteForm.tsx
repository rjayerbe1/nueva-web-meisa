"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { sendGAEvent } from "@next/third-parties/google"

interface QuickQuoteFormProps {
  /** Tema de la página, para dar contexto al comercial (ej. "precios de estructura metálica"). */
  tema: string
  /** Etiqueta de origen para medición (ej. "guia-precios"). */
  origen: string
  /** Categoría/tipo que se guarda en el lead. Por defecto "OTRO". */
  tipoProyecto?: string
  /** Encabezado del bloque. */
  titulo?: string
  /** Subtítulo/pitch. */
  subtitulo?: string
}

/**
 * Captura ligera (3 campos) para páginas de alto tráfico informacional (guías,
 * precios). Matchea la intención del que investiga: "déjanos tus datos y te
 * mandamos un estimado", en vez de rebotarlo al brief completo de /contacto.
 * Variante Light (editorial) para calzar con GuiaTemplate.
 */
export function QuickQuoteForm({
  tema,
  origen,
  tipoProyecto = "OTRO",
  titulo = "¿Quieres un estimado para tu proyecto?",
  subtitulo = "Déjanos tus datos y te enviamos un rango orientativo en menos de 24 horas hábiles. Sin compromiso.",
}: QuickQuoteFormProps) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [habeas, setHabeas] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState("")

  const inputClass =
    "w-full px-4 py-3 bg-stone-50 border border-slate-300 text-slate-950 placeholder-slate-400 focus:outline-none focus:border-red-600 transition-colors font-lato rounded-none"
  const labelClass =
    "block text-slate-500 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-2"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setError("")

    if (nombre.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Ingresa tu nombre y un correo válido.")
      return
    }
    if (telefono.replace(/\D/g, "").length < 7) {
      setError("Ingresa un teléfono válido.")
      return
    }
    if (!habeas) {
      setError("Debes autorizar el tratamiento de datos.")
      return
    }

    setEnviando(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          tipoProyecto,
          descripcion: `Solicitud de estimado rápido desde ${tema}. El usuario pide un rango orientativo de precio.`,
          website: honeypot,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.success) {
        setEnviado(true)
        sendGAEvent("event", "generate_lead", {
          metodo: "mini-form",
          origen,
        })
      } else {
        setError(json.message || "No se pudo enviar. Intenta de nuevo.")
      }
    } catch {
      setError("No se pudo conectar. Intenta de nuevo o escríbenos directo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="border border-slate-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Pitch */}
            <div className="lg:col-span-5 p-8 md:p-10 lg:border-r border-slate-200 flex flex-col justify-center">
              <p className="text-red-600 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                Estimado rápido
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase leading-[0.95] text-slate-950 mb-4">
                {titulo}
              </h2>
              <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed max-w-md">
                {subtitulo}
              </p>
            </div>

            {/* Form o confirmación */}
            <div className="lg:col-span-7 p-8 md:p-10">
              {enviado ? (
                <div className="h-full flex flex-col justify-center">
                  <CheckCircle2
                    className="w-10 h-10 text-red-600 mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-3xl md:text-4xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                    ¡Gracias! Te contactamos pronto.
                  </h3>
                  <p className="text-slate-600 font-lato text-sm md:text-base">
                    Nuestro equipo comercial te enviará un estimado en menos de
                    24 horas hábiles.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <div
                    className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="qq-website">No llenar</label>
                    <input
                      id="qq-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="qq-nombre" className={labelClass}>
                      Nombre *
                    </label>
                    <input
                      id="qq-nombre"
                      type="text"
                      autoComplete="name"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className={inputClass}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qq-email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        id="qq-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="qq-telefono" className={labelClass}>
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="qq-telefono"
                        type="tel"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={inputClass}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={habeas}
                      onChange={(e) => setHabeas(e.target.checked)}
                      className="w-4 h-4 mt-0.5 border border-slate-400 accent-red-600"
                    />
                    <span className="text-slate-600 font-lato text-xs leading-relaxed group-hover:text-slate-950 transition-colors">
                      Autorizo el tratamiento de mis datos según la{" "}
                      <Link
                        href="/politica-datos"
                        className="underline underline-offset-2 hover:text-slate-950"
                      >
                        política de datos
                      </Link>
                      .
                    </span>
                  </label>

                  {error && (
                    <p className="text-red-600 font-lato text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enviando ? (
                      "Enviando…"
                    ) : (
                      <>
                        Quiero un estimado
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
