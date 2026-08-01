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

/**
 * Resuelve lo que el candidato escribió en el campo de referido.
 *
 * En la práctica la gente NO escribe el código: le pregunta a su conocido
 * "¿quién digo que me mandó?" y le dan un NOMBRE. De los 3 primeros referidos
 * reales, dos se perdieron así — uno puso "DANIEL MONTENEGRO CAPOTE" y otro un
 * número suelto. Cada referido perdido es un colaborador que no cobra su bono,
 * que es lo que mata la credibilidad del programa.
 *
 * Por eso se intenta, en orden: código exacto → código sin separadores →
 * nombre del colaborador (difuso, tolerando acentos y nombres incompletos).
 *
 * Si el nombre coincide con MÁS DE UN colaborador, NO se vincula: se deja el
 * texto crudo para que Talento Humano lo resuelva. Adjudicarle un bono a la
 * persona equivocada es peor que dejarlo pendiente.
 */
export type MatchReferido = {
  id: string
  codigo: string
  nombreEmpleado: string
  via: "codigo" | "nombre"
}

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export async function resolverCodigoReferido(
  texto: string,
): Promise<{ match: MatchReferido | null; ambiguo: boolean }> {
  const limpio = normalizar(texto)
  if (!limpio) return { match: null, ambiguo: false }

  const activos = await prisma.codigoReferido.findMany({ where: { activo: true } })

  // 1. Código exacto (o sin espacios/guiones, como suelen pegarlo).
  const sinSep = limpio.replace(/\s/g, "")
  const porCodigo = activos.find(
    (c) => c.codigo.toUpperCase() === limpio || c.codigo.toUpperCase() === sinSep,
  )
  if (porCodigo) {
    return {
      match: { id: porCodigo.id, codigo: porCodigo.codigo, nombreEmpleado: porCodigo.nombreEmpleado, via: "codigo" },
      ambiguo: false,
    }
  }

  // 2. Nombre del colaborador. Se exigen al menos 2 palabras coincidentes para
  //    no vincular por un "JUAN" suelto que tendrían veinte personas.
  const tokens = limpio.split(" ").filter((t) => t.length >= 3)
  if (tokens.length < 2) return { match: null, ambiguo: false }

  const candidatos = activos.filter((c) => {
    const emp = normalizar(c.nombreEmpleado).split(" ").filter(Boolean)
    const comunes = tokens.filter((t) =>
      emp.some((e) => e === t || (t.length >= 4 && (e.startsWith(t) || t.startsWith(e)))),
    )
    return comunes.length >= 2
  })

  if (candidatos.length === 1) {
    const c = candidatos[0]
    return {
      match: { id: c.id, codigo: c.codigo, nombreEmpleado: c.nombreEmpleado, via: "nombre" },
      ambiguo: false,
    }
  }
  return { match: null, ambiguo: candidatos.length > 1 }
}
