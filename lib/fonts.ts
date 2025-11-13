/**
 * Sistema de Gestión de Fuentes
 * Fuentes de Google Fonts organizadas por categoría
 */

export interface FontFamily {
  name: string
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
  variants?: string[] // 'regular', '700', 'italic', etc.
  googleFont?: boolean // Si viene de Google Fonts
}

// Fuentes del sistema (siempre disponibles)
export const SYSTEM_FONTS: FontFamily[] = [
  { name: 'Arial', category: 'sans-serif' },
  { name: 'Helvetica', category: 'sans-serif' },
  { name: 'Times New Roman', category: 'serif' },
  { name: 'Georgia', category: 'serif' },
  { name: 'Courier New', category: 'monospace' },
  { name: 'Verdana', category: 'sans-serif' },
  { name: 'Tahoma', category: 'sans-serif' },
  { name: 'Trebuchet MS', category: 'sans-serif' },
]

// Fuentes populares de Google Fonts
export const GOOGLE_FONTS: FontFamily[] = [
  // Sans-Serif (las más populares y versátiles)
  { name: 'Inter', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'Roboto', category: 'sans-serif', variants: ['300', 'regular', '500', '700', '900'], googleFont: true },
  { name: 'Open Sans', category: 'sans-serif', variants: ['300', 'regular', '600', '700', '800'], googleFont: true },
  { name: 'Lato', category: 'sans-serif', variants: ['300', 'regular', '700', '900'], googleFont: true },
  { name: 'Montserrat', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'Poppins', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'Raleway', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'Nunito', category: 'sans-serif', variants: ['300', 'regular', '600', '700', '800'], googleFont: true },
  { name: 'Ubuntu', category: 'sans-serif', variants: ['300', 'regular', '500', '700'], googleFont: true },
  { name: 'Work Sans', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700'], googleFont: true },
  { name: 'Rubik', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700'], googleFont: true },
  { name: 'Manrope', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'DM Sans', category: 'sans-serif', variants: ['regular', '500', '700'], googleFont: true },
  { name: 'Barlow', category: 'sans-serif', variants: ['300', 'regular', '500', '600', '700'], googleFont: true },

  // Serif (elegantes y profesionales)
  { name: 'Merriweather', category: 'serif', variants: ['300', 'regular', '700', '900'], googleFont: true },
  { name: 'Playfair Display', category: 'serif', variants: ['regular', '500', '600', '700', '800'], googleFont: true },
  { name: 'Lora', category: 'serif', variants: ['regular', '500', '600', '700'], googleFont: true },
  { name: 'PT Serif', category: 'serif', variants: ['regular', '700'], googleFont: true },
  { name: 'Crimson Text', category: 'serif', variants: ['regular', '600', '700'], googleFont: true },
  { name: 'EB Garamond', category: 'serif', variants: ['regular', '500', '600', '700'], googleFont: true },
  { name: 'Cormorant Garamond', category: 'serif', variants: ['300', 'regular', '500', '600', '700'], googleFont: true },
  { name: 'Libre Baskerville', category: 'serif', variants: ['regular', '700'], googleFont: true },

  // Display (para títulos y destacados)
  { name: 'Oswald', category: 'display', variants: ['300', 'regular', '500', '600', '700'], googleFont: true },
  { name: 'Bebas Neue', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Anton', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Righteous', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Archivo Black', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Fredoka One', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Abril Fatface', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Lobster', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Pacifico', category: 'display', variants: ['regular'], googleFont: true },
  { name: 'Bangers', category: 'display', variants: ['regular'], googleFont: true },

  // Handwriting (elegantes y personales)
  { name: 'Dancing Script', category: 'handwriting', variants: ['regular', '500', '600', '700'], googleFont: true },
  { name: 'Parisienne', category: 'handwriting', variants: ['regular'], googleFont: true },
  { name: 'Great Vibes', category: 'handwriting', variants: ['regular'], googleFont: true },
  { name: 'Satisfy', category: 'handwriting', variants: ['regular'], googleFont: true },
  { name: 'Kaushan Script', category: 'handwriting', variants: ['regular'], googleFont: true },

  // Monospace (para código y datos técnicos)
  { name: 'Roboto Mono', category: 'monospace', variants: ['300', 'regular', '500', '700'], googleFont: true },
  { name: 'Source Code Pro', category: 'monospace', variants: ['300', 'regular', '600', '700'], googleFont: true },
  { name: 'Fira Code', category: 'monospace', variants: ['300', 'regular', '500', '700'], googleFont: true },
  { name: 'JetBrains Mono', category: 'monospace', variants: ['300', 'regular', '500', '700'], googleFont: true },
  { name: 'IBM Plex Mono', category: 'monospace', variants: ['300', 'regular', '600', '700'], googleFont: true },
]

// Todas las fuentes disponibles
export const ALL_FONTS = [...SYSTEM_FONTS, ...GOOGLE_FONTS]

/**
 * Carga una fuente de Google Fonts dinámicamente
 */
export function loadGoogleFont(fontName: string, variants: string[] = ['regular']): void {
  // Evitar cargar la misma fuente múltiples veces
  const id = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) {
    console.log(`✅ Fuente "${fontName}" ya está cargada`)
    return
  }

  // Construir URL de Google Fonts
  const family = fontName.replace(/\s+/g, '+')
  const weights = variants
    .map(v => {
      if (v === 'regular') return '400'
      if (v === 'italic') return '400i'
      return v
    })
    .join(',')

  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`

  // Crear elemento link
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = url
  link.onload = () => console.log(`✅ Fuente "${fontName}" cargada desde Google Fonts`)
  link.onerror = () => console.error(`❌ Error cargando fuente "${fontName}"`)

  document.head.appendChild(link)
}

/**
 * Carga todas las fuentes de Google Fonts en una sola petición
 * Más eficiente que cargar fuentes individualmente
 */
export function loadAllGoogleFonts(): void {
  console.log('📦 Precargando TODAS las fuentes de Google Fonts...')

  // Evitar cargar múltiples veces
  if (document.getElementById('all-google-fonts')) {
    console.log('✅ Fuentes ya están cargadas')
    return
  }

  // Construir URL con todas las fuentes en una sola petición
  const families = GOOGLE_FONTS.map(font => {
    const family = font.name.replace(/\s+/g, '+')
    const weights = font.variants
      ?.map(v => {
        if (v === 'regular') return '400'
        if (v === 'italic') return '400i'
        return v
      })
      .join(';') || '400'

    return `family=${family}:wght@${weights}`
  }).join('&')

  const url = `https://fonts.googleapis.com/css2?${families}&display=swap`

  // Crear elemento link único para todas las fuentes
  const link = document.createElement('link')
  link.id = 'all-google-fonts'
  link.rel = 'stylesheet'
  link.href = url
  link.onload = () => {
    console.log(`✅ ${GOOGLE_FONTS.length} fuentes de Google Fonts cargadas exitosamente`)
  }
  link.onerror = () => console.error('❌ Error cargando fuentes de Google Fonts')

  document.head.appendChild(link)
}

/**
 * Carga fuentes bajo demanda
 */
export function loadFontOnDemand(fontName: string): void {
  const font = ALL_FONTS.find(f => f.name === fontName)

  if (!font) {
    console.warn(`⚠️ Fuente "${fontName}" no encontrada`)
    return
  }

  if (font.googleFont && font.variants) {
    loadGoogleFont(fontName, font.variants)
  }
}

/**
 * Obtener fuentes por categoría
 */
export function getFontsByCategory(category: string): FontFamily[] {
  return ALL_FONTS.filter(f => f.category === category)
}

/**
 * Buscar fuentes por nombre
 */
export function searchFonts(query: string): FontFamily[] {
  const q = query.toLowerCase()
  return ALL_FONTS.filter(f => f.name.toLowerCase().includes(q))
}

/**
 * Obtener nombres de todas las fuentes (para selector)
 */
export function getAllFontNames(): string[] {
  return ALL_FONTS.map(f => f.name)
}

/**
 * Obtener fuentes agrupadas por categoría (para UI)
 */
export function getFontsGroupedByCategory() {
  return {
    'Sistema': SYSTEM_FONTS,
    'Sans-Serif': GOOGLE_FONTS.filter(f => f.category === 'sans-serif'),
    'Serif': GOOGLE_FONTS.filter(f => f.category === 'serif'),
    'Display': GOOGLE_FONTS.filter(f => f.category === 'display'),
    'Handwriting': GOOGLE_FONTS.filter(f => f.category === 'handwriting'),
    'Monospace': GOOGLE_FONTS.filter(f => f.category === 'monospace'),
  }
}

/**
 * Cargar fuente personalizada usando @font-face
 */
export function loadCustomFont(fontFamily: string, fontUrl: string, format: string): void {
  // Evitar cargar la misma fuente múltiples veces
  const id = `custom-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) {
    console.log(`✅ Fuente personalizada "${fontFamily}" ya está cargada`)
    return
  }

  // Determinar el formato correcto para @font-face
  let fontFormat = format
  if (format === 'ttf') fontFormat = 'truetype'
  else if (format === 'otf') fontFormat = 'opentype'

  // Crear elemento style con @font-face
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${fontUrl}') format('${fontFormat}');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `

  document.head.appendChild(style)
  console.log(`✅ Fuente personalizada "${fontFamily}" cargada desde ${fontUrl}`)
}

/**
 * Obtener todas las fuentes personalizadas desde la API
 */
export async function getCustomFonts(): Promise<FontFamily[]> {
  try {
    const response = await fetch('/api/fonts/upload')
    if (!response.ok) {
      throw new Error('Error al obtener fuentes personalizadas')
    }

    const data = await response.json()
    const customFonts = data.fonts || []

    return customFonts.map((font: any) => ({
      name: font.fontFamily,
      category: font.category?.toLowerCase() as any || 'sans-serif',
      googleFont: false
    }))
  } catch (error) {
    console.error('❌ Error obteniendo fuentes personalizadas:', error)
    return []
  }
}

/**
 * Cargar todas las fuentes personalizadas guardadas
 */
export async function loadAllCustomFonts(): Promise<void> {
  try {
    const response = await fetch('/api/fonts/upload')
    if (!response.ok) {
      throw new Error('Error al obtener fuentes personalizadas')
    }

    const data = await response.json()
    const customFonts = data.fonts || []

    console.log(`📦 Cargando ${customFonts.length} fuentes personalizadas...`)

    // Cargar todas las fuentes en paralelo
    const loadPromises = customFonts.map((font: any) => {
      return new Promise<void>((resolve) => {
        loadCustomFont(font.fontFamily, font.fileUrl, font.fileFormat)
        // Dar un pequeño tiempo para que se cargue
        setTimeout(() => resolve(), 100)
      })
    })

    await Promise.all(loadPromises)
    console.log(`✅ ${customFonts.length} fuentes personalizadas cargadas`)
  } catch (error) {
    console.error('❌ Error cargando fuentes personalizadas:', error)
  }
}

/**
 * Precargar fuentes críticas para el dropdown
 * Usa preload para mayor prioridad
 */
export function preloadCriticalFonts(): void {
  const criticalFonts = [
    'Inter',
    'Roboto',
    'Montserrat',
    'Poppins',
    'Open Sans',
    'Lato',
    'Merriweather',
    'Playfair Display'
  ]

  criticalFonts.forEach(fontName => {
    const font = GOOGLE_FONTS.find(f => f.name === fontName)
    if (font && font.variants) {
      const family = fontName.replace(/\s+/g, '+')
      const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`

      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      link.onload = function() {
        // @ts-ignore
        this.onload = null
        // @ts-ignore
        this.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    }
  })

  console.log('⚡ Fuentes críticas precargadas con prioridad alta')
}
