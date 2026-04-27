/**
 * Cliente para enviar emails vía Gmail API usando Domain-Wide Delegation.
 *
 * Requiere:
 *  - GOOGLE_SERVICE_ACCOUNT_EMAIL: email de la SA con DWD habilitada
 *  - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: private key (PEM) de la SA
 *  - MEISA_GMAIL_SENDER: usuario del dominio meisa.com.co a impersonar (default: contacto@meisa.com.co)
 *
 * El scope `https://www.googleapis.com/auth/gmail.send` debe estar autorizado
 * en la consola de admin de Workspace para esta service account.
 */

import { JWT } from "google-auth-library"

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

let cachedJwt: JWT | null = null
let cachedSubject: string | null = null

function getDefaultSender(): string {
  return process.env.MEISA_GMAIL_SENDER || "contacto@meisa.com.co"
}

function getJwt(subject: string): JWT {
  if (cachedJwt && cachedSubject === subject) return cachedJwt

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) {
    throw new Error(
      "Faltan GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY en el entorno",
    )
  }
  const key = rawKey.replace(/\\n/g, "\n")

  cachedJwt = new JWT({
    email,
    key,
    scopes: SCOPES,
    subject,
  })
  cachedSubject = subject
  return cachedJwt
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function encodeHeaderValue(value: string): string {
  // RFC 2047 encoded-word (UTF-8, base64) — solo si contiene no-ASCII
  // eslint-disable-next-line no-control-regex
  const needsEncoding = /[^\x00-\x7F]/.test(value)
  if (!needsEncoding) return value
  const encoded = Buffer.from(value, "utf8").toString("base64")
  return `=?UTF-8?B?${encoded}?=`
}

/**
 * Encoda una dirección "Name <email>" siguiendo RFC 5322 + RFC 2047:
 * - Solo el display name se encoda (con encoded-word si hay non-ASCII, con quoted-string si hay specials).
 * - El email queda raw entre `<>`.
 * - Si la entrada es solo email, se devuelve sin tocar.
 */
function encodeAddress(value: string): string {
  const trimmed = value.trim()
  // Match "Name <email>" — name puede tener cualquier cosa excepto < o >
  const match = trimmed.match(/^(.*?)\s*<([^>]+)>$/)
  if (!match) {
    // Solo email u otro formato → raw
    return trimmed
  }
  const rawName = match[1].trim().replace(/^"|"$/g, "")
  const email = match[2].trim()
  if (!rawName) return `<${email}>`

  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\x00-\x7F]/.test(rawName)
  if (hasNonAscii) {
    return `${encodeHeaderValue(rawName)} <${email}>`
  }
  // ASCII con specials RFC 5322 → quoted-string
  if (/[(),:;<>@\[\]\\".]/.test(rawName)) {
    const escaped = rawName.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
    return `"${escaped}" <${email}>`
  }
  return `${rawName} <${email}>`
}

function formatAddressList(addresses: string | string[]): string {
  const arr = Array.isArray(addresses) ? addresses : [addresses]
  return arr
    .map((a) => encodeAddress(a))
    .filter(Boolean)
    .join(", ")
}

function buildRfc2822Message(opts: {
  from: string
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}): string {
  const boundary = `=_meisa_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  const headers: string[] = []
  headers.push(`From: ${encodeAddress(opts.from)}`)
  headers.push(`To: ${formatAddressList(opts.to)}`)
  if (opts.cc) headers.push(`Cc: ${formatAddressList(opts.cc)}`)
  if (opts.bcc) headers.push(`Bcc: ${formatAddressList(opts.bcc)}`)
  if (opts.replyTo) headers.push(`Reply-To: ${encodeAddress(opts.replyTo)}`)
  headers.push(`Subject: ${encodeHeaderValue(opts.subject)}`)
  headers.push("MIME-Version: 1.0")
  headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`)

  const textPart = opts.text || htmlToText(opts.html)

  const body = [
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(textPart, "utf8").toString("base64"),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(opts.html, "utf8").toString("base64"),
    `--${boundary}--`,
    "",
  ].join("\r\n")

  return `${headers.join("\r\n")}\r\n\r\n${body}`
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export interface GmailSendOptions {
  from?: string
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  /** Sender override — qué cuenta del dominio impersonar. Default: MEISA_GMAIL_SENDER */
  senderUser?: string
}

export async function sendViaGmailDWD(opts: GmailSendOptions): Promise<{
  messageId: string
}> {
  const sender = opts.senderUser || getDefaultSender()
  const fromHeader = opts.from || sender
  const jwt = getJwt(sender)

  const raw = buildRfc2822Message({
    from: fromHeader,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
    cc: opts.cc,
    bcc: opts.bcc,
  })
  const encoded = base64UrlEncode(Buffer.from(raw, "utf8"))

  const accessTokenResponse = await jwt.getAccessToken()
  const accessToken = accessTokenResponse.token
  if (!accessToken) {
    throw new Error("No se pudo obtener access token de la SA (DWD)")
  }

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encoded }),
    },
  )

  if (!res.ok) {
    const errBody = await res.text().catch(() => "")
    throw new Error(`Gmail API ${res.status}: ${errBody}`)
  }

  const data = (await res.json()) as { id: string }
  return { messageId: data.id }
}
