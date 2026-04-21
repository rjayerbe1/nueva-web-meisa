/**
 * Metadata estática del sitio. Lo que queda tras eliminar /lib/site-config.ts.
 *
 * - Marca y año de fundación son constantes históricas; no se parametrizan
 *   por admin para evitar romper SEO/metadata.
 * - Lo editable por admin vive en ConfiguracionEmpresa (lib/content/empresa.ts)
 *   y se lee ahí cuando la página es server-side.
 */

export const SITE_URL = "https://meisa.com.co"
export const BRAND_NAME = "MEISA"
export const BRAND_FULL_NAME = "Metálicas e Ingeniería S.A.S."
export const FOUNDING_YEAR = 1996

/** Años de experiencia calculados desde la fundación. Dinámico por año. */
export function aniosExperiencia(): number {
  return new Date().getFullYear() - FOUNDING_YEAR
}
