"use client"

import { MessageCircle } from "lucide-react"
import { sendGAEvent } from "@next/third-parties/google"
import { trackWhatsappClick } from "@/lib/track-whatsapp"

interface WhatsAppCTAButtonProps {
  /** Dígitos del WhatsApp comercial. Viene de la DB, nunca hardcodeado. */
  numero: string
  mensaje?: string
  origen?: string
  variant?: "dark" | "light"
}

/**
 * Parte cliente del CTA de WhatsApp (necesita onClick para medir).
 * El número lo inyecta el server — ver `WhatsAppCTA` y `lib/content/whatsapp.ts`.
 */
export function WhatsAppCTAButton({
  numero,
  mensaje = "Hola MEISA, quisiera cotizar un proyecto en estructura metálica.",
  origen = "cta-whatsapp",
  variant = "dark",
}: WhatsAppCTAButtonProps) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`

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
