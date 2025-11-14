# 📝 Guía de Tipografías MEISA - Google Fonts

## 🎨 Fuentes Configuradas

### **Poppins** (Títulos y Encabezados)
- **De**: Google Fonts
- **Pesos**: 400, 600, 700, 800
- **Uso**: Títulos, headings, texto destacado
- **Características**:
  - ✅ Moderna y profesional
  - ✅ Excelente para títulos de impacto
  - ✅ Muy legible en todos los tamaños
  - ✅ Popular en sitios corporativos e industriales

### **Lato** (Cuerpo de Texto)
- **De**: Google Fonts
- **Pesos**: 300 (Light), 400 (Regular), 700 (Bold)
- **Uso**: Párrafos, textos secundarios, descripciones
- **Características**:
  - ✅ Excelente legibilidad
  - ✅ Neutral y profesional
  - ✅ Perfecta para textos largos
  - ✅ Muy usada en diseño web moderno

---

## 🎯 Por qué estas fuentes son perfectas para MEISA:

1. **Poppins** da un toque moderno y profesional sin ser demasiado agresiva
2. **Lato** es neutra y muy legible, perfecta para contenido técnico
3. Ambas son **gratis** de Google Fonts
4. **Performance óptimo** - se cargan desde CDN de Google
5. Combinación probada en miles de sitios profesionales

---

## 💡 Cómo Usar

### Opción 1: Clases de Tailwind

```jsx
// Poppins para títulos
<h1 className="font-poppins text-6xl font-bold">
  MEISA - Metálicas e Ingeniería
</h1>

// Lato para cuerpo (es el default)
<p className="text-lg">
  Más de 29 años de experiencia
</p>

// Forzar Lato explícitamente
<p className="font-lato text-base">
  Contenido del texto
</p>
```

### Opción 2: Clases de Utilidad Personalizadas

```jsx
// Título principal con Poppins Bold
<h1 className="heading-display text-6xl text-gray-900">
  PROYECTOS DESTACADOS
</h1>

// Subtítulo con Poppins Semibold
<h2 className="heading-bold text-3xl text-gray-800">
  Nuestros Servicios
</h2>

// Texto de cuerpo con Lato Regular
<p className="text-body text-base text-gray-700">
  Contenido del párrafo
</p>

// Texto ligero con Lato Light
<p className="text-light text-sm text-gray-600">
  Información secundaria
</p>
```

### Opción 3: Diferentes Pesos

```jsx
// Poppins
<h1 className="font-poppins font-normal">Normal (400)</h1>
<h2 className="font-poppins font-semibold">Semibold (600)</h2>
<h3 className="font-poppins font-bold">Bold (700)</h3>
<h4 className="font-poppins font-extrabold">Extra Bold (800)</h4>

// Lato
<p className="font-lato font-light">Light (300)</p>
<p className="font-lato font-normal">Regular (400)</p>
<p className="font-lato font-bold">Bold (700)</p>
```

---

## 📐 Jerarquía Visual Recomendada

```css
H1 (Hero) → font-poppins font-bold text-6xl lg:text-8xl
H2 (Secciones) → font-poppins font-bold text-4xl lg:text-5xl
H3 (Subsecciones) → font-poppins font-semibold text-2xl lg:text-3xl
H4 (Títulos menores) → font-poppins font-semibold text-xl
Body (Contenido) → font-lato font-normal text-base
Small (Secundario) → font-lato font-light text-sm
```

---

## 🚀 Ejemplos Prácticos

### Hero Section
```jsx
<section className="hero py-20">
  <h1 className="font-poppins font-bold text-7xl text-blue-700 mb-4">
    MEISA
  </h1>
  <p className="font-lato text-xl font-light text-gray-600">
    Construyendo el Futuro de Colombia
  </p>
  <p className="font-lato text-base text-gray-700 mt-6 max-w-2xl">
    Con más de 29 años de experiencia, somos líderes en diseño,
    fabricación y montaje de estructuras metálicas.
  </p>
</section>
```

### Card de Servicio
```jsx
<div className="service-card p-8 bg-white rounded-2xl shadow-lg">
  <h3 className="font-poppins font-semibold text-2xl text-gray-900 mb-4">
    Fabricación de Estructuras
  </h3>
  <p className="font-lato text-base text-gray-700 leading-relaxed">
    Diseño y fabricación de estructuras metálicas para todo tipo de
    proyectos industriales, comerciales y de infraestructura.
  </p>
  <button className="font-lato font-bold text-sm mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
    Ver Más
  </button>
</div>
```

### Estadística
```jsx
<div className="stat text-center">
  <p className="font-poppins font-bold text-5xl text-blue-600 mb-2">
    600+
  </p>
  <p className="font-lato font-light text-sm text-gray-600 uppercase tracking-wide">
    Toneladas por mes
  </p>
</div>
```

### Navbar
```jsx
<nav className="navbar">
  <Link href="/" className="font-poppins font-bold text-xl">
    MEISA
  </Link>
  <div className="links">
    <Link href="/servicios" className="font-lato font-medium text-base hover:text-blue-600">
      Servicios
    </Link>
    <Link href="/proyectos" className="font-lato font-medium text-base hover:text-blue-600">
      Proyectos
    </Link>
  </div>
</nav>
```

### Botones
```jsx
// Botón principal
<button className="font-lato font-bold text-base px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
  Cotizar Proyecto
</button>

// Botón secundario
<button className="font-lato font-semibold text-base px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50">
  Más Información
</button>
```

---

## ⚡ Performance

- **Optimizado automáticamente** por Next.js
- **Font-display: swap** para carga rápida
- **CDN de Google** - velocidad mundial
- **Self-hosted** - Next.js descarga y sirve las fuentes desde tu servidor
- **Sin FOUT** (Flash of Unstyled Text)

---

## 🎨 Combinaciones Recomendadas

### Para Impacto Visual
```jsx
<h1 className="font-poppins font-extrabold text-7xl tracking-tight text-blue-700">
  ESTRUCTURAS DE CLASE MUNDIAL
</h1>
```

### Para Elegancia
```jsx
<h2 className="font-poppins font-semibold text-4xl tracking-tight text-gray-900">
  Innovación en Cada Proyecto
</h2>
```

### Para Contenido Técnico
```jsx
<div className="technical-specs">
  <h3 className="font-poppins font-bold text-2xl mb-4">Especificaciones</h3>
  <p className="font-lato text-base leading-relaxed">
    Capacidad de producción: 600 toneladas/mes
    <br />
    Área de plantas: 10,400 m²
    <br />
    Equipos especializados: 8 puentes grúa
  </p>
</div>
```

---

## 📚 Recursos

- [Poppins en Google Fonts](https://fonts.google.com/specimen/Poppins)
- [Lato en Google Fonts](https://fonts.google.com/specimen/Lato)
- [Next.js Font Optimization](https://nextjs.org/docs/basic-features/font-optimization)

---

## ✅ Ventajas vs Fuentes Locales

| Aspecto | Google Fonts | Fuentes Locales |
|---------|-------------|-----------------|
| Velocidad | ⚡ CDN global | 🐌 Desde tu servidor |
| Mantenimiento | ✅ Automático | ❌ Manual |
| Optimización | ✅ Por Next.js | ⚠️ Requiere config |
| Peso | ✅ Solo las necesarias | ❌ Todas las variantes |
| Updates | ✅ Automático | ❌ Manual |

---

**¡Las fuentes ya están activas en todo el sitio!** 🎉

Lato es la fuente por defecto, y puedes usar Poppins agregando `font-poppins` a cualquier elemento.
