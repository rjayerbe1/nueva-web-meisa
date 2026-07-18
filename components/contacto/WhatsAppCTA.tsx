"use client"

import { MessageCircle } from "lucide-react"
import { sendGAEvent } from "@next/third-parties/google"
import { trackWhatsappClick } from "@/lib/track-whatsapp"

// WhatsApp comercial canónico del sitio (mismo número usado en /servicios, /proyectos, widget).
const WHATSAPP_NUMBER = "573104327227"

interface WhatsAppCTAProps {
  /** Mensaje pre-rellenado del chat de WhatsApp. */
  mensaje?: string
  /** Etiqueta de origen para medición. */
  origen?: string
  /** Temperatura del contenedor: ghost blanco (dark) o ghost oscuro (light). */
  variant?: "dark" | "light"
}

/**
 * CTA "Cotizar por WhatsApp" que además dispara el evento generate_lead —
 * así dejamos de medir a ciegas los contactos que entran por WhatsApp.
 */
export function WhatsAppCTA({
  mensaje = "Hola MEISA, quisiera cotizar un proyecto en estructura metálica.",
  origen = "cta-whatsapp",
  variant = "dark",
}: WhatsAppCTAProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

  const styles =
    variant === "dark"
      ? "border border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-950"
      : "border border-slate-950/30 text-slate-950 hover:border-slate-950 hover:bg-slate-950 hover:text-white"

  const handleClick = () => {
    sendGAEvent("event", "generate_lead", { metodo: "whatsapp", origen })
    trackWhatsappClick(origen)
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center gap-3 px-8 py-4 font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 ${styles}`}
    >
      <MessageCircle className="w-5 h-5" strokeWidth={2} />
      Cotizar por WhatsApp
    </a>
  )
}
