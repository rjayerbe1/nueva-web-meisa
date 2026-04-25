# Hero Images — Prompts para Nano Banana Pro (pendientes)

**Estado actual:**
- ✅ 9 procesadas aplicadas a DB: comercial-1/2/3, industrial-1/2, inst-1/2/3, puentes-1
- 🔴 9 pendientes (en `~/Downloads/meisa-hero-fix/originales/`)

## Flujo

1. Abrí **gemini.google.com** con tu Workspace, modelo **Gemini 3 Pro** (Nano Banana Pro)
2. Subí cada imagen de `~/Downloads/meisa-hero-fix/originales/` una por una
3. Pegá el prompt correspondiente
4. Descargá el resultado como `~/Downloads/meisa-hero-fix/procesadas/<código>.png`
5. Cuando termines, corro `scripts/apply-processed-heroes.ts` y se aplican todas

## Reglas comunes (todos los prompts)

- **Mantener identidad MEISA**: obra real en Colombia, no re-imaginar
- **No inventar texto, logos ni marcas** — si no está, no debe aparecer
- **Preservar la estructura metálica** tal cual — son aceros reales
- **Iluminación natural y realista** — no cinematic, no HDR exagerado
- **Output**: PNG sin compresión, aspect ratio 16:9 (1920x1080+)

---

## 🔴 9 Pendientes

### 1. `industrial-3.webp` — Complejo Industrial Piedechinche ⚠️ Moderada

**Qué se ve:** Vista aérea drone del Complejo Industrial Piedechinche (Ingenio Providencia) — naves industriales blancas con cubiertas a dos aguas y cerchas visibles, una nave a la izquierda en construcción (pórticos sin techar), terreno rural plano, montañas verdes al fondo, vallas azules perimetrales de obra. **Hero de "Estructuras Especializadas de Alta Resistencia"** en categoría Industrial.

**Problemas:**
- Vallas azules perimetrales de obra (en U alrededor del predio)
- Estructura izquierda sin terminar (pórticos sin cubierta)
- Algo de tierra/excavación visible

**PROMPT:**
```
Vista aérea drone del Complejo Industrial Piedechinche (Ingenio
Providencia) — naves industriales metálicas con cubiertas blancas.
Adaptala a hero 16:9 mostrando el complejo TERMINADO.

MANTENÉ EXACTAMENTE:
- Las naves industriales blancas con sus cubiertas a dos aguas y
  cerchas visibles
- El terreno rural plano alrededor
- Las montañas verdes del fondo
- La perspectiva aérea oblicua
- La iluminación natural diurna

QUITÁ:
- Las vallas azules perimetrales de obra (todo el contorno)
- Cualquier maquinaria o vehículo de obra
- Las áreas de tierra/excavación visibles

TRANSFORMÁ:
- La estructura de la izquierda sin techar → completala visualmente
  con la misma cubierta blanca que las otras naves (complejo
  terminado)
- El piso → terreno limpio (pasto verde o pavimento industrial),
  sin huellas de obra

OUTPUT: PNG 1920x1080, complejo industrial Piedechinche terminado
visto desde drone, escala imponente de "Estructuras Especializadas
de Alta Resistencia".
```

---

### 2. `puentes-2.webp` — Puente Arco Saraconcho (vista cenital aérea) ✅ Casi lista

**Qué se ve:** Vista aérea cenital drone del **Puente Arco Saraconcho** — arco metálico negro/oscuro tipo bowstring cruzando cañón profundo con río de aguas cafés, carretera curva a la izquierda. Toma muy dramática y limpia, sin trabajadores ni obra. **Hero de "Puentes en Arco Metálico"** en categoría Puentes.

> **Nota**: esta imagen estaba mal asignada antes al proyecto "Cartón Colombia". Verificada y reubicada correctamente al proyecto Saraconcho (es el mismo arco que las otras 4 fotos de Saraconcho — vista lateral, lateral 2, cenital y otra).

**Problemas menores:**
- La imagen está algo subexpuesta/oscura
- La sombra del puente en el río es muy oscura
- Falta un poco de contraste en el arco metálico

**PROMPT:**
```
Foto aérea drone del Puente Vehicular Cartón de Colombia — arco
metálico negro tipo bowstring cruzando cañón con río. Adaptala a
hero 16:9 con un ajuste de exposición.

MANTENÉ EXACTAMENTE:
- El arco metálico negro completo (geometría bowstring/Pratt)
- La carretera curva a la izquierda con el carro pequeño
- El río de aguas cafés al fondo
- La perspectiva cenital aérea
- Las paredes del cañón con vegetación
- La sombra natural del puente sobre el río

MEJORÁ:
- Sube la exposición un poco (la foto se ve subexpuesta/oscura)
- Más contraste en el arco metálico negro para que destaque
- La sombra del puente que conserve textura (no quede negro plano)
- El cielo / luz ambiental que se vea más natural día claro

NO ALTERES:
- La composición ni el ángulo de la foto
- La geometría del arco
- La paleta de colores del entorno (paredes ocres, río café)

OUTPUT: PNG 1920x1080, arco bowstring negro icónico sobre cañón
colombiano, vista cenital aérea limpia y bien expuesta.
```

---

### 3. `puentes-3.webp` — Puente Peatonal La Tertulia ⚠️ Menor

**Qué se ve:** Puente peatonal La Tertulia TERMINADO con baranda metálica, vista lateral con edificios residenciales blancos al fondo, árboles y vegetación urbana. **Hero de "Puentes Peatonales"** (también usado en Infraestructura #3).

**Problemas:**
- Maleza alta en primer plano
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

OUTPUT: PNG 1920x1080, puente peatonal terminado integrado al entorno
urbano, sin personas, sin obra.
```

---

### 4. `infra-1.webp` — Escalinata Curva Río Cali ✅ Casi lista

**Qué se ve:** Arco metálico tipo escama de pez (cubierta curva con costillas) TERMINADO contra cielo, vista lateral con vegetación y río al fondo. **Hero de "Ciclopuentes y Pasarelas Peatonales"**.

**Problemas:**
- Trabajadores pequeños visibles a los costados
- Algo de tierra en primer plano
- Pequeña valla de obra azul al fondo

**PROMPT:**
```
Foto de la Escalinata Curva Boulevard del Río Cali, arco metálico
tipo escama de pez con costillas blancas. Adaptala a hero 16:9.

MANTENÉ EXACTAMENTE:
- El arco curvo con sus costillas metálicas (es el protagonista)
- El color blanco de la estructura
- La vegetación al fondo
- La perspectiva lateral diagonal
- El cielo

QUITÁ:
- Los trabajadores pequeños a los costados
- La valla de obra azul al fondo
- La tierra suelta en primer plano (reemplazar por pavimento o
  vegetación ordenada)

MEJORÁ:
- El cielo ligeramente más dramático con nubes
- Un poco de contraste para resaltar las costillas blancas

OUTPUT: PNG 1920x1080, arco icónico escama de pez limpio integrado
al paisaje urbano, sin personas, sin obra.
```

---

### 5. `infra-2.jpg` — Estación MIO BRT terminada (vista urbana) ✅ Casi lista

**Qué se ve:** Estación BRT terminada y operativa con plataforma cubierta blanca a la derecha, vías separadas (carril buses + carretera vehicular con autos en circulación), barreras amarillas de seguridad, cielo nublado dramático con luz dorada al fondo, vegetación, pasarela peatonal metálica gris a la derecha conectando con la estación. Composición horizontal natural. **Hero de "Estaciones de Transporte Masivo"** en categoría Infraestructura.

**Problemas menores:**
- Cielo nublado gris (puede mejorarse a más claro o más dramático)
- Algo de cables eléctricos
- Re-encuadre 16:9

**PROMPT:**
```
Foto urbana de Estación BRT terminada con vías separadas, plataforma
cubierta blanca y pasarela peatonal metálica. Adaptala a hero 16:9.

MANTENÉ EXACTAMENTE:
- La estación BRT con su plataforma cubierta blanca
- Las dos vías separadas (carril buses central y carretera vehicular)
- Las barreras amarillas de seguridad
- Los autos en circulación en la carretera lateral
- La pasarela peatonal metálica gris a la derecha
- La vegetación urbana
- La composición horizontal con perspectiva del corredor

MEJORÁ:
- El cielo nublado gris → más limpio (azul con nubes dispersas) o
  más dramático (atardecer suave) sin perder realismo
- Limpiar cables eléctricos visibles arriba
- Más contraste para que la infraestructura destaque

NO ALTERES:
- La composición ni el ángulo
- La paleta de colores del concreto, asfalto, autos
- Las barreras amarillas (son parte del diseño)

OUTPUT: PNG 1920x1080, estación de transporte masivo BRT operativa,
infraestructura urbana terminada y en uso.
```

---

### 6. `infra-3.jpeg` — Pasarela peatonal urbana (cercha gris) ✅ Casi lista

**Qué se ve:** Pasarela peatonal metálica elevada con estructura de cercha triangular gris/blanca atravesando el predio, árbol grande con copa frondosa en primer plano, cielo azul espectacular con nubes blancas, edificios industriales blancos al fondo. Sin trabajadores. Composición horizontal natural. **Hero de "Puentes Peatonales Urbanos"** en categoría Infraestructura.

**Problemas menores:**
- Algunos elementos de obra al fondo (containers blancos)
- Algunas marcas/manchas en el pavimento
- Re-encuadre 16:9

**PROMPT:**
```
Foto urbana de pasarela peatonal metálica elevada con estructura de
cercha triangular y árbol icónico en primer plano. Adaptala a hero
16:9 con cleanup ligero.

MANTENÉ EXACTAMENTE:
- La pasarela peatonal metálica con sus cerchas triangulares
- El árbol grande con copa frondosa en primer plano (es feature
  arquitectónico — la pasarela rodea el árbol)
- El cielo azul con nubes blancas (espectacular)
- La perspectiva horizontal con vista del predio
- La paleta de colores: gris/blanco metal, verde árbol, azul cielo

QUITÁ / MINIMIZÁ:
- Los containers/casetas blancas del fondo (atenuarlos o quitarlos)
- Las manchas/marcas oscuras en el pavimento
- Cualquier elemento de obra residual

MEJORÁ:
- Re-encuadre a 16:9 horizontal manteniendo el árbol y la pasarela
- Un poco más de contraste para resaltar la estructura metálica

OUTPUT: PNG 1920x1080, pasarela peatonal urbana terminada con árbol
emblemático, ambiente fotográfico arquitectónico.
```

---

### 7. `edif-1.webp` — Clínica Reina Victoria ⚠️ Menor

**Qué se ve:** Vista aérea drone del edificio Clínica Reina Victoria — fachada blanca con franjas naranjas, techo plano blanco, entorno urbano con árboles, edificios vecinos. **Hero de "Pórticos Metálicos de Múltiples Niveles"**.

**Problemas:**
- Autos estacionados alrededor del edificio
- Edificios vecinos genéricos al fondo
- Proporción cuadrada (1600x1600)

**PROMPT:**
```
Vista aérea drone de la Clínica Reina Victoria. Adaptala a hero 16:9.

MANTENÉ EXACTAMENTE:
- El edificio Clínica Reina Victoria (6 pisos, franjas naranjas,
  fachada blanca)
- El techo plano blanco
- La vegetación verde cercana
- La luz natural clara

QUITÁ / MINIMIZÁ:
- Los autos estacionados alrededor del edificio
- Atenuá los edificios vecinos del fondo (más suaves, neutros)
- Cualquier grúa o señal de obra visible

TRANSFORMÁ:
- Re-encuadre a horizontal 16:9 dando más protagonismo al edificio
- Entorno urbano más limpio

OUTPUT: PNG 1920x1080, clínica como protagonista aéreo, entorno
urbano limpio.
```

---

### 8. `edif-2.webp` — Tequendama 🚨🚨 CRÍTICA

**Qué se ve:** **RENDER 3D estructural (Tekla/BIM)** del Edificio Parqueadero Tequendama Cali — colores irreales rosa, verde lima, amarillo, cian, púrpura sobre fondo blanco. **Hero de "Estructuras Metálicas para Estacionamiento"**.

**Problema crítico:** NO es una foto, es un modelo BIM. Las otras 3 fotos disponibles del proyecto son etapas tempranas de obra (excavación, cofrado) — peores como hero. No hay foto del edificio terminado.

**PROMPT (generar foto realista desde el render):**
```
Esta imagen es un render estructural 3D (Tekla/BIM) del Edificio
Parqueadero Tequendama en Cali. Convertilo en una imagen FOTOREALISTA
del parqueadero terminado, hero 16:9.

INTERPRETÁ el render:
- Edificio de estacionamiento de múltiples niveles con pórticos
  metálicos
- Tiene una rampa curva interior (la parte curva blanca-naranja)
- Estructura abierta (sin cerramiento completo, ventilación natural)

TRANSFORMÁ a foto realista:
- Colores reales: acero gris/blanco estructural, NO los colores
  Tekla (sin rosa, sin verde fluor, sin cian)
- Concreto gris en losas
- Luz natural diurna entrando por los lados abiertos
- Contexto urbano: calle, edificios vecinos suaves, cielo claro
- Perspectiva: ligeramente elevada, mostrando la fachada abierta
  con los niveles visibles y la rampa curva

MANTENÉ:
- La geometría estructural exacta (pórticos, niveles, rampa)
- La forma arquitectónica del edificio
- La escala aparente

OUTPUT: PNG 1920x1080, parqueadero Tequendama fotorealista terminado
y en uso, sin personas, sin autos excesivos, sin elementos del render
(colores BIM eliminados).
```

---

### 9. `edif-3.webp` — Módulos Médicos Espíritu Santo ⚠️ Moderada

**Qué se ve:** Vista interior amplia desde debajo del entrepiso metálico, viguetas blancas en el techo, columnas blancas, paisaje verde con montañas al fondo a través de los vanos, **tablones de madera en el piso (obra)**, persona pequeña al fondo. **Hero de "Estructuras Livianas Modulares"**.

**Problemas:**
- Tablones de madera en el piso (cofrado de obra)
- Persona pequeña al fondo
- Espacio se ve "sin terminar"

**PROMPT:**
```
Foto interior de los Módulos Médicos Espíritu Santo Parque Clínico.
Convertila en hero 16:9 mostrando el espacio TERMINADO.

MANTENÉ EXACTAMENTE:
- Las viguetas metálicas blancas del techo (protagonista estructural)
- Las columnas verticales blancas
- El paisaje verde con montañas visible a través de los vanos
- La perspectiva profunda del espacio

QUITÁ:
- Los tablones de madera en el piso (son cofrado de obra)
- La persona pequeña al fondo
- Cualquier herramienta o material de obra

TRANSFORMÁ:
- El piso → concreto pulido terminado o piso técnico de clínica/módulo
- El espacio → módulo médico recién terminado, iluminación natural
  limpia, ambiente sereno

OUTPUT: PNG 1920x1080, espacio modular interior terminado, viguetas
MEISA como protagonistas estructurales, paisaje natural al fondo.
```

---

## Resumen prioridades pendientes

| Código | Prioridad | Esfuerzo |
|---|---|---|
| **edif-2** Tequendama | 🚨🚨 Crítica | Convertir render BIM a foto |
| edif-3 Módulos Médicos | ⚠️ Moderada | Quitar tablones + persona |
| **industrial-3** Piedechinche | ⚠️ Moderada | Quitar vallas + completar nave |
| infra-1 Escalinata | ⚠️ Menor | Trabajadores + valla obra |
| infra-2 BRT urbano | ⚠️ Menor | Cielo + cables |
| infra-3 Pasarela árbol | ⚠️ Menor | Containers fondo + 16:9 |
| edif-1 Reina Victoria | ⚠️ Menor | Autos + encuadre |
| puentes-2 Saraconcho cenital | ⚠️ Menor | Solo ajuste exposición |
| puentes-3 Tertulia | ⚠️ Menor | Maleza + autos |

**Tip:** infra-3 es el mismo archivo que puentes-3 — solo procesalo una vez y guardalo con ambos nombres.

Cuando termines, avisame y corro `scripts/apply-processed-heroes.ts`.
