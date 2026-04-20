import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@meisa.com.co"
const companyName = process.env.MEISA_COMPANY_NAME || "MEISA - Metálicas e Ingeniería S.A."

const resend = resendApiKey ? new Resend(resendApiKey) : null

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
