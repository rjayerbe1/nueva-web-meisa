import { Resend } from "resend"
import { sendViaGmailDWD, type GmailAttachment } from "./gmail-client"
import type { LeadAnalysisReport } from "./lead-analysis"

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@meisa.com.co"
const companyName = process.env.MEISA_COMPANY_NAME || "MEISA - Metálicas e Ingeniería S.A."
const baseUrl =
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://meisa.com.co"

const resend = resendApiKey ? new Resend(resendApiKey) : null

// Subject del JWT (DWD) — DEBE ser un mailbox primario real del Workspace.
// El alias contacto@/no-reply@ NO funciona como subject; usar archivo@/proyectistas@/etc.
const contactSenderEmail =
  process.env.MEISA_GMAIL_SENDER || "archivo@meisa.com.co"
// From header que ven los destinatarios — puede ser alias si está configurado como "Send mail as"
// en el mailbox primario impersonado.
const contactFromEmail =
  process.env.MEISA_CONTACT_FROM_EMAIL || contactSenderEmail
const contactFromHeader = `${companyName} <${contactFromEmail}>`
// Reply-To por defecto (para correos donde no se sobreescribe, ej. confirmación al cliente)
const contactReplyTo = process.env.MEISA_CONTACT_REPLY_TO || "contacto@meisa.com.co"

// Remitente de los correos del módulo de Talento (postulaciones). Usa el MISMO
// alias no-reply@ del formulario de contacto — ya está configurado como "Send
// mail as" en el mailbox impersonado, así que no requiere nada nuevo en
// Workspace — pero con nombre visible propio del área. Antes estos correos
// salían del buzón crudo archivo@meisa.com.co, sin nombre y sin Reply-To: el
// candidato veía un remitente raro y, si respondía, su mensaje moría en el
// buzón de archivo.
// Nombre corto a propósito: `companyName` ("MEISA - Metálicas e Ingeniería
// S.A.") + área se trunca en la bandeja del candidato.
export const talentoFromHeader = `MEISA Talento Humano <${contactFromEmail}>`

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string
) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured")
  }

  const greeting = userName ? `Hola ${userName}` : "Hola"

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restablecer contraseña</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color:#1e40af;padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">${companyName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;color:#334155;font-size:16px;line-height:1.6;">
                <h2 style="margin:0 0 16px 0;color:#1e3a8a;font-size:20px;">Restablecer tu contraseña</h2>
                <p style="margin:0 0 16px 0;">${greeting},</p>
                <p style="margin:0 0 16px 0;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, haz clic en el botón de abajo para crear una nueva contraseña.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                  <tr>
                    <td style="border-radius:6px;background-color:#1e40af;">
                      <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;">Restablecer contraseña</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px 0;font-size:14px;color:#64748b;">O copia y pega este enlace en tu navegador:</p>
                <p style="margin:0 0 24px 0;font-size:13px;color:#3b82f6;word-break:break-all;">${resetUrl}</p>
                <p style="margin:0 0 8px 0;font-size:14px;color:#64748b;">Este enlace expira en <strong>1 hora</strong>.</p>
                <p style="margin:0;font-size:14px;color:#64748b;">Si no solicitaste este cambio, puedes ignorar este correo — tu contraseña seguirá siendo la misma.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Este es un correo automático, por favor no respondas.</p>
                <p style="margin:8px 0 0 0;font-size:12px;color:#94a3b8;">&copy; ${new Date().getFullYear()} ${companyName}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `${greeting},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${companyName}.

Abre este enlace para crear una nueva contraseña (expira en 1 hora):
${resetUrl}

Si no solicitaste este cambio, ignora este correo.`

  return resend.emails.send({
    from: `${companyName} <${fromEmail}>`,
    to,
    subject: "Restablecer tu contraseña",
    html,
    text,
  })
}

// ─────────────────────────────────────────────────────────────────────────
// Contacto — notificación al admin + confirmación al cliente

const ETAPA_LABEL: Record<string, string> = {
  IDEA: "Idea inicial",
  ANTEPROYECTO: "Anteproyecto",
  PLANOS_DEFINITIVOS: "Planos definitivos",
  EN_OBRA: "Ya en obra",
}

const TIPO_PROYECTO_LABEL: Record<string, string> = {
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
  PUENTES: "Puentes",
  INFRAESTRUCTURA_URBANA: "Infraestructura Urbana",
  EDIFICACIONES: "Edificaciones",
  DEPORTES_EDUCACION: "Deportes & Educación",
  OTRO: "Otro",
}

const ESCALA_UNIDAD_LABEL: Record<string, string> = {
  M2: "m²",
  TON: "Toneladas",
  NA: "Sin definir",
}

export interface ContactNotificationPayload {
  referencia: string
  nombre: string
  empresa?: string | null
  email: string
  telefono: string
  ciudad?: string | null
  tipoProyecto?: string | null
  etapa?: string | null
  escalaValor?: number | null
  escalaUnidad?: string | null
  mensaje: string
  adjuntos?: Array<{ name: string; url: string; size?: number; mime?: string }>
  origen?: string | null
  contactId: string
}

// Tope total de adjuntos embebidos en el correo. Deja margen bajo el límite de
// ~35 MB del endpoint de upload de Gmail (el base64 infla el tamaño ~33%).
// Lo que exceda el tope queda solo como link en el cuerpo del correo.
const MAX_TOTAL_ATTACHMENT_BYTES = 20 * 1024 * 1024

/**
 * Descarga los adjuntos del lead (GCS) para embeberlos como archivos reales en
 * el correo. Tolerante a fallos: si un archivo no se puede bajar o excede el
 * tope, se omite del correo (el link sigue en el cuerpo). Nunca lanza.
 */
export async function fetchAdjuntosAsAttachments(
  adjuntos?: Array<{ name: string; url: string; size?: number; mime?: string }>,
): Promise<GmailAttachment[]> {
  if (!adjuntos || adjuntos.length === 0) return []
  const out: GmailAttachment[] = []
  let total = 0
  for (const a of adjuntos) {
    // Descarte temprano por tamaño declarado (evita bajar archivos enormes en vano).
    if (a.size && total + a.size > MAX_TOTAL_ATTACHMENT_BYTES) {
      console.warn(`[email] adjunto "${a.name}" no se embebe (excede tope de tamaño); queda como link`)
      continue
    }
    try {
      const res = await fetch(a.url)
      if (!res.ok) {
        console.warn(`[email] adjunto "${a.name}" no descargado (HTTP ${res.status}); queda como link`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      if (total + buf.length > MAX_TOTAL_ATTACHMENT_BYTES) {
        console.warn(`[email] adjunto "${a.name}" no se embebe (excede tope de tamaño); queda como link`)
        continue
      }
      total += buf.length
      out.push({
        filename: a.name || "adjunto",
        mimeType: a.mime || res.headers.get("content-type") || "application/octet-stream",
        content: buf,
      })
    } catch (err) {
      console.warn(`[email] error descargando adjunto "${a.name}":`, err)
    }
  }
  return out
}

function getNotifyRecipients(): string[] {
  const list = process.env.MEISA_CONTACT_NOTIFY_TO
  if (list && list.trim()) {
    return list
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)
  }
  const fallback = process.env.MEISA_ADMIN_EMAIL
  return fallback ? [fallback] : []
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 16px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;vertical-align:top;">${value}</td>
  </tr>`
}

function bulletList(items: string[]): string {
  if (!items || items.length === 0) return ""
  return `<ul style="margin:0;padding-left:20px;color:#0f172a;font-size:13px;line-height:1.6;">${items
    .map((i) => `<li style="margin:0 0 5px 0;">${escapeHtml(i)}</li>`)
    .join("")}</ul>`
}

function analisisSubBlock(title: string, inner: string): string {
  if (!inner) return ""
  return `<div style="margin:0 0 16px 0;">
    <p style="margin:0 0 6px 0;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">${escapeHtml(title)}</p>
    ${inner}
  </div>`
}

/** Bloque HTML "Análisis IA de la propuesta" para el correo interno. */
function renderAnalisisHtml(report: LeadAnalysisReport): string {
  const metaRows = [
    report.tipoEstructura ? row("Tipo de estructura", escapeHtml(report.tipoEstructura)) : "",
    report.alcanceAparente ? row("Alcance aparente", escapeHtml(report.alcanceAparente)) : "",
    report.sistemaEstructural ? row("Sistema estructural", escapeHtml(report.sistemaEstructural)) : "",
  ].join("")

  const porArchivo =
    report.analisisPorArchivo && report.analisisPorArchivo.length > 0
      ? `<ul style="margin:0;padding-left:20px;color:#0f172a;font-size:13px;line-height:1.6;">${report.analisisPorArchivo
          .map(
            (a) =>
              `<li style="margin:0 0 5px 0;"><strong>${escapeHtml(a.archivo)}:</strong> ${escapeHtml(a.observacion)}</li>`,
          )
          .join("")}</ul>`
      : ""

  const noAnalizados =
    report.archivosNoAnalizados && report.archivosNoAnalizados.length > 0
      ? `<p style="margin:12px 0 0 0;font-size:12px;color:#94a3b8;">No analizados por la IA (formato no legible, revisar manual): ${escapeHtml(report.archivosNoAnalizados.join(", "))}</p>`
      : ""

  return `<tr>
    <td style="padding:24px 32px 8px 32px;">
      <p style="margin:0 0 12px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Análisis IA de la propuesta <span style="display:inline-block;background:#1e40af;color:#fff;font-size:9px;padding:2px 6px;border-radius:3px;letter-spacing:1px;vertical-align:middle;">IA</span></p>
      <div style="border:1px solid #dbeafe;border-left:3px solid #1e40af;background:#f8fafc;padding:20px;">
        <div style="margin:0 0 16px 0;padding:14px;background:#eff6ff;border:1px solid #dbeafe;font-size:14px;color:#1e3a8a;line-height:1.6;">${escapeHtml(report.resumenEjecutivo)}</div>
        ${metaRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;margin:0 0 16px 0;">${metaRows}</table>` : ""}
        ${analisisSubBlock("Puntos relevantes", bulletList(report.puntosRelevantes))}
        ${analisisSubBlock("Riesgos y dudas", bulletList(report.riesgosODudas))}
        ${analisisSubBlock("Preguntas sugeridas para el cliente", bulletList(report.preguntasParaCliente))}
        ${analisisSubBlock("Análisis por archivo", porArchivo)}
        ${noAnalizados}
        <p style="margin:16px 0 0 0;font-size:11px;color:#94a3b8;font-style:italic;">Generado automáticamente por IA a partir de los adjuntos. Puede contener errores; verifica con el cliente.</p>
      </div>
    </td>
  </tr>`
}

/** Versión en texto plano del análisis IA. */
function renderAnalisisText(report: LeadAnalysisReport): string {
  const lines: string[] = ["", "── ANÁLISIS IA DE LA PROPUESTA ──", "", report.resumenEjecutivo, ""]
  if (report.tipoEstructura) lines.push(`Tipo de estructura: ${report.tipoEstructura}`)
  if (report.alcanceAparente) lines.push(`Alcance aparente: ${report.alcanceAparente}`)
  if (report.sistemaEstructural) lines.push(`Sistema estructural: ${report.sistemaEstructural}`)
  if (report.puntosRelevantes.length) {
    lines.push("", "Puntos relevantes:")
    report.puntosRelevantes.forEach((p) => lines.push(`- ${p}`))
  }
  if (report.riesgosODudas.length) {
    lines.push("", "Riesgos y dudas:")
    report.riesgosODudas.forEach((p) => lines.push(`- ${p}`))
  }
  if (report.preguntasParaCliente.length) {
    lines.push("", "Preguntas sugeridas:")
    report.preguntasParaCliente.forEach((p) => lines.push(`- ${p}`))
  }
  if (report.analisisPorArchivo.length) {
    lines.push("", "Por archivo:")
    report.analisisPorArchivo.forEach((a) => lines.push(`- ${a.archivo}: ${a.observacion}`))
  }
  if (report.archivosNoAnalizados.length) {
    lines.push("", `No analizados por la IA: ${report.archivosNoAnalizados.join(", ")}`)
  }
  lines.push("", "(Generado por IA a partir de los adjuntos; puede contener errores.)", "")
  return lines.join("\n")
}

export async function sendContactNotificationEmail(
  payload: ContactNotificationPayload,
  opts: {
    /** Adjuntos ya descargados (evita re-descargar cuando quien llama ya los tiene). */
    attachments?: GmailAttachment[]
    /** Reporte de análisis IA a incrustar en el correo (una sola pieza, todo junto). */
    analisis?: LeadAnalysisReport | null
  } = {},
) {
  const recipients = getNotifyRecipients()
  if (recipients.length === 0) {
    throw new Error("No hay destinatarios configurados (MEISA_CONTACT_NOTIFY_TO o MEISA_ADMIN_EMAIL)")
  }

  const tipoLabel = payload.tipoProyecto ? TIPO_PROYECTO_LABEL[payload.tipoProyecto] || payload.tipoProyecto : "—"
  const etapaLabel = payload.etapa ? ETAPA_LABEL[payload.etapa] || payload.etapa : "—"
  const ciudadTxt = payload.ciudad || "—"
  const escalaTxt =
    payload.escalaValor && payload.escalaUnidad
      ? `${payload.escalaValor} ${ESCALA_UNIDAD_LABEL[payload.escalaUnidad] || payload.escalaUnidad}`
      : payload.escalaUnidad === "NA"
      ? "Sin definir"
      : "—"

  const adjuntosHtml = payload.adjuntos && payload.adjuntos.length > 0
    ? payload.adjuntos
        .map(
          (a) =>
            `<a href="${escapeHtml(a.url)}" style="display:block;padding:8px 12px;background:#f1f5f9;border:1px solid #cbd5e1;color:#0f172a;text-decoration:none;font-size:13px;margin-bottom:6px;">${escapeHtml(a.name)}${a.size ? ` <span style="color:#64748b;font-size:11px;">(${(a.size / 1024 / 1024).toFixed(1)} MB)</span>` : ""}</a>`
        )
        .join("")
    : '<span style="color:#94a3b8;font-size:13px;">Sin adjuntos</span>'

  const adminUrl = `${baseUrl}/admin/messages/${payload.contactId}`
  const subject = `[MEISA] Nueva solicitud · ${payload.referencia} · ${tipoLabel} · ${ciudadTxt}`

  // Adjuntos: usa los ya descargados si vienen; si no, los baja de GCS.
  const attachments =
    opts.attachments ?? (await fetchAdjuntosAsAttachments(payload.adjuntos))

  // Análisis IA (opcional): cuando viene, se incrusta en ESTE mismo correo
  // (todo en uno). Lo pasa /api/contact/analyze; el envío server-side directo
  // no lo incluye (sería demasiado lento para el form).
  const analisisHtml = opts.analisis ? renderAnalisisHtml(opts.analisis) : ""
  const analisisText = opts.analisis ? renderAnalisisText(opts.analisis) : ""

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#0f172a;padding:24px 32px;">
                <p style="margin:0 0 6px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Nueva solicitud · ${escapeHtml(payload.referencia)}</p>
                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;">${escapeHtml(payload.nombre)}${payload.empresa ? ` · <span style="color:#94a3b8;font-weight:400;">${escapeHtml(payload.empresa)}</span>` : ""}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <p style="margin:0 0 12px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Identificación</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
                  ${row("Email", `<a href="mailto:${escapeHtml(payload.email)}" style="color:#dc2626;text-decoration:none;font-weight:600;">${escapeHtml(payload.email)}</a>`)}
                  ${row("Teléfono", `<a href="tel:${escapeHtml(payload.telefono)}" style="color:#dc2626;text-decoration:none;font-weight:600;">${escapeHtml(payload.telefono)}</a>`)}
                  ${row("Ciudad", escapeHtml(ciudadTxt))}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <p style="margin:0 0 12px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Proyecto</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
                  ${row("Tipo", escapeHtml(tipoLabel))}
                  ${row("Etapa", escapeHtml(etapaLabel))}
                  ${row("Escala estimada", escapeHtml(escalaTxt))}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <p style="margin:0 0 12px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Mensaje</p>
                <div style="padding:16px;background:#f8fafc;border-left:3px solid #0f172a;font-size:14px;color:#0f172a;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.mensaje)}</div>
              </td>
            </tr>
            ${analisisHtml}
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <p style="margin:0 0 12px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Adjuntos${payload.adjuntos && payload.adjuntos.length ? ` <span style="color:#94a3b8;font-weight:400;text-transform:none;letter-spacing:0;">(también adjuntos a este correo)</span>` : ""}</p>
                ${adjuntosHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#dc2626;">
                      <a href="${adminUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Ver y responder en el panel</a>
                    </td>
                  </tr>
                </table>
                ${payload.origen ? `<p style="margin:16px 0 0 0;font-size:11px;color:#94a3b8;">Origen: ${escapeHtml(payload.origen)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;">${escapeHtml(payload.referencia)} · ${new Date().toLocaleString("es-CO")}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `Nueva solicitud · ${payload.referencia}
${payload.nombre}${payload.empresa ? " · " + payload.empresa : ""}

Email: ${payload.email}
Teléfono: ${payload.telefono}
Ciudad: ${ciudadTxt}

Tipo: ${tipoLabel}
Etapa: ${etapaLabel}
Escala: ${escalaTxt}

Mensaje:
${payload.mensaje}
${analisisText}
${payload.adjuntos && payload.adjuntos.length ? "Adjuntos:\n" + payload.adjuntos.map((a) => `- ${a.name}: ${a.url}`).join("\n") + "\n" : ""}
Ver en panel: ${adminUrl}
${payload.origen ? "Origen: " + payload.origen : ""}
`

  return sendViaGmailDWD({
    from: contactFromHeader,
    to: recipients,
    replyTo: payload.email,
    subject,
    html,
    text,
    attachments,
  })
}

export interface ContactConfirmationPayload {
  to: string
  nombre: string
  referencia: string
}

export async function sendContactConfirmationEmail(payload: ContactConfirmationPayload) {
  const subject = `Recibimos tu solicitud · ${payload.referencia}`

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#0f172a;padding:32px 40px;">
                <p style="margin:0 0 8px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Solicitud recibida</p>
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;">${escapeHtml(payload.referencia)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;color:#0f172a;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 16px 0;">Hola <strong>${escapeHtml(payload.nombre)}</strong>,</p>
                <p style="margin:0 0 16px 0;">Recibimos tu solicitud y nuestro equipo comercial ya está revisando los detalles.</p>
                <p style="margin:0 0 16px 0;">Te contactaremos en menos de <strong>24 horas hábiles</strong> al correo y teléfono que registraste.</p>
                <p style="margin:0 0 24px 0;color:#475569;font-size:14px;">Este es un correo automático <strong>no respondas a esta dirección</strong>. Si necesitas adelantar información, escríbenos a <a href="mailto:contacto@meisa.com.co" style="color:#dc2626;text-decoration:none;font-weight:600;">contacto@meisa.com.co</a> citando tu referencia <strong>${escapeHtml(payload.referencia)}</strong>.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:0;">
                  <tr>
                    <td style="padding:16px 0;">
                      <p style="margin:0 0 6px 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Tu referencia</p>
                      <p style="margin:0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:1px;">${escapeHtml(payload.referencia)}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-size:14px;color:#475569;">Gracias por considerar a MEISA para tu proyecto.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                <p style="margin:0 0 4px 0;font-size:12px;color:#64748b;font-weight:700;">${companyName}</p>
                <p style="margin:0;font-size:11px;color:#94a3b8;">Colombia · meisa.com.co</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `Hola ${payload.nombre},

Recibimos tu solicitud con la referencia ${payload.referencia}.

Nuestro equipo comercial ya está revisando los detalles y te contactaremos en menos de 24 horas hábiles.

Este es un correo automático — no respondas a esta dirección. Si necesitas adelantar información, escríbenos a contacto@meisa.com.co citando tu referencia ${payload.referencia}.

Gracias,
${companyName}
`

  return sendViaGmailDWD({
    from: contactFromHeader,
    to: payload.to,
    replyTo: contactReplyTo,
    subject,
    html,
    text,
  })
}

export interface ChatTranscriptPayload {
  to: string
  transcript: string
  referencia?: string
}

/** Envía al visitante la copia de su conversación con el asistente. */
export async function sendChatTranscriptEmail(payload: ChatTranscriptPayload) {
  const subject = `Tu conversación con el asistente de MEISA${payload.referencia ? ` · ${payload.referencia}` : ""}`
  const transcriptHtml = escapeHtml(payload.transcript).replace(/\n/g, "<br/>")

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#0f172a;padding:32px 40px;">
                <p style="margin:0 0 8px 0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Asistente MEISA</p>
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;">Tu conversación</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;color:#0f172a;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 20px 0;">Hola, aquí tienes la copia de la conversación que tuviste con nuestro asistente:</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;font-size:14px;color:#334155;line-height:1.7;">${transcriptHtml}</div>
                <p style="margin:24px 0 0 0;font-size:14px;color:#475569;">¿Quieres avanzar con tu proyecto? Responde este correo, escríbenos a <a href="mailto:contacto@meisa.com.co" style="color:#dc2626;text-decoration:none;font-weight:600;">contacto@meisa.com.co</a> o por WhatsApp desde <a href="${baseUrl}" style="color:#dc2626;text-decoration:none;font-weight:600;">meisa.com.co</a>.</p>
                <p style="margin:16px 0 0 0;font-size:12px;color:#94a3b8;">Nota: el asistente usa IA y puede cometer errores; los precios mencionados son estimados de referencia, no una cotización formal.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                <p style="margin:0 0 4px 0;font-size:12px;color:#64748b;font-weight:700;">${companyName}</p>
                <p style="margin:0;font-size:11px;color:#94a3b8;">Colombia · meisa.com.co</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `Hola, aquí tienes la copia de tu conversación con el asistente de MEISA:

${payload.transcript}

¿Quieres avanzar con tu proyecto? Escríbenos a contacto@meisa.com.co o por WhatsApp desde meisa.com.co.

Nota: el asistente usa IA y puede cometer errores; los precios son estimados de referencia, no una cotización formal.

${companyName}`

  return sendViaGmailDWD({
    from: contactFromHeader,
    to: payload.to,
    replyTo: contactReplyTo,
    subject,
    html,
    text,
  })
}
