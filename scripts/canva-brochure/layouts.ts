// Layouts del brochure — sistema brutalist editorial MEISA.
// Variante DARK (slate-950) dominante para showcases; LIGHT (stone-50) para narrativa.
// Tipografía: Bebas Neue (display) + Lato (body), siguiendo skill meisa-web-design.

import type PptxGenJS from "pptxgenjs"
import { THEME, FRAME, SPECS_ICONS, ASSETS } from "./theme"
import type { ProyectoPuente } from "./data"
import { CAPACIDADES, EMPRESA, FOTOS_NARRATIVAS, PULL_QUOTE, STATS_GLOBAL, TIMELINE, UBICACIONES } from "./data"

// ============================================================
// Helpers
// ============================================================

/** Header recurrente: "NN — PORTAFOLIO PUENTES" + línea roja */
function drawHeader(slide: PptxGenJS.Slide, pageNumber?: number, dark = false) {
  const label = pageNumber
    ? `${String(pageNumber).padStart(2, "0")}  —  PORTAFOLIO PUENTES`
    : "—  PORTAFOLIO PUENTES"
  const color = dark ? "94A3B8" : THEME.color.slate400
  slide.addText(label, {
    x: FRAME.headerLeftX,
    y: FRAME.headerY,
    w: 4.5,
    h: 0.25,
    fontSize: 9,
    fontFace: THEME.font.body,
    bold: true,
    color,
    charSpacing: THEME.tracking.eyebrow * 25,
    valign: "middle",
  })
  slide.addShape("line", {
    x: 5.0,
    y: FRAME.headerLineY + 0.05,
    w: 7.83,
    h: 0,
    line: { color: dark ? "1E293B" : "E2E8F0", width: 0.75 },
  })
}

/** Footer minimal: logo MEISA + razón social */
function drawFooter(slide: PptxGenJS.Slide, dark = false) {
  slide.addImage({
    path: dark ? ASSETS.logoWhite : ASSETS.logoColor,
    x: 11.4,
    y: FRAME.footerY - 0.15,
    w: 1.4,
    h: 0.45,
    sizing: { type: "contain", w: 1.4, h: 0.45 },
  })
  slide.addText(EMPRESA.razonSocial.toUpperCase(), {
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

/** Eyebrow brutalist editorial: "01 — TÍTULO" en uppercase tracking alto */
function drawEyebrow(
  slide: PptxGenJS.Slide,
  text: string,
  x: number,
  y: number,
  w: number,
  dark = false,
  red = false,
) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.3,
    fontSize: 11,
    fontFace: THEME.font.body,
    bold: true,
    color: red ? THEME.color.rojo : dark ? "94A3B8" : THEME.color.slate400,
    charSpacing: THEME.tracking.eyebrow * 30,
    valign: "top",
  })
}

/** Foto editable o placeholder según url disponible */
function drawPhoto(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { label?: string; url?: string; dark?: boolean } = {},
) {
  if (opts.url) {
    slide.addImage({
      path: opts.url,
      x,
      y,
      w,
      h,
      sizing: { type: "cover", w, h },
    })
    return
  }
  const fillColor = opts.dark ? THEME.color.slate900 : THEME.color.slate200
  slide.addShape("rect", {
    x,
    y,
    w,
    h,
    fill: { color: fillColor },
    line: { color: fillColor, width: 0 },
  })
  slide.addText(opts.label || "FOTO", {
    x,
    y,
    w,
    h,
    fontSize: 10,
    fontFace: THEME.font.body,
    bold: true,
    color: opts.dark ? "64748B" : THEME.color.slate400,
    align: "center",
    valign: "middle",
    charSpacing: THEME.tracking.eyebrow * 25,
  })
}

/** Grid de specs con iconos — adapta tamaño a celda */
function drawSpecsGrid(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  proyecto: ProyectoPuente,
  textColor = THEME.color.slate950Text,
  labelColor?: string,
) {
  const cellW = w / 2
  const cellH = h / 3
  const labelSize = cellH < 0.35 ? 7 : 9
  const labelH = cellH < 0.35 ? 0.14 : 0.18
  const valueSize = cellH < 0.35 ? 12 : cellH < 0.5 ? 14 : 18
  const valueSizeLong = cellH < 0.35 ? 9 : cellH < 0.5 ? 10 : 11

  const items = [
    { label: "LONGITUD", value: proyecto.longitud },
    { label: "ANCHO", value: proyecto.ancho },
    { label: "PESO ESTRUCTURA", value: proyecto.peso },
    { label: "LUZ MÁX.", value: proyecto.luzMax },
    { label: "MATERIAL", value: proyecto.material },
    { label: "DISEÑO", value: proyecto.diseno },
  ]
  items.forEach((item, i) => {
    const cx = x + (i % 2) * cellW
    const cy = y + Math.floor(i / 2) * cellH
    const isLong = item.value.length > 22
    const icon = SPECS_ICONS[item.label] || ""
    const labelWithIcon = icon ? `${icon}  ${item.label}` : item.label
    slide.addText(labelWithIcon, {
      x: cx,
      y: cy,
      w: cellW - 0.1,
      h: labelH,
      fontSize: labelSize,
      fontFace: THEME.font.body,
      bold: true,
      color: labelColor || THEME.color.slate400,
      charSpacing: THEME.tracking.label * 25,
      valign: "top",
    })
    slide.addText(item.value, {
      x: cx,
      y: cy + labelH + 0.02,
      w: cellW - 0.1,
      h: cellH - labelH - 0.05,
      fontSize: isLong ? valueSizeLong : valueSize,
      fontFace: isLong ? THEME.font.body : THEME.font.display,
      color: textColor,
      bold: true,
      valign: "top",
    })
  })
}

// ============================================================
// 1. PORTADA — DARK editorial brutalist
// ============================================================
export function drawPortada(pres: PptxGenJS, _: PptxGenJS) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }

  // Foto a sangre full-bleed
  slide.addImage({
    path: "https://storage.googleapis.com/meisa-imagenes/projects/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp",
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    sizing: { type: "cover", w: 13.333, h: 7.5 },
  })
  // Overlay gradient sólido oscuro abajo (simulado con shape semi-transparente — pptxgenjs limitado, usamos rect oscuro)
  slide.addShape("rect", {
    x: 0,
    y: 4.0,
    w: 13.333,
    h: 3.5,
    fill: { color: THEME.color.slate950, transparency: 30 } as any,
    line: { color: THEME.color.slate950, width: 0 },
  })

  // Logo MEISA arriba der
  slide.addImage({
    path: ASSETS.logoWhite,
    x: 11.0,
    y: 0.4,
    w: 1.8,
    h: 0.8,
    sizing: { type: "contain", w: 1.8, h: 0.8 },
  })

  // Eyebrow
  slide.addText("PORTAFOLIO", {
    x: 0.6,
    y: 4.7,
    w: 6,
    h: 0.4,
    fontSize: 14,
    fontFace: THEME.font.body,
    bold: true,
    color: "FFFFFF",
    charSpacing: THEME.tracking.eyebrow * 30,
  })

  // Título mega
  slide.addText("PUENTES", {
    x: 0.6,
    y: 5.1,
    w: 9,
    h: 1.6,
    fontSize: 130,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })

  // Año en rojo (acento de máxima prioridad)
  slide.addText("2026", {
    x: 0.6,
    y: 6.8,
    w: 4,
    h: 0.6,
    fontSize: 28,
    fontFace: THEME.font.display,
    color: THEME.color.rojo,
    bold: true,
    charSpacing: 100,
    valign: "top",
  })
}

// ============================================================
// 2. STATS GLOBALES — DARK split: texto izq + foto der + stats abajo
// ============================================================
export function drawStats(pres: PptxGenJS, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }
  drawHeader(slide, pageNumber, true)
  drawFooter(slide, true)

  // Foto a la derecha (split editorial 60/40)
  slide.addImage({
    path: FOTOS_NARRATIVAS.statsLateral,
    x: 7.5,
    y: 0.85,
    w: 5.33,
    h: 4.2,
    sizing: { type: "cover", w: 5.33, h: 4.2 },
  })

  // Eyebrow
  drawEyebrow(slide, "TRAYECTORIA EN ACERO", 0.5, 1.0, 7, true)

  // Título 2 líneas brutalist
  slide.addText("TREINTA", {
    x: 0.5,
    y: 1.4,
    w: 7,
    h: 1.0,
    fontSize: 88,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })
  slide.addText("AÑOS", {
    x: 0.5,
    y: 2.3,
    w: 7,
    h: 1.0,
    fontSize: 88,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })
  slide.addText("EN OBRA.", {
    x: 0.5,
    y: 3.2,
    w: 7,
    h: 1.0,
    fontSize: 88,
    fontFace: THEME.font.display,
    color: "94A3B8",
    bold: true,
    valign: "top",
  })

  // 4 columnas de stats abajo (full width)
  const stats = [
    { num: STATS_GLOBAL.anios, suf: "+", label: "AÑOS DESDE 1996" },
    { num: STATS_GLOBAL.proyectos, suf: "+", label: "PROYECTOS ENTREGADOS" },
    { num: STATS_GLOBAL.toneladas, suf: "+", label: "TONELADAS DE ACERO" },
    { num: STATS_GLOBAL.puentes, suf: "+", label: "PUENTES CONSTRUIDOS" },
  ]
  const colW = 12.33 / 4
  const colY = 5.4
  // Línea horizontal sobre los stats
  slide.addShape("line", {
    x: 0.5,
    y: colY - 0.15,
    w: 12.33,
    h: 0,
    line: { color: "FFFFFF", width: 0.5 },
  })
  stats.forEach((s, i) => {
    const cx = 0.5 + i * colW
    if (i > 0) {
      slide.addShape("line", {
        x: cx - 0.05,
        y: colY,
        w: 0,
        h: 1.4,
        line: { color: "FFFFFF", width: 0.3 },
      })
    }
    slide.addText(
      [
        { text: s.num, options: { fontSize: 56, color: "FFFFFF", bold: true, fontFace: THEME.font.display } },
        { text: s.suf, options: { fontSize: 56, color: "94A3B8", bold: true, fontFace: THEME.font.display } },
      ],
      { x: cx + 0.1, y: colY, w: colW - 0.2, h: 0.95, valign: "top" },
    )
    slide.addText(s.label, {
      x: cx + 0.1,
      y: colY + 0.95,
      w: colW - 0.2,
      h: 0.35,
      fontSize: 9,
      fontFace: THEME.font.body,
      bold: true,
      color: "FFFFFF",
      charSpacing: THEME.tracking.eyebrow * 25,
      valign: "top",
    })
  })
}

// ============================================================
// 3. INTRO / MISIÓN — LIGHT editorial split: texto izq + foto der
// ============================================================
export function drawIntroMision(pres: PptxGenJS, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.stone50 }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto a la derecha (split editorial)
  slide.addImage({
    path: FOTOS_NARRATIVAS.introTop,
    x: 7.5,
    y: 0.85,
    w: 5.33,
    h: 5.6,
    sizing: { type: "cover", w: 5.33, h: 5.6 },
  })

  // Eyebrow
  drawEyebrow(slide, "01 — NUESTRA ESENCIA", 0.5, 1.0, 7, false)

  // Título 3 líneas
  slide.addText("DISEÑO,", {
    x: 0.5,
    y: 1.45,
    w: 7,
    h: 1.0,
    fontSize: 72,
    fontFace: THEME.font.display,
    color: THEME.color.slate950Text,
    bold: true,
    valign: "top",
  })
  slide.addText("FABRICACIÓN", {
    x: 0.5,
    y: 2.35,
    w: 7,
    h: 1.0,
    fontSize: 72,
    fontFace: THEME.font.display,
    color: THEME.color.slate950Text,
    bold: true,
    valign: "top",
  })
  slide.addText("Y MONTAJE.", {
    x: 0.5,
    y: 3.25,
    w: 7,
    h: 1.0,
    fontSize: 72,
    fontFace: THEME.font.display,
    color: THEME.color.slate300,
    bold: true,
    valign: "top",
  })

  // Lead paragraph debajo del título
  slide.addText(EMPRESA.introBody, {
    x: 0.5,
    y: 4.5,
    w: 6.8,
    h: 1.7,
    fontSize: 12,
    fontFace: THEME.font.body,
    color: THEME.color.slate700,
    valign: "top",
    lineSpacingMultiple: 1.4,
  })

  // Highlights strip abajo
  slide.addShape("line", {
    x: 0.5,
    y: 6.4,
    w: 12.33,
    h: 0,
    line: { color: THEME.color.slate200, width: 0.5 },
  })
  const highlights = [
    "FUNDADA EN POPAYÁN, 1996",
    "PLANTAS EN POPAYÁN Y CALI",
    "COBERTURA NACIONAL",
    "AWS · NSR-10",
  ]
  let hx = 0.5
  highlights.forEach((h, i) => {
    slide.addText(h, {
      x: hx,
      y: 6.55,
      w: 3,
      h: 0.4,
      fontSize: 9,
      fontFace: THEME.font.body,
      bold: true,
      color: THEME.color.slate700,
      charSpacing: THEME.tracking.eyebrow * 20,
      valign: "middle",
    })
    if (i < highlights.length - 1) {
      slide.addText("·", {
        x: hx + 2.95,
        y: 6.55,
        w: 0.15,
        h: 0.4,
        fontSize: 14,
        fontFace: THEME.font.body,
        color: THEME.color.slate400,
        align: "center",
        valign: "middle",
      })
    }
    hx += 3.1
  })
}

// ============================================================
// 4. CAPACIDADES — DARK 3 columnas con FOTO + numeración + texto
// ============================================================
export function drawCapacidades(pres: PptxGenJS, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }
  drawHeader(slide, pageNumber, true)
  drawFooter(slide, true)

  drawEyebrow(slide, "— LO QUE HACEMOS", 0.5, 1.0, 8, true)

  slide.addText("INTEGRACIÓN", {
    x: 0.5,
    y: 1.4,
    w: 12,
    h: 1.0,
    fontSize: 64,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })
  slide.addText("VERTICAL.", {
    x: 0.5,
    y: 2.15,
    w: 12,
    h: 1.0,
    fontSize: 64,
    fontFace: THEME.font.display,
    color: "94A3B8",
    bold: true,
    valign: "top",
  })

  // 3 columnas con FOTO + numerales + título + desc
  const colW = 12.33 / 3
  const fotos = [FOTOS_NARRATIVAS.capDiseno, FOTOS_NARRATIVAS.capFabricacion, FOTOS_NARRATIVAS.capMontaje]
  CAPACIDADES.forEach((c, i) => {
    const cx = 0.5 + i * colW
    // Foto cuadrada arriba de cada columna
    slide.addImage({
      path: fotos[i],
      x: cx,
      y: 3.5,
      w: colW - 0.2,
      h: 1.6,
      sizing: { type: "cover", w: colW - 0.2, h: 1.6 },
    })
    // Numeral a la izquierda del título
    slide.addText(c.numero, {
      x: cx,
      y: 5.3,
      w: 0.8,
      h: 0.6,
      fontSize: 32,
      fontFace: THEME.font.display,
      color: "FFFFFF",
      bold: true,
      valign: "middle",
    })
    // Línea horizontal corta tipo separador
    slide.addShape("line", {
      x: cx + 0.65,
      y: 5.55,
      w: 0.3,
      h: 0,
      line: { color: THEME.color.rojo, width: 1.5 },
    })
    slide.addText(c.titulo, {
      x: cx + 1.0,
      y: 5.3,
      w: colW - 1.2,
      h: 0.6,
      fontSize: 24,
      fontFace: THEME.font.display,
      color: "FFFFFF",
      bold: true,
      valign: "middle",
    })
    slide.addText(c.descripcion, {
      x: cx,
      y: 5.95,
      w: colW - 0.3,
      h: 1.0,
      fontSize: 9,
      fontFace: THEME.font.body,
      color: "94A3B8",
      valign: "top",
      lineSpacingMultiple: 1.4,
    })
  })
}

// ============================================================
// 5. TIMELINE — LIGHT split: foto izq + timeline der
// ============================================================
export function drawTimeline(pres: PptxGenJS, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.stone50 }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto a la izquierda — full alto del área de contenido
  slide.addImage({
    path: FOTOS_NARRATIVAS.timelineLateral,
    x: 0.5,
    y: 0.85,
    w: 5.0,
    h: 5.8,
    sizing: { type: "cover", w: 5.0, h: 5.8 },
  })

  // Eyebrow + título a la derecha de la foto
  drawEyebrow(slide, "— TRAYECTORIA", 5.8, 1.0, 7, false)

  slide.addText("DESDE", {
    x: 5.8,
    y: 1.4,
    w: 7,
    h: 0.9,
    fontSize: 64,
    fontFace: THEME.font.display,
    color: THEME.color.slate950Text,
    bold: true,
    valign: "top",
  })
  slide.addText("1996.", {
    x: 5.8,
    y: 2.15,
    w: 7,
    h: 0.9,
    fontSize: 64,
    fontFace: THEME.font.display,
    color: THEME.color.slate300,
    bold: true,
    valign: "top",
  })

  // Lista compacta de hitos a la derecha
  const startY = 3.5
  const rowH = 0.5
  const cx = 5.8
  TIMELINE.forEach((t, i) => {
    const ry = startY + i * rowH
    slide.addText(t.anio, {
      x: cx,
      y: ry,
      w: 1.2,
      h: rowH - 0.05,
      fontSize: 20,
      fontFace: THEME.font.display,
      color: THEME.color.rojo,
      bold: true,
      valign: "top",
    })
    slide.addText(t.titulo, {
      x: cx + 1.2,
      y: ry + 0.02,
      w: 2.5,
      h: rowH - 0.05,
      fontSize: 13,
      fontFace: THEME.font.display,
      color: THEME.color.slate950Text,
      bold: true,
      valign: "top",
    })
    slide.addText(t.desc, {
      x: cx + 3.7,
      y: ry + 0.05,
      w: 3.4,
      h: rowH - 0.05,
      fontSize: 9,
      fontFace: THEME.font.body,
      color: THEME.color.slate700,
      valign: "top",
      lineSpacingMultiple: 1.3,
    })
    // Línea divisora
    slide.addShape("line", {
      x: cx,
      y: ry + rowH - 0.05,
      w: 7.0,
      h: 0,
      line: { color: THEME.color.slate200, width: 0.4 },
    })
  })
}

// ============================================================
// 6. MAPA — DARK split: foto/mapa der + lista ciudades izq
// ============================================================
export function drawMapa(pres: PptxGenJS, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }
  drawHeader(slide, pageNumber, true)
  drawFooter(slide, true)

  // Foto a la derecha (silueta Colombia o foto de obra) — placeholder pero visual
  slide.addImage({
    path: FOTOS_NARRATIVAS.mapaFoto,
    x: 7.5,
    y: 0.85,
    w: 5.33,
    h: 6.0,
    sizing: { type: "cover", w: 5.33, h: 6.0 },
  })

  drawEyebrow(slide, "— PRESENCIA NACIONAL", 0.5, 1.0, 7, true)

  slide.addText("DE NORTE", {
    x: 0.5,
    y: 1.4,
    w: 7,
    h: 0.9,
    fontSize: 60,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
  })
  slide.addText("A SUR.", {
    x: 0.5,
    y: 2.15,
    w: 7,
    h: 0.9,
    fontSize: 60,
    fontFace: THEME.font.display,
    color: "94A3B8",
    bold: true,
    valign: "top",
  })

  // Lista de ciudades (izquierda) en una sola columna ordenada
  const startY = 3.4
  const rowH = 0.42
  UBICACIONES.forEach((u, i) => {
    const ry = startY + i * rowH
    slide.addText(u.ciudad, {
      x: 0.5,
      y: ry,
      w: 4,
      h: rowH - 0.05,
      fontSize: 14,
      fontFace: THEME.font.display,
      color: "FFFFFF",
      bold: true,
      valign: "middle",
    })
    slide.addText(`${u.proyectos} PROYECTOS`, {
      x: 4.5,
      y: ry,
      w: 2.6,
      h: rowH - 0.05,
      fontSize: 9,
      fontFace: THEME.font.body,
      bold: true,
      color: "94A3B8",
      charSpacing: THEME.tracking.eyebrow * 20,
      align: "right",
      valign: "middle",
    })
    // Línea separadora
    slide.addShape("line", {
      x: 0.5,
      y: ry + rowH - 0.05,
      w: 6.7,
      h: 0,
      line: { color: "FFFFFF", width: 0.3 },
    })
  })
}

// ============================================================
// LAYOUTS A-E — páginas de proyecto FIELES AL PDF ORIGINAL
// Fondo BLANCO (excepto E foto a sangre). Specs en texto plano "**Label:** valor".
// Bloque azul SOLO en Layout C.
// ============================================================

/** Specs en texto plano estilo PDF: "**Label:** valor" línea a línea */
function drawSpecsText(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  proyecto: ProyectoPuente,
  textColor = THEME.color.tinta,
  size = 11,
) {
  // Specs principales (Ubicación, Diseño, Luz Max, Material)
  slide.addText(
    [
      { text: "Ubicación: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.ubicacionCorta}\n`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Diseño: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.diseno}\n`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Luz Max: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.luzMax}\n`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Material: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.material}`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
    ],
    { x, y, w, h, valign: "top", lineSpacingMultiple: 1.4 },
  )
}

/** Sección "Dimensiones:" con bullets "°" (estilo PDF) */
function drawDimensiones(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  proyecto: ProyectoPuente,
  textColor = THEME.color.tinta,
  size = 11,
) {
  slide.addText(
    [
      { text: "Dimensiones:\n", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "°  ", options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Longitud: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.longitud}\n`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "°  ", options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Ancho: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: `${proyecto.ancho}\n`, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: "Peso estructura: ", options: { bold: true, color: textColor, fontFace: THEME.font.body, fontSize: size } },
      { text: proyecto.peso, options: { color: textColor, fontFace: THEME.font.body, fontSize: size } },
    ],
    { x, y, w, h, valign: "top", lineSpacingMultiple: 1.4 },
  )
}

/** Título "tipo + nombre" estilo PDF (sobre fondo claro u oscuro) */
function drawTituloProyecto(
  slide: PptxGenJS.Slide,
  p: ProyectoPuente,
  x: number,
  y: number,
  w: number,
  opts: { tipoColor?: string; nombreColor?: string; nombreSize?: number; redLine?: boolean } = {},
) {
  const tipoColor = opts.tipoColor || THEME.color.azul
  const nombreColor = opts.nombreColor || THEME.color.azul
  const nombreSize = opts.nombreSize || 56

  slide.addText(p.tipo, {
    x,
    y,
    w,
    h: 0.4,
    fontSize: 16,
    fontFace: THEME.font.display, // Bebas Neue
    color: tipoColor,
    charSpacing: 4,
    valign: "top",
  })
  slide.addText(p.nombre, {
    x,
    y: y + 0.4,
    w,
    h: 1.6,
    fontSize: nombreSize,
    fontFace: THEME.font.displayHeavy, // Archivo Black para nombres heavy como PDF
    color: nombreColor,
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.9,
  })
}

// ============================================================
// Layout A — Foto vertical hero izq + info der (PDF estilo Ovejas)
// FONDO BLANCO. Specs en texto plano. Foto secundaria centro-der + foto detalle.
// ============================================================
export function drawLayoutA(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto vertical IZQ — grande, casi full alto del área de contenido
  drawPhoto(slide, 0.5, 0.95, 5.4, 6.0, { url: p.fotos[0], label: "FOTO PRINCIPAL" })

  // Bloque título + ubicación a la derecha (split en 2: título izq + ubicación der)
  // Título "PUENTE VEHICULAR / OVEJAS"
  drawTituloProyecto(slide, p, 6.1, 1.05, 4.5, {
    tipoColor: THEME.color.azul,
    nombreColor: THEME.color.azul,
    nombreSize: 60,
  })

  // Ubicación 3 líneas a la derecha del título
  const ubicParts = p.ubicacionCorta.split(" — ")
  const linea1 = ubicParts[0] || p.ubicacionCorta
  const linea2 = ubicParts[1] || ""
  slide.addText(
    [
      { text: `${linea1}\n`, options: { fontSize: 14, fontFace: THEME.font.body, color: THEME.color.azul, bold: true } },
      { text: `${linea2}\n`, options: { fontSize: 14, fontFace: THEME.font.body, color: THEME.color.azul, bold: true } },
      { text: p.anio, options: { fontSize: 14, fontFace: THEME.font.body, color: THEME.color.azul, bold: true } },
    ],
    { x: 10.7, y: 1.1, w: 2.2, h: 1.3, valign: "top", lineSpacingMultiple: 1.2 },
  )

  // Specs en texto plano abajo del título
  drawSpecsText(slide, 6.1, 2.7, 6.7, 1.4, p, THEME.color.tinta, 11)

  // Foto secundaria HORIZONTAL centro-derecha
  drawPhoto(slide, 6.1, 4.15, 6.0, 1.85, { url: p.fotos[1] || p.fotos[0], label: "FOTO 2" })

  // Dimensiones abajo izq (debajo de specs)
  drawDimensiones(slide, 6.1, 6.05, 4.0, 1.0, p, THEME.color.tinta, 11)

  // Foto detalle pequeña abajo der
  drawPhoto(slide, 10.4, 6.05, 2.4, 1.0, { url: p.fotos[1] || p.fotos[0], label: "FOTO DETALLE" })
}

// ============================================================
// Layout B — Collage 2 fotos arriba + foto vertical der + título y specs abajo izq
// FONDO BLANCO. Estilo Cascada del PDF.
// ============================================================
export function drawLayoutB(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto vertical der full alto del área de contenido
  drawPhoto(slide, 8.7, 0.95, 4.13, 5.5, { url: p.fotos[0], label: "FOTO VERTICAL" })

  // 2 fotos arriba izq + centro
  drawPhoto(slide, 0.5, 0.95, 4.8, 2.6, { url: p.fotos[1] || p.fotos[0], label: "FOTO 1" })
  drawPhoto(slide, 5.4, 0.95, 3.2, 2.6, { url: p.fotos[1] || p.fotos[0], label: "FOTO 2" })

  // Título "PUENTE VEHICULAR / CASCADA" abajo izq
  drawTituloProyecto(slide, p, 0.5, 3.75, 4.5, {
    tipoColor: THEME.color.azul,
    nombreColor: THEME.color.azul,
    nombreSize: 50,
  })

  // Línea roja decorativa debajo del título
  slide.addShape("line", {
    x: 0.5,
    y: 5.45,
    w: 1.5,
    h: 0,
    line: { color: THEME.color.rojo, width: 2 },
  })

  // Ubicación 3 líneas debajo del título
  const ubicParts = p.ubicacionCorta.split(" — ")
  slide.addText(
    [
      { text: `${ubicParts[0] || p.ubicacionCorta}\n`, options: { fontSize: 11, color: THEME.color.tinta } },
      { text: `${ubicParts[1] || ""}\n`, options: { fontSize: 11, color: THEME.color.tinta } },
      { text: p.anio, options: { fontSize: 11, color: THEME.color.tinta } },
    ],
    { x: 0.5, y: 5.6, w: 4.0, h: 0.85, fontFace: THEME.font.body, valign: "top", lineSpacingMultiple: 1.3 },
  )

  // Specs en texto plano centro-izq
  drawSpecsText(slide, 0.5, 6.5, 4.5, 1.4, p, THEME.color.tinta, 9)

  // Sección Dimensiones a la derecha del bloque texto
  drawDimensiones(slide, 5.2, 6.5, 3.3, 1.4, p, THEME.color.tinta, 10)
}

// ============================================================
// Layout C — Bloque azul izq con título + specs/fotos derecha sobre BLANCO
// El ÚNICO layout con bloque azul (estilo Tecnoquímicas del PDF).
// ============================================================
export function drawLayoutC(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Bloque azul oscuro IZQ (~45% width, ~55% height)
  slide.addShape("rect", {
    x: 0.5,
    y: 0.95,
    w: 5.0,
    h: 3.4,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })

  // Título dentro del bloque azul
  slide.addText(p.tipo, {
    x: 0.8,
    y: 1.5,
    w: 4.4,
    h: 0.4,
    fontSize: 16,
    fontFace: THEME.font.display,
    color: THEME.color.white,
    charSpacing: 4,
    valign: "top",
  })
  slide.addText(p.nombre, {
    x: 0.8,
    y: 1.95,
    w: 4.4,
    h: 1.5,
    fontSize: 32,
    fontFace: THEME.font.displayHeavy,
    color: THEME.color.white,
    bold: true,
    valign: "top",
  })

  // Línea blanca decorativa
  slide.addShape("line", {
    x: 0.8,
    y: 3.6,
    w: 1.2,
    h: 0,
    line: { color: THEME.color.white, width: 1 },
  })
  slide.addText(`${p.ubicacionCorta} - ${p.anio}`, {
    x: 0.8,
    y: 3.7,
    w: 4.4,
    h: 0.4,
    fontSize: 12,
    fontFace: THEME.font.body,
    color: THEME.color.white,
    valign: "top",
  })

  // Specs DERECHA sobre fondo blanco (estilo PDF Tecnoquímicas)
  drawSpecsText(slide, 6.0, 1.05, 6.8, 1.6, p, THEME.color.tinta, 11)

  // Sección Dimensiones (incluida en specs en este layout — más compacto)
  slide.addText(
    [
      { text: "Dimensiones: ", options: { bold: true, fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `Longitud: ${p.longitud}, Ancho: ${p.ancho}\n`, options: { fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Peso estructura: ", options: { bold: true, fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: p.peso, options: { fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
    ],
    { x: 6.0, y: 2.7, w: 6.8, h: 1.0, valign: "top", lineSpacingMultiple: 1.4 },
  )

  // 3 fotos abajo: 2 cuadradas izq + 1 vertical der
  drawPhoto(slide, 0.5, 4.55, 3.0, 2.5, { url: p.fotos[0], label: "FOTO 1" })
  drawPhoto(slide, 3.7, 4.55, 3.0, 2.5, { url: p.fotos[1] || p.fotos[0], label: "FOTO 2" })
  drawPhoto(slide, 6.9, 4.55, 5.9, 2.5, { url: p.fotos[1] || p.fotos[0], label: "FOTO 3" })
}

// ============================================================
// Layout D — Foto panorámica + foto render + título y specs abajo izq (FONDO BLANCO)
// Estilo La Floresta del PDF.
// ============================================================
export function drawLayoutD(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto panorámica arriba izquierda
  drawPhoto(slide, 0.5, 0.95, 6.5, 2.6, { url: p.fotos[0], label: "FOTO PANORÁMICA" })

  // Foto render/detalle arriba derecha
  drawPhoto(slide, 7.2, 0.95, 5.6, 2.6, { url: p.fotos[1] || p.fotos[0], label: "FOTO RENDER" })

  // Bloque "Dimensiones:" arriba derecha (entre fotos y bloque título)
  slide.addText(
    [
      { text: "Dimensiones: ", options: { bold: true, fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `Longitud:\n${p.longitud}, Ancho: ${p.ancho}\n`, options: { fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Peso estructura: ", options: { bold: true, fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: p.peso, options: { fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta } },
    ],
    { x: 7.2, y: 3.7, w: 5.6, h: 1.2, valign: "top", lineSpacingMultiple: 1.4 },
  )

  // Foto cuadrada centro inferior
  drawPhoto(slide, 5.0, 5.0, 3.5, 2.0, { url: p.fotos[1] || p.fotos[0], label: "FOTO 3" })

  // Foto vertical lateral derecha
  drawPhoto(slide, 8.7, 5.0, 4.13, 2.0, { url: p.fotos[0], label: "FOTO 4" })

  // Bloque título abajo izquierda — más arriba para evitar superposición de la línea roja
  drawTituloProyecto(slide, p, 0.5, 3.7, 4.5, {
    tipoColor: THEME.color.azul,
    nombreColor: THEME.color.azul,
    nombreSize: 38,
  })
  // Línea roja DEBAJO del título completo
  slide.addShape("line", {
    x: 0.5,
    y: 4.95,
    w: 1.5,
    h: 0,
    line: { color: THEME.color.rojo, width: 2 },
  })
  slide.addText(`${p.ubicacionCorta} - ${p.anio}`, {
    x: 0.5,
    y: 5.05,
    w: 4.5,
    h: 0.3,
    fontSize: 11,
    fontFace: THEME.font.body,
    color: THEME.color.tinta,
  })
  // Specs principales debajo
  drawSpecsText(slide, 0.5, 5.45, 4.3, 1.5, p, THEME.color.tinta, 9)
}

// ============================================================
// Layout E — Foto a sangre + bloque BLANCO con texto azul abajo izq + 2 thumbs
// Estilo Santander de Quilichao del PDF.
// ============================================================
export function drawLayoutE(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()

  // Foto principal a sangre
  if (p.fotos[0]) {
    slide.addImage({
      path: p.fotos[0],
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
      sizing: { type: "cover", w: 13.333, h: 7.5 },
    })
  } else {
    slide.background = { color: "374151" }
  }

  // Header on-dark (texto blanco)
  drawHeader(slide, pageNumber, true)
  drawFooter(slide, true)

  // Bloque BLANCO bottom-left con texto AZUL (estilo PDF Santander)
  slide.addShape("rect", {
    x: 0.5,
    y: 4.0,
    w: 6.5,
    h: 3.05,
    fill: { color: THEME.color.white },
    line: { color: THEME.color.white, width: 0 },
  })

  // Título "PUENTE PEATONAL / SANTANDER DE QUILICHAO"
  slide.addText(p.tipo, {
    x: 0.8,
    y: 4.2,
    w: 6,
    h: 0.4,
    fontSize: 16,
    fontFace: THEME.font.display,
    color: THEME.color.azul,
    charSpacing: 4,
    valign: "top",
  })
  slide.addText(p.nombre, {
    x: 0.8,
    y: 4.6,
    w: 5,
    h: 1.4,
    fontSize: 38,
    fontFace: THEME.font.displayHeavy,
    color: THEME.color.azul,
    bold: true,
    valign: "top",
    lineSpacingMultiple: 0.95,
  })

  // Año en grande a la derecha
  slide.addText(p.anio, {
    x: 5.8,
    y: 5.65,
    w: 1.2,
    h: 0.5,
    fontSize: 22,
    fontFace: THEME.font.body,
    color: THEME.color.azul,
    align: "right",
    valign: "middle",
  })

  // Línea horizontal decorativa
  slide.addShape("line", {
    x: 0.8,
    y: 6.0,
    w: 4,
    h: 0,
    line: { color: THEME.color.tinta, width: 0.5 },
  })

  // Specs compactos
  slide.addText(
    [
      { text: "Ubicación: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `${p.ubicacionCorta}\n`, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Diseño: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `${p.diseno}\n`, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Luz Max: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `${p.luzMax}    `, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Material: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `${p.material}\n`, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Dimensiones: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: `Longitud: ${p.longitud}, Ancho: ${p.ancho}\n`, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: "Peso estructura: ", options: { bold: true, fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
      { text: p.peso, options: { fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta } },
    ],
    { x: 0.8, y: 6.15, w: 6.0, h: 0.85, valign: "top", lineSpacingMultiple: 1.3 },
  )

  // 2 fotos thumb der con borde blanco overlay
  if (p.fotos[1]) {
    slide.addImage({
      path: p.fotos[1],
      x: 8.0,
      y: 1.5,
      w: 2.5,
      h: 2.0,
      sizing: { type: "cover", w: 2.5, h: 2.0 },
    })
  }
  slide.addShape("rect", {
    x: 8.0,
    y: 1.5,
    w: 2.5,
    h: 2.0,
    fill: { type: "none" } as any,
    line: { color: THEME.color.white, width: 3 },
  })

  // Pequeño cuadrado azul decorativo
  slide.addShape("rect", {
    x: 10.7,
    y: 1.4,
    w: 0.3,
    h: 0.3,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })

  if (p.fotos[0]) {
    slide.addImage({
      path: p.fotos[0],
      x: 9.5,
      y: 4.0,
      w: 3.3,
      h: 2.3,
      sizing: { type: "cover", w: 3.3, h: 2.3 },
    })
  }
  slide.addShape("rect", {
    x: 9.5,
    y: 4.0,
    w: 3.3,
    h: 2.3,
    fill: { type: "none" } as any,
    line: { color: THEME.color.white, width: 3 },
  })
}

// ============================================================
// 12. PULL QUOTE — DARK gigante centrado
// ============================================================
export function drawPullQuote(pres: PptxGenJS) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }

  // Comilla decorativa
  slide.addText("“", {
    x: 0.5,
    y: 1.5,
    w: 2,
    h: 1.5,
    fontSize: 200,
    fontFace: THEME.font.display,
    color: THEME.color.rojo,
    bold: true,
    valign: "top",
  })

  slide.addText(PULL_QUOTE.texto, {
    x: 1.5,
    y: 2.5,
    w: 11,
    h: 3.5,
    fontSize: 56,
    fontFace: THEME.font.display,
    color: "FFFFFF",
    bold: true,
    valign: "top",
    lineSpacingMultiple: 1.0,
  })

  slide.addShape("line", {
    x: 1.5,
    y: 6.2,
    w: 1,
    h: 0,
    line: { color: THEME.color.rojo, width: 2 },
  })
  slide.addText(PULL_QUOTE.atribucion, {
    x: 1.5,
    y: 6.35,
    w: 11,
    h: 0.3,
    fontSize: 10,
    fontFace: THEME.font.body,
    bold: true,
    color: "94A3B8",
    charSpacing: THEME.tracking.eyebrow * 30,
  })
}

// ============================================================
// 13. CONTRAPORTADA — DARK con QR
// ============================================================
export function drawContraportada(pres: PptxGenJS, qrDataUri: string) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.slate950 }

  // Logo MEISA grande centrado
  slide.addImage({
    path: ASSETS.logoWhite,
    x: 4.66,
    y: 1.0,
    w: 4,
    h: 1.6,
    sizing: { type: "contain", w: 4, h: 1.6 },
  })

  // Tagline
  slide.addText(EMPRESA.tagline.toUpperCase(), {
    x: 1,
    y: 2.9,
    w: 11.3,
    h: 0.4,
    fontSize: 14,
    fontFace: THEME.font.body,
    bold: true,
    color: "94A3B8",
    align: "center",
    charSpacing: THEME.tracking.eyebrow * 30,
  })

  // Línea roja
  slide.addShape("line", {
    x: 6.16,
    y: 3.5,
    w: 1,
    h: 0,
    line: { color: THEME.color.rojo, width: 2 },
  })

  // Datos contacto centrados
  slide.addText(
    [
      { text: EMPRESA.web + "\n", options: { fontSize: 22, fontFace: THEME.font.display, color: "FFFFFF", bold: true } },
      { text: "POPAYÁN  ·  CALI  ·  COLOMBIA\n", options: { fontSize: 10, fontFace: THEME.font.body, bold: true, color: "94A3B8", charSpacing: THEME.tracking.eyebrow * 30 } },
      { text: "info@meisa.com.co\n", options: { fontSize: 12, fontFace: THEME.font.body, color: "94A3B8" } },
      { text: "+57 (2) 000 0000", options: { fontSize: 12, fontFace: THEME.font.body, color: "94A3B8" } },
    ],
    { x: 1, y: 3.8, w: 11.3, h: 1.8, align: "center" },
  )

  // QR en contraportada (esquina derecha abajo)
  slide.addImage({
    data: qrDataUri,
    x: 11.3,
    y: 5.5,
    w: 1.5,
    h: 1.5,
  })
  slide.addText("ESCANEA", {
    x: 11.3,
    y: 7.05,
    w: 1.5,
    h: 0.25,
    fontSize: 8,
    fontFace: THEME.font.body,
    bold: true,
    color: "94A3B8",
    align: "center",
    charSpacing: THEME.tracking.eyebrow * 30,
  })
}

// ============================================================
// LAYOUTS NUEVOS F-O (v11)
// ============================================================

// Layout F — Foto a sangre + overlay título grande
export function drawLayoutF(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  if (p.fotos[0]) {
    slide.addImage({ path: p.fotos[0], x: 0, y: 0, w: 13.333, h: 7.5, sizing: { type: "cover", w: 13.333, h: 7.5 } })
  } else {
    slide.background = { color: "374151" }
  }
  // Overlay oscuro abajo (mitad inferior)
  slide.addShape("rect", {
    x: 0, y: 4.0, w: 13.333, h: 3.5,
    fill: { color: "000000", transparency: 35 } as any,
    line: { color: "000000", width: 0 },
  })
  drawHeader(slide, pageNumber, true)
  drawFooter(slide, true)

  // Numeración roja
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5, y: 4.4, w: 6, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true,
    color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  slide.addText(p.tipo, {
    x: 0.5, y: 4.75, w: 8, h: 0.4,
    fontSize: 16, fontFace: THEME.font.display, color: "FFFFFF", charSpacing: 4,
  })
  slide.addText(p.nombre, {
    x: 0.5, y: 5.15, w: 12, h: 1.4,
    fontSize: 80, fontFace: THEME.font.displayHeavy, color: "FFFFFF", bold: true, valign: "top", lineSpacingMultiple: 0.95,
  })
  slide.addText(`${p.ubicacionCorta}  ·  ${p.anio}  ·  L: ${p.longitud}  ·  ${p.peso}`, {
    x: 0.5, y: 6.7, w: 12, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, color: "FFFFFF",
  })
}

// Layout G — Grid 3×2 fotos izquierda + info lateral derecha
export function drawLayoutG(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Grid 3×2 de fotos rotando
  const fotos = [p.fotos[0], p.fotos[1] || p.fotos[0], p.fotos[0], p.fotos[1] || p.fotos[0], p.fotos[0], p.fotos[1] || p.fotos[0]]
  const cellW = 2.6, cellH = 2.95, gap = 0.08
  for (let i = 0; i < 6; i++) {
    const col = i % 3, row = Math.floor(i / 3)
    drawPhoto(slide, 0.5 + col * (cellW + gap), 0.95 + row * (cellH + gap), cellW, cellH, { url: fotos[i], label: `FOTO ${i + 1}` })
  }

  // Bloque info derecha
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 8.9, y: 1.0, w: 4, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  drawTituloProyecto(slide, p, 8.9, 1.4, 4, { tipoColor: THEME.color.azul, nombreColor: THEME.color.azul, nombreSize: 38 })
  slide.addShape("line", { x: 8.9, y: 3.5, w: 1.5, h: 0, line: { color: THEME.color.rojo, width: 2 } })
  slide.addText(`${p.ubicacionCorta} · ${p.anio}`, {
    x: 8.9, y: 3.6, w: 4, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta,
  })
  drawSpecsText(slide, 8.9, 4.0, 4, 1.6, p, THEME.color.tinta, 10)
  drawDimensiones(slide, 8.9, 5.7, 4, 1.3, p, THEME.color.tinta, 10)
}

// Layout H — Panorámica top + 3 columnas abajo (Wallpaper magazine)
export function drawLayoutH(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Panorámica top — fondo azul corporativo + foto contain centrada (cubre fotos no horizontales)
  slide.addShape("rect", {
    x: 0, y: 0, w: 13.333, h: 4.2,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })
  if (p.fotos[0]) {
    // Usar 2 fotos lado a lado para cubrir mejor el área panorámica
    slide.addImage({ path: p.fotos[0], x: 0, y: 0, w: 6.667, h: 4.2, sizing: { type: "cover", w: 6.667, h: 4.2 } })
    slide.addImage({ path: p.fotos[1] || p.fotos[0], x: 6.667, y: 0, w: 6.667, h: 4.2, sizing: { type: "cover", w: 6.667, h: 4.2 } })
  } else {
    drawPhoto(slide, 0, 0, 13.333, 4.2, { label: "FOTO PANORÁMICA" })
  }

  // 3 columnas abajo
  const colY = 4.5, colW = 4.0
  // Col 1: foto secundaria
  drawPhoto(slide, 0.5, colY, colW, 2.4, { url: p.fotos[1] || p.fotos[0], label: "FOTO 2" })

  // Auto-ajuste fontSize según largo del nombre
  const nombreCleanH = p.nombre.replace(/\n/g, " ")
  const nombreSizeH = nombreCleanH.length > 12 ? 22 : nombreCleanH.length > 9 ? 28 : 36
  // Col 2: título y ubicación
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5 + colW + 0.3, y: colY, w: colW, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  slide.addText(p.tipo, {
    x: 0.5 + colW + 0.3, y: colY + 0.35, w: colW, h: 0.3,
    fontSize: 13, fontFace: THEME.font.display, color: THEME.color.azul, charSpacing: 4,
  })
  slide.addText(nombreCleanH, {
    x: 0.5 + colW + 0.3, y: colY + 0.7, w: colW, h: 1.4,
    fontSize: nombreSizeH, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, valign: "top",
  })
  slide.addText(`${p.ubicacionCorta}\n${p.anio}`, {
    x: 0.5 + colW + 0.3, y: colY + 2.1, w: colW, h: 0.6,
    fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta, lineSpacingMultiple: 1.3,
  })

  // Col 3: specs + dimensiones
  drawSpecsText(slide, 0.5 + 2 * (colW + 0.3), colY, colW, 1.4, p, THEME.color.tinta, 9)
  drawDimensiones(slide, 0.5 + 2 * (colW + 0.3), colY + 1.4, colW, 1.0, p, THEME.color.tinta, 9)
}

// Layout I — Asymmetric 60/40 (foto grande izq + columna estrecha der)
export function drawLayoutI(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto grande izq 60% del slide
  drawPhoto(slide, 0.5, 0.95, 7.5, 6.0, { url: p.fotos[0], label: "FOTO PRINCIPAL" })

  // Caption pequeño debajo
  slide.addText(`${p.tipo} · ${p.nombre}`, {
    x: 0.5, y: 6.95, w: 7.5, h: 0.2,
    fontSize: 8, fontFace: THEME.font.body, color: THEME.color.slate400, charSpacing: 4,
  })

  // Numeral grande arriba der
  slide.addText(String(p.numero).padStart(2, "0"), {
    x: 8.3, y: 0.95, w: 4.5, h: 1.4,
    fontSize: 90, fontFace: THEME.font.displayHeavy, color: THEME.color.slate200, bold: true, valign: "top",
  })
  slide.addText("/ 50", {
    x: 11.5, y: 1.7, w: 1.3, h: 0.4,
    fontSize: 18, fontFace: THEME.font.display, color: THEME.color.rojo, bold: true,
  })

  // Columna derecha texto
  slide.addText(p.tipo, {
    x: 8.3, y: 2.5, w: 4.5, h: 0.3,
    fontSize: 13, fontFace: THEME.font.display, color: THEME.color.azul, charSpacing: 4,
  })
  slide.addText(p.nombre, {
    x: 8.3, y: 2.85, w: 4.5, h: 1.5,
    fontSize: 36, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, valign: "top", lineSpacingMultiple: 0.95,
  })
  slide.addShape("line", { x: 8.3, y: 4.4, w: 1.5, h: 0, line: { color: THEME.color.rojo, width: 2 } })
  slide.addText(`${p.ubicacionCorta}\n${p.anio}`, {
    x: 8.3, y: 4.55, w: 4.5, h: 0.6,
    fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta, lineSpacingMultiple: 1.3,
  })
  drawSpecsText(slide, 8.3, 5.25, 4.5, 1.0, p, THEME.color.tinta, 9)
  drawDimensiones(slide, 8.3, 6.2, 4.5, 0.8, p, THEME.color.tinta, 9)
}

// Layout J — Dúo 50/50 con título overlay cruzando
export function drawLayoutJ(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // 2 fotos 50/50 arriba (~70% alto)
  const photoH = 4.6
  if (p.fotos[0]) slide.addImage({ path: p.fotos[0], x: 0, y: 0.85, w: 6.667, h: photoH, sizing: { type: "cover", w: 6.667, h: photoH } })
  if (p.fotos[1]) slide.addImage({ path: p.fotos[1], x: 6.667, y: 0.85, w: 6.667, h: photoH, sizing: { type: "cover", w: 6.667, h: photoH } })

  // Banda blanca con overlay del título cruzando ambas fotos
  slide.addShape("rect", {
    x: 0, y: 3.0, w: 13.333, h: 1.4,
    fill: { color: "FFFFFF", transparency: 8 } as any,
    line: { color: "FFFFFF", width: 0 },
  })
  slide.addText(p.nombre, {
    x: 0, y: 3.05, w: 13.333, h: 1.3,
    fontSize: 76, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, align: "center", valign: "middle",
  })

  // Banda inferior blanca con info
  slide.addShape("rect", {
    x: 0, y: 5.45, w: 13.333, h: 1.55,
    fill: { color: THEME.color.white },
    line: { color: THEME.color.white, width: 0 },
  })
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50  ·  ${p.tipo}  ·  ${p.ubicacionCorta}  ·  ${p.anio}`, {
    x: 0.5, y: 5.6, w: 12.33, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.azul, charSpacing: THEME.tracking.eyebrow * 25,
  })
  slide.addShape("line", { x: 0.5, y: 5.95, w: 12.33, h: 0, line: { color: THEME.color.slate200, width: 0.5 } })
  // Specs en una línea horizontal
  slide.addText(
    [
      { text: "Longitud: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.longitud}    `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Ancho: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.ancho}    `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Luz Max: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.luzMax}    `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Peso: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.peso}    `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Material: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: p.material, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
    ],
    { x: 0.5, y: 6.1, w: 12.33, h: 0.4, valign: "top" },
  )
}

// Layout K — Ficha técnica + foto polaroid (técnico/sobrio)
export function drawLayoutK(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Título arriba izquierda
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5, y: 1.0, w: 6, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  drawTituloProyecto(slide, p, 0.5, 1.4, 7, { tipoColor: THEME.color.azul, nombreColor: THEME.color.azul, nombreSize: 48 })
  slide.addShape("line", { x: 0.5, y: 3.6, w: 1.5, h: 0, line: { color: THEME.color.rojo, width: 2 } })
  slide.addText(`${p.ubicacionCorta} · ${p.anio}`, {
    x: 0.5, y: 3.7, w: 7, h: 0.3,
    fontSize: 12, fontFace: THEME.font.body, color: THEME.color.tinta,
  })

  // Foto polaroid (con margen blanco simulado por borde) arriba der
  slide.addShape("rect", {
    x: 8.5, y: 0.95, w: 4.3, h: 3.6,
    fill: { color: THEME.color.white },
    line: { color: THEME.color.slate200, width: 1 },
  })
  drawPhoto(slide, 8.7, 1.15, 3.9, 3.0, { url: p.fotos[0], label: "FOTO" })
  slide.addText(p.nombre, {
    x: 8.7, y: 4.2, w: 3.9, h: 0.3,
    fontSize: 9, fontFace: THEME.font.body, bold: true, color: THEME.color.tinta, charSpacing: 4, align: "center",
  })

  // Ficha técnica grid 3×2 abajo
  const items = [
    { label: "LONGITUD", value: p.longitud },
    { label: "ANCHO", value: p.ancho },
    { label: "PESO", value: p.peso },
    { label: "LUZ MÁX.", value: p.luzMax },
    { label: "MATERIAL", value: p.material },
    { label: "DISEÑO", value: p.diseno },
  ]
  const ficY = 4.9
  const ficW = 12.33 / 3
  // Línea horizontal arriba
  slide.addShape("line", { x: 0.5, y: ficY - 0.1, w: 12.33, h: 0, line: { color: THEME.color.tinta, width: 1 } })
  items.forEach((item, i) => {
    const cx = 0.5 + (i % 3) * ficW
    const cy = ficY + Math.floor(i / 3) * 1.0
    if (i % 3 > 0) {
      slide.addShape("line", { x: cx - 0.05, y: cy, w: 0, h: 0.85, line: { color: THEME.color.slate200, width: 0.5 } })
    }
    slide.addText(item.label, {
      x: cx + 0.1, y: cy, w: ficW - 0.2, h: 0.25,
      fontSize: 8, fontFace: THEME.font.body, bold: true, color: THEME.color.slate400, charSpacing: THEME.tracking.eyebrow * 25,
    })
    const isLong = item.value.length > 22
    slide.addText(item.value, {
      x: cx + 0.1, y: cy + 0.27, w: ficW - 0.2, h: 0.6,
      fontSize: isLong ? 11 : 18, fontFace: isLong ? THEME.font.body : THEME.font.displayHeavy,
      color: THEME.color.azul, bold: true, valign: "top",
    })
  })
  // Línea horizontal abajo
  slide.addShape("line", { x: 0.5, y: ficY + 1.95, w: 12.33, h: 0, line: { color: THEME.color.tinta, width: 1 } })
}

// Layout L — Antes/Después (render vs obra)
export function drawLayoutL(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // 2 fotos lado a lado (50/50 ancho, ~55% alto)
  const photoH = 4.0, midX = 6.667
  if (p.fotos[1]) slide.addImage({ path: p.fotos[1], x: 0.5, y: 0.95, w: midX - 0.7, h: photoH, sizing: { type: "cover", w: midX - 0.7, h: photoH } })
  if (p.fotos[0]) slide.addImage({ path: p.fotos[0], x: midX + 0.2, y: 0.95, w: midX - 0.7, h: photoH, sizing: { type: "cover", w: midX - 0.7, h: photoH } })

  // Labels DISEÑO / OBRA
  slide.addText("DISEÑO", {
    x: 0.5, y: 5.05, w: midX - 0.7, h: 0.4,
    fontSize: 14, fontFace: THEME.font.display, color: THEME.color.azul, bold: true, charSpacing: 8, align: "center",
  })
  slide.addText("OBRA", {
    x: midX + 0.2, y: 5.05, w: midX - 0.7, h: 0.4,
    fontSize: 14, fontFace: THEME.font.display, color: THEME.color.azul, bold: true, charSpacing: 8, align: "center",
  })
  slide.addShape("line", { x: 0.5, y: 5.5, w: 12.33, h: 0, line: { color: THEME.color.rojo, width: 1 } })

  // Bloque info abajo
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5, y: 5.7, w: 6, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  drawTituloProyecto(slide, p, 0.5, 6.05, 7, { tipoColor: THEME.color.azul, nombreColor: THEME.color.azul, nombreSize: 28 })
  slide.addText(`${p.ubicacionCorta} · ${p.anio}`, {
    x: 0.5, y: 6.85, w: 7, h: 0.25,
    fontSize: 10, fontFace: THEME.font.body, color: THEME.color.tinta,
  })
  slide.addText(
    [
      { text: "L: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.longitud}  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "A: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.ancho}  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Peso: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.peso}  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Material: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: p.material, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
    ],
    { x: 7.5, y: 6.55, w: 5.3, h: 0.5, valign: "top" },
  )
}

// Layout M — Foto vertical centrada + textos simétricos (formal)
export function drawLayoutM(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Foto vertical centrada
  drawPhoto(slide, 4.5, 0.95, 4.333, 6.0, { url: p.fotos[0], label: "FOTO PRINCIPAL" })

  // Bloque texto izquierda (título)
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5, y: 1.5, w: 4, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  slide.addText(p.tipo, {
    x: 0.5, y: 1.9, w: 4, h: 0.4,
    fontSize: 14, fontFace: THEME.font.display, color: THEME.color.azul, charSpacing: 4,
  })
  // Auto-ajuste de fontSize según largo del nombre
  const nombreCleanM = p.nombre.replace(/\n/g, " ")
  const nombreSizeM = nombreCleanM.length > 12 ? 22 : nombreCleanM.length > 9 ? 28 : 36
  slide.addText(nombreCleanM, {
    x: 0.5, y: 2.35, w: 4, h: 2,
    fontSize: nombreSizeM, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, valign: "top", lineSpacingMultiple: 0.95,
  })
  slide.addShape("line", { x: 0.5, y: 4.5, w: 1.5, h: 0, line: { color: THEME.color.rojo, width: 2 } })
  slide.addText(`${p.ubicacionCorta}\n${p.anio}`, {
    x: 0.5, y: 4.65, w: 4, h: 0.7,
    fontSize: 11, fontFace: THEME.font.body, color: THEME.color.tinta, lineSpacingMultiple: 1.3,
  })

  // Bloque texto derecha (specs)
  drawSpecsText(slide, 9.0, 1.5, 3.83, 1.7, p, THEME.color.tinta, 10)
  slide.addShape("line", { x: 9.0, y: 3.4, w: 1.5, h: 0, line: { color: THEME.color.tinta, width: 0.5 } })
  drawDimensiones(slide, 9.0, 3.55, 3.83, 1.4, p, THEME.color.tinta, 10)
}

// Layout N — Hero + 4 thumbs detalle (case study)
export function drawLayoutN(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Hero foto top (~55% alto)
  if (p.fotos[0]) slide.addImage({ path: p.fotos[0], x: 0, y: 0.85, w: 13.333, h: 4.0, sizing: { type: "cover", w: 13.333, h: 4.0 } })

  // 4 thumbs abajo
  const tW = 2.4, tH = 1.7, tY = 5.05, gap = 0.15
  for (let i = 0; i < 4; i++) {
    drawPhoto(slide, 0.5 + i * (tW + gap), tY, tW, tH, { url: p.fotos[i % 2] || p.fotos[0], label: `DETALLE ${i + 1}` })
  }

  // Bloque info derecha (al lado de los thumbs)
  const infoX = 0.5 + 4 * (tW + gap) + 0.15
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: infoX, y: tY, w: 12.83 - infoX, h: 0.25,
    fontSize: 10, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  slide.addText(p.tipo, {
    x: infoX, y: tY + 0.3, w: 12.83 - infoX, h: 0.3,
    fontSize: 11, fontFace: THEME.font.display, color: THEME.color.azul, charSpacing: 4,
  })
  // Auto-ajuste fontSize según largo del nombre (bloque info estrecho)
  const nombreCleanN = p.nombre.replace(/\n/g, " ")
  const nombreSizeN = nombreCleanN.length > 11 ? 16 : nombreCleanN.length > 8 ? 20 : 24
  slide.addText(nombreCleanN, {
    x: infoX, y: tY + 0.6, w: 12.83 - infoX, h: 1.0,
    fontSize: nombreSizeN, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, valign: "top", lineSpacingMultiple: 0.95,
  })
  slide.addText(`${p.ubicacionCorta} · ${p.anio}`, {
    x: infoX, y: tY + 1.5, w: 12.83 - infoX, h: 0.3,
    fontSize: 9, fontFace: THEME.font.body, color: THEME.color.tinta,
  })

  // Banda inferior con specs
  slide.addShape("line", { x: 0.5, y: 6.85, w: 12.33, h: 0, line: { color: THEME.color.slate200, width: 0.5 } })
  slide.addText(
    [
      { text: "Longitud: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.longitud}  ·  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Ancho: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.ancho}  ·  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Peso: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: `${p.peso}  ·  `, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: "Material: ", options: { bold: true, fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
      { text: p.material, options: { fontSize: 10, color: THEME.color.tinta, fontFace: THEME.font.body } },
    ],
    { x: 0.5, y: 7.0, w: 12.33, h: 0.3, valign: "top" },
  )
}

// Layout O — Cita técnica gigante + foto (estadística como protagonista)
export function drawLayoutO(pres: PptxGenJS, p: ProyectoPuente, pageNumber: number) {
  const slide = pres.addSlide()
  slide.background = { color: THEME.color.white }
  drawHeader(slide, pageNumber, false)
  drawFooter(slide, false)

  // Lado izquierdo: cifra gigante
  slide.addText(`${String(p.numero).padStart(2, "0")} / 50`, {
    x: 0.5, y: 1.0, w: 6, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, bold: true, color: THEME.color.rojo, charSpacing: THEME.tracking.eyebrow * 30,
  })
  slide.addText("LONGITUD", {
    x: 0.5, y: 1.5, w: 6, h: 0.4,
    fontSize: 14, fontFace: THEME.font.display, color: THEME.color.slate400, charSpacing: 8,
  })
  // Cifra gigante (ej "188.8 m")
  slide.addText(p.longitud, {
    x: 0.5, y: 2.0, w: 6, h: 2.5,
    fontSize: 130, fontFace: THEME.font.displayHeavy, color: THEME.color.azul, bold: true, valign: "top",
  })
  slide.addShape("line", { x: 0.5, y: 4.6, w: 2, h: 0, line: { color: THEME.color.rojo, width: 3 } })

  // Lado derecho: foto
  drawPhoto(slide, 7.0, 0.95, 5.83, 5.5, { url: p.fotos[0], label: "FOTO" })

  // Banda inferior con título y datos
  slide.addShape("rect", {
    x: 0, y: 5.5, w: 13.333, h: 2.0,
    fill: { color: THEME.color.azul },
    line: { color: THEME.color.azul, width: 0 },
  })
  slide.addText(p.tipo, {
    x: 0.5, y: 5.7, w: 12.33, h: 0.3,
    fontSize: 12, fontFace: THEME.font.display, color: "C7D2FE", charSpacing: 4,
  })
  slide.addText(p.nombre, {
    x: 0.5, y: 6.05, w: 8, h: 1.0,
    fontSize: 36, fontFace: THEME.font.displayHeavy, color: THEME.color.white, bold: true, valign: "top",
  })
  slide.addText(`${p.ubicacionCorta} · ${p.anio}`, {
    x: 0.5, y: 6.95, w: 8, h: 0.3,
    fontSize: 11, fontFace: THEME.font.body, color: "C7D2FE",
  })
  // Specs compactos derecha
  slide.addText(
    [
      { text: "Ancho: ", options: { bold: true, fontSize: 10, color: "FFFFFF", fontFace: THEME.font.body } },
      { text: `${p.ancho}\n`, options: { fontSize: 10, color: "C7D2FE", fontFace: THEME.font.body } },
      { text: "Peso: ", options: { bold: true, fontSize: 10, color: "FFFFFF", fontFace: THEME.font.body } },
      { text: `${p.peso}\n`, options: { fontSize: 10, color: "C7D2FE", fontFace: THEME.font.body } },
      { text: "Material: ", options: { bold: true, fontSize: 10, color: "FFFFFF", fontFace: THEME.font.body } },
      { text: p.material, options: { fontSize: 10, color: "C7D2FE", fontFace: THEME.font.body } },
    ],
    { x: 9.0, y: 5.85, w: 3.83, h: 1.5, valign: "top", lineSpacingMultiple: 1.4 },
  )
}
