#!/bin/bash

# Script para restaurar base de datos local desde Neon (producción)
# Uso: ./restore-from-neon.sh

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "🔄 Restaurando base de datos local desde Neon (producción)..."
echo ""

# URL de Neon (producción)
NEON_URL='postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# URL de base de datos local (desde .env.local)
LOCAL_URL='postgresql://postgres:meisa2024@localhost:5432/meisa_db'

# 1. Confirmar con el usuario
echo -e "${YELLOW}⚠️  ¿Estás seguro de que quieres restaurar desde Neon/Producción?${NC}"
echo "   Esto SOBRESCRIBIRÁ tu base de datos local con los datos de producción."
echo ""
read -p "Escribe 'SI' para confirmar: " confirmacion

if [ "$confirmacion" != "SI" ]; then
    echo -e "${RED}❌ Restauración cancelada${NC}"
    exit 1
fi

# 2. Hacer backup de base de datos local
echo ""
echo "💾 1. Creando backup de base de datos local..."
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="backups/local-backup-$timestamp.sql"

mkdir -p backups

# Intentar crear backup con pg_dump si está disponible
if command -v pg_dump &> /dev/null; then
    echo "   Creando backup con pg_dump..."
    pg_dump "$LOCAL_URL" > "$backup_file" 2>/dev/null || echo "   ⚠️  No se pudo crear backup SQL"
    if [ -f "$backup_file" ]; then
        echo -e "   ${GREEN}✓ Backup local guardado en: $backup_file${NC}"
    fi
else
    echo "   ⚠️  pg_dump no disponible, continuando sin backup..."
fi

# 3. Crear dump de Neon
echo ""
echo "📦 2. Descargando datos desde Neon..."
neon_dump="backups/neon-dump-$timestamp.sql"

if command -v pg_dump &> /dev/null; then
    pg_dump "$NEON_URL" > "$neon_dump"
    echo -e "   ${GREEN}✓ Dump de Neon creado: $neon_dump${NC}"
else
    echo -e "${RED}❌ Error: pg_dump no está instalado${NC}"
    echo "   Instala PostgreSQL client: brew install postgresql"
    exit 1
fi

# 4. Resetear base de datos local
echo ""
echo "🗑️  3. Reseteando base de datos local..."
DATABASE_URL="$LOCAL_URL" npx prisma migrate reset --force --skip-seed

# 5. Restaurar dump de Neon
echo ""
echo "📥 4. Restaurando datos desde Neon..."
if command -v psql &> /dev/null; then
    psql "$LOCAL_URL" < "$neon_dump"
    echo -e "   ${GREEN}✓ Datos restaurados${NC}"
else
    echo -e "${RED}❌ Error: psql no está instalado${NC}"
    exit 1
fi

# 6. Regenerar Prisma Client
echo ""
echo "🔨 5. Regenerando Prisma Client..."
npx prisma generate

echo ""
echo -e "${GREEN}✅ ¡Restauración completada!${NC}"
echo ""
echo "📋 Tu base de datos local ahora tiene los mismos datos que producción"
echo ""
