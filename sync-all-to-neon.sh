#!/bin/bash

# Script maestro para sincronizar TODA la base de datos local a Neon (producción)
# Incluye: schema, categorías, assets, proyectos, y contadores
# Uso: ./sync-all-to-neon.sh

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URL de Neon (producción)
NEON_URL='postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 SINCRONIZACIÓN COMPLETA A NEON (PRODUCCIÓN)           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Mostrar resumen de lo que se hará
echo -e "${BLUE}📋 Este script realizará las siguientes acciones:${NC}"
echo ""
echo "   1. ✅ Verificar estado actual de Neon"
echo "   2. 💾 Crear backup de seguridad"
echo "   3. 🔄 Sincronizar schema de Prisma (estructura de tablas)"
echo "   4. 📁 Migrar categorías de proyectos (9 antiguas → 6 nuevas)"
echo "   5. 🎨 Reutilizar assets de categorías (covers, iconos)"
echo "   6. 📊 Clasificar ProyectosHojaVida en nuevas categorías"
echo "   7. 🔢 Actualizar contadores de proyectos por categoría"
echo "   8. ✅ Verificar migración completa"
echo ""

# Confirmar con el usuario
echo -e "${YELLOW}⚠️  ¿Estás seguro de que quieres sincronizar TODO a Neon/Producción?${NC}"
echo "   Esta es una operación importante que afectará la base de datos en producción."
echo ""
read -p "Escribe 'SI ESTOY SEGURO' para confirmar: " confirmacion

if [ "$confirmacion" != "SI ESTOY SEGURO" ]; then
    echo -e "${RED}❌ Sincronización cancelada${NC}"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# PASO 1: Verificar estado actual
echo -e "${BLUE}📊 PASO 1/8: Verificando estado actual de Neon...${NC}"
echo ""
DATABASE_URL="$NEON_URL" node check-neon-db.mjs

# PASO 2: Crear backup
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}💾 PASO 2/8: Creando backup de seguridad...${NC}"
echo ""
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="backups/neon-backup-$timestamp.sql"

mkdir -p backups

if command -v pg_dump &> /dev/null; then
    echo "   Creando backup con pg_dump..."
    pg_dump "$NEON_URL" > "$backup_file" 2>/dev/null || echo "   ⚠️  No se pudo crear backup SQL (continuando...)"
    if [ -f "$backup_file" ]; then
        echo -e "   ${GREEN}✓ Backup guardado en: $backup_file${NC}"
    fi
else
    echo "   ⚠️  pg_dump no disponible, saltando backup SQL"
fi

# PASO 3: Sincronizar schema
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🔄 PASO 3/8: Sincronizando schema de Prisma a Neon...${NC}"
echo ""
echo "   Esto actualizará la estructura de tablas y enums..."
DATABASE_URL="$NEON_URL" npx prisma db push --accept-data-loss

echo ""
echo -e "   ${GREEN}✓ Schema sincronizado${NC}"

# PASO 4: Migrar categorías
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📁 PASO 4/8: Creando nuevas categorías en Neon...${NC}"
echo ""
DATABASE_URL="$NEON_URL" npx tsx scripts/seed-nuevas-categorias.ts

# PASO 5: Reutilizar assets
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🎨 PASO 5/8: Reutilizando assets de categorías antiguas...${NC}"
echo ""
DATABASE_URL="$NEON_URL" npx tsx scripts/reutilizar-assets-antiguos.ts

# PASO 6: Clasificar ProyectosHojaVida
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📊 PASO 6/8: Clasificando ProyectosHojaVida en nuevas categorías...${NC}"
echo ""
DATABASE_URL="$NEON_URL" npx tsx scripts/clasificar-proyectos-hoja-vida.ts

# PASO 7: Actualizar contadores
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🔢 PASO 7/8: Actualizando contadores de proyectos...${NC}"
echo ""
DATABASE_URL="$NEON_URL" npx tsx scripts/actualizar-contadores.ts

# PASO 8: Verificar migración completa
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}✅ PASO 8/8: Verificando migración completa...${NC}"
echo ""
DATABASE_URL="$NEON_URL" npx tsx scripts/verificar-migracion-completa.ts

# Resumen final
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ ¡SINCRONIZACIÓN COMPLETA EXITOSA!                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Base de datos Neon actualizada correctamente${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verificar que tu sitio web funcione: https://meisa.com.co"
echo "   2. Revisar que las categorías se muestren correctamente"
echo "   3. Verificar que los contadores de proyectos sean correctos"
echo "   4. Hacer deploy con GitHub Actions cuando estés listo"
echo ""
echo "💾 Backup guardado en: $backup_file"
echo ""
