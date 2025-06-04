#!/bin/bash

# Crear directorio de imágenes de servicios si no existe
mkdir -p public/images/servicios

# Crear imágenes placeholder para cada servicio usando ImageMagick
# Si no tienes ImageMagick instalado, puedes usar: brew install imagemagick

# Consultoría en Diseño Estructural - Azul
convert -size 1200x800 xc:'#1e40af' \
  -gravity center \
  -pointsize 72 \
  -fill white \
  -annotate +0+0 'Consultoría\nDiseño Estructural' \
  -blur 0x8 \
  -fill 'rgba(255,255,255,0.1)' \
  -draw "rectangle 0,0 1200,800" \
  public/images/servicios/diseno-estructural.jpg

# Fabricación de Estructuras Metálicas - Rojo
convert -size 1200x800 xc:'#dc2626' \
  -gravity center \
  -pointsize 72 \
  -fill white \
  -annotate +0+0 'Fabricación\nEstructuras Metálicas' \
  -blur 0x8 \
  -fill 'rgba(255,255,255,0.1)' \
  -draw "rectangle 0,0 1200,800" \
  public/images/servicios/fabricacion.jpg

# Montaje de Estructuras - Verde
convert -size 1200x800 xc:'#16a34a' \
  -gravity center \
  -pointsize 72 \
  -fill white \
  -annotate +0+0 'Montaje\nde Estructuras' \
  -blur 0x8 \
  -fill 'rgba(255,255,255,0.1)' \
  -draw "rectangle 0,0 1200,800" \
  public/images/servicios/montaje.jpg

# Gestión Integral de Proyectos - Púrpura
convert -size 1200x800 xc:'#9333ea' \
  -gravity center \
  -pointsize 72 \
  -fill white \
  -annotate +0+0 'Gestión Integral\nde Proyectos' \
  -blur 0x8 \
  -fill 'rgba(255,255,255,0.1)' \
  -draw "rectangle 0,0 1200,800" \
  public/images/servicios/gestion-proyectos.jpg

# Proceso Integral - Fondo oscuro
convert -size 1920x600 xc:'#111827' \
  -gravity center \
  -pointsize 72 \
  -fill white \
  -annotate +0+0 'Proceso Integral MEISA' \
  -blur 0x8 \
  -fill 'rgba(59,130,246,0.1)' \
  -draw "rectangle 0,0 1920,600" \
  public/images/servicios/proceso-integral-bg.jpg

echo "✅ Imágenes placeholder creadas exitosamente"