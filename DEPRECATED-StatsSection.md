# ⚠️ ARCHIVO OBSOLETO - ELIMINAR

## StatsSection.tsx - DEPRECATED

**Archivo:** `components/sections/StatsSection.tsx`

**Estado:** 🗑️ **DEBE SER ELIMINADO**

**Razón:** Este componente ha sido reemplazado completamente por:
1. `StatsSectionNew.tsx` - Para estadísticas de homepage
2. `UnifiedStatsGrid` - Sistema unificado para todas las páginas

## ¿Por qué eliminar?

1. **Duplicación:** Funcionalidad ya cubierta por StatsSectionNew.tsx
2. **Inconsistencia:** No sigue el nuevo estilo visual unificado
3. **Mantenimiento:** Código redundante que confunde el sistema
4. **Performance:** Componente no utilizado que aumenta el bundle

## Pasos para eliminación:

1. ✅ Verificar que no se importe en ningún archivo
2. ✅ Confirmar que StatsSectionNew.tsx funciona correctamente
3. 🔄 Eliminar el archivo StatsSection.tsx
4. 🔄 Limpiar imports si los hay

## Verificación de uso:

```bash
# Buscar referencias al archivo obsoleto
grep -r "StatsSection" app/ --exclude="StatsSectionNew.tsx"
grep -r "StatsSection" components/ --exclude="StatsSectionNew.tsx"
```

Si no hay referencias, es seguro eliminarlo.

## Componente de reemplazo:

Use `StatsSectionNew.tsx` o `UnifiedStatsGrid` en su lugar.

```tsx
// ❌ OBSOLETO
import { StatsSection } from '@/components/sections/StatsSection'

// ✅ USAR ESTO
import { StatsSection } from '@/components/sections/StatsSectionNew'
// O
import { UnifiedStatsGrid } from '@/components/ui/unified-stats-card'
```