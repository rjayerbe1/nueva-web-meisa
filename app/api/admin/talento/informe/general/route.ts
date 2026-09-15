import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { LOGO_URL } from "@/lib/talento/informe"
import { armarInformeGeneral, cargarInformeGeneral, PERIODOS } from "@/lib/talento/informe-general"

export const dynamic = "force-dynamic"

/**
 * Informe general de Talento Humano (todas las vacantes vigentes + las hojas de
 * vida que llegaron en el periodo), listo para guardar como PDF.
 *
 * `?dias=7|30|90|0` — 0 es todo el histórico. Por defecto, 30.
 * Mismo mecanismo que el informe por vacante: HTML + diálogo de impresión del
 * navegador, porque la imagen de Cloud Run no trae Chrome.
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const pedido = Number(req.nextUrl.searchParams.get("dias") ?? 30)
    const dias = (PERIODOS as readonly number[]).includes(pedido) ? pedido : 30

    const datos = await cargarInformeGeneral(dias)
    const html = armarInformeGeneral(datos, { logo: LOGO_URL, autoImprimir: true })

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Contiene datos personales: que no quede en cachés intermedias.
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
