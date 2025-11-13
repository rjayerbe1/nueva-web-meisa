# 🔄 Guía de Sincronización de Base de Datos

Esta guía te ayudará a mantener sincronizada tu base de datos local con Neon (producción).

## 🎯 Inicio Rápido

**¿Necesitas sincronizar ahora?** Sigue estos 3 pasos:

1. **Compara todo:**
   ```bash
   node compare-all-data.mjs
   ```

2. **Si hay diferencias, ejecuta los scripts de copia necesarios:**
   ```bash
   # Para trayectoria (proyectos_hoja_vida, resumenes, config)
   node copy-data-to-neon.mjs

   # Para proyectos principales, progreso, historias, secciones
   node copy-missing-data.mjs
   ```

3. **Verifica:**
   ```bash
   node compare-all-data.mjs
   ```

✅ **Estado actual:** Base de datos COMPLETAMENTE sincronizada (2025-11-12)

---

## 📋 Scripts Disponibles

### 1. `check-db-diff.sh` - Comparar bases de datos
Compara rápidamente las tablas entre local y Neon.

```bash
./check-db-diff.sh
```

**Qué hace:**
- ✅ Muestra tablas de la base de datos local
- ✅ Muestra tablas de Neon (producción)
- ✅ Te permite ver diferencias fácilmente

---

### 2. `sync-db-to-neon.sh` - Sincronizar a producción
Sincroniza el schema de tu base de datos local a Neon.

```bash
./sync-db-to-neon.sh
```

**Qué hace:**
1. ✅ Revisa el estado actual de Neon
2. ⚠️ Pide confirmación (escribe `SI` para continuar)
3. 💾 Crea un backup de seguridad
4. 🚀 Aplica cambios del schema a Neon
5. ✅ Verifica que todo quedó bien

**IMPORTANTE:** Este script **NO copia datos**, solo actualiza la estructura (tablas, columnas, índices).

---

### 3. `compare-data.mjs` - Comparar DATOS entre local y Neon
Compara la cantidad de registros en cada tabla.

```bash
node compare-data.mjs
```

**Qué muestra:**
- ✅ Tablas con los mismos datos
- ⚠️ Tablas con diferencias (y cuántos registros faltan)
- 📋 Listado de primeros proyectos en local

---

### 4. `copy-data-to-neon.mjs` - Copiar DATOS a producción
Copia datos que faltan de local a Neon.

```bash
node copy-data-to-neon.mjs
```

**IMPORTANTE:**
- ⚠️ Solo copia datos que NO existen en Neon
- ✅ No sobrescribe datos existentes
- 📊 Muestra progreso en tiempo real
- 🔍 Verifica al final que todo quedó bien

---

### 5. `check-neon-db.mjs` - Revisar base de datos específica
Revisa en detalle una base de datos.

```bash
# Para local
node check-neon-db.mjs

# Para Neon
DATABASE_URL="postgresql://..." node check-neon-db.mjs
```

---

### 6. `compare-all-data.mjs` - Comparación completa de todas las tablas
Compara TODAS las tablas (20 tablas) entre local y Neon.

```bash
node compare-all-data.mjs
```

**Qué muestra:**
- ✅ Tabla con formato profesional
- 📊 Conteo de registros en local vs Neon
- ⚠️ Diferencias claramente marcadas
- 💡 Sugerencia de qué hacer si hay diferencias

---

### 7. `copy-missing-data.mjs` - Copiar datos faltantes específicos
Copia datos que faltan en tablas específicas (proyectos, progreso, historias, secciones).

```bash
node copy-missing-data.mjs
```

**Qué hace:**
- ✅ Copia proyectos principales faltantes (con sus imágenes)
- ✅ Copia registros de progreso
- ✅ Copia historias de proyectos
- ✅ Copia secciones de páginas
- 🔒 Maneja foreign keys correctamente
- 📊 Verifica el resultado al final

---

## 🔧 Flujo de Trabajo Recomendado

### Cuando hagas cambios en el SCHEMA (estructura):

1. **Edita** `prisma/schema.prisma`

2. **Aplica a local:**
   ```bash
   npm run db:push
   ```

3. **Compara las bases:**
   ```bash
   ./check-db-diff.sh
   ```

4. **Sincroniza schema a producción:**
   ```bash
   ./sync-db-to-neon.sh
   ```

5. **Verifica tu sitio web:**
   - Visita tu sitio en producción
   - Prueba las funcionalidades afectadas
   - Revisa los logs en Cloud Run

---

### Cuando agregues DATOS nuevos en local:

1. **Compara TODOS los datos:**
   ```bash
   node compare-all-data.mjs
   ```

2. **Si hay diferencias en trayectoria (proyectos_hoja_vida, resumenes, config):**
   ```bash
   node copy-data-to-neon.mjs
   ```

3. **Si hay diferencias en proyectos principales, progreso, historias o secciones:**
   ```bash
   node copy-missing-data.mjs
   ```

4. **Verifica que se copió bien:**
   ```bash
   node compare-all-data.mjs
   ```

5. **Prueba en tu sitio:**
   - Visita las páginas afectadas
   - Verifica que los datos aparezcan correctamente

---

## ⚠️ Precauciones

### ❌ NO hagas esto en producción:
- Eliminar tablas con datos importantes sin backup
- Cambiar tipos de columnas que pueden causar pérdida de datos
- Sincronizar sin revisar primero con `check-db-diff.sh`

### ✅ SÍ haz esto:
- Siempre prueba cambios en local primero
- Usa `check-db-diff.sh` antes de sincronizar
- Crea backups manualmente antes de cambios grandes
- Sincroniza en horarios de bajo tráfico

---

## 📊 Estado Actual

### Base de datos LOCAL:
- **Conexión:** `postgresql://rjayerbe@localhost:5432/meisa_db`
- **Tablas:** 20
- **Registros totales:** ~910
- **Estado:** ✅ Actualizada

### Base de datos NEON (Producción):
- **Conexión:** `postgresql://neondb_owner:***@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb`
- **Tablas:** 20
- **Registros totales:** ~911 (1 usuario adicional)
- **Estado:** ✅ **COMPLETAMENTE SINCRONIZADA** (última actualización: 2025-11-12)

### Sincronización reciente:
- ✅ 284 registros copiados (proyectos_hoja_vida, resumenes, configuracion)
- ✅ 66 registros copiados (proyectos, progreso, secciones)
- ✅ 4 historias_proyecto copiadas
- ✅ **Total: 354 registros sincronizados**
- ✅ 19/20 tablas idénticas (users tiene 1 usuario extra en producción)

---

## 🆘 Solución de Problemas

### Error: "table already exists"
**Solución:** La tabla ya existe en Neon. Usa `--accept-data-loss` si estás seguro:
```bash
DATABASE_URL="..." npx prisma db push --accept-data-loss
```

### Error: "connection refused"
**Solución:** Verifica que la URL de Neon sea correcta y esté actualizada.

### Las tablas no coinciden
**Solución:**
1. Ejecuta `./check-db-diff.sh`
2. Identifica qué falta
3. Ejecuta `./sync-db-to-neon.sh`

---

## 📝 Comandos Útiles

```bash
# Ver todas las tablas de local
psql postgresql://rjayerbe@localhost:5432/meisa_db -c "\dt"

# Ver todas las tablas de Neon
psql 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require' -c "\dt"

# Contar registros de una tabla
psql 'postgresql://...' -c "SELECT COUNT(*) FROM proyectos;"

# Ver estructura de una tabla
psql 'postgresql://...' -c "\d+ proyectos"
```

---

## 🔐 Seguridad

**IMPORTANTE:** Los scripts contienen la URL de conexión de Neon. **NO los subas a Git** si incluyen credenciales.

Para mayor seguridad, considera usar variables de entorno:
```bash
export NEON_URL='postgresql://...'
./sync-db-to-neon.sh
```
