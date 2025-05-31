#!/bin/bash

# Copia RÁPIDA masiva de todas las imágenes de proyectos
FTP_BASE="/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads"
DEST_DIR="./public/uploads/projects"

echo "🚀 COPIA RÁPIDA MASIVA DE IMÁGENES"
echo "📁 Origen: $FTP_BASE"
echo "📁 Destino: $DEST_DIR"
echo ""

# Crear directorio si no existe
mkdir -p "$DEST_DIR"

echo "🔍 Buscando TODAS las imágenes de proyectos en el FTP backup..."

# Buscar y copiar TODAS las imágenes de proyectos de una vez
echo "📋 Patrones a buscar:"
echo "   - Centro-*"
echo "   - Edificio-*" 
echo "   - Industria-*"
echo "   - Puente-*"
echo "   - Escenario-*"
echo "   - Estructura-*"
echo "   - Oil-*"
echo "   - Cubiertas-*"
echo "   - Monserrat-*"
echo "   - CC-ARMENIA-*"
echo ""

# Usar find para localizar TODAS las imágenes y copiarlas masivamente
echo "⚡ Copiando imágenes de CENTROS COMERCIALES..."
find "$FTP_BASE" -name "Centro-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;
find "$FTP_BASE" -name "Monserrat-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;
find "$FTP_BASE" -name "CC-ARMENIA-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de EDIFICIOS..."
find "$FTP_BASE" -name "Edificio-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de INDUSTRIA..."
find "$FTP_BASE" -name "Industria-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de PUENTES..."
find "$FTP_BASE" -name "Puente-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de ESCENARIOS DEPORTIVOS..."
find "$FTP_BASE" -name "Escenario-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de ESTRUCTURAS MODULARES..."
find "$FTP_BASE" -name "Estructura-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de OIL & GAS..."
find "$FTP_BASE" -name "Oil-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo "⚡ Copiando imágenes de CUBIERTAS Y FACHADAS..."
find "$FTP_BASE" -name "Cubiertas-*" -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg" \) -exec cp {} "$DEST_DIR/" \;

echo ""
echo "🎉 COPIA MASIVA COMPLETADA!"
echo ""
echo "📊 RESUMEN:"
echo "📁 Total de archivos copiados:"
ls -1 "$DEST_DIR" | wc -l

echo ""
echo "📋 Tipos de archivos:"
echo "WebP: $(ls -1 "$DEST_DIR"/*.webp 2>/dev/null | wc -l)"
echo "JPG: $(ls -1 "$DEST_DIR"/*.jpg 2>/dev/null | wc -l)"  
echo "JPEG: $(ls -1 "$DEST_DIR"/*.jpeg 2>/dev/null | wc -l)"

echo ""
echo "📁 Primeras 10 imágenes:"
ls "$DEST_DIR" | head -10

echo ""
echo "📁 Últimas 10 imágenes:"
ls "$DEST_DIR" | tail -10

echo ""
echo "✅ Todas las imágenes están disponibles en: $DEST_DIR"
echo "🌐 URL web: http://localhost:3002/uploads/projects/"