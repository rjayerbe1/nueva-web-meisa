import { revalidatePath, revalidateTag } from 'next/cache'
import { MODEL_TAGS, type PublicTag } from '@/lib/cache/tags'

/**
 * Invalida el caché público: las tags de datos indicadas (Data Cache de
 * `cachedContent`) y TODAS las páginas renderizadas (Full Route Cache), vía
 * `revalidatePath('/', 'layout')`. Se prefiere invalidar todas las páginas y
 * no mapear tabla→ruta porque (a) casi toda tabla aparece en varias rutas
 * (navbar, footer, JSON-LD, cross-links) y (b) las escrituras del admin son
 * pocas al día: regenerar el sitio entero tras cada una es barato y no deja
 * nada viejo por un mapeo incompleto.
 *
 * Nunca lanza: si no hay contexto de request de Next (scripts, seeds,
 * jobs), el fallo se ignora y la escritura sigue su curso.
 */
let generacion = 0

/**
 * Contador de invalidaciones en este proceso. lib/content/snapshot.ts lo usa
 * para no reutilizar una carga del snapshot que empezó ANTES de una escritura.
 */
export function generacionContenido(): number {
  return generacion
}

export function revalidatePublicContent(tags: readonly PublicTag[] = []): void {
  generacion++
  if (process.env.CACHE_REVALIDATE_DEBUG) {
    console.log(`[cache] invalidando tags=${tags.join(',') || '(ninguna)'} + todas las páginas`)
  }
  try {
    for (const tag of tags) revalidateTag(tag)
    revalidatePath('/', 'layout')
  } catch {
    // Fuera de un request de Next (p. ej. un script con tsx) no hay store de
    // revalidación. No es un error: el TTL de 1 h se encarga.
  }
}

/** Invalida a partir del modelo Prisma escrito (nombre del delegate). */
export function revalidateForModel(model: string): void {
  const tags = MODEL_TAGS[model]
  if (!tags || tags.length === 0) return
  revalidatePublicContent(tags)
}
