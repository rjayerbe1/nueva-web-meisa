'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react'

/**
 * Asistente comercial IA — widget flotante con captura de leads.
 *
 * Diseño: brutalist editorial (font-bebas títulos, font-lato cuerpo, bordes
 * rectos, sin glassmorphism). FAB negro en la esquina INFERIOR IZQUIERDA para
 * no chocar con el botón verde de WhatsApp (inferior derecha) ni el MENU
 * (superior derecha).
 *
 * Se muestra solo si NEXT_PUBLIC_CHAT_ENABLED === 'true'. El anti-bot Turnstile
 * se activa solo si NEXT_PUBLIC_TURNSTILE_SITE_KEY está definido.
 *
 * Leads: el botón "Dejar mis datos" abre un formulario que crea un ContactForm
 * (origen='chatbot') y notifica al equipo comercial por correo (Fase 2).
 */

const ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED === 'true'
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

interface Mensaje {
  rol: 'user' | 'assistant'
  contenido: string
}

const SALUDO: Mensaje = {
  rol: 'assistant',
  contenido:
    '¡Hola! 👋 Soy el asistente de MEISA. Puedo contarte sobre nuestros servicios de estructuras metálicas, proyectos y cómo solicitar una cotización. ¿En qué te ayudo?',
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'meisa_chat_session'
  let id = window.localStorage.getItem(key)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(key, id)
  }
  return id
}

const LEAD_INICIAL = { nombre: '', email: '', telefono: '', empresa: '', mensaje: '', website: '' }

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [vista, setVista] = useState<'chat' | 'lead'>('chat')
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cerrado, setCerrado] = useState(false) // fin de conversación / no disponible

  // Lead
  const [lead, setLead] = useState(LEAD_INICIAL)
  const [leadEnviando, setLeadEnviando] = useState(false)
  const [leadEnviado, setLeadEnviado] = useState(false)
  const [leadError, setLeadError] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileToken = useRef<string>('')
  const turnstileWidgetId = useRef<string>('')

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes, loading])

  // Cargar Turnstile (solo si hay site key)
  useEffect(() => {
    if (!isOpen || !TURNSTILE_SITE_KEY) return
    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) return
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        size: 'flexible',
        callback: (token: string) => {
          turnstileToken.current = token
        },
        'error-callback': () => {
          turnstileToken.current = ''
        },
      })
    }
    if (window.turnstile) {
      renderWidget()
    } else if (!document.getElementById('cf-turnstile-script')) {
      const s = document.createElement('script')
      s.id = 'cf-turnstile-script'
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      s.async = true
      s.defer = true
      s.onload = renderWidget
      document.head.appendChild(s)
    }
  }, [isOpen])

  const renovarTurnstile = useCallback(() => {
    if (TURNSTILE_SITE_KEY && window.turnstile && turnstileWidgetId.current) {
      turnstileToken.current = ''
      window.turnstile.reset(turnstileWidgetId.current)
    }
  }, [])

  const enviar = useCallback(async () => {
    const texto = input.trim()
    if (!texto || loading || cerrado) return

    setMensajes((prev) => [...prev, { rol: 'user', contenido: texto }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          mensaje: texto,
          turnstileToken: turnstileToken.current || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      renovarTurnstile()

      const reply =
        data.reply ||
        data.error ||
        'Disculpa, tuve un problema para responder. Intenta de nuevo o escríbenos por WhatsApp.'
      setMensajes((prev) => [...prev, { rol: 'assistant', contenido: reply }])

      if (data.disponible === false || data.finConversacion) setCerrado(true)
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          rol: 'assistant',
          contenido:
            'No pude conectarme en este momento. Por favor escríbenos por WhatsApp o en la página de contacto.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, cerrado, renovarTurnstile])

  const enviarLead = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (leadEnviando) return
      setLeadError('')
      if (lead.nombre.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
        setLeadError('Por favor ingresa tu nombre y un correo válido.')
        return
      }
      setLeadEnviando(true)
      try {
        const res = await fetch('/api/chat/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: getSessionId(),
            nombre: lead.nombre.trim(),
            email: lead.email.trim(),
            telefono: lead.telefono.trim() || undefined,
            empresa: lead.empresa.trim() || undefined,
            mensaje: lead.mensaje.trim() || undefined,
            website: lead.website,
            turnstileToken: turnstileToken.current || undefined,
          }),
        })
        const data = await res.json().catch(() => ({}))
        renovarTurnstile()

        if (res.ok && data.success) {
          setLeadEnviado(true)
          setVista('chat')
          setLead(LEAD_INICIAL)
          setMensajes((prev) => [
            ...prev,
            {
              rol: 'assistant',
              contenido: `¡Gracias! Tus datos quedaron registrados${
                data.referencia ? ` (ref. ${data.referencia})` : ''
              }. 🙌 Nuestro equipo comercial te contactará muy pronto. ¿Algo más en lo que te ayude?`,
            },
          ])
        } else {
          setLeadError(data.message || 'No se pudo enviar. Intenta de nuevo.')
        }
      } catch {
        setLeadError('No se pudo conectar. Intenta de nuevo o escríbenos por WhatsApp.')
      } finally {
        setLeadEnviando(false)
      }
    },
    [lead, leadEnviando, renovarTurnstile],
  )

  if (!ENABLED) return null

  const inputCls =
    'w-full border border-slate-300 rounded-none px-3 py-2 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950'

  return (
    <>
      {/* Botón flotante — inferior IZQUIERDA (no choca con WhatsApp ni MENU) */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          className="bg-slate-950 hover:bg-slate-800 text-white rounded-full p-3.5 shadow-xl transition-colors duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente MEISA'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Panel del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-6 z-40 w-[calc(100vw-3rem)] max-w-md"
          >
            <div className="bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
              {/* Header oscuro brutalist */}
              <div className="bg-slate-950 text-white px-5 py-4">
                <p className="text-white/50 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                  Asistente MEISA
                </p>
                <h3 className="font-bebas text-2xl uppercase leading-none">
                  {vista === 'lead' ? 'Déjanos tus datos' : '¿En qué te ayudamos?'}
                </h3>
              </div>

              {/* Mensajes */}
              <div
                ref={scrollRef}
                className="bg-stone-50 px-4 py-4 space-y-3 overflow-y-auto h-[55vh] max-h-[460px]"
              >
                {mensajes.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 font-lato text-sm leading-relaxed whitespace-pre-wrap ${
                        m.rol === 'user'
                          ? 'bg-slate-950 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {m.contenido}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-3.5 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Turnstile (auto si hay site key) */}
              {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="px-4" />}

              {/* Sección inferior: formulario de lead o input de chat */}
              {vista === 'lead' ? (
                <form onSubmit={enviarLead} className="border-t border-slate-200 p-4 bg-white space-y-2.5">
                  {/* Honeypot (oculto) */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={lead.website}
                    onChange={(e) => setLead((l) => ({ ...l, website: e.target.value }))}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <input
                    className={inputCls}
                    placeholder="Nombre *"
                    value={lead.nombre}
                    onChange={(e) => setLead((l) => ({ ...l, nombre: e.target.value }))}
                    maxLength={120}
                  />
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="Correo *"
                    value={lead.email}
                    onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                    maxLength={160}
                  />
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="Teléfono"
                      value={lead.telefono}
                      onChange={(e) => setLead((l) => ({ ...l, telefono: e.target.value }))}
                      maxLength={40}
                    />
                    <input
                      className={inputCls}
                      placeholder="Empresa"
                      value={lead.empresa}
                      onChange={(e) => setLead((l) => ({ ...l, empresa: e.target.value }))}
                      maxLength={160}
                    />
                  </div>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="¿En qué proyecto estás pensando? (opcional)"
                    value={lead.mensaje}
                    onChange={(e) => setLead((l) => ({ ...l, mensaje: e.target.value }))}
                    maxLength={2000}
                  />
                  {leadError && (
                    <p className="text-[11px] text-red-600 font-lato">{leadError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setVista('chat')
                        setLeadError('')
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 text-slate-700 font-lato font-bold text-xs uppercase tracking-wider hover:border-slate-950 hover:text-slate-950 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                    <button
                      type="submit"
                      disabled={leadEnviando}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-lato font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {leadEnviando ? 'Enviando…' : 'Enviar mis datos'}
                      {!leadEnviando && <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border-t border-slate-200 bg-white">
                  {/* CTA para dejar datos */}
                  {!leadEnviado && !cerrado && (
                    <button
                      onClick={() => setVista('lead')}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-slate-200 text-left group"
                    >
                      <span className="font-lato text-xs text-slate-600">
                        ¿Quieres que un asesor te contacte?{' '}
                        <span className="font-bold text-slate-950">Dejar mis datos</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                  {leadEnviado && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 border-b border-slate-200 text-xs text-slate-600 font-lato">
                      <Check className="w-4 h-4 text-green-600" />
                      Datos enviados. Te contactaremos pronto.
                    </div>
                  )}

                  {/* Input del chat */}
                  <div className="p-3">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            enviar()
                          }
                        }}
                        rows={1}
                        maxLength={1000}
                        disabled={cerrado}
                        placeholder={cerrado ? 'Conversación finalizada' : 'Escribe tu mensaje…'}
                        className="flex-1 resize-none border border-slate-300 rounded-none px-3 py-2 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 disabled:bg-slate-50 max-h-28"
                      />
                      <button
                        onClick={enviar}
                        disabled={loading || cerrado || !input.trim()}
                        className="bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 text-white p-2.5 transition-colors"
                        aria-label="Enviar mensaje"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 font-lato leading-snug">
                      Asistente con IA · puede cometer errores. Para temas formales,
                      escríbenos por WhatsApp o en{' '}
                      <a href="/contacto" className="underline hover:text-slate-700">
                        Contacto
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
