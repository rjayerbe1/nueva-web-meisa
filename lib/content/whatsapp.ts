import { cache } from "react"
import { getConfiguracionContacto } from "@/lib/content/servicios-contacto"

export type WhatsappComercial = {
  /** Solo dígitos con indicativo, listo para `https://wa.me/<digits>`. */
  digits: string
  /** Formato legible para textos y prompts: "+57 300 782 8139". */
  display: string
}

/** "+57 XXX XXX XXXX" a partir de los dígitos (deja intacto lo que no calce). */
function formatear(digits: string): string {
  const m = digits.match(/^57(\d{3})(\d{3})(\d{4})$/)
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${digits}`
}

/**
 * ÚNICA fuente de verdad del WhatsApp comercial del sitio.
 *
 * Sale de `ConfiguracionContacto.whatsappNumero` (editable en /admin/contacto)
 * y alimenta TODOS los CTA de WhatsApp: guías, /precios, /servicios/[slug],
 * /proyectos, el bloque de contacto del home y el prompt del chatbot.
 * No hardcodear el número en ningún componente — cambiarlo debe ser un solo
 * campo en el admin, no un deploy.
 *
 * Devuelve null si el campo está vacío o no es un número usable: los CTA
 * entonces se ocultan o caen a /contacto, que es preferible a mandar gente a
 * un número equivocado que quedó pegado en el código.
 *
 * (El widget flotante es aparte: usa la tabla `ContactoWhatsApp`, que permite
 * varios asesores por área — se administra en /admin/contactos-whatsapp.)
 */
export const getWhatsappComercial = cache(
  async (): Promise<WhatsappComercial | null> => {
    const config = await getConfiguracionContacto().catch(() => null)
    const digits = (config?.whatsappNumero ?? "").replace(/\D/g, "")
    if (digits.length < 10) return null
    return { digits, display: formatear(digits) }
  },
)
