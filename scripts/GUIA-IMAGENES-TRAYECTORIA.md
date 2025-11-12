# 📸 Guía de Imágenes en Trayectoria

## 🎯 Descripción General

Hay **DOS TIPOS** de imágenes en el sistema de trayectoria, cada una con un propósito diferente:

---

## 1️⃣ IMÁGENES DE PROYECTO INDIVIDUAL

### 📍 Ubicación en Base de Datos
- **Tabla**: `ProyectoHojaVida`
- **Campo**: `imagenes` (array JSON de URLs)

### 🎨 Dónde se agregan/editan
```
http://localhost:3000/admin/trayectoria
→ Click en un proyecto específico
→ Botón "Editar"
→ Sección "Imágenes del Proyecto"
```

### 👁️ Dónde se visualizan en el frontend
```
http://localhost:3000/trayectoria
→ Click en cualquier proyecto de la línea de tiempo
→ Se abre un MODAL con carrusel de imágenes
```

### ✨ Características
- ✅ Ilimitadas imágenes por proyecto
- ✅ Navegación con flechas y puntos
- ✅ Contador de imágenes (ej: "2/3")
- ✅ Se muestran SOLO al hacer clic en el proyecto

### 📝 Cuándo usar
- Para mostrar fotos específicas de cada proyecto
- Fotos del proceso de construcción
- Resultados finales del proyecto
- Detalles técnicos visuales

---

## 2️⃣ IMÁGENES DESTACADAS DE AÑO

### 📍 Ubicación en Base de Datos
- **Tabla**: `ResumenAnio`
- **Campo**: `imagenesFeatured` (array JSON de URLs, máximo 4)

### 🎨 Dónde se agregan/editan
```
http://localhost:3000/admin/trayectoria/resumenes
→ Click en "Editar" de cualquier año
→ Sección "Imágenes Destacadas (máximo 4)"
→ Usar ImageUploader
```

### 👁️ Dónde se visualizan en el frontend
```
http://localhost:3000/trayectoria
→ Se muestran directamente en la LÍNEA DE TIEMPO
→ Aparecen en una tarjeta de "Resumen del Año"
→ Formato: Collage de 1-4 imágenes
```

### ✨ Características
- ⚠️ Máximo 4 imágenes por año
- ✅ Se muestran como collage (grid adaptativo)
- ✅ Visibles SIN necesidad de hacer clic
- ✅ Incluye título, descripción y categorías del año

### 📝 Cuándo usar
- Para años con pocos proyectos (menos de 3)
- Para destacar los proyectos más importantes del año
- Para crear impacto visual en la línea de tiempo
- Para años que quieres resaltar visualmente

---

## 🎯 MEJOR PRÁCTICA RECOMENDADA

### Estrategia Híbrida (Recomendada)

#### Para Proyectos Destacados del Año:
1. **Subir imágenes a nivel de proyecto individual** (`ProyectoHojaVida.imagenes`)
2. **Reutilizar las mejores 1-4 imágenes** en el resumen del año (`ResumenAnio.imagenesFeatured`)

#### Para Proyectos Normales:
- Solo subir imágenes a nivel de proyecto individual
- El usuario las verá al hacer clic en el proyecto

### Ejemplo Práctico: Año 2025

```
🏗️ Proyecto: Dollar City Mazuren
   📁 Imágenes del proyecto (5 fotos):
      - dollarcity-exterior.jpg
      - dollarcity-construccion.jpg
      - dollarcity-estructura.jpg
      - dollarcity-interior.jpg
      - dollarcity-terminado.jpg

🎨 Resumen Año 2025:
   📁 Imágenes destacadas (4 fotos seleccionadas):
      - dollarcity-terminado.jpg  ← La mejor foto del proyecto
      - dollarcity-exterior.jpg   ← Vista impresionante
      - pavcol-ciclopuente.jpg    ← De otro proyecto destacado
      - omega-edificio.jpg        ← De otro proyecto destacado
```

---

## 🔧 WORKFLOW RECOMENDADO

### Paso 1: Cargar imágenes de proyectos individuales
```bash
1. Ir a: /admin/trayectoria
2. Editar cada proyecto
3. Subir todas las imágenes del proyecto (5-10 fotos)
4. Guardar
```

### Paso 2: Crear resumen visual del año
```bash
1. Ir a: /admin/trayectoria/resumenes
2. Editar el año deseado
3. Seleccionar las 4 mejores imágenes de todos los proyectos del año
4. Agregar título descriptivo (ej: "2025: Expansión Estructuras Modulares")
5. Agregar descripción breve
6. Categorías principales del año
7. Guardar
```

---

## 📊 COMPARACIÓN VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│                    LÍNEA DE TIEMPO                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ╔════════════════════════════════════╗                    │
│  ║   [2025]                            ║                    │
│  ║  ┌────┬────┐                        ║  ← ResumenAnio     │
│  ║  │ 📷 │ 📷 │  Expansión Modular     ║     (imagenesFeatured)
│  ║  ├────┼────┤  Año de crecimiento... ║     SE VE DIRECTO  │
│  ║  │ 📷 │ 📷 │  #Industrial #Retail   ║                    │
│  ║  └────┴────┘                        ║                    │
│  ╚════════════════════════════════════╝                    │
│                                                             │
│  • Dollar City Mazuren                     ← Click aquí    │
│  • Dollar City Chapinero                                   │
│  • Dollar City Rio Negro                                   │
│                                                             │
│         MODAL (al hacer click) ─────────►                  │
│         ┌──────────────────────┐                           │
│         │  ⬅️  [ 📷 ] ➡️         │  ← Proyecto Individual   │
│         │  Dollar City Mazuren │     (imagenes)           │
│         │  Imagen 1/5          │     Solo al CLICK        │
│         │  • • • ○ •           │                           │
│         └──────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ VENTAJAS DE ESTE SISTEMA

### Imágenes de Proyecto (ProyectoHojaVida.imagenes)
✅ Usuario decide cuándo ver las imágenes
✅ No satura visualmente la línea de tiempo
✅ Permite muchas imágenes por proyecto
✅ Mejor experiencia con carrusel interactivo

### Imágenes Destacadas de Año (ResumenAnio.imagenesFeatured)
✅ Impacto visual inmediato
✅ Destaca años importantes
✅ Rellena espacios en años con pocos proyectos
✅ Cuenta la historia del año de un vistazo

---

## 🚀 EJEMPLO DE USO: Año 2025

### Base de Datos Actual
```json
{
  "proyectos": [
    {
      "id": "cmhunrt1n00033olse4cbp4a4",
      "entidadContratante": "Dollar City",
      "objetoContrato": "Dollar City Mazuren",
      "imagenes": [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
      ]
    }
  ],
  "resumenAnio": {
    "anio": 2025,
    "titulo": "2025: Expansión de Estructuras Modulares",
    "descripcion": "Un año de crecimiento con proyectos Dollar City...",
    "imagenesFeatured": [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
    ]
  }
}
```

### URLs para Gestión
```
Admin Panel:
├─ Proyectos: http://localhost:3000/admin/trayectoria
├─ Resúmenes: http://localhost:3000/admin/trayectoria/resumenes
└─ Editar Proyecto: http://localhost:3000/admin/trayectoria/[id]

Frontend:
└─ Ver Trayectoria: http://localhost:3000/trayectoria
```

---

## 💡 CASOS DE USO

### Caso 1: Año con muchos proyectos (2024)
- **NO usar** ResumenAnio.imagenesFeatured
- **Usar solo** imágenes en proyectos individuales
- La línea de tiempo muestra lista de proyectos sin saturar

### Caso 2: Año con pocos proyectos (2010)
- **Usar** ResumenAnio.imagenesFeatured (2-4 imágenes)
- **También** agregar imágenes en proyectos individuales
- El resumen visual compensa la falta de proyectos

### Caso 3: Año MUY importante (2015)
- **Usar** ResumenAnio.imagenesFeatured con las 4 mejores fotos
- **Agregar** descripción impactante
- **Incluir** imágenes detalladas en cada proyecto
- Máximo impacto visual y contenido

---

## 🔥 TIPS PROFESIONALES

1. **Calidad sobre cantidad**: Mejor 3 fotos excelentes que 10 mediocres
2. **Reutiliza las mejores**: Usa las fotos destacadas del proyecto en el resumen del año
3. **Consistencia visual**: Mantén un estilo similar en las fotos del año
4. **Contexto**: Las imágenes del resumen deben representar el año completo
5. **Balance**: No todos los años necesitan ResumenAnio con imágenes

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Subir imágenes a proyectos destacados del 2025
- [ ] Crear ResumenAnio para 2025
- [ ] Seleccionar 4 mejores imágenes para ResumenAnio
- [ ] Escribir título y descripción impactante
- [ ] Agregar categorías relevantes
- [ ] Revisar en frontend: http://localhost:3000/trayectoria
- [ ] Verificar que el carrusel funciona en proyectos individuales
- [ ] Verificar que el collage se ve bien en el ResumenAnio

---

**Última actualización**: 2025-11-11
**Sistema**: MEISA Trayectoria v2.0
