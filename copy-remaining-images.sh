#!/bin/bash

# Script para copiar las imágenes restantes desde el FTP backup
# Directorio base del backup FTP
FTP_BASE="/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads"

# Directorio destino
DEST_DIR="./public/uploads/projects"

# Crear directorio si no existe
mkdir -p "$DEST_DIR"

echo "🚀 Copiando imágenes restantes desde FTP backup..."
echo "📁 Origen: $FTP_BASE"
echo "📁 Destino: $DEST_DIR"
echo ""

# Contador
copied=0
failed=0

# Función para copiar imagen si existe
copy_if_exists() {
    local expected_name="$1"
    local ftp_path="$2"
    local source_path="$FTP_BASE/$ftp_path"
    local dest_path="$DEST_DIR/$expected_name"
    
    if [ -f "$source_path" ]; then
        if [ ! -f "$dest_path" ]; then
            cp "$source_path" "$dest_path"
            echo "✅ Copiado: $expected_name"
            ((copied++))
        else
            echo "⏭️  Ya existe: $expected_name"
        fi
    else
        echo "⚠️  No encontrado: $ftp_path"
        ((failed++))
    fi
}

# CENTROS COMERCIALES - Monserrat (que faltó)
copy_if_exists "Monserrat-Plaza.jpg" "2021/03/Monserrat-Plaza.jpg"
copy_if_exists "Monserrat-Plaza3.jpg" "2021/03/Monserrat-Plaza3.jpg"
copy_if_exists "Monserrat-Plaza-1.jpg" "2021/03/Monserrat-Plaza-1.jpg"
copy_if_exists "monserrat-5.jpg" "2021/03/monserrat-5.jpg"
copy_if_exists "Monserrat-Plaza3-1.jpg" "2021/03/Monserrat-Plaza3-1.jpg"

# Centro Paseo Villa del Río
copy_if_exists "Centro-paseo-villa-del-rio-1-400x400.webp" "2021/03/Centro-paseo-villa-del-rio-1-600x403.webp"
copy_if_exists "Centro-paseo-villa-del-rio-2-400x400.webp" "2021/03/Centro-paseo-villa-del-rio-2-600x403.webp"
copy_if_exists "Centro-paseo-villa-del-rio-3-400x400.webp" "2021/03/Centro-paseo-villa-del-rio-3-600x403.webp"
copy_if_exists "Centro-paseo-villa-del-rio-4-400x400.webp" "2021/03/Centro-paseo-villa-del-rio-4-600x403.webp"
copy_if_exists "Centro-paseo-villa-del-rio-5-400x400.webp" "2021/03/Centro-paseo-villa-del-rio-5-600x403.webp"

# Centro Armenia Plaza - versiones JPG
copy_if_exists "CC-ARMENIA-PLAZA-1.jpeg" "2021/03/CC-ARMENIA-PLAZA-1.jpeg"
copy_if_exists "CC-ARMENIA-PLAZA-5.jpeg" "2021/03/CC-ARMENIA-PLAZA-5.jpeg"

# Centro Bochalema Plaza - imagen principal JPG
copy_if_exists "Centro-Comercial-Bochalema-Plaza-Cali.jpg" "2021/03/Centro-Comercial-Bochalema-Plaza-Cali.jpg"
copy_if_exists "Centro-bochalema-plaza-2.webp" "2021/03/Centro-bochalema-plaza-2-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-3.webp" "2021/03/Centro-bochalema-plaza-3-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-4.webp" "2021/03/Centro-bochalema-plaza-4-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-5.webp" "2021/03/Centro-bochalema-plaza-5-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-6.webp" "2021/03/Centro-bochalema-plaza-6-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-7.webp" "2021/03/Centro-bochalema-plaza-7-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-8.webp" "2021/03/Centro-bochalema-plaza-8-600x403.webp"
copy_if_exists "Centro-bochalema-plaza-9.webp" "2021/03/Centro-bochalema-plaza-9-600x403.webp"

# EDIFICIOS - Todas las que faltan
copy_if_exists "Edificio-modulos-medicos-1.webp" "2021/03/Edificio-modulos-medicos-1-600x403.webp"
copy_if_exists "Edificio-modulos-medicos-2.webp" "2021/03/Edificio-modulos-medicos-2-600x403.webp"
copy_if_exists "Edificio-modulos-medicos-3.webp" "2021/03/Edificio-modulos-medicos-3-600x403.webp"
copy_if_exists "Edificio-modulos-medicos-4.webp" "2021/03/Edificio-modulos-medicos-4-600x403.webp"

# INDUSTRIA - Todas las variantes de tamaño
copy_if_exists "Industria-ampliacion-cargill-1-400x400.webp" "2023/05/Industria-ampliacion-cargill-1-600x403.webp"
copy_if_exists "Industria-ampliacion-cargill-2-400x400.webp" "2023/05/Industria-ampliacion-cargill-2-600x403.webp"
copy_if_exists "Industria-ampliacion-cargill-3-400x400.webp" "2023/05/Industria-ampliacion-cargill-3-600x403.webp"
copy_if_exists "Industria-ampliacion-cargill-4-400x400.webp" "2023/05/Industria-ampliacion-cargill-4-600x403.webp"
copy_if_exists "Industria-ampliacion-cargill-5-400x400.webp" "2023/05/Industria-ampliacion-cargill-5-600x403.webp"
copy_if_exists "Industria-ampliacion-cargill-6-400x400.webp" "2023/05/Industria-ampliacion-cargill-6-600x403.webp"

# PUENTES PEATONALES con espacios en nombres
copy_if_exists "Puente peatonal escalinata curva rio cali 1.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-1-600x403.webp"
copy_if_exists "Puente peatonal escalinata curva rio cali 2.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-2-600x403.webp"
copy_if_exists "Puente peatonal escalinata curva rio cali 3.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-3-600x403.webp"
copy_if_exists "Puente peatonal escalinata curva rio cali 4.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-4-600x403.webp"
copy_if_exists "Puente peatonal escalinata curva rio cali 5.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-5-600x403.webp"
copy_if_exists "Puente peatonal escalinata curva rio cali 6.webp" "2021/03/Puente-peatonal-escalinata-curva-rio-cali-6-600x403.webp"

copy_if_exists "Puente peatonal autopista sur cali 1.webp" "2021/03/Puente-peatonal-autopista-sur-cali-1-600x403.webp"
copy_if_exists "Puente peatonal autopista sur cali 2.webp" "2021/03/Puente-peatonal-autopista-sur-cali-2-600x403.webp"
copy_if_exists "Puente peatonal autopista sur cali 3.webp" "2021/03/Puente-peatonal-autopista-sur-cali-3-600x403.webp"
copy_if_exists "Puente peatonal autopista sur cali 4.webp" "2021/03/Puente-peatonal-autopista-sur-cali-4-600x403.webp"

copy_if_exists "Puente peatonal la 63 cali 1.webp" "2021/03/Puente-peatonal-la-63-cali-1-600x403.webp"
copy_if_exists "Puente peatonal la 63 cali 2.webp" "2021/03/Puente-peatonal-la-63-cali-2-600x403.webp"
copy_if_exists "Puente peatonal la 63 cali 3.webp" "2021/03/Puente-peatonal-la-63-cali-3-600x403.webp"
copy_if_exists "Puente peatonal la 63 cali 4.webp" "2021/03/Puente-peatonal-la-63-cali-4-600x403.webp"

copy_if_exists "Puente peatonal la tertulia 1.webp" "2021/03/Puente-peatonal-la-tertulia-1-600x403.webp"
copy_if_exists "Puente peatonal la tertulia 2.webp" "2021/03/Puente-peatonal-la-tertulia-2-600x403.webp"
copy_if_exists "Puente peatonal la tertulia 3.webp" "2021/03/Puente-peatonal-la-tertulia-3-600x403.webp"
copy_if_exists "Puente peatonal la tertulia 4.webp" "2021/03/Puente-peatonal-la-tertulia-4-600x403.webp"

copy_if_exists "Puente peatonal terminal intermedio 1.webp" "2021/03/Puente-peatonal-terminal-intermedio-1-600x403.webp"
copy_if_exists "Puente peatonal terminal intermedio 2.webp" "2021/03/Puente-peatonal-terminal-intermedio-2-600x403.webp"
copy_if_exists "Puente peatonal terminal intermedio 3.webp" "2021/03/Puente-peatonal-terminal-intermedio-3-600x403.webp"
copy_if_exists "Puente peatonal terminal intermedio 4.webp" "2021/03/Puente-peatonal-terminal-intermedio-4-600x403.webp"
copy_if_exists "Puente peatonal terminal intermedio 5.webp" "2021/03/Puente-peatonal-terminal-intermedio-5-600x403.webp"

# ESCENARIOS DEPORTIVOS
copy_if_exists "Escenario-deportivo-compejo-acuativo-popayan-1.webp" "2021/03/Escenario-deportivo-complejo-acuatico-popayan-1-600x403.webp"
copy_if_exists "Escenario-deportivo-complejo-acuatico-popayan-2.webp" "2021/03/Escenario-deportivo-complejo-acuatico-popayan-2-600x403.webp"

copy_if_exists "Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp" "2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-1-600x403.webp"
copy_if_exists "Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp" "2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-2-600x403.webp"

copy_if_exists "Escenario-deportivo-coliseo-de-artes-marciales-1.webp" "2021/03/Escenario-deportivo-coliseo-de-artes-marciales-1-600x403.webp"

copy_if_exists "Escenario-deportivo-cecun-1.webp" "2021/03/Escenario-deportivo-cecun-1-600x403.webp"
copy_if_exists "Escenario-deportivo-cecun-2.webp" "2021/03/Escenario-deportivo-cecun-2-600x403.webp"
copy_if_exists "Escenario-deportivo-cecun-3.webp" "2021/03/Escenario-deportivo-cecun-3-600x403.webp"
copy_if_exists "Escenario-deportivo-cecun-4.webp" "2021/03/Escenario-deportivo-cecun-4-600x403.webp"
copy_if_exists "Escenario-deportivo-cecun-5.webp" "2021/03/Escenario-deportivo-cecun-5-600x403.webp"

copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-1.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-1-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-2.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-2-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-3.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-3-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-4.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-4-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-5.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-5-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-6.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-6-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-7.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-7-600x403.webp"
copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-8.webp" "2021/03/Escenario-deportivo-cancha-javeriana-cali-8-600x403.webp"

# ESTRUCTURAS MODULARES
copy_if_exists "Estructura-modular-cocina-oculta-1-400x400.jpeg" "2021/03/Estructura-modular-cocina-oculta-1.jpeg"
copy_if_exists "Estructura-modular-cocina-oculta-2-400x400.webp" "2021/03/Estructura-modular-cocina-oculta-2-600x403.webp"
copy_if_exists "Estructura-modular-cocina-oculta-3-400x400.webp" "2021/03/Estructura-modular-cocina-oculta-3-600x403.webp"

copy_if_exists "Estructura-modular-modulo-oficina-1-400x400.webp" "2021/03/Estructura-modular-modulo-oficina-1-600x403.webp"
copy_if_exists "Estructura-modular-modulo-oficina-2-400x400.webp" "2021/03/Estructura-modular-modulo-oficina-2-600x403.webp"
copy_if_exists "Estructura-modular-modulo-oficina-3-400x400.webp" "2021/03/Estructura-modular-modulo-oficina-3-600x403.webp"

# OIL & GAS
copy_if_exists "Oil-gas-tanque-pulmon-1-400x400.webp" "2021/03/Oil-gas-tanque-pulmon-1-600x403.webp"

copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-1-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-1-600x403.webp"
copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-2-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-2-600x403.webp"
copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-3-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-3-600x403.webp"
copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-4-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-4-600x403.webp"
copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-5-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-5-600x403.webp"
copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-6-400x400.webp" "2021/03/Oil-gas-tanque-de-almacenamiento-gpl-6-600x403.webp"

# CUBIERTAS Y FACHADAS
copy_if_exists "Cubiertas-y-fachadas-camino-viejo-1.webp" "2021/03/Cubiertas-y-fachadas-camino-viejo-1-600x403.webp"
copy_if_exists "Cubiertas-y-fachadas-camino-viejo-2.webp" "2021/03/Cubiertas-y-fachadas-camino-viejo-2-600x403.webp"

copy_if_exists "Cubiertas-y-fachadas-cubierta-interna-1.webp" "2021/03/Cubiertas-y-fachadas-cubierta-interna-1-600x403.webp"
copy_if_exists "Cubiertas-y-fachadas-cubierta-interna-2.webp" "2021/03/Cubiertas-y-fachadas-cubierta-interna-2-600x403.webp"

copy_if_exists "Cubiertas-y-fachadas-ips-sura-1.webp" "2021/03/Cubiertas-y-fachadas-ips-sura-1-600x403.webp"
copy_if_exists "Cubiertas-y-fachadas-ips-sura-2.webp" "2021/03/Cubiertas-y-fachadas-ips-sura-2-600x403.webp"

copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-1.webp" "2021/03/Cubiertas-y-fachadas-taquillas-pisoje-1-600x403.webp"
copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-2.webp" "2021/03/Cubiertas-y-fachadas-taquillas-pisoje-2-600x403.webp"

copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1.webp" "2021/03/Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1-600x403.webp"
copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2.webp" "2021/03/Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2-600x403.webp"

echo ""
echo "🎉 COPIA COMPLETADA!"
echo "✅ Imágenes copiadas: $copied"
echo "❌ Imágenes no encontradas: $failed"
echo "📁 Total en directorio:"
ls -1 "$DEST_DIR" | wc -l