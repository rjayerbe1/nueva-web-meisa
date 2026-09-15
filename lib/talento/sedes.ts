import type { Plant } from "@prisma/client"

// MEISA no es solo Jamundí: hay plantas en Popayán y Villa Rica. Todo texto
// público de empleo que diga dónde se trabaja sale de la tabla `plantas`, así
// una sede nueva (o una que se cierre) se refleja sin tocar código.

type PlantaMin = Pick<Plant, "ciudad" | "departamento" | "activo" | "orden">

function sinTildes(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase()
}

export function ciudadesSedes(plantas: PlantaMin[]): string[] {
  const vistas = new Set<string>()
  return [...plantas]
    .filter((p) => p.activo && p.ciudad)
    .sort((a, b) => a.orden - b.orden)
    .map((p) => p.ciudad!)
    .filter((c) => !vistas.has(sinTildes(c)) && vistas.add(sinTildes(c)))
}

/** "Jamundí, Popayán y Villa Rica" */
export function listaSedes(plantas: PlantaMin[]): string {
  const c = ciudadesSedes(plantas)
  if (c.length <= 1) return c[0] ?? "Colombia"
  return `${c.slice(0, -1).join(", ")} y ${c[c.length - 1]}`
}

/** Departamento de la sede en esa ciudad, para el JSON-LD de Google Jobs. */
export function departamentoDeCiudad(plantas: PlantaMin[], ciudad: string | null): string | null {
  if (!ciudad) return null
  return plantas.find((p) => p.ciudad && sinTildes(p.ciudad) === sinTildes(ciudad))?.departamento ?? null
}
