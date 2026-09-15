import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { leerCriterios } from "@/lib/talento/ia"
import { armarHtml, LOGO_URL, paginaAviso, type Cand } from "@/lib/talento/informe"

/** Se abre en pestaña nueva: los errores van como página legible, no como JSON. */
function aviso(status: number, titulo: string, mensaje: string) {
  return new NextResponse(paginaAviso(titulo, mensaje), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" },
  })
}

/**
 * Informe de evaluación de una vacante, listo para guardar como PDF.
 *
 * Devuelve el MISMO HTML que genera `scripts/informe-vacantes.ts` (comparten
 * `lib/talento/informe.ts`) y abre solo el diálogo de impresión del navegador.
 *
 * ¿Por qué no se genera el PDF en el servidor? Porque la imagen de Cloud Run no
 * trae Chrome, y meterlo agrega ~300 MB y arranques más lentos a todo el sitio
 * para una función que se usa unas veces por semana. El navegador de quien
 * consulta ya sabe imprimir a PDF y el resultado es idéntico —mismo `@page`,
 * mismo CSS—, así que Talento Humano lo descarga sin depender de nadie.
 *
 * Los DESCARTADA quedan fuera, igual que en el informe del script.
 */
export async function GET(_req: NextRequest, { params }: { params: { vacanteId: string } }) {
  try {
    await requireAdmin()

    const vacante = await prisma.vacante.findUnique({ where: { id: params.vacanteId } })
    if (!vacante) {
      return aviso(404, "Vacante no encontrada", "La vacante ya no existe. Recarga el admin y vuelve a intentar.")
    }

    const criterios = leerCriterios(vacante.criteriosEvaluacion)
    if (!criterios.length) {
      return aviso(
        409,
        `${vacante.titulo}: falta la matriz`,
        "Esta vacante no tiene matriz de evaluación, y sin ella no hay contra qué puntuar a los candidatos. Defínela en la pestaña Vacantes (lápiz de la vacante → «Matriz de evaluación del cargo») y vuelve a generar el informe.",
      )
    }

    const ps = await prisma.postulacion.findMany({
      where: { vacanteId: vacante.id, etapa: { not: "DESCARTADA" } },
      include: {
        candidato: { select: { nombre: true, ciudad: true, createdAt: true, datosIA: true } },
      },
      // NULLS LAST: sin esto los sin-puntaje salen de primeros y parecen los mejores.
      orderBy: { scoreIA: { sort: "desc", nulls: "last" } },
    })

    if (!ps.length) {
      return aviso(
        200,
        `${vacante.titulo}: sin candidatos`,
        "Esta vacante todavía no tiene postulaciones activas (las descartadas no entran al informe). Cuando lleguen hojas de vida, el informe se arma solo.",
      )
    }

    const cands: Cand[] = ps.map((p) => ({
      nombre: p.candidato.nombre,
      ciudad: p.candidato.ciudad,
      // La hora de Colombia, no UTC: si no, lo recibido de noche sale con la fecha del día siguiente.
      recibido: new Date(p.candidato.createdAt.getTime() - 5 * 3600e3).toISOString().slice(0, 10),
      score: p.scoreIA,
      anos: (p.candidato.datosIA as { anosExperiencia?: number } | null)?.anosExperiencia ?? null,
      cvPathGcs: null,
      cvFileName: null,
      match: p.matchIA as Cand["match"],
    }))

    const fecha = new Date().toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Bogota",
    })

    const html = armarHtml(vacante.titulo, vacante.ciudad, fecha, criterios, cands, {
      logo: LOGO_URL,
      autoImprimir: true,
    })

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
