'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, ArrowLeft, Check, Mail } from 'lucide-react'

/**
 * Asistente comercial IA — widget flotante con captura de leads y envío de la
 * conversación por correo. Diseño brutalist editorial. FAB abajo-derecha, a la
 * izquierda del botón de WhatsApp. Se muestra solo si NEXT_PUBLIC_CHAT_ENABLED.
 *
 * Datos personales (lead / correo): exigen autorización de tratamiento de datos
 * (Ley 1581/2012) vía checkbox obligatorio enlazado a /politica-datos.
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

/** Render inline de **negrillas** y [enlaces](url) dentro de una línea. */
function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      out.push(<strong key={i}>{m[1]}</strong>)
    } else {
      out.push(
        <a
          key={i}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-950"
        >
          {m[2]}
        </a>,
      )
    }
    last = re.lastIndex
    i++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Renderiza el mensaje del asistente: negrillas, viñetas y saltos de línea. */
function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, idx) => {
        if (line.trim() === '') return <div key={idx} className="h-1.5" />
        // Encabezados markdown (#, ##, ###) → negrilla, sin los "#".
        const heading = line.match(/^\s*#{1,6}\s+(.*)$/)
        if (heading) {
          return (
            <div key={idx} className="font-bold text-slate-900 mt-1.5">
              {renderInline(heading[1])}
            </div>
          )
        }
        if (/^\s*[*-]\s+/.test(line)) {
          const clean = line.replace(/^\s*[*-]\s+/, '')
          return (
            <div key={idx} className="flex gap-1.5">
              <span className="select-none">•</span>
              <span>{renderInline(clean)}</span>
            </div>
          )
        }
        return <div key={idx}>{renderInline(line)}</div>
      })}
    </>
  )
}

/** Checkbox de autorización de tratamiento de datos (Habeas Data, Ley 1581). */
function HabeasCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-3.5 h-3.5 accent-red-600 flex-shrink-0"
      />
      <span className="text-[10px] text-slate-500 font-lato leading-snug">
        Autorizo a MEISA a tratar mis datos personales con fines comerciales según su{' '}
        <a
          href="/politica-datos"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-700"
        >
          política de tratamiento de datos
        </a>
        .
      </span>
    </label>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hint, setHint] = useState(false)
  const [vista, setVista] = useState<'chat' | 'lead' | 'correo'>('chat')
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cerrado, setCerrado] = useState(false) // fin de conversación / no disponible

  // Lead
  const [lead, setLead] = useState(LEAD_INICIAL)
  const [leadHabeas, setLeadHabeas] = useState(false)
  const [leadEnviando, setLeadEnviando] = useState(false)
  const [leadEnviado, setLeadEnviado] = useState(false)
  const [leadError, setLeadError] = useState('')

  // Recibir conversación por correo (transcript)
  const [correoEmail, setCorreoEmail] = useState('')
  const [correoHabeas, setCorreoHabeas] = useState(false)
  const [correoWebsite, setCorreoWebsite] = useState('') // honeypot
  const [correoEnviando, setCorreoEnviando] = useState(false)
  const [correoError, setCorreoError] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileToken = useRef<string>('')
  const turnstileWidgetId = useRef<string>('')

  // Globo de invitación: una vez por navegador, SOLO después de hacer scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('meisa_chat_hint_seen')) return
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setHint(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cerrarHint = useCallback(() => {
    setHint(false)
    try {
      window.localStorage.setItem('meisa_chat_hint_seen', '1')
    } catch {
      /* noop */
    }
  }, [])

  const abrir = useCallback(() => {
    setIsOpen(true)
    cerrarHint()
  }, [cerrarHint])

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
      renovarTurnstile()

      // Errores / mantenimiento → JSON. Respuesta normal → texto en streaming.
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || ct.includes('application/json') || !res.body) {
        const data = await res.json().catch(() => ({}))
        const reply =
          data.reply ||
          data.error ||
          'Disculpa, tuve un problema para responder. Intenta de nuevo o escríbenos por WhatsApp.'
        setMensajes((prev) => [...prev, { rol: 'assistant', contenido: reply }])
        if (data.disponible === false || data.finConversacion) setCerrado(true)
        return
      }

      // Streaming: agrega una burbuja vacía y la va llenando con cada fragmento.
      setLoading(false)
      setMensajes((prev) => [...prev, { rol: 'assistant', contenido: '' }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMensajes((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { rol: 'assistant', contenido: acc }
          return copy
        })
      }
      if (!acc.trim()) {
        setMensajes((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            rol: 'assistant',
            contenido:
              'Disculpa, no pude responder. Intenta de nuevo o escríbenos por WhatsApp.',
          }
          return copy
        })
      }
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
      if (!leadHabeas) {
        setLeadError('Debes autorizar el tratamiento de datos para continuar.')
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
            habeasData: true,
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
          setLeadHabeas(false)
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
    [lead, leadHabeas, leadEnviando, renovarTurnstile],
  )

  const enviarCorreo = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (correoEnviando) return
      setCorreoError('')
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correoEmail)) {
        setCorreoError('Ingresa un correo válido.')
        return
      }
      if (!correoHabeas) {
        setCorreoError('Debes autorizar el tratamiento de datos para continuar.')
        return
      }
      setCorreoEnviando(true)
      try {
        const res = await fetch('/api/chat/transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: getSessionId(),
            email: correoEmail.trim(),
            habeasData: true,
            website: correoWebsite,
            turnstileToken: turnstileToken.current || undefined,
          }),
        })
        const data = await res.json().catch(() => ({}))
        renovarTurnstile()

        if (res.ok && data.success) {
          const dest = correoEmail.trim()
          setVista('chat')
          setCorreoEmail('')
          setCorreoHabeas(false)
          setMensajes((prev) => [
            ...prev,
            {
              rol: 'assistant',
              contenido: `📧 Te envié la conversación a **${dest}**. Revisa tu bandeja (y spam, por si acaso). ¿Algo más?`,
            },
          ])
        } else {
          setCorreoError(data.message || 'No se pudo enviar. Intenta de nuevo.')
        }
      } catch {
        setCorreoError('No se pudo conectar. Intenta de nuevo.')
      } finally {
        setCorreoEnviando(false)
      }
    },
    [correoEmail, correoHabeas, correoWebsite, correoEnviando, renovarTurnstile],
  )

  if (!ENABLED) return null

  const inputCls =
    'w-full border border-slate-300 rounded-none px-3 py-2 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950'

  return (
    <>
      {/* Globo de invitación (una vez por navegador, tras scroll) */}
      <AnimatePresence>
        {hint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-[15rem]"
          >
            <div className="relative bg-white border border-slate-200 shadow-xl p-3.5">
              <button
                onClick={cerrarHint}
                aria-label="Cerrar"
                className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button onClick={abrir} className="text-left">
                <p className="font-bebas text-lg uppercase leading-none text-slate-950 mb-1">
                  ¿Dudas sobre tu proyecto?
                </p>
                <p className="font-lato text-xs text-slate-600 leading-snug pr-3">
                  Pregúntale al asistente de MEISA — servicios, proyectos y cotizaciones. 👋
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante — abajo-derecha, a la IZQUIERDA del de WhatsApp */}
      <motion.div
        className="fixed bottom-6 right-24 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <motion.button
          onClick={() => (isOpen ? setIsOpen(false) : abrir())}
          className="bg-slate-950 hover:bg-slate-800 text-white rounded-full p-3 shadow-xl transition-colors duration-200 flex items-center justify-center"
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
                <MessageCircle className="w-6 h-6" />
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
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-md"
          >
            <div className="bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-slate-950 text-white px-5 py-4">
                <p className="text-white/50 font-lato font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                  Asistente MEISA
                </p>
                <h3 className="font-bebas text-2xl uppercase leading-none">
                  {vista === 'lead'
                    ? 'Déjanos tus datos'
                    : vista === 'correo'
                      ? 'Recibir por correo'
                      : '¿En qué te ayudamos?'}
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
                      className={`max-w-[85%] px-3.5 py-2.5 font-lato text-sm leading-relaxed ${
                        m.rol === 'user'
                          ? 'bg-slate-950 text-white whitespace-pre-wrap'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {m.rol === 'assistant' ? (
                        <FormattedMessage text={m.contenido} />
                      ) : (
                        m.contenido
                      )}
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

              {/* Turnstile (auto si hay site key) — disponible en todas las vistas */}
              {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="px-4" />}

              {/* ---- Vista: formulario de lead ---- */}
              {vista === 'lead' && (
                <form onSubmit={enviarLead} className="border-t border-slate-200 p-4 bg-white space-y-2.5">
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
                  <HabeasCheckbox checked={leadHabeas} onChange={setLeadHabeas} />
                  {leadError && <p className="text-[11px] text-red-600 font-lato">{leadError}</p>}
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
              )}

              {/* ---- Vista: recibir conversación por correo ---- */}
              {vista === 'correo' && (
                <form onSubmit={enviarCorreo} className="border-t border-slate-200 p-4 bg-white space-y-2.5">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={correoWebsite}
                    onChange={(e) => setCorreoWebsite(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <p className="font-lato text-xs text-slate-600">
                    Te enviamos esta conversación a tu correo.
                  </p>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="Tu correo *"
                    value={correoEmail}
                    onChange={(e) => setCorreoEmail(e.target.value)}
                    maxLength={160}
                  />
                  <HabeasCheckbox checked={correoHabeas} onChange={setCorreoHabeas} />
                  {correoError && <p className="text-[11px] text-red-600 font-lato">{correoError}</p>}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setVista('chat')
                        setCorreoError('')
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 text-slate-700 font-lato font-bold text-xs uppercase tracking-wider hover:border-slate-950 hover:text-slate-950 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                    <button
                      type="submit"
                      disabled={correoEnviando}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-lato font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {correoEnviando ? 'Enviando…' : 'Enviarme la conversación'}
                      {!correoEnviando && <Mail className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}

              {/* ---- Vista: chat ---- */}
              {vista === 'chat' && (
                <div className="border-t border-slate-200 bg-white">
                  {/* CTAs */}
                  {!cerrado && (
                    <div className="divide-y divide-slate-200 border-b border-slate-200">
                      {!leadEnviado && (
                        <button
                          onClick={() => setVista('lead')}
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-50 text-left group"
                        >
                          <span className="font-lato text-xs text-slate-600">
                            ¿Quieres que un asesor te contacte?{' '}
                            <span className="font-bold text-slate-950">Dejar mis datos</span>
                          </span>
                          <Send className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                      <button
                        onClick={() => setVista('correo')}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-50 text-left group"
                      >
                        <span className="font-lato text-xs text-slate-600 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          Recibir esta conversación por correo
                        </span>
                      </button>
                    </div>
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
