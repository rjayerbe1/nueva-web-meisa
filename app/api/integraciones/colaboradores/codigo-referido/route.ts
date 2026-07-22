import { timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generarCodigoUnico } from "@/lib/talento/codigos-referido"
import { listarColaboradoresActivos } from "@/lib/talento/colaboradores-firestore"

// Integración servidor-a-servidor para el portal de colaboradores: dado el
// número de cédula de un colaborador activo, devuelve (y crea si hace falta)
// su código del Programa de Referidos. Protegido por API key compartida —
// nunca expuesto al navegador del empleado ni indexable públicamente.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function soloDigitos(value: string) {
  return value.replace(/\D/g, "")
}

function normalizarNombre(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("es").trim()
}

function autorizado(req: NextRequest): boolean {
  const header = req.headers.get("authorization") || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  const expected = process.env.PORTAL_COLABORADORES_API_KEY
  if (!expected || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const cedula = soloDigitos(req.nextUrl.searchParams.get("cedula") || "")
  if (!cedula) {
    return NextResponse.json({ error: "Falta o es inválido el parámetro cedula" }, { status: 400 })
  }

  try {
    const colaborador = (await listarColaboradoresActivos()).find(
      (item) => item.cedula && soloDigitos(item.cedula) === cedula,
    )
    if (!colaborador) {
      return NextResponse.json(
        { error: "No hay un colaborador activo con esa cédula" },
        { status: 404 },
      )
    }

    let registro = await prisma.codigoReferido.findUnique({ where: { colaboradorId: colaborador.id } })

    if (!registro) {
      // Vincula códigos legacy creados con nombre libre (antes de tener colaboradorId).
      const nombreNormalizado = normalizarNombre(colaborador.nombre)
      const legacy = (
        await prisma.codigoReferido.findMany({ where: { colaboradorId: null } })
      ).find((item) => normalizarNombre(item.nombreEmpleado) === nombreNormalizado)

      registro = legacy
        ? await prisma.codigoReferido.update({
            where: { id: legacy.id },
            data: {
              colaboradorId: colaborador.id,
              cedulaEmpleado: colaborador.cedula,
              nombreEmpleado: colaborador.nombre,
              cargoEmpleado: colaborador.cargo,
              areaEmpleado: colaborador.area,
            },
          })
        : await prisma.codigoReferido.create({
            data: {
              colaboradorId: colaborador.id,
              cedulaEmpleado: colaborador.cedula,
              nombreEmpleado: colaborador.nombre,
              cargoEmpleado: colaborador.cargo,
              areaEmpleado: colaborador.area,
              codigo: await generarCodigoUnico(colaborador.nombre),
            },
          })
    }

    if (!registro.activo) {
      return NextResponse.json(
        { error: "El código de este colaborador está inactivo" },
        { status: 403 },
      )
    }

    return NextResponse.json({
      nombreEmpleado: registro.nombreEmpleado,
      codigo: registro.codigo,
      activo: registro.activo,
      urlPostulacion: "https://meisa.com.co/trabaja-con-nosotros",
    })
  } catch (error) {
    console.error("[api] integraciones/colaboradores/codigo-referido:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
