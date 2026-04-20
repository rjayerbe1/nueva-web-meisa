import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  let token: string | undefined
  let password: string | undefined

  try {
    const body = await req.json()
    token = typeof body.token === "string" ? body.token : undefined
    password = typeof body.password === "string" ? body.password : undefined
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token y contraseña son requeridos" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    )
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "El enlace no es válido o ha expirado" },
      { status: 400 }
    )
  }

  const hash = await bcrypt.hash(password, 10)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.updateMany({
      where: {
        userId: record.userId,
        id: { not: record.id },
        usedAt: null,
      },
      data: { usedAt: new Date() },
    }),
  ])

  return NextResponse.json({
    message: "Contraseña actualizada. Ya puedes iniciar sesión.",
  })
}
