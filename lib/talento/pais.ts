// Sin dependencias de servidor: lo usan también los componentes del admin.

const COLOMBIA = /^(colombia|co|col)$/i

export function esColombia(pais: string | null | undefined): boolean {
  return !!pais && COLOMBIA.test(pais.normalize("NFD").replace(/[̀-ͯ]/g, "").trim())
}

/** `true` si el país de residencia existe y no es Colombia. Sin dato, `false`. */
export function resideFueraDeColombia(pais: string | null | undefined): boolean {
  return !!pais?.trim() && !esColombia(pais)
}
