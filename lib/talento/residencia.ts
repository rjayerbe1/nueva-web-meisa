import { prisma } from "@/lib/prisma"
import { resideFueraDeColombia } from "./pais"

/**
 * Descarte automático de postulaciones de personas que VIVEN fuera de Colombia.
 *
 * Por qué: desde que la página quedó indexada (ago-2026) llegan hojas de vida
 * desde Argentina, Venezuela o Chile para cargos presenciales en las sedes
 * (Jamundí, Popayán, Villa Rica).
 * Talento Humano las descartaba a mano y entorpecían el pipeline.
 *
 * El criterio es la RESIDENCIA ACTUAL, nunca la nacionalidad: descartar a
 * alguien por ser extranjero es discriminación por origen nacional (Ley
 * 1482/2011), y un venezolano que vive en Cali sí puede trabajar aquí. Por eso:
 *  - La IA determina `paisResidencia` con la ciudad/dirección de contacto, y lo
 *    que la persona declaró al postularse prevalece sobre un CV viejo (caso
 *    real: CV con dirección de Punto Fijo y nómina lo registró en Jamundí).
 *  - Solo toca postulaciones en RECIBIDA: si alguien de TH ya la movió, esa
 *    decisión humana manda.
 *  - No aplica a vacantes remotas.
 *  - Queda en el historial con el motivo, y se revierte cambiando la etapa.
 */

export const USUARIO_FILTRO_RESIDENCIA = "sistema: reside fuera de Colombia"

export async function aplicarFiltroResidencia(
  candidatoId: string,
  datos: { paisResidencia?: string | null; evidenciaResidencia?: string | null },
): Promise<number> {
  if (!resideFueraDeColombia(datos.paisResidencia)) return 0

  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    select: { telefono: true },
  })
  // Un celular declarado con indicativo +57 es señal fuerte de que está aquí.
  if (/^\s*\+?\s*57[\s-]*3/.test(candidato?.telefono ?? "")) return 0

  const pendientes = await prisma.postulacion.findMany({
    where: {
      candidatoId,
      etapa: "RECIBIDA",
      OR: [{ vacanteId: null }, { vacante: { modalidad: { not: "remoto" } } }],
    },
    select: { id: true, historial: true, notasInternas: true },
  })

  const motivo =
    `Descartada automáticamente: reside en ${datos.paisResidencia}` +
    (datos.evidenciaResidencia ? ` (${datos.evidenciaResidencia})` : "") +
    ". Si ya vive en Colombia, devolverla a Recibida."

  for (const p of pendientes) {
    const prev = Array.isArray(p.historial) ? p.historial : []
    await prisma.postulacion.update({
      where: { id: p.id },
      data: {
        etapa: "DESCARTADA",
        historial: [
          ...prev,
          {
            de: "RECIBIDA",
            a: "DESCARTADA",
            fecha: new Date().toISOString(),
            usuario: `${USUARIO_FILTRO_RESIDENCIA} (${datos.paisResidencia})`,
          },
        ],
        notasInternas: p.notasInternas ? `${p.notasInternas}\n${motivo}` : motivo,
      },
    })
  }
  return pendientes.length
}
