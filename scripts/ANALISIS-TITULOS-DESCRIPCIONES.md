# Análisis de Títulos y Descripciones por Año - MEISA

**Fecha de análisis:** 2025-11-11
**Años analizados:** 1996 - 2025 (29 años)

## Metodología

Se analizó el archivo `REPORTE-ANOS-COMPLETO.txt` que contiene información detallada de todos los proyectos de MEISA organizados por año. Para cada año se extrajo:

- **Principales clientes:** Empresas y entidades más destacadas
- **Ubicaciones principales:** Ciudades y departamentos con mayor actividad
- **Tipos de proyecto:** Categorías de infraestructura desarrollada

## Criterios para Títulos

Los títulos se diseñaron para:
- ✅ Mencionar tipos de proyectos específicos (puentes, coliseos, bodegas, etc.)
- ✅ Incluir ubicaciones clave cuando son relevantes
- ✅ Destacar clientes importantes
- ❌ NO incluir números, estadísticas, cantidades

## Criterios para Descripciones

Las descripciones se diseñaron para:
- ✅ 2-3 oraciones descriptivas
- ✅ Mencionar tipos específicos de proyectos y sus características
- ✅ Destacar clientes importantes y su sector
- ✅ Incluir ubicaciones geográficas relevantes
- ✅ Describir el impacto o enfoque del año
- ❌ NO incluir números de proyectos, toneladas, m², departamentos

## Ejemplos Destacados

### Año 1996 (Inicio)
**Título:** "Inicio en Estructuras Industriales en Pasto"
**Descripción:** "MEISA inició operaciones con la construcción de estructuras metálicas y cubiertas para plantas industriales, destacándose con el proyecto de Friesland Colombia en Pasto. Este año marcó el comienzo de nuestra experiencia en el sector industrial del suroccidente colombiano."

### Año 2011 (Transmilenio)
**Título:** "Puentes Peatonales en Cali y Proyectos COMFACAUCA"
**Descripción:** "Alta actividad con puentes peatonales de Transmilenio en la Autopista Sur de Cali, múltiples cubiertas para COMFACAUCA en Popayán, y el Centro Comercial Único en Pasto. Consolidación en infraestructura de transporte masivo y proyectos para cajas de compensación."

### Año 2020 (Pandemia)
**Título:** "Tecnoquímicas y Proyectos durante la Pandemia"
**Descripción:** "Durante la pandemia, continuidad con Tecnoquímicas en Cali y Jamundí, edificios corporativos, bodegas para Propal y la estación de bomberos en Popayán. Resiliencia y adaptación manteniendo operaciones en proyectos esenciales de salud e infraestructura crítica."

### Año 2025 (Actual)
**Título:** "Dollar City, MHC y Puentes en Bogotá"
**Descripción:** "Proyectos en curso con Dollar City en Bogotá, PAVCOL en puentes peatonales, MHC en infraestructura de Transmilenio, e Inverteq en estructuras especializadas. Continuidad en proyectos estratégicos de transporte masivo y expansión comercial en las principales ciudades del país."

## Patrones Identificados

### Evolución por Décadas

**1996-2005:** Enfoque regional (Cauca, Valle, Nariño)
- Infraestructura deportiva y comunitaria
- Plantas industriales
- Puentes rurales

**2006-2015:** Expansión nacional
- Centros comerciales (Único, Éxito, Royal Films)
- Agroindustria (Pollos Bucanero, ingenios)
- Transporte masivo (Transmilenio)

**2016-2025:** Consolidación sectorial
- Infraestructura peatonal (PAVCOL)
- Industria farmacéutica (Tecnoquímicas)
- Agroindustria azucarera (Ingenios Providencia, Sucroal)
- Comercio nacional (Dollar City)

### Clientes Recurrentes

- **COMFACAUCA:** 2010-2013 (Escenarios deportivos y cubiertas en Popayán)
- **Pollos Bucanero:** 2014-2015 (Plantas avícolas en Villagorgona)
- **Royal Films:** 2016 (Salas de cine en varias ciudades)
- **Tecnoquímicas:** 2020-2023 (Infraestructura farmacéutica)
- **Ingenio Providencia:** 2021-2023 (Sector azucarero)
- **PAVCOL:** 2023-2025 (Puentes peatonales urbanos)
- **Dollar City:** 2024-2025 (Estructuras comerciales)

### Ubicaciones Estratégicas

- **Cali:** Centro comercial principal (Centros Comerciales Único, edificios corporativos)
- **Popayán:** Base regional histórica (Escenarios deportivos, proyectos comunitarios)
- **Bogotá:** Expansión reciente (Puentes peatonales PAVCOL, Dollar City)
- **Valle del Cauca:** Agroindustria (Ingenios, plantas procesadoras)
- **Villagorgona:** Especialización avícola (Pollos Bucanero)

## Archivos Generados

1. **titulos-anos-propuestos.json** (1.7 KB)
   - 29 títulos específicos por año
   - Formato: clave-valor (año: título)

2. **descripciones-anos-propuestas.json** (8.1 KB)
   - 29 descripciones detalladas por año
   - Formato: clave-valor (año: descripción)

## Notas de Implementación

Los archivos JSON generados pueden ser utilizados directamente en:
- Frontend de la página web (timeline histórico)
- Admin panel (edición de contenido por año)
- Marketing y comunicaciones (descripción de trayectoria)

Para importar en la aplicación:
```javascript
import titulos from '@/scripts/titulos-anos-propuestos.json'
import descripciones from '@/scripts/descripciones-anos-propuestas.json'

const yearData = {
  title: titulos[year],
  description: descripciones[year]
}
```
