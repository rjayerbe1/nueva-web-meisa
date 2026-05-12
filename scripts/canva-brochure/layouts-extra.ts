// Layouts extras: P-T (inspirados en PDF Edificaciones) + portada/contraportada angular.
// Se importan desde index.ts y comparten contexto via setBrochureContext en layouts.ts.

import type PptxGenJS from "pptxgenjs"
import { THEME, FRAME, ASSETS } from "./theme"
import type { ProyectoBrochure } from "./data"
import type { CategoriaConfig, SpecKey } from "./categorias"
import { fitTitleSize, fitTitleByLines } from "./layouts"

const W = THEME.slide.width // 13.333
const H = THEME.slide.height // 7.5

// =============================================================================
// Helpers locales (replicados de layouts.ts para auto-contención)
// =============================================================================

function drawHeader(
  slide: PptxGenJS.Slide,
  pageNumber: number,
  tagline: string,
  dark = false,
) {
  const label = `${String(pageNumber).padStart(2, "0")}  —  ${tagline}`
  const color = dark ? "94A3B8" : THEME.color.slate400
  slide.addText(label, {
    x: FRAME.headerLeftX,
    y: FRAME.headerY,
    w: 6,
    h: 0.25,
    fontSize: 9,
    fontFace: THEME.font.body,
    bold: true,
    color,
    charSpacing: THEME.tracking.eyebrow * 25,
    valign: "middle",
  })
  slide.addShape("line", {
    x: 6.5,
    y: FRAME.headerLineY + 0.05,
    w: 6.33,
    h: 0,
    line: { color: dark ? "1E293B" : "E2E8F0", width: 0.75 },
  })
}

function drawFooter(slide: PptxGenJS.Slide, dark = false, tagline = "") {
  slide.addImage({
    path: dark ? ASSETS.logoWhite : ASSETS.logoColor,
    x: 11.4,
    y: FRAME.footerY - 0.15,
    w: 1.4,
    h: 0.45,
    sizing: { type: "contain", w: 1.4, h: 0.45 },
  })
  if (tagline) {
    slide.addText(tagline, {
      x: 0.5,
      y: FRAME.footerY,
      w: 5,
      h: 0.25,
      fontSize: 7,
      fontFace: THEME.font.body,
      bold: true,
      color: dark ? "64748B" : THEME.color.slate400,
      charSpacing: THEME.tracking.eyebrow * 20,
      valign: "middle",
    })
  }
}

function drawPhoto(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  url?: string,
  dark = false,
) {
  if (url) {
    slide.addImage({ path: url, x, y, w, h, sizing: { type: "cover", w, h } })
    return
  }
  const fillColor = dark ? THEME.color.slate900 : THEME.color.slate200
  slide.addShape("rect", {
    x,
    y,
    w,
    h,
    fill: { color: fillColor },
    line: { color: fillColor, width: 0 },
  })
}

/** Retorna {label, value} para una SpecKey. Reusable por todos los layouts P-T */
function specPair(p: ProyectoBrochure, key: SpecKey): { label: string; value: string } | null {
  const valueMap: Record<SpecKey, string | undefined> = {
    AREA: p.area,
    PESO: p.peso,
    CLIENTE: p.cliente,
    DISEÑO: p.diseno,
    LUZ_MAX: p.luzMax,
    MATERIAL: p.material,
    LONGITUD: p.longitud,
    ANCHO: p.ancho,
  }
  const labelMap: Record<SpecKey, string> = {
    AREA: "ÁREA",
    PESO: "PESO",
    CLIENTE: "CLIENTE",
    DISEÑO: "DISEÑO",
    LUZ_MAX: "LUZ MÁX.",
    MATERIAL: "MATERIAL",
    LONGITUD: "LONGITUD",
    ANCHO: "ANCHO",
  }
  const value = valueMap[key]
  return value ? { label: labelMap[key], value } : null
}

// =============================================================================
// PORTADA ANGULAR — bloques triangulares azul/rojo (estilo PDF Edificaciones pág 1)
// =============================================================================

export function drawPortadaAngular(
  pres: PptxGenJS,
  categoria: CategoriaConfig,
  fotoPortada?: string,
) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  // 1. Foto a sangre cubriendo lado derecho
  drawPhoto(slide, 7.5, 0, 5.833, 7.5, fotoPortada, true)

  // 2. Bloque azul izquierdo — alto 6.5" para que aloje título + año sin colisionar con el rojo
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 7.5,
    h: 6.5,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })

  // 3. Banda roja diagonal solo en el último 1.0" (separador editorial inferior)
  slide.addShape("rtTriangle", {
    x: 0,
    y: 6.5,
    w: 7.5,
    h: 1.0,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
    flipV: true,
  })
  slide.addShape("rtTriangle", {
    x: 7.5,
    y: 6.5,
    w: 5.833,
    h: 1.0,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
    flipH: true,
    flipV: true,
  })

  // 4. Título grande en blanco — fitTitleByLines garantiza que entra en h=4.2
  const tituloFull = categoria.tituloPortada
  const size = fitTitleByLines(tituloFull, 7.0, 4.2, 84, 0.62, 0.92)

  slide.addText(tituloFull, {
    x: 0.4,
    y: 0.9,
    w: 7.0,
    h: 4.2,
    fontSize: size,
    fontFace: THEME.font.displayHeavy,
    color: "FFFFFF",
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.92,
    charSpacing: 2,
  })

  // 5. Año dentro del bloque azul (no sobre el rojo) — fontSize moderado
  slide.addText(categoria.subtituloPortada, {
    x: 0.4,
    y: 5.5,
    w: 4.0,
    h: 0.6,
    fontSize: 28,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
    charSpacing: 12,
  })

  // 6. Logo MEISA blanco abajo izq — sobre la franja blanca debajo del rojo
  //    (el rojo está en y=6.5 hasta y=7.0; el blanco asoma de y=7.0 a y=7.5)
  slide.addImage({
    path: ASSETS.logoWhite,
    x: 0.4,
    y: 6.7,
    w: 2.4,
    h: 0.7,
    sizing: { type: "contain", w: 2.4, h: 0.7 },
  })
}

// =============================================================================
// CONTRAPORTADA ANGULAR — bloques rojo/azul + datos de contacto
// =============================================================================

export function drawContraportadaAngular(pres: PptxGenJS) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  // 1. Bloque azul ocupando 60% superior — solo decorativo (sin texto encima)
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.333,
    h: 4.5,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })

  // 2. Banda roja diagonal abajo del azul (separador editorial)
  slide.addShape("rtTriangle", {
    x: 0,
    y: 4.5,
    w: 7.5,
    h: 1.5,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
    flipV: true,
  })
  slide.addShape("rtTriangle", {
    x: 7.5,
    y: 4.5,
    w: 5.833,
    h: 1.5,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
    flipH: true,
    flipV: true,
  })

  // 3. "CONTÁCTANOS" hero sobre el bloque azul (centrado)
  slide.addText("CONTÁCTANOS", {
    x: 0.5,
    y: 0.9,
    w: 12.333,
    h: 1.0,
    fontSize: 56,
    fontFace: THEME.font.displayHeavy,
    color: "FFFFFF",
    bold: true,
    align: "center",
    valign: "middle",
    charSpacing: 14,
  })

  // 4. Línea roja decorativa debajo
  slide.addShape("line", {
    x: 6.0,
    y: 1.95,
    w: 1.333,
    h: 0,
    line: { color: THEME.color.rojo, width: 3 },
  })

  // 5. Tres columnas: Jamundí · Popayán · Web/email
  const colY = 2.3
  // Columna 1: Jamundí
  slide.addText("JAMUNDÍ", {
    x: 0.7, y: colY, w: 4.0, h: 0.4,
    fontSize: 18, fontFace: THEME.font.display, color: "FFFFFF",
    bold: true, valign: "top", charSpacing: 8,
  })
  slide.addText(
    "Vía Panamericana # 6 sur - 196\n+57 (2) 312 0050 al 53\nCel: 315 219 7001",
    {
      x: 0.7, y: colY + 0.5, w: 4.0, h: 1.4,
      fontSize: 11, fontFace: THEME.font.body, color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.4,
    },
  )

  // Columna 2: Popayán
  slide.addText("POPAYÁN", {
    x: 5.0, y: colY, w: 4.0, h: 0.4,
    fontSize: 18, fontFace: THEME.font.display, color: "FFFFFF",
    bold: true, valign: "top", charSpacing: 8,
  })
  slide.addText(
    "Parque Industrial · Bodega E13\nCauca - Colombia",
    {
      x: 5.0, y: colY + 0.5, w: 4.0, h: 1.4,
      fontSize: 11, fontFace: THEME.font.body, color: "FFFFFF",
      valign: "top", lineSpacingMultiple: 1.4,
    },
  )

  // Columna 3: Web + email
  slide.addText("ESCRÍBENOS", {
    x: 9.3, y: colY, w: 3.7, h: 0.4,
    fontSize: 18, fontFace: THEME.font.display, color: "FFFFFF",
    bold: true, valign: "top", charSpacing: 8,
  })
  slide.addText(
    "contacto@meisa.com.co\nwww.meisa.com.co",
    {
      x: 9.3, y: colY + 0.5, w: 3.7, h: 1.4,
      fontSize: 12, fontFace: THEME.font.body, color: "FFFFFF",
      bold: true, valign: "top", lineSpacingMultiple: 1.4,
    },
  )

  // 6. Tagline cierre sobre el blanco inferior
  slide.addText("ESTRUCTURAS METÁLICAS DESDE 1996", {
    x: 0.5, y: 6.3, w: 9.0, h: 0.5,
    fontSize: 16, fontFace: THEME.font.display,
    color: THEME.color.azul, bold: true,
    valign: "middle", charSpacing: 10,
  })

  // 7. Logo MEISA color en abajo-derecha sobre el blanco
  slide.addImage({
    path: ASSETS.logoColor,
    x: 10.0, y: 6.2, w: 2.8, h: 1.0,
    sizing: { type: "contain", w: 2.8, h: 1.0 },
  })
}

// =============================================================================
// LAYOUT P — Hero badge: foto vertical der + título grande izq + badge año
//   Inspiración: pág 6 "DOLLAR CITY", pág 12 "EDIFICIO CITRÍCO"
// =============================================================================

export function drawLayoutP(
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  drawHeader(slide, pageNumber, cfg.tagline, false)

  // Foto vertical derecha — toma 50% del ancho
  drawPhoto(slide, 6.5, 1.2, 6.3, 5.6, p.fotos[0], true)

  // Puntos decorativos azules grid (estilo PDF DOLLAR CITY)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      slide.addShape("ellipse", {
        x: 5.6 + col * 0.18,
        y: 1.4 + row * 0.18,
        w: 0.06,
        h: 0.06,
        fill: { color: THEME.color.azul },
        line: { color: THEME.color.azul, width: 0 },
      })
    }
  }

  // Título grande izquierda — fitTitleByLines considera palabra Y líneas
  const nombreClean = p.nombre.replace(/\n/g, " ").trim()
  const nombreSize = fitTitleByLines(nombreClean, 5.5, 1.6, 60, 0.62, 0.92)
  slide.addText(nombreClean, {
    x: 0.5,
    y: 2.2,
    w: 5.5,
    h: 1.6,
    fontSize: nombreSize,
    fontFace: THEME.font.displayHeavy,
    color: THEME.color.azul,
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.92,
  })

  // Línea roja decorativa debajo del título
  slide.addShape("line", {
    x: 0.5,
    y: 3.85,
    w: 3.0,
    h: 0,
    line: { color: THEME.color.rojo, width: 2.5 },
  })

  // Ubicación
  slide.addText(p.ubicacionCorta.toUpperCase(), {
    x: 0.5,
    y: 4.0,
    w: 5.5,
    h: 0.4,
    fontSize: 18,
    fontFace: THEME.font.display,
    color: THEME.color.azul,
    bold: true,
    valign: "top",
  })

  // Badge rojo con AÑO
  slide.addShape("rect", {
    x: 0.5,
    y: 4.55,
    w: 1.4,
    h: 0.55,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
  })
  slide.addText(p.anio, {
    x: 0.5,
    y: 4.55,
    w: 1.4,
    h: 0.55,
    fontSize: 22,
    fontFace: THEME.font.body,
    color: "FFFFFF",
    bold: true,
    align: "center",
    valign: "middle",
    charSpacing: 10,
  })

  // Descripción
  if (p.descripcion) {
    slide.addText(p.descripcion, {
      x: 0.5,
      y: 5.3,
      w: 5.5,
      h: 0.8,
      fontSize: 11,
      fontFace: THEME.font.body,
      color: THEME.color.tinta,
      valign: "top",
      lineSpacingMultiple: 1.4,
    })
  } else {
    slide.addText("Construcción de Estructura Metálica", {
      x: 0.5,
      y: 5.3,
      w: 5.5,
      h: 0.4,
      fontSize: 12,
      fontFace: THEME.font.body,
      color: THEME.color.tinta,
      valign: "top",
    })
  }

  // Specs alineadas izquierda — solo las visibles
  const specs = cfg.specsVisibles
    .map((k) => specPair(p, k))
    .filter((x): x is { label: string; value: string } => x !== null)
  const specsLines = specs.map((s) => `${s.label}: ${s.value}`).join("\n")
  slide.addText(specsLines, {
    x: 0.5,
    y: 6.15,
    w: 5.5,
    h: 0.85,
    fontSize: 12,
    fontFace: THEME.font.body,
    color: THEME.color.azul,
    bold: true,
    charSpacing: 6,
    valign: "top",
    lineSpacingMultiple: 1.3,
  })

  drawFooter(slide, false, cfg.tagline.toUpperCase())
}

// =============================================================================
// LAYOUT Q — Bloque azul izq + 2 fotos circulares derecha
//   Inspiración: pág 18 "CAPSULAS BLANDAS"
// =============================================================================

export function drawLayoutQ(
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  drawHeader(slide, pageNumber, cfg.tagline, false)

  // Foto banner top-right cubriendo de fondo
  drawPhoto(slide, 7.5, 0, 5.833, 7.5, p.fotos[0], true)

  // Título grande arriba izquierda — fitTitleByLines + h=1.4 estricto
  const nombreClean = p.nombre.replace(/\n/g, " ").trim()
  const nombreSize = fitTitleByLines(nombreClean, 7.0, 1.4, 48, 0.62, 0.92)
  slide.addText(nombreClean, {
    x: 0.5,
    y: 1.0,
    w: 7.0,
    h: 1.4,
    fontSize: nombreSize,
    fontFace: THEME.font.displayHeavy,
    color: THEME.color.azul,
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.92,
  })

  // Badge rojo ubicación + año — bajado a y=2.95 para no chocar con título h=1.4 (termina y=2.4)
  slide.addShape("rect", {
    x: 0.5,
    y: 2.95,
    w: 3.5,
    h: 0.5,
    fill: { color: THEME.color.rojo },
    line: { color: THEME.color.rojo, width: 0 },
  })
  slide.addText(`${p.ubicacionCorta.toUpperCase()} · ${p.anio}`, {
    x: 0.5,
    y: 2.95,
    w: 3.5,
    h: 0.5,
    fontSize: 13,
    fontFace: THEME.font.body,
    color: "FFFFFF",
    bold: true,
    align: "center",
    valign: "middle",
    charSpacing: 5,
  })

  // Bloque azul con descripción + specs
  slide.addShape("rect", {
    x: 0.5,
    y: 3.4,
    w: 5.5,
    h: 3.6,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })

  // Descripción
  const descripcion =
    p.descripcion || "Construcción de la estructura metálica del proyecto."
  slide.addText(descripcion, {
    x: 0.85,
    y: 3.65,
    w: 5.0,
    h: 1.6,
    fontSize: 11,
    fontFace: THEME.font.body,
    color: "FFFFFF",
    valign: "top",
    lineSpacingMultiple: 1.4,
  })

  // Specs en blanco sobre azul
  const specs = cfg.specsVisibles
    .map((k) => specPair(p, k))
    .filter((x): x is { label: string; value: string } => x !== null)
  const specsLines = specs.map((s) => `${s.label}: ${s.value}`).join("\n")
  slide.addText(specsLines, {
    x: 0.85,
    y: 5.3,
    w: 5.0,
    h: 1.5,
    fontSize: 13,
    fontFace: THEME.font.body,
    color: "FFFFFF",
    bold: true,
    charSpacing: 6,
    valign: "top",
    lineSpacingMultiple: 1.4,
  })

  // 2 fotos circulares apiladas (segunda y tercera foto)
  if (p.fotos[1]) {
    slide.addImage({
      path: p.fotos[1],
      x: 9.5,
      y: 1.2,
      w: 2.2,
      h: 2.2,
      sizing: { type: "cover", w: 2.2, h: 2.2 },
      rounding: true,
    })
  }
  if (p.fotos[2]) {
    slide.addImage({
      path: p.fotos[2],
      x: 9.5,
      y: 4.0,
      w: 2.2,
      h: 2.2,
      sizing: { type: "cover", w: 2.2, h: 2.2 },
      rounding: true,
    })
  }

  drawFooter(slide, false, cfg.tagline.toUpperCase())
}

// =============================================================================
// LAYOUT R — Fondo rojo dominante 50% + foto 50% derecha
//   Inspiración: pág 16 "SÓLIDOS DE ALTO VOLUMEN" — máximo 1 por brochure
// =============================================================================

export function drawLayoutR(
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.rojoIntenso }

  // Foto a sangre derecha 60%
  drawPhoto(slide, 5.0, 0, 8.333, 7.5, p.fotos[0], true)

  // Bloque rojo izquierda 40%
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 5.0,
    h: 7.5,
    fill: { color: THEME.color.rojoIntenso },
    line: { color: THEME.color.rojoIntenso, width: 0 },
  })

  // "Striped" decorativo arriba: 3 líneas blancas SOLO en franja superior (y<1.8)
  // — fuera del área de título (y>=2.5) para no cruzarlo nunca
  for (let i = 0; i < 3; i++) {
    slide.addShape("line", {
      x: 0,
      y: 0.6 + i * 0.4,
      w: 5.0,
      h: 0,
      line: { color: "FFFFFF", width: 0.5, transparency: 70 } as any,
    })
  }

  // Header en blanco sobre rojo
  drawHeader(slide, pageNumber, cfg.tagline, true)

  // Título mega — fitTitleByLines por línea, considerando ancho de bloque rojo (4.5")
  const nombreClean = p.nombre.replace(/\n/g, " ").trim()
  // Partir el nombre en líneas si es largo
  const palabras = nombreClean.split(" ")
  const linea1 = palabras[0] || ""
  const linea2 = palabras.slice(1).join(" ") || ""
  const size1 = fitTitleByLines(linea1, 4.5, 1.0, 56, 0.55, 0.95)
  const size2 = fitTitleByLines(linea2, 4.5, 1.8, 48, 0.62, 0.92)

  slide.addText(linea1, {
    x: 0.5,
    y: 2.5,
    w: 4.5,
    h: 1.0,
    fontSize: size1,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })
  if (linea2) {
    slide.addText(linea2, {
      x: 0.5,
      y: 3.5,
      w: 4.5,
      h: 1.8,
      fontSize: size2,
      fontFace: THEME.font.displayHeavy,
      color: "FFFFFF",
      bold: true,
      valign: "top",
      lineSpacingMultiple: 0.92,
    })
  }

  // Año
  slide.addText(p.anio, {
    x: 0.5,
    y: 5.4,
    w: 4.5,
    h: 0.6,
    fontSize: 28,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    charSpacing: 10,
    valign: "top",
  })

  drawFooter(slide, true, cfg.tagline.toUpperCase())
}

// =============================================================================
// LAYOUT S — Mosaico 6 fotos sobre fondo azul + specs en bloque inferior
//   Inspiración: pág 9 "SUCROAL", pág 47 "TACHO CONTÍNUO"
// =============================================================================

export function drawLayoutS(
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.azulProfundo }

  drawHeader(slide, pageNumber, cfg.tagline, true)

  // Grid 4 columnas × 2 filas, fotos del proyecto (rotando si hay menos de 8)
  const gridX = 1.0
  const gridY = 1.0
  const cellW = 2.7
  const cellH = 2.4
  const gap = 0.15

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const idx = row * 4 + col
      const fotoIdx = idx % p.fotos.length
      const x = gridX + col * (cellW + gap)
      const y = gridY + row * (cellH + gap)
      drawPhoto(slide, x, y, cellW, cellH, p.fotos[fotoIdx], true)
    }
  }

  // Específicos abajo izquierda — encima del bloque azul profundo
  // Línea decorativa
  slide.addShape("line", {
    x: 1.0,
    y: 6.4,
    w: 1.5,
    h: 0,
    line: { color: "FFFFFF", width: 1.5 },
  })

  // Specs en blanco
  const specs = cfg.specsVisibles
    .map((k) => specPair(p, k))
    .filter((x): x is { label: string; value: string } => x !== null)
  const specsLines = specs.map((s) => `${s.label}: ${s.value}`).join("\n")
  slide.addText(specsLines, {
    x: 1.0,
    y: 6.5,
    w: 7.0,
    h: 0.7,
    fontSize: 13,
    fontFace: THEME.font.body,
    color: "FFFFFF",
    bold: true,
    charSpacing: 6,
    valign: "top",
    lineSpacingMultiple: 1.3,
  })

  // Footer dark
  drawFooter(slide, true, cfg.tagline.toUpperCase())
}

// =============================================================================
// LAYOUT T — Banner foto top + título + descripción + specs alineadas der
//   Inspiración: pág 5 "MHC", pág 13 "Ingenio Mayagüez"
// =============================================================================

export function drawLayoutT(
  pres: PptxGenJS,
  p: ProyectoBrochure,
  pageNumber: number,
  cfg: CategoriaConfig,
) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  drawHeader(slide, pageNumber, cfg.tagline, false)

  // Foto banner top — full-width, ~50% altura
  drawPhoto(slide, 0.5, 0.85, 12.333, 4.0, p.fotos[0], false)

  // Bloque azul lateral derecho dentro de la foto (estilo MHC)
  slide.addShape("rect", {
    x: 8.5,
    y: 0.85,
    w: 4.333,
    h: 4.0,
    fill: { color: THEME.color.azul, transparency: 25 } as any,
    line: { color: THEME.color.azul, width: 0 },
  })

  // Título tipo proyecto
  slide.addText(p.tipo.toUpperCase(), {
    x: 0.5,
    y: 5.05,
    w: 12.0,
    h: 0.35,
    fontSize: 13,
    fontFace: THEME.font.body,
    bold: true,
    color: THEME.color.slate400,
    charSpacing: 8,
    valign: "top",
  })

  // Nombre — fitTitleByLines con h=1.6 (ampliado) y valign top
  const nombreClean = p.nombre.replace(/\n/g, " ").trim()
  const nombreSize = fitTitleByLines(nombreClean, 7.5, 1.6, 44, 0.62, 0.92)
  slide.addText(nombreClean, {
    x: 0.5,
    y: 5.4,
    w: 7.5,
    h: 1.6,
    fontSize: nombreSize,
    fontFace: THEME.font.displayHeavy,
    color: THEME.color.azul,
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.92,
  })

  // Descripción + ubicación
  const descLine = p.descripcion
    ? p.descripcion
    : "Construcción de Estructura Metálica"
  slide.addText(
    [
      { text: descLine, options: { fontSize: 12, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "\n", options: { fontSize: 12, fontFace: THEME.font.body } },
      { text: "Ubicación: ", options: { fontSize: 12, bold: true, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: p.ubicacionCorta, options: { fontSize: 12, color: THEME.color.tinta, fontFace: THEME.font.body } },
    ],
    {
      x: 0.5,
      y: 6.4,
      w: 7.5,
      h: 0.7,
      valign: "top",
      lineSpacingMultiple: 1.4,
    },
  )

  // Specs alineadas a la derecha
  const specs = cfg.specsVisibles
    .map((k) => specPair(p, k))
    .filter((x): x is { label: string; value: string } => x !== null)
  // Línea separadora
  slide.addShape("line", {
    x: 8.5,
    y: 5.5,
    w: 1.5,
    h: 0,
    line: { color: THEME.color.tinta, width: 1 },
  })
  const specsLines = specs.map((s) => `${s.label}: ${s.value}`).join("\n")
  slide.addText(specsLines, {
    x: 8.5,
    y: 5.65,
    w: 4.3,
    h: 1.5,
    fontSize: 14,
    fontFace: THEME.font.body,
    color: THEME.color.azul,
    bold: true,
    charSpacing: 8,
    align: "left",
    valign: "top",
    lineSpacingMultiple: 1.4,
  })

  drawFooter(slide, false, cfg.tagline.toUpperCase())
}
