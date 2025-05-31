#!/bin/bash

# Script para copiar logos de clientes desde el backup de WordPress

SOURCE_DIR="/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads"
DEST_DIR="/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public/images/clients"

echo "🔍 Buscando y copiando logos de clientes..."

# Crear directorio de destino si no existe
mkdir -p "$DEST_DIR"

# Lista de clientes para buscar
CLIENTS=(
    "tecnoquimicas"
    "cargill"
    "tecnofar"
    "protecnica"
    "manuelita"
    "mayaguez"
    "pollos-bucanero"
    "exito"
    "royal-films"
    "colpatria"
    "normandia"
    "concreto"
    "consorcio-edificar"
    "jaramillo"
    "arinsa"
    "sena"
    "sura"
    "comfacauca"
    "seguridad-omega"
)

# Buscar y copiar logos para cada cliente
for client in "${CLIENTS[@]}"; do
    echo "🔍 Buscando logos para: $client"
    
    # Buscar archivos que contengan el nombre del cliente
    find "$SOURCE_DIR" -type f \( -name "*$client*" \) \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" \) 2>/dev/null | while read -r file; do
        # Obtener solo el nombre del archivo
        filename=$(basename "$file")
        
        # Copiar el archivo con el nombre cliente-[nombre].[ext]
        ext="${filename##*.}"
        new_name="cliente-$client.$ext"
        
        # Si el archivo no contiene dimensiones en el nombre, copiarlo
        if [[ ! "$filename" =~ [0-9]+x[0-9]+ ]]; then
            echo "  ✅ Copiando: $filename → $new_name"
            cp "$file" "$DEST_DIR/$new_name"
            break  # Solo copiar el primero que encuentre sin dimensiones
        fi
    done
done

# También buscar logos con el patrón cliente-*.png
echo "🔍 Buscando logos con patrón cliente-*.png..."
find "$SOURCE_DIR" -type f -name "cliente-*.png" -o -name "cliente-*.jpg" -o -name "cliente-*.webp" 2>/dev/null | while read -r file; do
    filename=$(basename "$file")
    echo "  ✅ Copiando: $filename"
    cp "$file" "$DEST_DIR/"
done

echo "✅ Proceso completado!"
echo "📁 Logos copiados a: $DEST_DIR"
ls -la "$DEST_DIR" | grep -E "\.(png|jpg|webp)$" | wc -l | xargs echo "📊 Total de logos copiados:"