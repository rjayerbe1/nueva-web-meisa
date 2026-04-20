import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

const GENERIC_RESPONSE = {
  message:
    "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
}

const TOKEN_TTL_MS = 60 * 60 * 1000
const MIN_INTERVAL_MS = 2 * 60 * 1000

export async function POST(req: NextRequest) {
  let email: string | undefined
  try {
    const body = await req.json()
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  })

  if (!user) {
    return NextResponse.json(GENERIC_RESPONSE)
  }

  const recent = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: { gt: new Date() },
      createdAt: { gt: new Date(Date.now() - MIN_INTERVAL_MS) },
    },
    orderBy: { createdAt: "desc" },
  })

  if (recent) {
    return NextResponse.json(GENERIC_RESPONSE)
  }

  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  })

  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  try {
    await sendPasswordResetEmail(user.email, resetUrl, user.name ?? undefined)
  } catch (err) {
    console.error("[forgot-password] Error enviando correo:", err)
    return NextResponse.json(
      { error: "No se pudo enviar el correo. Intenta más tarde." },
      { status: 500 }
    )
  }

  return NextResponse.json(GENERIC_RESPONSE)
}
