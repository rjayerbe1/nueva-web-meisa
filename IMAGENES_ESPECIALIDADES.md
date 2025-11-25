# Gestión de Imágenes en Especialidades

## Descripción

Las especialidades en las páginas de categorías ahora soportan imágenes de fondo personalizadas para cada tarjeta. Este documento explica cómo gestionar estas imágenes.

## Estructura de Datos

Las especialidades se almacenan en el campo `especialidades` (tipo JSON) en la tabla `CategoriaProyecto`. Cada especialidad tiene la siguiente estructura:

```json
{
  "id": "uuid",
  "titulo": "Estructuras de Gran Luz",
  "icono": "⚡",
  "descripcion": "Descripción de la especialidad...",
  "metricas": ["60m sin columnas", "500kg/m²"],
  "proyectosEjemplo": ["Centro Comercial X", "Bodega Y"],
  "orden": 1,
  "activo": true,
  "imagen": "https://images.unsplash.com/photo-xxx?w=800&q=80"
}
```

## Agregar Imágenes por Defecto

Para agregar imágenes por defecto a todas las especialidades existentes:

```bash
node scripts/agregar-imagenes-especialidades.js
```

Este script:
- ✅ Analiza el título de cada especialidad
- ✅ Asigna automáticamente una imagen apropiada de Unsplash
- ✅ Actualiza todas las categorías en la base de datos
- ✅ No sobrescribe imágenes existentes si ya están configuradas

## Cambiar Imágenes desde el Backend

### Opción 1: Edición Manual en la Base de Datos

1. Acceder a Prisma Studio:
   ```bash
   npm run db:studio
   ```

2. Ir a la tabla `CategoriaProyecto`

3. Buscar la categoría deseada (ej: COMERCIAL, INDUSTRIAL)

4. Editar el campo `especialidades` (JSON)

5. Modificar la URL del campo `imagen` en la especialidad deseada:
   ```json
   {
     "imagen": "https://tu-nueva-imagen.com/imagen.jpg"
   }
   ```

### Opción 2: API Endpoint (Recomendado)

Crear un endpoint API para gestionar las imágenes de especialidades:

**Endpoint:** `PUT /api/categories/[id]/especialidades`

**Body:**
```json
{
  "especialidadId": "uuid-de-la-especialidad",
  "imagen": "https://nueva-imagen.com/foto.jpg"
}
```

**Ejemplo de implementación:**

```typescript
// app/api/categories/[id]/especialidades/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { especialidadId, imagen } = await req.json()

  const categoria = await prisma.categoriaProyecto.findUnique({
    where: { id: params.id }
  })

  if (!categoria || !categoria.especialidades) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
  }

  const especialidades = categoria.especialidades as any[]
  const especialidadIndex = especialidades.findIndex(e => e.id === especialidadId)

  if (especialidadIndex === -1) {
    return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 404 })
  }

  especialidades[especialidadIndex].imagen = imagen

  await prisma.categoriaProyecto.update({
    where: { id: params.id },
    data: { especialidades }
  })

  return NextResponse.json({ success: true })
}
```

## Fuentes de Imágenes Recomendadas

### 1. Unsplash (Gratuitas y de alta calidad)
- URL: https://unsplash.com
- Búsquedas recomendadas:
  - "steel structure"
  - "metal building"
  - "industrial construction"
  - "bridge construction"
  - "warehouse interior"
  - "stadium architecture"

### 2. Pexels (Gratuitas)
- URL: https://pexels.com
- Similar a Unsplash, buena calidad

### 3. Imágenes Propias de MEISA
- Subir a Uploadcare o servicio de almacenamiento
- Usar URLs directas en el campo `imagen`

## Especificaciones de Imágenes

### Tamaño Recomendado
- **Ancho:** 800-1200px
- **Alto:** 450-800px
- **Relación de aspecto:** 16:9 o 4:3
- **Peso:** < 500KB (optimizado)

### Formato
- **Preferido:** WebP o JPEG
- **Calidad:** 80-85%

### Consideraciones de Diseño
- La imagen debe tener suficiente contraste para el texto blanco
- El overlay oscuro (`bg-black/40`) se aplica automáticamente
- Evitar imágenes con texto embebido
- Preferir composiciones centrales o simétricas

## Comportamiento del Componente

El componente `EspecialidadesTabs.tsx`:

1. **Si tiene imagen:** Usa la URL del campo `imagen` como `background-image`
2. **Si NO tiene imagen:** Genera un gradiente único basado en el índice
3. **Overlay oscuro:** Siempre se aplica para legibilidad del texto
4. **Responsive:** Las imágenes se adaptan con `bg-cover` y `bg-center`

## Ejemplos de URLs de Imágenes

```javascript
// Estructuras de gran luz
"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"

// Cubiertas metálicas
"https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80"

// Puentes
"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"

// Estructuras industriales
"https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80"
```

## Verificar Cambios

Después de actualizar las imágenes:

1. Recargar la página de categoría
2. Las tarjetas deberían mostrar las nuevas imágenes
3. El hover y estado activo funcionan igual
4. Si la imagen no carga, se mostrará el gradiente de respaldo

## Troubleshooting

### La imagen no se muestra
- ✅ Verificar que la URL sea válida y accesible
- ✅ Verificar que la URL use HTTPS (no HTTP)
- ✅ Verificar CORS si es dominio externo
- ✅ Comprobar que el campo `imagen` esté en el JSON

### La imagen se ve pixelada
- ✅ Usar URLs con parámetro `w=800` o mayor
- ✅ Verificar la resolución de la imagen original

### El texto no se lee bien
- ✅ El overlay oscuro está configurado automáticamente
- ✅ Si aún no se lee, elegir imagen con menos contraste en el centro
- ✅ Ajustar opacidad del overlay en el componente si es necesario

## Próximos Pasos

### Panel de Administración
Se recomienda crear una interfaz en el panel admin para:
- 📝 Editar especialidades visualmente
- 🖼️ Subir imágenes directamente desde el admin
- 👁️ Preview en tiempo real
- 📤 Integración con Uploadcare para subir imágenes

### Optimización Automática
- Implementar resize automático de imágenes
- Convertir a WebP automáticamente
- CDN para mejor rendimiento
