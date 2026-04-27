import { prisma } from "../lib/prisma"

/**
 * Seed para /calidad:
 *  1. Grupo "hero" + imagenFondo en grupos hero/politicas/control-calidad (portadas reales).
 *  2. 4 etapas de Control de Calidad (antes hardcodeadas en PoliticasContent.tsx).
 *
 * Idempotente — usa upsert por (pagina, clave) y por slug.
 */

const HERO_IMAGEN =
  "https://storage.googleapis.com/meisa-imagenes/projects/industria-torre-cogeneracion-propal/torre-cogeneracion-propal-01-industria-torre-cogeneracion-propal-01-Industria-torre-cogeneracion-propal-1-1600x1600.webp"

const BREAK_POLITICAS_IMAGEN =
  "https://storage.googleapis.com/meisa-imagenes/projects/puente-peatonal-la-63-cali/la-63-cali-01-puente-peatonal-la-63-cali-01-Puente-peatonal-la-63-cali-1-1600x1600.webp"

const BREAK_CONTROL_IMAGEN =
  "https://storage.googleapis.com/meisa-imagenes/projects/edificio-estacion-mio-guadalupe/estacion-mio-guadalupe-01-edificio-estacion-mio-guadalupe-01-Edificio-estacion-mio-guadalupe-1-1600x1600.webp"

async function main() {
  // 1. Grupo hero (nuevo)
  await prisma.grupoSeccion.upsert({
    where: { pagina_clave: { pagina: "calidad", clave: "hero" } },
    create: {
      pagina: "calidad",
      clave: "hero",
      titulo: "Calidad\nsin concesiones",
      subtitulo: "Sistema de Gestión",
      descripcion:
        "Sistema Integrado de Gestión, políticas corporativas y cumplimiento normativo — el marco que rige cada proyecto de MEISA.",
      imagenFondo: HERO_IMAGEN,
      orden: 0,
      activo: true,
    },
    update: {
      imagenFondo: HERO_IMAGEN,
    },
  })
  console.log("✓ grupo hero — imagen actualizada")

  // 2. Image break antes de Políticas
  await prisma.grupoSeccion.update({
    where: { pagina_clave: { pagina: "calidad", clave: "politicas" } },
    data: { imagenFondo: BREAK_POLITICAS_IMAGEN },
  })
  console.log("✓ grupo politicas — imagen de fondo actualizada")

  // 3. Image break antes de Control de calidad
  await prisma.grupoSeccion.update({
    where: { pagina_clave: { pagina: "calidad", clave: "control-calidad" } },
    data: { imagenFondo: BREAK_CONTROL_IMAGEN },
  })
  console.log("✓ grupo control-calidad — imagen de fondo actualizada")

  // 4. Etapas de control de calidad
  const etapas = [
    {
      slug: "diseno",
      titulo: "Diseño",
      descripcion: "Revisión por pares antes de emitir planos.",
      orden: 0,
    },
    {
      slug: "fabricacion",
      titulo: "Fabricación",
      descripcion: "Inspección continua en planta con checkpoints por pieza.",
      orden: 1,
    },
    {
      slug: "montaje",
      titulo: "Montaje",
      descripcion: "Protocolos de entrega documentados y trazables.",
      orden: 2,
    },
    {
      slug: "liberacion",
      titulo: "Liberación",
      descripcion: "Visto bueno del Inspector SIG antes de cada hito.",
      orden: 3,
    },
  ]

  for (const e of etapas) {
    await prisma.etapaControlCalidad.upsert({
      where: { slug: e.slug },
      create: { ...e, activo: true },
      update: { titulo: e.titulo, descripcion: e.descripcion, orden: e.orden },
    })
    console.log(`✓ etapa ${e.slug} — ${e.titulo}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
