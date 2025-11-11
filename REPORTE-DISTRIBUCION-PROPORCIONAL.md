# 📊 Reporte: Distribución Proporcional de Toneladas por Año

**Fecha:** 2025-11-11
**Mejora implementada:** Distribución proporcional de proyectos multi-año

---

## 🎯 Problema Resuelto

### Problema Original:
Los proyectos que duraban múltiples años (ej: Dic 2024 → Ago 2025) contaban **todas** sus toneladas en el año de finalización, creando una impresión falsa de producción anual.

**Ejemplo:**
- Proyecto de 500 ton: Dic 2024 → Jun 2025
- **ANTES:** 0 ton en 2024, 500 ton en 2025 ❌
- **AHORA:** ~83 ton en 2024 (1 mes), ~417 ton en 2025 (6 meses) ✅

---

## 💡 Solución Implementada

### Distribución Proporcional por Meses

Cada proyecto ahora distribuye sus toneladas según los meses que estuvo activo en cada año:

**Fórmula:**
```
Toneladas en Año X = Toneladas Totales × (Meses en Año X / Meses Totales)
```

**Cálculo de meses:**
- **Primer año:** Desde mes de inicio hasta diciembre (12 - mes_inicio)
- **Años intermedios:** 12 meses completos
- **Último año:** Desde enero hasta mes de fin (mes_fin + 1)

---

## 📈 Comparación de Resultados

### Años Recientes (2024-2025)

| Año | ANTES (todo en fin) | AHORA (proporcional) | Diferencia |
|-----|---------------------|----------------------|------------|
| 2024 | 1,656 ton | **1,791 ton** | +135 ton ✅ |
| 2025 | 1,988 ton | **1,198 ton** | -790 ton ✅ |

**Explicación:** Los proyectos multi-año que terminan en 2025 ahora distribuyen sus toneladas entre ambos años según el tiempo trabajado en cada uno.

### Otros Años Beneficiados

| Año | ANTES | AHORA | Proyectos |
|-----|-------|-------|-----------|
| 2017 | 115 ton (1 proyecto) | **257 ton** (3 proyectos) | +142 ton |
| 2018 | 557 ton (3 proyectos) | **697 ton** (6 proyectos) | +140 ton |
| 2019 | 621 ton (2 proyectos) | **1,203 ton** (6 proyectos) | +582 ton |
| 2020 | 709 ton (4 proyectos) | **1,575 ton** (12 proyectos) | +866 ton |

---

## 🔍 Ejemplos Detallados

### 1. Proyecto de 3 Años: PAVCOL Estación Calle 19

**Datos:**
- Período: Ago 2023 → Sep 2025 (26 meses)
- Total: 273 toneladas

**Distribución:**
- **2023:** 53 ton (5 meses = 19%)
  - Agosto a Diciembre 2023
- **2024:** 126 ton (12 meses = 46%)
  - Todo el año 2024
- **2025:** 95 ton (9 meses = 35%)
  - Enero a Septiembre 2025

### 2. Proyecto de 2 Años: Puente OVEJAS

**Datos:**
- Período: Mayo 2024 → Dic 2025 (20 meses)
- Total: 536 toneladas

**Distribución:**
- **2024:** 214 ton (8 meses = 40%)
  - Mayo a Diciembre 2024
- **2025:** 322 ton (12 meses = 60%)
  - Todo el año 2025

### 3. Proyecto de 2 Años: MHC Estaciones Transmilenio

**Datos:**
- Período: Ene 2024 → Jun 2025 (18 meses)
- Total: 424 toneladas

**Distribución:**
- **2024:** 283 ton (12 meses = 67%)
  - Todo el año 2024
- **2025:** 141 ton (6 meses = 33%)
  - Enero a Junio 2025

---

## 🛠️ Cambios Técnicos

### Archivo Modificado

**`scripts/generar-resumenes-anio.mjs`**

#### Antes (líneas 196-206):
```javascript
// Agrupaba solo por año de finalización
proyectos.forEach(proyecto => {
  const anio = new Date(proyecto.fechaFin).getFullYear()
  proyectosPorAnio[anio].push(proyecto)
})
```

#### Ahora (líneas 196-254):
```javascript
// Distribuye proporcionalmente por años que abarca
proyectos.forEach(proyecto => {
  const yearInicio = fechaInicio.getFullYear()
  const yearFin = fechaFin.getFullYear()

  if (yearInicio === yearFin) {
    // Un solo año: asignar completo
    proyectosPorAnio[yearFin].push({
      ...proyecto,
      pesoKgProporcional: proyecto.pesoKg
    })
  } else {
    // Multi-año: distribuir proporcionalmente
    const mesesTotales = calcularMesesTotales(...)

    for (let year = yearInicio; year <= yearFin; year++) {
      const mesesEnAño = calcularMesesEnAño(...)
      const proporcion = mesesEnAño / mesesTotales

      proyectosPorAnio[year].push({
        ...proyecto,
        pesoKgProporcional: proyecto.pesoKg * proporcion,
        esMultiAnio: true
      })
    }
  }
})
```

#### Estadísticas (líneas 312-327):
```javascript
// Usa valores proporcionales
const toneladas = proyectosAnio.reduce((sum, p) =>
  sum + (p.pesoKgProporcional ? Number(p.pesoKgProporcional) / 1000 : 0), 0
)

// Cuenta proyectos únicos (multi-año se cuenta solo una vez)
const proyectosUnicos = new Set(proyectosAnio.map(p => p.id)).size
```

---

## 📝 Preguntas Frecuentes

### ¿Necesito actualizar los títulos y descripciones de los JSON?

**Respuesta:** **No es necesario** en la mayoría de los casos porque:

1. **Títulos** (`titulos-anos-propuestos.json`): Son descriptivos y generales
   - Ejemplo: "2024: Bodegas Industriales y Puentes"
   - No mencionan cifras específicas

2. **Descripciones** (`descripciones-anos-propuestas.json`): Hablan de tipos de proyectos y características, no cifras exactas
   - Ejemplo: "Año de consolidación con bodegas industriales de gran envergadura..."

**Excepción:** Si alguna descripción menciona cifras muy específicas que ahora son incorrectas, deberías actualizarla. Revisa si alguna dice cosas como "con 26 proyectos y 3,967 toneladas".

### ¿Los proyectos multi-año se cuentan múltiples veces?

**No.** La cuenta de proyectos usa `proyectosUnicos` que cuenta cada proyecto solo una vez usando su ID único.

**Ejemplo:**
- 2024: 18 proyectos (algunos son multi-año)
- 2025: 9 proyectos (algunos son multi-año)
- Un proyecto que aparece en ambos años se cuenta como **1 proyecto**, no 2

### ¿Qué pasa con proyectos sin peso (pesoKg = null)?

Se cuentan en el número de proyectos pero contribuyen 0 toneladas. Esto es correcto porque no todos los proyectos tienen datos de peso.

---

## ✅ Beneficios de esta Mejora

1. **Más preciso:** Refleja mejor la realidad productiva de cada año
2. **Más justo:** No infla artificialmente años de finalización
3. **Mejor análisis:** Permite ver capacidad productiva real por año
4. **Transparente:** Los usuarios entienden mejor el trabajo de cada período

---

## 🚀 Próximos Pasos (Opcional)

### Visualización en la UI

Podrías agregar indicadores visuales en la página de trayectoria:

1. **Badge para proyectos multi-año:**
   ```jsx
   {proyecto.esMultiAnio && (
     <span className="badge">
       Multi-año: {proyecto.añoInicio} → {proyecto.añoFin}
     </span>
   )}
   ```

2. **Tooltip con distribución:**
   ```jsx
   <Tooltip>
     <p>Este proyecto duró {mesesEnEsteAnio} meses en {año}</p>
     <p>Representa el {porcentaje}% del proyecto total</p>
   </Tooltip>
   ```

3. **Timeline visual:**
   - Mostrar una barra de tiempo para proyectos multi-año
   - Indicar qué porción corresponde a cada año

---

## 📁 Archivos de Referencia

- **Script principal:** `scripts/generar-resumenes-anio.mjs`
- **Análisis:** `ver-distribucion-proporcional.js`
- **Multi-año:** `analizar-multi-anio.js`
- **Títulos:** `scripts/titulos-anos-propuestos.json`
- **Descripciones:** `scripts/descripciones-anos-propuestas.json`

---

## 🎉 Conclusión

La distribución proporcional de toneladas proporciona una vista mucho más precisa y justa de la capacidad productiva de MEISA a través de los años. Los proyectos multi-año ahora contribuyen a cada año según el tiempo realmente trabajado en ese período.

**Antes:** Todo o nada (solo en año de fin)
**Ahora:** Proporcional y justo (según meses trabajados) ✅
