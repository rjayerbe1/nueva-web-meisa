#!/bin/bash

# Script para copiar TODAS las imágenes de proyectos desde el FTP backup
FTP_BASE="/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/wordpress-ftp-backup-20250528-085630/wp-content/uploads"
DEST_DIR="./public/uploads/projects"

# Crear directorio si no existe
mkdir -p "$DEST_DIR"

echo "🚀 Copiando TODAS las imágenes de proyectos desde FTP backup..."
echo "📁 Buscando en: $FTP_BASE"
echo "📁 Destino: $DEST_DIR"
echo ""

copied=0
failed=0

# Función para copiar si existe
copy_if_exists() {
    local dest_name="$1"
    local source_path="$2"
    
    if [ -f "$source_path" ]; then
        if [ ! -f "$DEST_DIR/$dest_name" ]; then
            cp "$source_path" "$DEST_DIR/$dest_name"
            echo "✅ Copiado: $dest_name"
            ((copied++))
        else
            echo "⏭️  Ya existe: $dest_name"
        fi
    else
        echo "⚠️  No encontrado: $source_path"
        ((failed++))
    fi
}

# CENTROS COMERCIALES

echo "🏬 === CENTROS COMERCIALES ==="

# 1. Centro Campanario - 7 imágenes
for i in {1..7}; do
    copy_if_exists "Centro-campanario-$i.webp" "$FTP_BASE/2023/05/Centro-campanario-$i-600x403.webp"
    copy_if_exists "Centro-campanario-$i-scaled-400x400.webp" "$FTP_BASE/2023/05/Centro-campanario-$i-400x400.webp"
done

# 2. Paseo Villa del Río - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Centro-paseo-villa-del-rio-$i-400x400.webp" "$FTP_BASE/2021/03/Centro-paseo-villa-del-rio-$i-600x403.webp"
done

# 3. Centro Monserrat - 10 imágenes total
copy_if_exists "Monserrat-Plaza.jpg" "$FTP_BASE/2021/03/Monserrat-Plaza.jpg"
copy_if_exists "Monserrat-Plaza3.jpg" "$FTP_BASE/2021/03/Monserrat-Plaza3.jpg" 
copy_if_exists "Monserrat-Plaza-1.jpg" "$FTP_BASE/2021/03/Monserrat-Plaza-1.jpg"
copy_if_exists "monserrat-5.jpg" "$FTP_BASE/2021/03/monserrat-5.jpg"
copy_if_exists "Monserrat-Plaza3-1.jpg" "$FTP_BASE/2021/03/Monserrat-Plaza3-1.jpg"

for i in {1..5}; do
    copy_if_exists "Centro-monserrat-$i.webp" "$FTP_BASE/2023/05/Centro-monserrat-$i-600x403.webp"
done

# 4. Centro Unico Cali - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Centro-unico-cali-$i.webp" "$FTP_BASE/2021/03/Centro-unico-cali-$i-600x403.webp"
done

# 5. Centro Unico Neiva - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Centro-unico-neiva-$i.webp" "$FTP_BASE/2021/03/Centro-unico-neiva-$i-600x403.webp"
done

# 6. Centro Unico Barranquilla - 2 imágenes
for i in 2 3; do
    copy_if_exists "Centro-unico-barranquilla-$i.webp" "$FTP_BASE/2021/03/Centro-unico-barranquilla-$i-600x403.webp"
done

# 7. Centro Armenia Plaza - 6 imágenes
copy_if_exists "CC-ARMENIA-PLAZA-1.jpeg" "$FTP_BASE/2021/03/CC-ARMENIA-PLAZA-1.jpeg"
copy_if_exists "CC-ARMENIA-PLAZA-5.jpeg" "$FTP_BASE/2021/03/CC-ARMENIA-PLAZA-5.jpeg"
for i in {1..4}; do
    copy_if_exists "Centro-armenia-plaza-$i.webp" "$FTP_BASE/2021/03/Centro-armenia-plaza-$i-600x403.webp"
done

# 8. Centro Bochalema Plaza - 10 imágenes
copy_if_exists "Centro-Comercial-Bochalema-Plaza-Cali.jpg" "$FTP_BASE/2021/03/Centro-Comercial-Bochalema-Plaza-Cali.jpg"
for i in {1..9}; do
    copy_if_exists "Centro-bochalema-plaza-$i.webp" "$FTP_BASE/2021/03/Centro-bochalema-plaza-$i-600x403.webp"
done

echo ""
echo "🏢 === EDIFICIOS ==="

# 1. Cinemateca Distrital - 6 imágenes + versiones 400x400
for i in {1..6}; do
    copy_if_exists "Edificio-cinemateca-distrital-$i.webp" "$FTP_BASE/2023/05/Edificio-cinemateca-distrital-$i-600x403.webp"
    copy_if_exists "Edificio-cinemateca-distrital-$i-400x400.webp" "$FTP_BASE/2023/05/Edificio-cinemateca-distrital-$i-400x400.webp"
done

# 2. Clínica Reina Victoria - 7 imágenes + versiones 400x400
for i in {1..7}; do
    copy_if_exists "Edificio-clinica-reina-victoria-$i.webp" "$FTP_BASE/2023/05/Edificio-clinica-reina-victoria-$i-600x403.webp"
    copy_if_exists "Edificio-clinica-reina-victoria-$i-400x400.webp" "$FTP_BASE/2023/05/Edificio-clinica-reina-victoria-$i-400x400.webp"
done

# 3. Edificio Omega - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Edificio-omega-$i.webp" "$FTP_BASE/2021/03/Edificio-omega-$i-600x403.webp"
done

# 4. Bomberos Popayán - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Edificio-bomberos-popayan-$i.webp" "$FTP_BASE/2021/03/Edificio-bomberos-popayan-$i-600x403.webp"
done

# 5. Estación MIO Guadalupe - 6 imágenes
for i in {1..6}; do
    copy_if_exists "Edificio-estacion-mio-guadalupe-$i.webp" "$FTP_BASE/2021/03/Edificio-estacion-mio-guadalupe-$i-600x403.webp"
done

# 6. SENA Santander - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Edificio-sena-santander-$i.webp" "$FTP_BASE/2021/03/Edificio-sena-santander-$i-600x403.webp"
done

# 7. Terminal Intermedio MIO - 8 imágenes
for i in {1..8}; do
    copy_if_exists "Edificio-terminal-intermedio-mio-cali-$i.webp" "$FTP_BASE/2021/03/Edificio-terminal-intermedio-mio-cali-$i-600x403.webp"
done

# 8. Tequendama Parking - 8 imágenes
for i in {1..8}; do
    copy_if_exists "Edificio-tequendama-parking-cali-$i.webp" "$FTP_BASE/2021/03/Edificio-tequendama-parking-cali-$i-600x403.webp"
done

# 9. Módulos Médicos - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Edificio-modulos-medicos-$i.webp" "$FTP_BASE/2021/03/Edificio-modulos-medicos-$i-600x403.webp"
done

echo ""
echo "🏭 === INDUSTRIA ==="

# 1. Ampliación Cargill - 6 imágenes 400x400
for i in {1..6}; do
    copy_if_exists "Industria-ampliacion-cargill-$i-400x400.webp" "$FTP_BASE/2023/05/Industria-ampliacion-cargill-$i-600x403.webp"
done

# 2. Torre Cogeneración Propal - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Industria-torre-cogeneracion-propal-$i.webp" "$FTP_BASE/2021/03/Industria-torre-cogeneracion-propal-$i-600x403.webp"
done

# 3. Bodega Duplex - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Industria-bodega-duplex-$i.webp" "$FTP_BASE/2021/03/Industria-bodega-duplex-$i-600x403.webp"
done

# 4. Bodega Intera - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Industria-bodega-intera-$i.webp" "$FTP_BASE/2021/03/Industria-bodega-intera-$i-600x403.webp"
done

# 5. Tecnofar - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Industria-tecnofar-$i.webp" "$FTP_BASE/2021/03/Industria-tecnofar-$i-600x403.webp"
done

# 6. Bodega Protecnica Etapa II - 7 imágenes
for i in {1..7}; do
    copy_if_exists "Industria-bodega-protecnica-etapa-dos-$i.webp" "$FTP_BASE/2021/03/Industria-bodega-protecnica-etapa-dos-$i-600x403.webp"
done

# 7. Tecnoquímicas Jamundí - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Industria-tecnoquimicas-jamundi-$i.webp" "$FTP_BASE/2021/03/Industria-tecnoquimicas-jamundi-$i-600x403.webp"
done

echo ""
echo "🌉 === PUENTES VEHICULARES ==="

# 1. Puente Nolasco - 3 imágenes
for i in {1..3}; do
    copy_if_exists "Puente-vehicular-nolasco-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-nolasco-$i-600x403.webp"
done

# 2. Puente Carrera 100 - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Puente-vehicular-carrera-cien-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-carrera-cien-$i-600x403.webp"
done

# 3. Puente Cambrín - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Puente-vehicular-cambrin-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-cambrin-$i-600x403.webp"
done

# 4. Puente Frisoles - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Puente-vehicular-frisoles-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-frisoles-$i-600x403.webp"
done

# 5. Puente La 21 - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Puente-vehicular-la-veinti-uno-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-la-veinti-uno-$i-600x403.webp"
done

# 6. Puente La Paila - 5 imágenes
for i in {1..5}; do
    copy_if_exists "Puente-vehicular-la-paila-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-la-paila-$i-600x403.webp"
done

# 7. Puente Saraconcho - 4 imágenes
for i in {1..4}; do
    copy_if_exists "Puente-vehicular-saraconcho-$i.webp" "$FTP_BASE/2021/03/Puente-vehicular-saraconcho-$i-600x403.webp"
done

echo ""
echo "🚶 === PUENTES PEATONALES ==="

# 1. Escalinata Curva Río Cali - 6 imágenes + versiones 400x400
for i in {1..6}; do
    copy_if_exists "Puente peatonal escalinata curva rio cali $i.webp" "$FTP_BASE/2021/03/Puente-peatonal-escalinata-curva-rio-cali-$i-600x403.webp"
    copy_if_exists "Puente-peatonal-escalinata-curva-rio-cali-$i-400x400.webp" "$FTP_BASE/2021/03/Puente-peatonal-escalinata-curva-rio-cali-$i-400x400.webp"
done

# 2. Puente Autopista Sur - 4 imágenes + versiones 400x400
for i in {1..4}; do
    copy_if_exists "Puente peatonal autopista sur cali $i.webp" "$FTP_BASE/2021/03/Puente-peatonal-autopista-sur-cali-$i-600x403.webp"
    copy_if_exists "Puente-peatonal-autopista-sur-cali-$i-400x400.webp" "$FTP_BASE/2021/03/Puente-peatonal-autopista-sur-cali-$i-400x400.webp"
done

# 3. Puente La 63 - 4 imágenes + versiones 400x400
for i in {1..4}; do
    copy_if_exists "Puente peatonal la 63 cali $i.webp" "$FTP_BASE/2021/03/Puente-peatonal-la-63-cali-$i-600x403.webp"
    copy_if_exists "Puente-peatonal-la-63-cali-$i-400x400.webp" "$FTP_BASE/2021/03/Puente-peatonal-la-63-cali-$i-400x400.webp"
done

# 4. Puente La Tertulia - 4 imágenes + versiones 400x400
for i in {1..4}; do
    copy_if_exists "Puente peatonal la tertulia $i.webp" "$FTP_BASE/2021/03/Puente-peatonal-la-tertulia-$i-600x403.webp"
    copy_if_exists "Puente-peatonal-la-tertulia-$i-400x400.webp" "$FTP_BASE/2021/03/Puente-peatonal-la-tertulia-$i-400x400.webp"
done

# 5. Puente Terminal Intermedio - 5 imágenes + versiones 400x400
for i in {1..5}; do
    copy_if_exists "Puente peatonal terminal intermedio $i.webp" "$FTP_BASE/2021/03/Puente-peatonal-terminal-intermedio-$i-600x403.webp"
    copy_if_exists "Puente-peatonal-terminal-intermedio-$i-400x400.webp" "$FTP_BASE/2021/03/Puente-peatonal-terminal-intermedio-$i-400x400.webp"
done

echo ""
echo "🏟️ === ESCENARIOS DEPORTIVOS ==="

# 1. Complejo Acuático Popayán - 2 imágenes + versiones 400x400
for i in {1..2}; do
    copy_if_exists "Escenario-deportivo-compejo-acuativo-popayan-$i.webp" "$FTP_BASE/2021/03/Escenario-deportivo-complejo-acuatico-popayan-$i-600x403.webp"
    copy_if_exists "Escenario-deportivo-compejo-acuativo-popayan-$i-400x400.webp" "$FTP_BASE/2021/03/Escenario-deportivo-complejo-acuatico-popayan-$i-400x400.webp"
done

copy_if_exists "Escenario-deportivo-complejo-acuatico-popayan-2.webp" "$FTP_BASE/2021/03/Escenario-deportivo-complejo-acuatico-popayan-2-600x403.webp"

# 2. Coliseo Mayor - 2 imágenes + versiones 400x400
for i in {1..2}; do
    copy_if_exists "Escenario-deportivo-juegos-nacionales-coliseo-mayor-$i.webp" "$FTP_BASE/2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-$i-600x403.webp"
    copy_if_exists "Escenario-deportivo-juegos-nacionales-coliseo-mayor-$i-400x400.webp" "$FTP_BASE/2021/03/Escenario-deportivo-juegos-nacionales-coliseo-mayor-$i-400x400.webp"
done

# 3. Coliseo Artes Marciales - 1 imagen + versión 400x400
copy_if_exists "Escenario-deportivo-coliseo-de-artes-marciales-1.webp" "$FTP_BASE/2021/03/Escenario-deportivo-coliseo-de-artes-marciales-1-600x403.webp"
copy_if_exists "Escenario-deportivo-coliseo-de-artes-marciales-1-400x400.webp" "$FTP_BASE/2021/03/Escenario-deportivo-coliseo-de-artes-marciales-1-400x400.webp"

# 4. CECUN - 5 imágenes + versiones 400x400
for i in {1..5}; do
    copy_if_exists "Escenario-deportivo-cecun-$i.webp" "$FTP_BASE/2021/03/Escenario-deportivo-cecun-$i-600x403.webp"
    copy_if_exists "Escenario-deportivo-cecun-$i-400x400.webp" "$FTP_BASE/2021/03/Escenario-deportivo-cecun-$i-400x400.webp"
done

# 5. Cancha Javeriana - 8 imágenes + versiones 400x400
for i in {1..8}; do
    copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-$i.webp" "$FTP_BASE/2021/03/Escenario-deportivo-cancha-javeriana-cali-$i-600x403.webp"
    copy_if_exists "Escenario-deportivo-cancha-javeriana-cali-$i-400x400.webp" "$FTP_BASE/2021/03/Escenario-deportivo-cancha-javeriana-cali-$i-400x400.webp"
done

echo ""
echo "🏗️ === ESTRUCTURAS MODULARES ==="

# 1. Cocinas Ocultas - 3 imágenes
copy_if_exists "Estructura-modular-cocina-oculta-1-400x400.jpeg" "$FTP_BASE/2021/03/Estructura-modular-cocina-oculta-1.jpeg"
for i in 2 3; do
    copy_if_exists "Estructura-modular-cocina-oculta-$i-400x400.webp" "$FTP_BASE/2021/03/Estructura-modular-cocina-oculta-$i-600x403.webp"
done

# 2. Módulo Oficina - 3 imágenes
for i in {1..3}; do
    copy_if_exists "Estructura-modular-modulo-oficina-$i-400x400.webp" "$FTP_BASE/2021/03/Estructura-modular-modulo-oficina-$i-600x403.webp"
done

echo ""
echo "⛽ === OIL & GAS ==="

# 1. Tanque Pulmón - 1 imagen
copy_if_exists "Oil-gas-tanque-pulmon-1-400x400.webp" "$FTP_BASE/2021/03/Oil-gas-tanque-pulmon-1-600x403.webp"

# 2. Tanques GLP - 6 imágenes
for i in {1..6}; do
    copy_if_exists "Oil-gas-tanque-de-almacenamiento-gpl-$i-400x400.webp" "$FTP_BASE/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-$i-600x403.webp"
done

echo ""
echo "🏗️ === CUBIERTAS Y FACHADAS ==="

# 1. Camino Viejo - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Cubiertas-y-fachadas-camino-viejo-$i.webp" "$FTP_BASE/2021/03/Cubiertas-y-fachadas-camino-viejo-$i-600x403.webp"
done

# 2. Cubierta Interna - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Cubiertas-y-fachadas-cubierta-interna-$i.webp" "$FTP_BASE/2021/03/Cubiertas-y-fachadas-cubierta-interna-$i-600x403.webp"
done

# 3. IPS Sura - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Cubiertas-y-fachadas-ips-sura-$i.webp" "$FTP_BASE/2021/03/Cubiertas-y-fachadas-ips-sura-$i-600x403.webp"
done

# 4. Taquillas Pisoje - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-$i.webp" "$FTP_BASE/2021/03/Cubiertas-y-fachadas-taquillas-pisoje-$i-600x403.webp"
done

# 5. Taquillas Pisoje Comfacauca - 2 imágenes
for i in {1..2}; do
    copy_if_exists "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-$i.webp" "$FTP_BASE/2021/03/Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-$i-600x403.webp"
done

echo ""
echo "🎉 COPIA COMPLETADA!"
echo "📊 RESULTADOS:"
echo "   ✅ Imágenes copiadas: $copied"
echo "   ❌ Imágenes no encontradas: $failed"
echo ""
echo "📁 Total de imágenes en directorio:"
ls -1 "$DEST_DIR" | wc -l
echo ""
echo "📋 Primeras 10 imágenes:"
ls "$DEST_DIR" | head -10