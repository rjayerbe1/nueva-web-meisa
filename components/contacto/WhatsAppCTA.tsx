import { getWhatsappComercial } from "@/lib/content/whatsapp"
import { WhatsAppCTAButton } from "./WhatsAppCTAButton"

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
 *
 * Server component: lee el número de la DB (/admin/contacto) y se lo pasa al
 * botón cliente. Si no hay número configurado no renderiza nada, en vez de
 * mandar gente a un número viejo pegado en el código.
 */
export async function WhatsAppCTA({
  mensaje,
  origen,
  variant,
}: WhatsAppCTAProps) {
  const whatsapp = await getWhatsappComercial()
  if (!whatsapp) return null

  return (
    <WhatsAppCTAButton
      numero={whatsapp.digits}
      mensaje={mensaje}
      origen={origen}
      variant={variant}
    />
  )
}
