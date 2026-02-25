#!/bin/bash

# Script wrapper para prisma db push con confirmación
# Protege contra cambios accidentales en la DB de producción (Neon)

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  ADVERTENCIA: Base de datos de PRODUCCION${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "Vas a aplicar cambios de schema a la base de datos ${RED}Neon (produccion)${NC}."
echo -e "Esto puede modificar tablas, columnas y datos existentes."
echo ""

# Mostrar qué DATABASE_URL se está usando (censurada)
DB_URL="${DATABASE_URL:-No configurada}"
if [[ "$DB_URL" == *"neon"* ]]; then
    echo -e "  DB: ${RED}Neon (produccion)${NC}"
elif [[ "$DB_URL" == *"localhost"* ]]; then
    echo -e "  DB: ${GREEN}localhost (local)${NC}"
else
    echo -e "  DB: ${YELLOW}$DB_URL${NC}"
fi
echo ""

read -p "Escribe 'SI' para confirmar: " confirmacion

if [ "$confirmacion" != "SI" ]; then
    echo -e "${RED}Cancelado.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Ejecutando prisma db push...${NC}"
echo ""
npx prisma db push
