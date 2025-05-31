# Categorías de Proyectos MEISA - Información Completa

## Resumen
La página de proyectos de MEISA utiliza un sistema de "flip-boxes" (cajas que giran) para mostrar las categorías. Cada categoría tiene:
- Una imagen principal (cara frontal)
- Un icono especial
- Texto descriptivo (cara posterior)
- Enlace a un proyecto ejemplo

## Categorías Detalladas

### 1. Centros Comerciales
- **ID HTML**: `CentrosComerciales`
- **Imagen principal**: `centros-comerciales-imagen-azul.jpg`
- **Icono**: `icono-centros-comerciales_1.png`
- **Texto descriptivo**: "Encuentra aquí los centros comerciales hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/centro-comercial-campanario/`

### 2. Edificios
- **ID HTML**: `Edificios`
- **Imagen principal**: `edificios.jpg`
- **Icono**: `icono-edificios_1.png`
- **Texto descriptivo**: "Encuentra aquí los edificios hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/edificios-cinemateca-distrital/`

### 3. Industria
- **ID HTML**: `Industria`
- **Imagen principal**: `industria.jpg`
- **Icono**: `icono-industria_1.png`
- **Texto descriptivo**: "Encuentra aquí estructuras industriales hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/industria-ampliacion-cargill/`

### 4. Puentes Vehiculares
- **ID HTML**: `PuentesVehiculares`
- **Imagen principal**: `puentes-vehiculares.jpg`
- **Icono**: `icono-puentes-vehiculares_1.png`
- **Texto descriptivo**: "Encuentra aquí puentes vehiculares hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/puentes-vehiculares-puente-nolasco/`

### 5. Puentes Peatonales
- **ID HTML**: `PuentesPeatonales`
- **Imagen principal**: `puentes-peatonales.jpg`
- **Icono**: `icono-puentes-peatonales_1.png`
- **Texto descriptivo**: "Encuentra aquí puentes peatonales hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/puentes-peatonales-escalinata-curva-rio-cali/`

### 6. Escenarios Deportivos
- **ID HTML**: `EscenariosDeportivos`
- **Imagen principal**: `escenarios-deportivos.jpg`
- **Icono**: `icono-escenarios-deportivos_1.png`
- **Texto descriptivo**: "Encuentra aquí escenarios deportivos hechos por Meisa."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/escenarios-deportivos-complejo-acuatico-popayan/`

### 7. Cubiertas y Fachadas
- **ID HTML**: `CubiertasyFachadas`
- **Imagen principal**: `cubiertas-y-fachadas.jpg`
- **Icono**: `icono-cubiertas-y-fachadas_1.png`
- **Texto descriptivo**: "Contamos con nuestra propia maquinaria para fabricar: tejas standing seam, snap lock, curvadora de tejas, steel deck y perfiles de fachada."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/centros-comerciales-campanario/`

### 8. Estructuras Modulares
- **ID HTML**: `EstructurasModulares`
- **Imagen principal**: `estructuras-modulares.jpg`
- **Icono**: `icono-estructuras-modulares_1.png`
- **Texto descriptivo**: "Las estructuras modulares son una opción para aquellos clientes que requieren de construcciones rápidas, prácticas y económicas para diferentes espacios."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/estructuras-modulares-cocinas-ocultas/`

### 9. Oil and Gas
- **ID HTML**: `OilandGas`
- **Imagen principal**: `oil-and-gas-1.jpg`
- **Icono**: `icono-oil-and-gas_1.png`
- **Texto descriptivo**: "En MEISA brindamos soluciones para la industria petrolera, química, alimenticia, papelera, entre otras, fabricando: Intercambiadores de calor, recipientes a presión, recipientes atmosféricos y muchos más equipos industriales."
- **Color de fondo**: `#2d2e80`
- **Proyecto ejemplo**: `https://meisa.com.co/project/oil-and-gas-tanque-pulmon/`

## Detalles Técnicos

### Estructura HTML
Cada categoría utiliza la clase `nectar-flip-box` con las siguientes características:
- `data-min-height="300"`: Altura mínima de 300px
- `data-flip-direction="horizontal-to-left"`: Giro horizontal hacia la izquierda
- `data-h_text_align="left"`: Alineación horizontal del texto a la izquierda
- `data-v_text_align="top"`: Alineación vertical del texto arriba

### Animaciones
Las categorías aparecen con animación:
- `data-animation="fade-in-from-bottom"`: Aparecen desde abajo
- `data-delay`: Con retrasos de 150ms, 300ms y 450ms para crear un efecto escalonado

### Ubicación de archivos
Todas las imágenes se encuentran en:
- **Ruta principal**: `/wp-content/uploads/2020/07/`
- **Imágenes de categorías**: Archivos `.jpg` con nombres descriptivos
- **Iconos**: Archivos `.png` con prefijo `icono-`

## Texto Introductorio
"En MEISA hemos fabricado e instalado estructuras metálicas para todo tipo de proyectos de construcción e infraestructura, las siguientes categorías muestran los diferentes sectores en los que hemos estado presentes."

## Banner Principal
- **Imagen**: `BANNER-PROYECTOS-oscura-scaled.jpg`
- **Título**: "Nuestros **Proyectos**" (con borde blanco)