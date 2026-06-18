# MEISA — Knowledge Base (grounding del asistente comercial)

> Fuente: contenido REAL del repo `nueva-web-meisa` (lib/soluciones.ts, lib/guias.ts,
> lib/ciudades.ts, prisma/seed-*, schema.prisma) + verificación de rutas en meisa.com.co.
> REGLA DE ORO para el bot: responder SOLO con lo de aquí o lo que diga el usuario.
> No inventar cifras, normas, certificaciones, clientes ni URLs. Lo marcado
> `[runtime/DB]` no está en archivos y debe verificarse en la base de datos antes de afirmarlo.

---

## 1. IDENTIDAD MEISA

- **Razón social:** Metálicas e Ingeniería S.A.S. (marca: **MEISA**).
- **Fundada:** 1996, en **Popayán (Cauca)**. ~30 años de experiencia (calcular: año actual − 1996).
- **Qué hace:** diseño, fabricación y montaje de **estructuras metálicas** y obras civiles. Servicio integral "un solo responsable" (del modelo BIM al acero instalado) bajo un Sistema Integrado de Gestión (SIG).
- **Sectores que atiende (6):** Comercial/retail · Industrial (bodegas) · Puentes · Edificaciones · Deportes & Educación (escenarios) · Infraestructura Urbana.
- **Cobertura:** nacional (Colombia); base y foco en el suroccidente.
- **Plantas (3, reales):**
  - **Jamundí (Valle del Cauca)** — sede principal (administrativa + producción). Vía Panamericana 6 Sur–195. ~6.000 m², grúa 20 t.
  - **Popayán (Cauca)** — Parque Industrial, bodega E13. ~4.400 m², grúa 10 t, 2 mesas CNC. Planta original/histórica.
  - **Villa Rica (Cauca, norte)** — vía Puerto Tejada, vereda Agua Azul. ~4.000 m², 2 naves, grúa 20 t.
  - Capacidad combinada **~600 toneladas/mes**; **+320 colaboradores** (cifras del seed; tratar como aproximadas/[verificar]).
- **Líder citable:** Roberto Ayerbe Camayo — Gerente Técnico | Socio Fundador.
- **Misión (resumen):** fortalecer la empresa a nivel nacional con calidad de productos y servicios, rentabilidad y satisfacción de clientes y colaboradores.
- **Visión (resumen):** soluciones en estructuras metálicas y obras civiles con balance entre costo, diseño, funcionalidad y calidad, cumpliendo normas sismo resistentes vigentes.
- **Valores:** Efectividad, Integridad, Lealtad, Proactividad, Aprendizaje Continuo, Respeto, Pasión, Disciplina.
- **Cifras agregadas que aparecen en el contenido público** (orientativas; varias se calculan en runtime desde DB): **+260–264 proyectos**, **+32.000 toneladas** de acero, **59 ciudades**, fabricando desde 1996. Usar con prudencia; preferir cifras por sector (abajo).

---

## 2. SERVICIOS (alto nivel)

Ciclo completo bajo un solo contrato. 4 fases del "Proceso Integral":
1. **Consultoría e Ingeniería BIM** — análisis estructural y sísmico; modelado 3D (Tekla Structures); diseño con ETABS, SAP2000, Midas, SAFE; conexiones con IDEA StatiCa (CBFEM); planos de fabricación y memorias de cálculo.
2. **Fabricación y Logística** — corte CNC (FastCAM, 3 mesas CNC), soldadura calificada AWS D1.1, granallado + pintura anticorrosiva, trazabilidad por pieza (QR), despacho coordinado.
3. **Montaje especializado** — izaje con grúas (8 puentes grúa propios), personal certificado trabajo en alturas (Res. 1409), inspección SIG, SG-SST.
4. **Entrega y Garantía** — documentación As-Built, capacitación, garantía de calidad, soporte post-venta.

Servicios sueltos (opciones del formulario de contacto): Diseño estructural · Fabricación · Montaje · Pintura y acabados · Mantenimiento.

---

## 3. SOLUCIONES POR SECTOR — ruta `/soluciones/{slug}`

(6 landings. "Tip." = tipologías. Cifras tomadas del texto público de cada landing.)

1. **Estructura metálica para bodegas y naves industriales** — `/soluciones/estructura-metalica-para-bodegas`
   - 72 proyectos industriales, +6.200 t, +109.000 m², 26 ciudades. Categoría: Industrial.
   - Tip.: pórticos rígidos a dos aguas, cerchas/celosías grandes luces, entrepisos/mezzanines, cubiertas autoportantes, ampliaciones sobre lo existente.
   - FAQ: el precio se cotiza por **kg** instalado, no por m²; bodega liviana ~$10.900–$13.000 COP/kg; consume ~25–45 kg/m².

2. **Puentes metálicos vehiculares y peatonales** — `/soluciones/puentes-metalicos`
   - 46 puentes, +4.600 t, 21 ciudades. Diseño bajo **CCP-14** e INVIAS. Categoría: Puentes.
   - Tip.: viga alma llena, viga cajón, celosía, arco, peatonales/ciclopuentes.
   - FAQ: estructura de puentes ~$17.000–$25.000 COP/kg; ventaja vs concreto = velocidad, menor peso, viabilidad en sitios difíciles. Incluye puentes del MIO (Cali).

3. **Cubiertas metálicas para grandes luces** — `/soluciones/cubiertas-metalicas`
   - +57.000 m² instalados; luces 20–60 m sin columnas. Plantas Jamundí y Popayán. Categoría: Deportes/Educación (slug `institucional`).
   - Tip.: cerchas/celosías, arcos, autoportantes, estructura para standing seam / panel sándwich, pérgolas urbanas.
   - FAQ: cubierta pesa ~25–60 kg/m² (sin teja); luz con arcos 30–60 m.

4. **Estructura metálica para centros comerciales y retail** — `/soluciones/estructura-metalica-centros-comerciales`
   - +14.600 t en 13 ciudades desde 2003; 54 proyectos comerciales. Categoría: Comercial.
   - Tip.: estructura multinivel (steel deck), grandes luces plazoletas, cubiertas arquitectónicas, pasarelas, **ampliaciones con el centro operando**.
   - FAQ: especialidad = ampliar **sin cerrar** la operación (izajes nocturnos). Ej.: ampliación Campanario Popayán 2.454 t con el centro funcionando.

5. **Coliseos y escenarios deportivos en estructura metálica** — `/soluciones/estructura-metalica-escenarios-deportivos`
   - 28 proyectos deportivos/educativos, ~57.600 m². Categoría: Deportes/Educación (slug `institucional`).
   - Tip.: coliseos cubiertos, graderías metálicas, cubiertas canchas múltiples, polideportivos escolares, complejos acuáticos.
   - FAQ: cancha múltiple necesita 24–28 m libres; coliseo con graderías 35–50 m. 4 escenarios de los Juegos Nacionales Popayán 2012; Korfball Juegos Mundiales Cali 2013.

6. **Edificios en estructura metálica** — `/soluciones/edificios-en-estructura-metalica`
   - +3.500 t en 14 ciudades desde 1998 (54 proyectos de edificación). Categoría: Edificaciones.
   - Tip.: corporativos/oficinas, clínicas/salud (uso IV), industriales multipiso, entrepisos/ampliaciones verticales, estructuras arquitectónicas especiales.
   - FAQ: obra 30–50 % más rápida que el sistema tradicional; sí se puede ampliar en altura sobre edificio existente; cumple NSR-10 Título F.

> Nota: las cifras por sector y proyectos insignia (toneladas/ciudades) las inyecta el sitio
> en parte desde la DB en runtime. Los proyectos destacados citados (Tecnosur 840 t, Campanario
> 2.454 t, Puente Cascada 537 t, Colpatria Neiva 902 t, etc.) son reales y están en el contenido.

---

## 4. GUÍAS TÉCNICAS — rutas en la raíz (NO bajo /soluciones)

1. **¿Cuánto cuesta una estructura metálica? (precios 2026)** — `/precios-estructuras-metalicas`
   **El dato clave del bot.** MEISA cotiza **por kilogramo de acero instalado, NO por m²**.
   Rangos orientativos 2026 (COP/kg instalado):
   | Tipo | Ejemplos | Rango COP/kg |
   |---|---|---|
   | Estructura estándar (repetitiva) | bodegas, naves, cubiertas luces medias | **$10.900 – $13.000** |
   | Edificación / entrepiso | edificios, entrepisos, mezzanines, plataformas | **$13.000 – $17.000** |
   | Especial / alta complejidad | puentes, grandes luces, cerchas, arcos, geometría singular | **$17.000 – $25.000** |
   - **Incluyen:** fabricación, pintura y montaje. **Excluyen:** cimentación, cubierta (teja) y acabados.
   - El $/kg sube con la **complejidad** de fabricación/montaje, no con el peso. A más tonelaje total, mejor $/kg.
   - Conversión aprox.: bodega liviana ~25–45 kg/m² → estructura ~**$272.000 – $585.000 COP/m²** (solo estructura, aproximación temprana, NO cotización).
   - Cotización formal SOLO sobre planos o anteproyecto.

2. **Estructura metálica vs concreto** — `/estructura-metalica-vs-concreto`
   - Comparación criterio por criterio. Acero gana en: bodegas/naves, grandes luces, ampliaciones sobre edificios existentes, plazos cortos, puentes. Concreto gana/compite en: vivienda multifamiliar tipo, sótanos/estructuras enterradas. Respuesta frecuente: sistema **híbrido** (concreto en cimentación/sótanos/núcleos + acero en esqueleto y entrepisos steel deck). Acero ~40–60 % más rápido.

3. **Tipos de estructuras metálicas** — `/tipos-de-estructuras-metalicas`
   - Sistemas: pórticos rígidos, cerchas/celosías, arcos, colgantes/atirantados, viga cajón.
   - Aceros: **ASTM A36** (fy 250 MPa, secundarios), **ASTM A572 Gr.50** (fy 345 MPa, principales/puentes — estándar de facto), tubulares **ASTM A500**, pernos **ASTM F3125 (A325/A490)**, steel deck.
   - Conexiones: pernadas (obra) + soldadas AWS D1.1 (planta) + precalificadas a momento **AISC 358 / NSR-10 F.3.9**.
   - Normativa: **NSR-10 Título F** (F.2≈AISC 360, F.3≈AISC 341, F.4 perfiles formados en frío); puentes **CCP-14** (≈AASHTO LRFD); soldadura **AWS D1.1**.

4. **¿Cuántos kg/m² pesa una estructura metálica?** — `/peso-estructura-metalica-por-m2`
   - Bodega liviana (solo cubierta, 15–25 m): **25–45 kg/m²**.
   - Bodega con puente grúa o carga de proceso: **45–70 kg/m²**.
   - Entrepisos de edificios y centros comerciales: **60–100 kg/m²**.
   - Cubiertas deportivas de grandes luces: **35–60 kg/m²**.
   - Puentes: NO se miden en kg/m² (se miden por luz y metro lineal, CCP-14).
   - Método estimar presupuesto: kg/m² × área × $/kg. Optimizar con BIM (Tekla) ahorra más que negociar el $/kg.

5. **Granallado y pintura de estructuras metálicas** — `/granallado-y-pintura-estructuras-metalicas`
   - Preparación = 80 % del resultado. Grado estándar MEISA: **Sa 2½ (SP10)** = metal casi blanco (≥95 % limpio). Perfil de anclaje 1,5–3,0 mils (cinta Testex, ISO 8503).
   - Sistema típico (3 capas): primer epóxico-zinc + barrera epóxica + acabado poliuretano alifático; DFT total ~6–9 mils.
   - Selección por ambiente: **ISO 12944** (C2 a CX). Protección al fuego: pintura **intumescente** (RF60/90/120) — complementa, no reemplaza el anticorrosivo.
   - QC: perfil de anclaje, DFT (PosiTector), adherencia pull-off (ASTM D4541), condiciones ambientales. MEISA granalla en planta (Jamundí y Popayán). La protección va incluida en el $/kg.

---

## 5. CATEGORÍAS DE PROYECTOS — ruta `/proyectos/categoria/{slug}`

(Slugs reales verificados en meisa.com.co. Mapeo enum DB → slug:)

| Categoría (visible) | Enum DB | Ruta |
|---|---|---|
| Comercial | COMERCIAL | `/proyectos/categoria/comercial` |
| Industrial | INDUSTRIAL | `/proyectos/categoria/industrial` |
| Puentes | PUENTES | `/proyectos/categoria/puentes` |
| Infraestructura (Urbana) | INFRAESTRUCTURA_URBANA | `/proyectos/categoria/infraestructura-urbana` |
| Edificaciones | EDIFICACIONES | `/proyectos/categoria/edificaciones` |
| Institucional (Deportes & Educación) | DEPORTES_EDUCACION | `/proyectos/categoria/institucional` |

> OJO: DEPORTES_EDUCACION usa el slug **`institucional`** (NO `deportes-educacion`).
> Detalle de un proyecto: `/proyectos/detalle/{slug}` (alias también disponible en `/obras/{slug}`).
> Los proyectos individuales y sus slugs viven en DB `[runtime/DB]`.

---

## 6. BROCHURES — ruta `/brochure/{urlAmigable}`

- Modelo `Brochure` (DB): campos `urlAmigable` (único), `categoriaId`, `pdfUrl`, `publicado`, `activo`.
- En las páginas de categoría se muestra un brochure SOLO si `publicado=true && activo=true && pdfUrl!=null`.
- **No hay seeds de brochures en el repo y al verificar el sitio NO había enlaces `/brochure/...` publicados.**
- → `[runtime/DB]`: consultar `Brochure WHERE publicado=true AND activo=true` para obtener los `urlAmigable` reales. **El bot NO debe inventar URLs de brochure**; si no hay datos, ofrecer el catálogo en `/proyectos/categoria/{slug}` o cotización por `/contacto`.

---

## 7. NORMAS / CALIDAD (solo lo REAL — sin certificaciones inventadas)

- **Certificación real (única en el repo):** **RUC** — Registro Uniforme de Contratistas, del **Consejo Colombiano de Seguridad (CCS)**, en SSTA. (NO afirmar ISO 9001/14001/45001 — no están.)
- **Normas/códigos citados (reales):**
  - **NSR-10** (Norma Sismo Resistente Colombiana; Título F = estructuras metálicas).
  - **AWS D1.1** (código de soldadura estructural).
  - **AISC 360** (y referenciados AISC 341, AISC 358).
  - **NTC** (Normas Técnicas Colombianas).
  - **CCP-14** (Código Colombiano de Puentes, ≈AASHTO LRFD) — en puentes.
  - **ISO 12944** y **ISO 8503**, **ASTM D4541** — en la guía de pintura/granallado.
  - Aceros: ASTM A36, A572 Gr.50, A500; pernos ASTM F3125 (A325/A490).
- **Seguridad:** trabajo en alturas (Res. 1409), SG-SST, SIG. Página: `/calidad`.
- Si preguntan por una certificación que no esté aquí: decir que no se tiene constancia y reconducir a `/calidad` o al equipo comercial. NO confirmarla.

---

## 8. CONTACTO (canales reales)

- **Email:** contacto@meisa.com.co
- **PBX (Cali):** +57 (2) 312 0050 — 51 / 52 / 53
- **Móvil / WhatsApp:** +57 310 432 7227 (número WhatsApp: `573104327227`)
- **Dirección (sede principal):** Vía Panamericana 6 Sur–195, Jamundí, Valle del Cauca.
- **Horario:** Lun–Vie 7:00–17:00 · Sáb 8:00–12:00.
- **Formulario:** página `/contacto` (captura nombre, correo, teléfono, tipo de proyecto, servicio; devuelve número de referencia; respuesta < 24 h hábiles).
- **Widget de WhatsApp:** botón flotante en el sitio (esquina inferior derecha). Datos de los asesores y horario viven en DB `[runtime/DB]`.
- **Redes:** LinkedIn (`/company/meisa`), Instagram (`@meisa_sas`), Facebook (`meisa.sas`).
- Cómo escalar a una persona → WhatsApp (botón del sitio) o formulario `/contacto`.

---

## 9. MAPA DE RUTAS INTERNAS (para enlazar sin inventar)

**Páginas principales**
| Ruta | Qué es |
|---|---|
| `/` | Home |
| `/empresa` | Quiénes somos / historia / valores / plantas |
| `/servicios` | Servicios + proceso integral + sectores |
| `/servicios/{slug}` | Detalle de servicio (slugs en DB `[runtime/DB]`) |
| `/proyectos` | Portafolio (por categoría) |
| `/trayectoria` | Trayectoria / hoja de vida de proyectos por año |
| `/procesos-tecnologias` | Tecnología (BIM, CNC, montaje, hilo digital) |
| `/calidad` | Calidad, normas, seguridad |
| `/contacto` | Formulario de contacto + cotización |
| `/politica-datos` | Política de tratamiento de datos |
| `/sagrilaft` | SAGRILAFT |

**Soluciones por sector** — `/soluciones/{slug}`
`estructura-metalica-para-bodegas` · `puentes-metalicos` · `cubiertas-metalicas` · `estructura-metalica-centros-comerciales` · `estructura-metalica-escenarios-deportivos` · `edificios-en-estructura-metalica`

**Guías técnicas** (raíz)
`/precios-estructuras-metalicas` · `/estructura-metalica-vs-concreto` · `/tipos-de-estructuras-metalicas` · `/peso-estructura-metalica-por-m2` · `/granallado-y-pintura-estructuras-metalicas`

**Categorías de proyectos** — `/proyectos/categoria/{slug}`
`comercial` · `industrial` · `puentes` · `infraestructura-urbana` · `edificaciones` · `institucional`

**Otras**
| Ruta | Qué es |
|---|---|
| `/proyectos/detalle/{slug}` | Detalle de un proyecto (slug en DB) |
| `/obras/{slug}` | Alias de detalle de proyecto |
| `/estructuras-metalicas/{ciudad}` | Landing por ciudad: `cali`, `bogota`, `popayan` (slugs en lib/ciudades.ts) |
| `/brochure/{urlAmigable}` | Brochure PDF (urlAmigable en DB, `[runtime/DB]`) |

> Documentos legales también disponibles como PDF en footer: `/documentos/tratamiento-datos.pdf`,
> `/documentos/politica-transparencia.pdf`, `/documentos/manual-sagrilaft.pdf`.

**Landings por ciudad** (`/estructuras-metalicas/{ciudad}`): solo existen 3 hoy —
- `cali` (Cali y el Valle): +90 proyectos, 13.500 t, planta en Jamundí.
- `bogota`: 11 proyectos, +2.600 t (puentes urbanos, TransMilenio, retail).
- `popayan`: +40 proyectos, 4.000 t (Campanario, Juegos Nacionales 2012).
