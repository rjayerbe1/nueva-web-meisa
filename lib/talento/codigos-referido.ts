import { prisma } from "@/lib/prisma"

// Código legible: nombre + inicial del apellido + 3 dígitos, ej. "JUANP482".
function baseCodigo(nombreEmpleado: string): string {
  const partes = nombreEmpleado
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
  const primero = (partes[0] ?? "EMP").slice(0, 8)
  const inicialApellido = partes[1]?.[0] ?? ""
  return `${primero}${inicialApellido}`
}

export async function generarCodigoUnico(nombreEmpleado: string): Promise<string> {
  const base = baseCodigo(nombreEmpleado)
  for (let intento = 0; intento < 20; intento++) {
    const sufijo = Math.floor(100 + Math.random() * 900)
    const candidato = `${base}${sufijo}`
    const existe = await prisma.codigoReferido.findUnique({ where: { codigo: candidato } })
    if (!existe) return candidato
  }
  // Fallback extremadamente improbable: sufijo largo
  return `${base}${Date.now().toString().slice(-6)}`
}
