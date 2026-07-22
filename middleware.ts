import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Origen canónico de producción (igual que la etiqueta <link rel="canonical">
// del HTML). Se fija a prod a propósito: dev.meisa.com.co lleva noindex, y para
// SEO queremos que toda señal de canónica apunte a meisa.com.co.
const CANONICAL_ORIGIN = 'https://meisa.com.co'

// Usuarios marcados `restrictedToTalento` solo pueden entrar a esta sección del
// admin (páginas y sus API routes). Único punto de enforcement — no se toca
// cada ruta de /api/admin individualmente.
const TALENTO_PREFIXES = ['/admin/talento', '/api/admin/talento']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const isAllowed = TALENTO_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    if (token?.restrictedToTalento && !isAllowed) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/talento', request.url))
    }
    return NextResponse.next()
  }

  return canonicalHeader(request)
}

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
function canonicalHeader(request: NextRequest) {
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
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
