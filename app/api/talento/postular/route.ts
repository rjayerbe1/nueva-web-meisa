import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendViaGmailDWD } from "@/lib/gmail-client"
import { talentoFromHeader } from "@/lib/email"
import { DEFAULT_CONSENTIMIENTO } from "@/lib/talento/consentimiento"
import { normalizarNombre } from "@/lib/talento/nombres"
import { areaDesdeVacante } from "@/lib/talento/drive-sync"
import { resolverCodigoReferido } from "@/lib/talento/codigos-referido"

// Postulación PÚBLICA (formulario /trabaja-con-nosotros).
// Gated por el switch paginaPublicaActiva. Guarda la PRUEBA del
// consentimiento (Ley 1581/2012): fecha, hash de IP y snapshot del texto.

const schema = z.object({
  nombre: z.string().min(2).max(120).transform(normalizarNombre),
  email: z.string().email().max(160),
  telefono: z.string().min(7).max(30),
  ciudad: z
    .string()
    .max(80)
    .optional()
    .nullable()
    .transform((v) => (v ? normalizarNombre(v) : v)),
  vacanteSlug: z.string().max(120).optional().nullable(),
  // Programa de referidos: lo diligencia el CANDIDATO (no un tercero), así que
  // no hay problema de habeas data por entrega de datos de otra persona.
  codigoReferido: z.string().max(40).optional().nullable(),
  consentimiento: z.literal(true),
  consentimientoBanco: z.boolean().optional(),
  cvPathGcs: z.string().min(1),
  cvFileName: z.string().min(1),
  cvContentType: z.string().min(1),
  cvSize: z.number().int().positive(),
  // honeypot anti-bots: los humanos no lo ven, los bots lo llenan
  sitioWeb: z.string().max(0).optional().or(z.literal("")),
})

function hashIp(req: NextRequest): string | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  if (!ip) return null
  return createHash("sha256").update(ip).digest("hex").slice(0, 32)
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export async function POST(request: NextRequest) {
  try {
    const config = await prisma.configuracionTalento.findUnique({ where: { id: "default" } })
    if (!config?.paginaPublicaActiva) {
      return NextResponse.json({ error: "No disponible" }, { status: 404 })
    }

    const body = await request.json()
    const data = schema.parse(body)

    let vacante = null
    if (data.vacanteSlug) {
      vacante = await prisma.vacante.findUnique({ where: { slug: data.vacanteSlug } })
      if (!vacante || vacante.estado !== "ABIERTA") {
        return NextResponse.json({ error: "La vacante ya no está disponible" }, { status: 400 })
      }
    }

    const textoConsentimiento = config.textoConsentimiento?.trim() || DEFAULT_CONSENTIMIENTO

    // Solo TRACKING de la fuente para el incentivo — nunca afecta la
    // evaluación por mérito del candidato (Ley 931/2004). El objetivo
    // estratégico del programa es el personal operativo de planta: el código
    // solo se vincula (y cuenta para el incentivo) si la vacante está
    // marcada como elegible — se ignora en espontáneas o vacantes no
    // elegibles aunque el candidato haya escrito uno.
    let codigoReferidoId: string | null = null
    const codigoTexto =
      vacante?.elegibleReferidos && data.codigoReferido?.trim()
        ? data.codigoReferido.trim()
        : null
    if (codigoTexto) {
      // Acepta el código O el nombre del colaborador: la gente casi nunca
      // escribe el código, escribe a quién la mandó. Ver resolverCodigoReferido.
      const { match, ambiguo } = await resolverCodigoReferido(codigoTexto)
      if (match) codigoReferidoId = match.id
      else if (ambiguo) {
        console.warn(
          `[talento] referido ambiguo: "${codigoTexto}" coincide con varios colaboradores — resolver a mano`,
        )
      }
    }

    const candidato = await prisma.candidato.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        ciudad: data.ciudad || null,
        cvPathGcs: data.cvPathGcs,
        cvFileName: data.cvFileName,
        cvContentType: data.cvContentType,
        cvSize: data.cvSize,
        origen: "web",
        origenDetalle: vacante ? `vacante: ${vacante.titulo}` : "aplicación espontánea",
        // Sin esto el candidato queda fuera de todos los pools del banco (pasó
        // con las primeras 18 postulaciones). Espontáneas siguen en null: las
        // clasifica Talento Humano.
        areaInteres: areaDesdeVacante(vacante?.titulo, vacante?.area),
        consentimientoBanco: data.consentimientoBanco ?? false,
        consentimientoFecha: new Date(),
        consentimientoVia: "formulario-web",
        consentimientoIp: hashIp(request),
        consentimientoTexto: textoConsentimiento,
        codigoReferidoId,
        codigoReferidoTexto: codigoTexto,
        postulaciones: { create: [{ vacanteId: vacante?.id ?? null }] },
      },
    })

    // Correos (await: Cloud Run estrangula CPU en background — nada de fire-and-forget)
    // Acepta VARIOS destinatarios separados por coma (ej. "th@…, coordinacion@…"):
    // así el aviso de cada postulación le llega a todo el equipo de Talento
    // Humano, no a una sola persona que puede estar de vacaciones.
    const destinoInterno = (
      config.emailNotificaciones ||
      process.env.MEISA_CONTACT_NOTIFY_TO ||
      process.env.MEISA_ADMIN_EMAIL ||
      ""
    )
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.includes("@"))
    const vacanteTxt = vacante ? vacante.titulo : "Aplicación espontánea"

    const emailTasks: Promise<unknown>[] = []
    if (destinoInterno.length > 0) {
      emailTasks.push(
        sendViaGmailDWD({
          from: talentoFromHeader,
          to: destinoInterno,
          // Responder el aviso escribe directo al candidato, no al buzón de archivo.
          replyTo: data.email,
          subject: `[MEISA Talento] Nueva postulación · ${vacanteTxt} · ${data.nombre}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:560px;">
            <h2 style="color:#0f172a;">Nueva postulación</h2>
            <table style="font-size:14px;color:#334155;border-collapse:collapse;">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Vacante</td><td>${escapeHtml(vacanteTxt)}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Nombre</td><td>${escapeHtml(data.nombre)}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td>${escapeHtml(data.email)}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Teléfono</td><td>${escapeHtml(data.telefono)}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Ciudad</td><td>${escapeHtml(data.ciudad || "—")}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Banco de talento</td><td>${data.consentimientoBanco ? "Autorizado" : "No"}</td></tr>
            </table>
            <p style="margin-top:16px;"><a href="https://meisa.com.co/admin/talento?tab=candidatos" style="background:#dc2626;color:#fff;padding:10px 18px;text-decoration:none;font-weight:bold;">Ver en el admin</a></p>
            <p style="color:#94a3b8;font-size:12px;">El CV está en el bucket privado — se abre desde el admin.</p>
          </div>`,
        }).catch((e) => console.error("[talento] notif interna falló:", e)),
      )
    }
    emailTasks.push(
      sendViaGmailDWD({
        from: talentoFromHeader,
        to: data.email,
        // El From es no-reply@, pero el candidato igual responde: que su
        // respuesta caiga en Talento Humano y no en el buzón de archivo.
        replyTo: destinoInterno.length > 0 ? destinoInterno : undefined,
        subject: "Recibimos tu hoja de vida — MEISA",
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#334155;font-size:14px;line-height:1.6;">
          <h2 style="color:#0f172a;">Hola ${escapeHtml(data.nombre.split(" ")[0])},</h2>
          <p>Recibimos tu postulación${vacante ? ` a la vacante <strong>${escapeHtml(vacante.titulo)}</strong>` : " espontánea"} en <strong>MEISA — Metálicas e Ingeniería S.A.S.</strong></p>
          <p>Nuestro equipo de Talento Humano revisará tu hoja de vida y te contactará si tu perfil avanza en el proceso. No necesitas hacer nada más por ahora.</p>
          <p style="font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:20px;">
            Tus datos serán tratados según nuestra <a href="https://meisa.com.co/politica-datos" style="color:#1e40af;">Política de Tratamiento de Datos Personales</a> (Ley 1581 de 2012), con la finalidad de adelantar procesos de selección.
            ${data.consentimientoBanco ? "Autorizaste conservar tu hoja de vida para futuras vacantes." : `Si no eres seleccionado, tu hoja de vida se suprimirá al cumplirse el plazo de retención (${config.retencionMeses} meses).`}
            Puedes ejercer tus derechos de consulta, rectificación o supresión escribiendo a nuestros canales de contacto.
          </p>
        </div>`,
      }).catch((e) => console.error("[talento] confirmación al candidato falló:", e)),
    )
    await Promise.all(emailTasks)

    return NextResponse.json({ ok: true, id: candidato.id }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }
    console.error("[talento] postular:", e)
    return NextResponse.json({ error: "Error procesando la postulación" }, { status: 500 })
  }
}
