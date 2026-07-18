import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendViaGmailDWD } from "@/lib/gmail-client"
import { DEFAULT_CONSENTIMIENTO } from "@/lib/talento/consentimiento"

// Postulación PÚBLICA (formulario /trabaja-con-nosotros).
// Gated por el switch paginaPublicaActiva. Guarda la PRUEBA del
// consentimiento (Ley 1581/2012): fecha, hash de IP y snapshot del texto.

const schema = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email().max(160),
  telefono: z.string().min(7).max(30),
  ciudad: z.string().max(80).optional().nullable(),
  vacanteSlug: z.string().max(120).optional().nullable(),
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
        consentimientoBanco: data.consentimientoBanco ?? false,
        consentimientoFecha: new Date(),
        consentimientoVia: "formulario-web",
        consentimientoIp: hashIp(request),
        consentimientoTexto: textoConsentimiento,
        postulaciones: { create: [{ vacanteId: vacante?.id ?? null }] },
      },
    })

    // Correos (await: Cloud Run estrangula CPU en background — nada de fire-and-forget)
    const destinoInterno =
      config.emailNotificaciones ||
      process.env.MEISA_CONTACT_NOTIFY_TO ||
      process.env.MEISA_ADMIN_EMAIL
    const vacanteTxt = vacante ? vacante.titulo : "Aplicación espontánea"

    const emailTasks: Promise<unknown>[] = []
    if (destinoInterno) {
      emailTasks.push(
        sendViaGmailDWD({
          to: destinoInterno,
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
        to: data.email,
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
