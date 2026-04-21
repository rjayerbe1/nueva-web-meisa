import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import { UserRole } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const ROLE_WEIGHT: Record<UserRole, number> = {
  [UserRole.VIEWER]: 0,
  [UserRole.EDITOR]: 1,
  [UserRole.ADMIN]: 2,
}

export function hasAtLeastRole(role: UserRole | undefined | null, min: UserRole): boolean {
  if (!role) return false
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[min]
}

export class ApiAuthError extends Error {
  constructor(public status: 401 | 403, message: string) {
    super(message)
    this.name = "ApiAuthError"
  }
}

export async function requireAdmin(minRole: UserRole = UserRole.EDITOR): Promise<Session> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new ApiAuthError(401, "No autorizado")
  }
  if (!hasAtLeastRole(session.user.role, minRole)) {
    throw new ApiAuthError(403, "Sin permisos")
  }
  return session
}

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApiAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  console.error("[api] unhandled error:", error)
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
}
