#!/bin/bash

# Crear imágenes placeholder para MEISA
cd "$(dirname "$0")"

# Crear directorio si no existe
mkdir -p public/projects

# Función para crear imagen con ImageMagick o usar curl para descargar placeholders
create_placeholder() {
    local text="$1"
    local filename="$2"
    local encoded_text=$(echo "$text" | sed 's/ /+/g')
    
    # Descargar desde placeholder.com
    curl -s "https://via.placeholder.com/800x600/002B5C/FFFFFF.png?text=$encoded_text" -o "public/projects/$filename"
    echo "Creada: public/projects/$filename"
}

# Crear imágenes para proyectos
create_placeholder "Campanario" "campanario.jpg"
create_placeholder "Torre+Bogota" "torre-bogota.jpg"
create_placeholder "Puente+Magdalena" "puente-magdalena.jpg"
create_placeholder "Planta+Nestle" "planta-nestle.jpg"

# Crear imagen OG
curl -s "https://via.placeholder.com/1200x630/002B5C/FFFFFF.png?text=MEISA+-+Metalicas+e+Ingenieria" -o "public/og-image.jpg"
echo "Creada: public/og-image.jpg"

echo "✅ Todas las imágenes placeholder han sido creadas"