/**
 * Registra un clic en un botón de WhatsApp (best-effort, no bloquea).
 * Usa sendBeacon para que el registro sobreviva a la navegación a wa.me.
 */
export function trackWhatsappClick(origen: string, etiqueta?: string): void {
  try {
    const body = JSON.stringify({ origen, etiqueta })
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/track/whatsapp', new Blob([body], { type: 'application/json' }))
    } else {
      void fetch('/api/track/whatsapp', {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})
    }
  } catch {
    /* noop — nunca romper el flujo del usuario por medición */
  }
}
