# Optimización Hero Images — Prompts para Nano Banana Pro (Gemini 3.1 Pro Image)

Revisión visual de las **18 imágenes** que se usan como hero de fondo en las páginas `/proyectos/categoria/<slug>` (ocupan full-screen cuando el usuario hace click en cada especialidad).

**Objetivo:** que cada imagen funcione como hero profesional — sin distractores operativos (cascos, grúas en operación, mallas de obra, logos comerciales ajenos, cintas de peligro), composición limpia y con protagonismo de la estructura metálica MEISA.

## Flujo de trabajo sugerido

Para cada imagen marcada como **🚨 Grave** o **⚠️ Moderada**:

1. Abrí **gemini.google.com** con tu cuenta Workspace → asegurate que esté seleccionado **Gemini 3 Pro** (Nano Banana Pro).
2. Descargá la imagen original desde la URL indicada en esta ficha.
3. Subila al chat.
4. Copiá el **PROMPT** debajo de esa ficha.
5. Descargá el resultado como PNG sin compresión a `~/Downloads/meisa-hero-fix/<código>.png`.
6. Cuando tengas todas, avisás y corro un script que:
   - Las convierte a WebP optimizado
   - Las sube a GCS reemplazando las originales
   - Confirma dims

## Reglas comunes (todos los prompts incluyen)

- **Mantener identidad del proyecto**: es una obra real de MEISA en Colombia, no re-imaginar desde cero.
- **No inventar texto, logos ni marcas** — si no está en la foto original, no debe aparecer.
- **Preservar la estructura metálica tal cual** — son aceros reales, no "mejorar" su geometría.
- **Iluminación natural y realista** — no cinematic, no HDR exagerado.
- **Output**: máxima resolución, formato PNG sin compresión, aspect ratio 16:9 cuando sea posible (mejor para full-screen hero).

---

## 📂 CATEGORÍA: Comercial

### 1. Estructuras de Gran Luz — Centro Comercial Campanario ⚠️ Moderada

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/centro-comercial-campanario/centro-comercial-campanario-01-Centro-campanario-1-scaled-1600x1600.webp`

**Qué se ve:** Fachada moderna del CC Campanario, techo curvo blanco tipo carpa tensada, fachada negra-naranja con logo "CAMPANARIO", zona de parking con autos, postes de luz, calle y césped en primer plano, cielo con nubes cúmulus.

**Problemas:**
- Demasiado espacio muerto arriba (cielo) y abajo (calle + césped).
- Postes de luz a ambos lados compiten con la estructura.
- Autos en el parking distraen.
- Cable eléctrico atraviesa la imagen.
- Composición muy centrada, no hay jerarquía visual para hero.

**PROMPT:**
```
Recompón esta foto del Centro Comercial Campanario (Popayán) como hero
horizontal 16:9 (1920x1080 o mayor). Mantené íntegramente la estructura
metálica curva del techo (forma de carpa tensada) y la fachada
arquitectónica con el logo CAMPANARIO.

QUITÁ:
- Los postes de luz de ambos lados
- Los autos del parking
- Los cables eléctricos que cruzan el cielo
- Exceso de césped y calle en primer plano (acercate a la estructura)

MANTENÉ:
- El cielo con nubes cúmulus exactamente como está (es dramático y real)
- La paleta de colores original (negro-naranja-blanco)
- El logo "CAMPANARIO" tal cual
- La curvatura y geometría del techo

OUTPUT: PNG 1920x1080 mínimo, fotorealista, sin post-procesado
cinematográfico, sin saturar.
```

---

### 2. Cubiertas y Fachadas Metálicas — Centro Comercial Único Cali 🚨 Grave

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/centro-comercial-unico-cali/centro-comercial-unico-cali-01-Centro-unico-cali-1-1600x1600.webp`

**Qué se ve:** Fachada azul del CC Único con letrero rojo "OUTLE" (cortado), una mascota amarilla (emoji pulgar arriba) colgando, árbol con hojas tapando la esquina, bancas azules en primer plano, piso de tierra, farolas.

**Problemas:**
- La **mascota amarilla** es una decoración comercial ajena a MEISA que domina.
- Árboles tapan el ángulo superior.
- El letrero "OUTLE" se ve cortado y barato.
- Bancas, piso de tierra, farolas son todos distractores.

**PROMPT:**
```
Rehacé la composición de esta foto del Centro Comercial Único (Cali)
para usar como hero horizontal 16:9. El protagonista DEBE ser la
fachada y cubierta metálica azul.

QUITÁ:
- La mascota amarilla (emoji pulgar arriba) que cuelga del techo
- El letrero rojo "OUTLE" cortado
- Los árboles que tapan la esquina superior izquierda
- Las bancas azules y demás mobiliario en primer plano
- El piso de tierra/barro
- Las farolas blancas en primer plano

MANTENÉ:
- La fachada metálica azul con paneles blancos y celestes
- La cubierta plana metálica
- El cielo despejado celeste
- La escala arquitectónica del edificio

OUTPUT: PNG 1920x1080 mínimo, perspectiva ligeramente elevada, sol
suave desde el lado, sin logos de ninguna marca, sin personas.
```

---

### 3. Entrepisos y Mezanines — Armenia Plaza (nueva imagen drone aéreo) ✅ Casi lista

**URL actual (ACTUALIZADA — gal3 drone aéreo):**
`https://storage.googleapis.com/meisa-imagenes/projects/centro-comercial-armenia-plaza/centro-comercial-armenia-plaza-03-Centro-armenia-plaza-3-1600x1600.webp`

**Qué se ve:** Vista aérea tipo drone del edificio comercial CON ESTRUCTURA DE ENTREPISO METÁLICO VISIBLE desde arriba — se ven las vigas y el marco del mezanine, edificio sobre solar con área pavimentada, casas/entorno urbano al fondo, vegetación.

**Cambio clave:** reemplazamos la portada con trabajadores+grúa por esta foto aérea donde se ve exactamente la estructura de entrepiso desde arriba. Perfecto para "Entrepisos y Mezanines" porque se ve la geometría.

**Retoques menores:**
- Area de tierra alrededor del edificio (obra)
- Re-encuadre a 16:9

**PROMPT:**
```
Vista aérea drone del Centro Comercial Armenia Plaza mostrando la
estructura metálica del entrepiso/mezanine desde arriba. Adaptala
a hero 16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- La estructura metálica de vigas y columnas del mezanine (es el
  protagonista)
- La perspectiva aérea oblicua
- Las casas y vegetación del entorno urbano
- La iluminación natural

QUITÁ / MINIMIZÁ:
- Las áreas de tierra de obra alrededor del edificio
- Cualquier vehículo de obra o container visible
- La malla verde de obra si aparece

MEJORÁ:
- Re-encuadrá a horizontal 16:9
- El piso del entorno que se vea terminado (pavimentado, no tierra)

OUTPUT: PNG 1920x1080, protagonismo de la estructura metálica del
entrepiso vista desde arriba, ambiente comercial terminado.
```

---

## 📂 CATEGORÍA: Industrial

### 1. Naves Industriales de Gran Luz — Bodega Protécnica Etapa II ✅ Casi lista (retoque menor)

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/bodega-protecnica-etapa-ii/bodega-protecnica-etapa-ii-01-industria-bodega-protecnica-etapa-dos-01-Industria-bodega-protecnica-etapa-dos-1-1600x1600.webp`

**Qué se ve:** Estructura metálica arqueada de nave industrial ya erigida, cielo dramático con nubes cúmulus, nave terminada gris al fondo, malla verde de obra a la izq, algunos materiales y tubos blancos en el suelo.

**Problemas menores:**
- Malla verde de obra a la izquierda.
- Tubos blancos apilados en el suelo derecho.
- Ligero desorden de obra en piso.

**PROMPT:**
```
Esta foto de la Bodega Protécnica Etapa II tiene una composición
muy fuerte — la estructura metálica arqueada es heroica. Hacé una
limpieza menor para que funcione como hero 16:9.

QUITÁ:
- La malla verde de obra a la izquierda
- Los tubos/perfiles blancos apilados en el suelo derecho
- Cualquier escombro menor en primer plano

MANTENÉ EXACTAMENTE IGUAL:
- La estructura arqueada metálica (geometría, color gris, nivel de
  detalle)
- El cielo dramático con nubes cúmulus (no tocar)
- La nave terminada gris del fondo
- La iluminación natural atardecer/temprana mañana
- El color de la tierra y el suelo

OUTPUT: PNG 1920x1080, fotorealista exacto, la estructura debe
seguir siendo EL protagonista.
```

---

### 2. Edificios Industriales de Múltiples Niveles — Torre Propal (nueva gal2) ✅ Casi lista

**URL actual (ACTUALIZADA — gal2 estructura limpia):**
`https://storage.googleapis.com/meisa-imagenes/projects/industria-torre-cogeneracion-propal/torre-cogeneracion-propal-02-industria-torre-cogeneracion-propal-02-Industria-torre-cogeneracion-propal-2-1600x1600.webp`

**Qué se ve:** Estructura metálica azul de múltiples niveles vista desde abajo, perspectiva dramática mostrando las vigas y columnas cruzadas, chimenea industrial visible al fondo entre el marco, cielo con algunas nubes, materiales apilados abajo.

**Cambio clave:** reemplazamos la foto con grúa Genie dominando por esta perspectiva ascendente donde la ESTRUCTURA METÁLICA es la protagonista — muestra exactamente los "múltiples niveles" del edificio industrial.

**Retoques menores:**
- Un poco de obra/materiales apilados en la parte baja
- Grúa naranja en borde superior izquierdo

**PROMPT:**
```
Foto de la estructura metálica de la Torre de Cogeneración Propal
vista desde abajo — múltiples niveles industriales. Adaptala a
hero 16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- La estructura metálica azul (vigas horizontales y columnas)
- La perspectiva ascendente dramática
- La chimenea industrial del fondo
- El cielo con nubes

QUITÁ:
- Los materiales apilados en la parte baja
- La grúa naranja del borde superior izquierdo (si visible)
- Cualquier elemento de obra temporal

MEJORÁ:
- Re-encuadrá a 16:9
- Un poco más de profundidad de campo para resaltar la geometría
  estructural

OUTPUT: PNG 1920x1080, estructura industrial azul como
protagonista, múltiples niveles claramente visibles.
```

---

### 3. Estructuras Especializadas de Alta Resistencia — Planta industrial aérea (drone) ✅ Lista

**URL actual (ACTUALIZADA — drone pool):**
`https://storage.googleapis.com/meisa-imagenes/drone-pool/dji_fly_20230729.webp`

**Qué se ve:** Vista aérea tipo drone de una planta industrial — naves industriales con cubiertas metálicas blancas y azules, patios operativos, vehículos/camiones, entorno industrial limpio. 4000×2250 (4K). Sin logos de cliente.

**Cambio clave:** reemplazamos el tanque GLP con logos "SURGAS" por esta foto aérea genérica de planta industrial MEISA. **Ninguna limpieza necesaria** — ya está hero-ready.

**PROMPT (opcional, si querés re-encuadrar):**
```
Adaptá esta vista aérea de planta industrial MEISA a proporción
16:9 horizontal. La foto ya es limpia y bien compuesta.

MANTENÉ EXACTAMENTE:
- Todas las naves industriales con sus cubiertas metálicas
- El patio operativo y vehículos
- La iluminación natural
- Los colores reales (sin saturar)

SOLO AJUSTÁ:
- Re-encuadre a 16:9 (ya es muy cercano)

OUTPUT: PNG 1920x1080, vista aérea planta industrial, sin
modificaciones al contenido.
```

**PROMPT:**
_(Prompt legacy para la imagen anterior — ya no aplicable. Ver prompt actualizado arriba.)_

---

## 📂 CATEGORÍA: Puentes

### 1. Puentes de Vigas y Cerchas — Puente Vehicular La Paila ⚠️ Moderada

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`

**Qué se ve:** Puente de cerchas metálicas en color ocre-óxido (Weathering Steel), vista frontal en perspectiva, barrera naranja-blanca de señalización abajo, cinta amarilla de peligro, cono anaranjado, montañas al fondo, losa de concreto.

**Problemas:**
- Barrera de obstáculo naranja/blanca en primer plano.
- Cinta amarilla "PELIGRO" cruzando.
- Cono anaranjado.
- Tierra/obra inacabada abajo.

**PROMPT:**
```
Esta foto del Puente Vehicular La Paila tiene una estructura de
cerchas metálicas impresionante (acero cor-ten / weathering steel
color ocre). Limpiala para hero 16:9 conservando el puente entero.

QUITÁ:
- La barrera de señalización naranja/blanca en primer plano
- La cinta amarilla de peligro que cruza la imagen
- El cono anaranjado vertical
- Los hierros/barras de refuerzo visibles a la derecha
- El desorden de obra/tierra en primer plano

MANTENÉ:
- El puente de cerchas metálico completo en color ocre-óxido
  (weathering steel) — todas las diagonales y verticales
- La losa de concreto del tablero
- Las montañas y cielo del fondo (son parte de la identidad del
  proyecto)
- La perspectiva frontal-diagonal mirando hacia el puente

MEJORÁ:
- El suelo en primer plano: pavimento nuevo de concreto o asfalto
  recién terminado, sin tierra suelta
- Cielo ligeramente más dramático con nubes suaves

OUTPUT: PNG 1920x1080, el puente en todo su esplendor estructural
sin señales de obra activa.
```

---

### 2. Puentes en Arco Metálico — Puente Arco Saraconcho ✅ Buena (retoque menor)

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/consorcio-competitividad-puente-arco-saraconcho/Puente-vehicular-saraconcho-4.webp`

**Qué se ve:** Vista lateral frontal del puente de arco metálico tipo bowstring (acero corten color ocre) cruzando valle, contra cielo azul con nubes cúmulus dispersas, montañas verdes al fondo a la izquierda. Longitud 150 metros.

**Problemas menores:**
- Se ve algo de grúa amarilla en el borde izquierdo inferior (esquina).
- Cables eléctricos delgados cruzando la parte superior del cielo.
- Algún andamio mínimo en el extremo izquierdo.
- Vegetación en primer plano algo desordenada.

**PROMPT:**
```
Esta foto del Puente Arco Saraconcho (150m) es un ARCO METÁLICO
REAL tipo bowstring — la más icónica del catálogo MEISA para esta
especialidad. Adaptala a hero 16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- El arco metálico completo (acero corten color ocre) — es el
  protagonista absoluto
- La geometría del arco con los tirantes verticales
- El tablero del puente
- El cielo azul con nubes cúmulus dispersas
- Las montañas verdes del fondo
- La iluminación natural diurna

QUITÁ:
- La grúa amarilla visible en el borde izquierdo inferior
- Los cables eléctricos delgados que cruzan el cielo en la
  parte superior
- Cualquier andamio temporal en los extremos
- Vegetación desordenada en primer plano (dejar que se vea más
  prolija y natural)

MEJORÁ:
- Que el arco se vea limpio, sin elementos parasitarios
- Un poco más de contraste atmosférico (sin saturar)
- Re-encuadrá a 16:9 horizontal manteniendo el arco entero visible

OUTPUT: PNG 1920x1080, arco bowstring Saraconcho limpio sobre
paisaje andino, perfecto para hero de especialidad "Puentes en
Arco Metálico".
```

---

### 3. Puentes Peatonales — Puente La Tertulia (nueva gal2, terminado) ✅ Casi lista

**URL actual (ACTUALIZADA — gal2 puente terminado):**
`https://storage.googleapis.com/meisa-imagenes/projects/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-02-Puente-peatonal-la-tertulia-2-1600x1600.webp`

**Qué se ve:** Puente peatonal La Tertulia TERMINADO — viga cajón color acero corten con baranda metálica, vista lateral con edificios residenciales blancos al fondo, árboles y vegetación urbana. **Sin trabajadores, sin obra.** Calle con autos visible al fondo.

**Cambio clave:** reemplazamos la foto de 3 trabajadores con cascos instalando, por esta foto del puente ya terminado y funcional.

**Retoques menores:**
- Algo de maleza/pasto alto en primer plano
- Algunos autos en el estacionamiento al fondo

**PROMPT:**
```
Foto del Puente Peatonal La Tertulia TERMINADO con baranda metálica.
Adaptala a hero 16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- La viga cajón color acero corten (weathering steel)
- La baranda metálica superior
- Los edificios residenciales blancos al fondo
- La vegetación y árboles del entorno
- La composición horizontal

QUITÁ:
- Los autos estacionados del fondo (si visibles)
- La maleza alta en primer plano
- Cualquier elemento que distraiga

MEJORÁ:
- Un poco de contraste en el acero corten para resaltar la textura
- El cielo ligeramente más dramático

OUTPUT: PNG 1920x1080, puente peatonal terminado integrado al
entorno urbano, sin personas, sin obra.
```

---

## 📂 CATEGORÍA: Infraestructura Urbana

### 1. Ciclopuentes y Pasarelas — Escalinata Curva Río Cali ⚠️ Moderada

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/escalinata-curva-rio-cali/escalinata-curva-rio-cali-01-puentes-peatonales-escalinata-curva-rio-cali-01-Puente-peatonal-escalinata-curva-rio-cali-1-1600x1600.webp`

**Qué se ve:** Cubierta curva metálica blanca (costillas tipo ribs) sobre estructura en construcción, madera del cofrado visible en el techo izquierdo, vegetación y algo azul (piscina?) al fondo, entorno parcialmente rural.

**Problemas:**
- **Techo de madera (cofrado de construcción)** en la mitad izquierda — es una estructura temporal.
- La estructura metálica se ve bien a la derecha pero está mezclada con obra.
- Objetos azules/piscinas confusos al fondo.

**PROMPT:**
```
Esta foto de la Escalinata Curva del Boulevard del Río Cali tiene
dos estructuras: a la izquierda madera (cofrado temporal de obra)
y a la derecha la estructura metálica blanca curva definitiva.
Necesito que quede SOLO la metálica, como hero 16:9.

QUITÁ:
- Todo el techo de madera/cofrado de la mitad izquierda
- La base de madera con algún armazón en primer plano izquierda
- Los objetos azules (piscina temporal?) del fondo derecho
- Cualquier vegetación descuidada

TRANSFORMÁ:
- Donde estaba el cofrado de madera → extender la estructura
  metálica blanca curva para que sea una cubierta/ciclopuente
  continuo y simétrico
- El entorno → paisaje urbano limpio (vegetación ordenada, río
  visible al fondo si encaja)

MANTENÉ:
- La estructura metálica blanca con costillas tipo ribs (la parte
  derecha de la imagen actual)
- El color blanco de las costillas
- La perspectiva diagonal ascendente

OUTPUT: PNG 1920x1080, ciclopuente metálico blanco curvo completo
y terminado, ambiente urbano limpio.
```

---

### 2. Estaciones de Transporte Masivo — Estación MIO Guadalupe ⚠️ Moderada

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/edificio-estacion-mio-guadalupe/estacion-mio-guadalupe-01-edificio-estacion-mio-guadalupe-01-Edificio-estacion-mio-guadalupe-1-1600x1600.webp`

**Qué se ve:** Estructura metálica de techo inclinado para estación de transporte, columnas de concreto y metal, andamios y malla verde de obra tapando toda la parte baja, cielo azul despejado, un trabajador pequeño visible arriba a la derecha, cono amarillo en la esquina derecha.

**Problemas:**
- **Malla verde de obra** cubre ~40% inferior de la imagen.
- Andamios blancos y escalinata visibles.
- Un trabajador pequeño (casi invisible pero presente).
- Cono de seguridad.
- Es claramente una foto de obra en proceso.

**PROMPT:**
```
Esta foto de la Estación MIO Guadalupe está en plena obra. Necesito
que quede como hero 16:9 mostrando la estación TERMINADA y
funcional.

QUITÁ:
- Toda la malla verde de obra (cubre la parte baja)
- Los andamios blancos al lado izquierdo
- El trabajador pequeño arriba a la derecha (si es visible)
- El cono amarillo de la esquina
- Cualquier armadura de hierro expuesta o tablas de cofrado

MANTENÉ:
- La estructura metálica de techo inclinado (es el protagonista
  de la estación)
- Las columnas de concreto cilíndricas
- El cielo azul despejado
- La geometría arquitectónica

TRANSFORMÁ:
- La parte baja (donde estaba la obra) → estación de BRT terminada
  y funcional: plataforma, bancas simples, algún usuario esperando
  (opcional, máximo 2 personas muy sutiles)
- El piso → concreto liso terminado o adoquín de estación

OUTPUT: PNG 1920x1080, estación de transporte masivo en pleno
funcionamiento, con la estructura metálica MEISA bien visible.
```

---

### 3. Puentes Peatonales Urbanos — Puente La Tertulia 🚨 Grave

**Misma imagen que Puentes #3.** Usá el mismo prompt pero guardá el resultado con nombre distinto o compartí el mismo archivo upscaled para ambas especialidades (la misma foto sirve para ambas).

---

## 📂 CATEGORÍA: Edificaciones

### 1. Pórticos Metálicos de Múltiples Niveles — Clínica Reina Victoria ✅ Casi lista

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/edificio-clinica-reina-victoria/clinica-reina-victoria-01-edificio-clinica-reina-victoria-01-Edificio-clinica-reina-victoria-1-1600x1600.webp`

**Qué se ve:** Vista aérea tipo drone del edificio blanco de 6 pisos con franjas naranjas en los niveles, techo plano blanco, entorno urbano con árboles y carros alrededor, edificios vecinos grises.

**Problemas menores:**
- Autos estacionados alrededor.
- Edificios vecinos feos al fondo.
- Proporción cuadrada en vez de 16:9.

**PROMPT:**
```
Esta vista aérea de la Clínica Reina Victoria es muy buena. Adaptala
a formato hero 16:9 horizontal con algo de cleanup.

QUITÁ / MINIMIZÁ:
- Los autos estacionados alrededor del edificio
- Los edificios vecinos genéricos del fondo (o atenuá su presencia
  difuminándolos)
- Cualquier grúa, andamio o señal de obra visible

MANTENÉ:
- El edificio Clínica Reina Victoria EXACTAMENTE como está
  (6 pisos, franjas naranjas, fachada blanca)
- El techo plano blanco
- La vegetación verde cercana al edificio
- La luz natural clara

TRANSFORMÁ:
- Re-encuadrá a horizontal 16:9 dando más protagonismo al edificio
- El entorno urbano → más limpio, menos saturado (edificios
  vecinos de color neutro más suave)

OUTPUT: PNG 1920x1080, la clínica como protagonista aéreo, entorno
urbano limpio.
```

---

### 2. Estructuras Metálicas para Estacionamiento — Parqueadero Tequendama 🚨🚨 CRÍTICO

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/diego-maria-romero-parqueadero-tequendama/Edificio-tequendama-parking-cali-1-1536x626.webp`

**Qué se ve:** **Render 3D de diseño estructural (probablemente Tekla/BIM)** con colores saturados irreales (rosa, verde lima, amarillo, cian, púrpura) sobre fondo blanco total.

**Problemas:**
- **NO es una foto** — es un modelo BIM. Colores tipo caramelo (no realistas).
- Fondo blanco total (sin contexto).
- Rampa interior visible (curva blanca-naranja).

Este caso requiere una decisión: o generamos una imagen fotorealista desde el render, o reemplazamos por otra foto (si hay -2, -7, -8 son canónicas pero no necesariamente de la fachada).

**PROMPT para generar fotorealismo desde el render BIM:**
```
Esta imagen es un render estructural 3D (Tekla/BIM) del Edificio
Parqueadero Tequendama en Cali. Necesito convertirlo en una imagen
fotorealista del parqueadero terminado, que sirva como hero 16:9
para un portfolio de ingeniería estructural.

INTERPRETÁ el render:
- Es un edificio de estacionamiento de múltiples niveles con
  pórticos metálicos
- Tiene una rampa curva interior (la parte curva blanca-naranja)
- Estructura abierta (sin cerramiento completo)

TRANSFORMÁ a foto realista:
- Colores reales: acero gris/blanco estructural, NO rosa/verde/amarillo
- Concreto gris en losas
- Luz natural exterior entrando por los lados
- Contexto urbano: calle, edificios vecinos suaves, cielo claro
- Perspectiva: ligeramente elevada, mostrando la fachada abierta
  con los niveles visibles y la rampa curva

MANTENÉ:
- La geometría estructural exacta (pórticos, niveles, rampa)
- La forma arquitectónica
- La escala aparente

OUTPUT: PNG 1920x1080, parqueadero Tequendama fotorealista terminado
y en uso, sin personas, sin autos excesivos.
```

**Alternativa más segura:** reutilizar la imagen `Edificio-tequendama-parking-cali-2.webp` (otra de las variantes que ya está en GCS, es una foto real de fachada).

---

### 3. Estructuras Livianas Modulares — Módulos Médicos Espíritu Santo ⚠️ Moderada

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/edificio-modulos-medicos/modulos-medicos-01-edificio-modulos-medicos-01-Edificio-modulos-medicos-1-1600x1600.webp`

**Qué se ve:** Vista interior amplia desde debajo de un entrepiso metálico en construcción, viguetas metálicas visibles, columnas blancas, una persona pequeña al fondo, tablones de madera en el piso (obra), paisaje verde montañoso al fondo a través de los vanos.

**Problemas:**
- Tablones de madera en el piso (obra en proceso).
- Una persona visible al fondo.
- Estructura sin cerramientos.

**PROMPT:**
```
Esta foto interior de los Módulos Médicos Espíritu Santo Parque
Clínico tiene una buena perspectiva estructural. Conviértela en
hero 16:9 del espacio TERMINADO.

QUITÁ:
- Los tablones de madera en el piso (son cofrado/obra)
- La persona pequeña al fondo
- Cualquier herramienta o material de obra

MANTENÉ:
- Las viguetas metálicas blancas del techo/entrepiso (protagonista
  estructural)
- Las columnas verticales blancas
- El paisaje verde con montañas visible a través de los vanos
- La perspectiva profunda del espacio

TRANSFORMÁ:
- El piso → concreto pulido terminado o piso técnico de clínica
- El espacio → como si fuera un módulo médico recién terminado,
  con iluminación natural limpia
- Ambiente → sereno, profesional, sin obra activa

OUTPUT: PNG 1920x1080, espacio modular interior terminado, viguetas
MEISA bien visibles como protagonistas estructurales, paisaje
natural al fondo.
```

---

## 📂 CATEGORÍA: Institucional

### 1. Coliseos y Estadios Deportivos — Coliseo Mayor Juegos Popayán 2012 ✅ Casi lista

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/coliseo-mayor-juegos-nacionales-2012/coliseo-mayor-juegos-nacionales-2012-02-escenario-deportivo-juegos-nacionales-coliseo-mayor-02-Escenario-deportivo-juegos-nacionales-coliseo-mayor-2-1600x1600.webp`

**Qué se ve:** Vista aérea del coliseo con cubierta metálica azul y blanca muy prominente, estructura curva visible, parqueos y algo de entorno urbano. Ya está bien compuesto.

**Problemas menores:**
- Tierra/parking de obra en primer plano inferior.
- Proporción cuadrada.

**PROMPT:**
```
Esta vista aérea del Coliseo Mayor (Juegos Nacionales Popayán 2012)
es una foto hero muy fuerte. Solo adaptala a 16:9.

QUITÁ:
- Cualquier zona de obra o tierra marrón visible en primer plano
- Vehículos o elementos temporales

MANTENÉ EXACTAMENTE:
- La cubierta metálica azul y blanca con su patrón icónico
- La geometría curva de la estructura
- El contexto urbano del fondo
- Los colores actuales

TRANSFORMÁ:
- Re-encuadre a horizontal 16:9
- Suelo de acceso pavimentado y limpio (parqueo ordenado si aplica)
- Césped más cuidado al lado del coliseo

OUTPUT: PNG 1920x1080, vista aérea del coliseo como ícono deportivo
terminado.
```

---

### 2. Piscinas y Complejos Acuáticos — Complejo Acuático Popayán ✅ Muy buena

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/projects/complejo-acuatico-popayan/complejo-acuatico-popayan-01-escenarios-deportivos-complejo-acuatico-popayan-01-Escenario-deportivo-compejo-acuativo-popayan-1-1600x1600.webp`

**Qué se ve:** Interior de piscina olímpica con cubierta metálica de arcos cruzados tipo ribs, reflejos sobre el agua, simétrica.

**Problemas menores:**
- El agua se ve un poco turbia/verdosa.
- Algunos objetos en el fondo (escalera, marcadores).

**PROMPT:**
```
Esta foto interior del Complejo Acuático Popayán ya es excelente —
la cubierta metálica con arcos cruzados es el protagonista perfecto.
Solo pulir pequeños detalles para hero 16:9.

QUITÁ / MINIMIZÁ:
- La escalera en el borde izquierdo (si es un detalle menor)
- Cualquier marcador, boya o accesorio flotante
- Colchón/objetos en el agua

MANTENÉ:
- La cubierta metálica con arcos cruzados tipo ribs EXACTAMENTE
- La geometría simétrica del espacio
- Los reflejos sobre el agua
- La escala imponente

MEJORÁ:
- El agua → azul piscina limpio y translúcido (no verdoso)
- La iluminación natural → luz entrando por los lados, más dramática

OUTPUT: PNG 1920x1080, piscina olímpica con cubierta MEISA, agua
cristalina, ambiente deportivo-arquitectónico limpio.
```

---

### 3. Canchas Múltiples Cubiertas — Cancha Múltiple Javeriana Cali ✅ Buena (retoque menor)

**URL actual:**
`https://storage.googleapis.com/meisa-imagenes/categories/1772484398703-ntnn3q.jpeg`

**Qué se ve:** Vista interior de cancha polideportiva cubierta. Techo metálico con estructura de vigas de acero pintadas en negro, paneles perforados dispuestos en patrón escalonado que dejan filtrar luz natural. Mallas verticales laterales (cancha), palmeras visibles al fondo a través de las aperturas. Composición horizontal perfecta para hero.

**Problemas menores:**
- Proporción ya es ~16:9 (buena para hero).
- Contraste entre el techo oscuro y los paneles iluminados es dramático y fotogénico.
- Solo algunos detalles: las mallas de protección se ven un poco pobres en los laterales.
- Zona de fondo un poco oscura.

**PROMPT:**
```
Esta foto interior de la Cancha Múltiple Universidad Javeriana Cali
(Etapa 2) tiene una composición arquitectónica muy fuerte — vigas
metálicas negras con paneles perforados escalonados que filtran luz
natural. Adaptala a hero 16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- La estructura metálica negra de cerchas (es el protagonista)
- El patrón escalonado de paneles perforados en el techo
- La luz natural filtrada entre los paneles (efecto dramático)
- La perspectiva ascendente mirando al techo
- La vegetación de palmeras visible al fondo

QUITÁ / MINIMIZÁ:
- Las mallas laterales de protección si se ven pobres (hacelas más
  limpias y prolijas)
- Cualquier cable o elemento eléctrico distractor
- Las sombras excesivas de la parte inferior

MEJORÁ:
- Un poco más de luz en las zonas de sombra para balancear el
  contraste (sin quitar el drama)
- Que la luz entre los paneles se vea nítida y con rayos sutiles
- El piso/cancha (si es visible) que sea claro y liso

OUTPUT: PNG 1920x1080 (ya está cerca de esa proporción), ambiente
polideportivo universitario terminado, protagonismo total de la
estructura metálica de cerchas, sin personas, sin distractores.
```

---

## 📝 Resumen de prioridades

| Código | Especialidad | Prioridad | Motivo |
|---|---|---|---|
| comercial-2 | Cubiertas y Fachadas Metálicas | 🚨 Alta | Logo mascota + "OUTLE" dominan |
| comercial-3 | Entrepisos y Mezanines | ⚠️ Menor | Drone aéreo (swap hecho) — retoque de entorno |
| industrial-2 | Edificios Industriales Multinivel | ⚠️ Menor | gal2 (swap hecho) — retoque menor |
| industrial-3 | Estructuras Especializadas | ✅ Lista | dji_fly drone pool (swap hecho) — 0 cleanup |
| puentes-3 + infra-3 | Puentes Peatonales Tertulia (2) | ⚠️ Menor | gal2 terminado (swap hecho) |
| edif-2 | Estructuras para Estacionamiento | 🚨🚨 Crítica | Es render BIM, no foto |
| infra-1 | Ciclopuentes y Pasarelas | 🚨 Alta | Madera de cofrado tapando |
| infra-2 | Estaciones de Transporte | ⚠️ Media | Malla de obra abajo |
| edif-3 | Estructuras Livianas Modulares | ⚠️ Media | Obra en piso |
| inst-3 | Canchas Múltiples Cubiertas | ⚠️ Menor | Solo retoque de luz + mallas |
| comercial-1 | Estructuras de Gran Luz | ⚠️ Menor | Postes/autos/cables |
| puentes-1 | Puentes de Vigas y Cerchas | ⚠️ Menor | Barrera + cinta peligro |
| edif-1 | Pórticos Metálicos | ⚠️ Menor | Autos, entorno feo |
| industrial-1 | Naves Industriales | ⚠️ Mínima | Solo retoque |
| puentes-2 | Puentes en Arco Metálico (Saraconcho) | ⚠️ Menor | Grúa+cables, limpieza ligera |
| inst-1 | Coliseos y Canchas | ⚠️ Mínima | Re-encuadre |
| inst-2 | Piscinas Cubiertas | ⚠️ Mínima | Agua + retoque |

## 📊 Estado actual (actualizado)

**✅ Procesadas (9):** comercial-1, comercial-2, **~~comercial-3~~** (obsoleta por swap), industrial-1, **~~industrial-2~~** (obsoleta por swap), inst-1, inst-2, inst-3, puentes-1

**⚠️ Ya listas sin procesamiento:** industrial-3 (dji_fly drone 4K)

**🔴 Faltan por procesar (8):**

| Código | Prioridad |
|---|---|
| edif-2 | 🚨🚨 Crítica (render 3D) |
| infra-1 | 🚨 Alta |
| infra-2 | ⚠️ Moderada |
| edif-3 | ⚠️ Moderada |
| edif-1 | ⚠️ Menor |
| puentes-2 | ⚠️ Menor |
| puentes-3 | ⚠️ Menor |
| infra-3 | ⚠️ Menor (= puentes-3) |

**Tip:** puentes-3 y infra-3 usan la MISMA imagen (Tertulia gal2) — procesás una sola vez y la usás para ambas.

Esas 6 cambian totalmente la percepción de calidad del sitio. Las demás se pueden hacer después o dejar como están.

---

## 💾 Ruta de entrega

Cuando tengas los PNG terminados, guardalos en:
```
~/Downloads/meisa-hero-fix/<codigo>.png
```

Ej:
- `~/Downloads/meisa-hero-fix/comercial-2.png`
- `~/Downloads/meisa-hero-fix/industrial-3.png`

Cuando termines, avisame y corro un script que los convierte a WebP, los sube a GCS y actualiza las URLs en DB.
