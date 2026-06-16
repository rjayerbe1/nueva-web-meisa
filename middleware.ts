import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Origen canónico de producción (igual que la etiqueta <link rel="canonical">
// del HTML). Se fija a prod a propósito: dev.meisa.com.co lleva noindex, y para
// SEO queremos que toda señal de canónica apunte a meisa.com.co.
const CANONICAL_ORIGIN = 'https://meisa.com.co'

/**
 * Refuerza la canónica de las landings SEO vía HTTP header `Link: rel="canonical"`,
 * además de la etiqueta <link> del HTML. Google lee ambas; tener las dos apuntando
 * a la URL propia es la señal más fuerte para que honre la canónica correcta.
 *
 * Motivo: en jun-2026 Google asignó por error `747live.bet` como canónica de
 * varias landings nuevas (bug de deduplicación conocido). El header refuerza la
 * señal para sacarlas de ese cluster. Cubre rutas dinámicas (soluciones/ciudades
 * DB-first) y futuras automáticamente vía el matcher.
 */
export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const canonical = `${CANONICAL_ORIGIN}${request.nextUrl.pathname}`
  // append (no set): no pisamos otros posibles headers Link (ej. preloads).
  res.headers.append('Link', `<${canonical}>; rel="canonical"`)
  return res
}

export const config = {
  matcher: [
    '/soluciones/:path*',
    '/estructuras-metalicas/:path*',
    '/precios-estructuras-metalicas',
    '/estructura-metalica-vs-concreto',
    '/tipos-de-estructuras-metalicas',
    '/peso-estructura-metalica-por-m2',
  ],
}
