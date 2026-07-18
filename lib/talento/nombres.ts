// Normaliza nombres de personas a Tipo Título uniforme:
// "MARIA ISABEL RAMOS" → "Maria Isabel Ramos", "elizabeth pomar" → "Elizabeth Pomar".
// Respeta partículas en minúscula (de, del, la...) salvo al inicio.
const PARTICULAS = new Set(["de", "del", "la", "las", "los", "da", "das", "do", "dos", "y", "e", "van", "von", "mc", "san"])

export function normalizarNombre(raw: string): string {
  const limpio = raw.replace(/\s+/g, " ").trim()
  if (!limpio) return limpio
  return limpio
    .toLocaleLowerCase("es-CO")
    .split(" ")
    .map((palabra, i) => {
      if (i > 0 && PARTICULAS.has(palabra)) return palabra
      // Maneja compuestos con guion: "garcia-lopez" → "Garcia-Lopez"
      return palabra
        .split("-")
        .map((p) => (p ? p.charAt(0).toLocaleUpperCase("es-CO") + p.slice(1) : p))
        .join("-")
    })
    .join(" ")
}
