/**
 * Seed de Fase 5: Navegación (Menu, Footer, Redes).
 *
 * Migra:
 *   - menuItems hardcoded en components/layout/Navbar.tsx
 *   - Enlaces del Footer
 *   - Redes sociales
 *
 * Correr: npx tsx prisma/seed-navegacion.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const MENU_ITEMS = [
  { label: "Inicio", href: "/", imagen: "/images/proyectos/puente-destacado.jpg" },
  { label: "Proyectos", href: "/proyectos", imagen: "/images/hero/ciclopuente-atardecer.jpg" },
  { label: "Servicios", href: "/servicios", imagen: "/images/hero/estructura-perspectiva.jpg" },
  { label: "Empresa", href: "/empresa", imagen: "/images/about/meisa-planta-aerea.jpg" },
  { label: "Trayectoria", href: "/trayectoria", imagen: "/images/hero/coliseo-estructuras-rojas.jpg" },
  { label: "Procesos & Tecnologías", href: "/procesos-tecnologias", imagen: "/images/hero/montaje-grua.jpg" },
  { label: "Calidad", href: "/calidad", imagen: "/images/hero/techo-metalico.jpg" },
  { label: "Contacto", href: "/contacto", imagen: "/images/hero/hero-construccion-industrial.jpg" },
]

const FOOTER_LINKS = [
  // Servicios
  { grupo: "servicios", label: "Diseño Estructural", href: "/servicios#diseno" },
  { grupo: "servicios", label: "Fabricación", href: "/servicios#fabricacion" },
  { grupo: "servicios", label: "Montaje", href: "/servicios#montaje" },
  { grupo: "servicios", label: "Procesos & Tecnologías", href: "/procesos-tecnologias" },
  // Empresa
  { grupo: "empresa", label: "Quiénes somos", href: "/empresa" },
  { grupo: "empresa", label: "Trayectoria", href: "/trayectoria" },
  { grupo: "empresa", label: "Proyectos", href: "/proyectos" },
  { grupo: "empresa", label: "Contacto", href: "/contacto" },
  // Legal
  { grupo: "legal", label: "Calidad", href: "/calidad" },
  { grupo: "legal", label: "Tratamiento de datos", href: "/documentos/tratamiento-datos.pdf" },
  { grupo: "legal", label: "Transparencia", href: "/documentos/politica-transparencia.pdf" },
  { grupo: "legal", label: "SAGRILAFT", href: "/documentos/manual-sagrilaft.pdf" },
]

const SOCIAL_LINKS = [
  {
    red: "linkedin",
    url: "https://www.linkedin.com/company/meisa",
    label: "LinkedIn",
    icono: "Linkedin",
  },
  {
    red: "instagram",
    url: "https://www.instagram.com/meisa_sas",
    label: "Instagram",
    icono: "Instagram",
  },
  {
    red: "facebook",
    url: "https://www.facebook.com/meisa.sas",
    label: "Facebook",
    icono: "Facebook",
  },
]

async function main() {
  // Menu
  await prisma.menuItem.deleteMany({})
  for (let i = 0; i < MENU_ITEMS.length; i++) {
    await prisma.menuItem.create({
      data: { ...MENU_ITEMS[i], orden: i, activo: true },
    })
  }
  console.log(`✓ ${MENU_ITEMS.length} items del menú`)

  // Footer
  await prisma.footerLink.deleteMany({})
  for (let i = 0; i < FOOTER_LINKS.length; i++) {
    await prisma.footerLink.create({
      data: { ...FOOTER_LINKS[i], orden: i, activo: true },
    })
  }
  console.log(`✓ ${FOOTER_LINKS.length} enlaces del footer`)

  // Social
  for (let i = 0; i < SOCIAL_LINKS.length; i++) {
    const s = SOCIAL_LINKS[i]
    await prisma.socialLink.upsert({
      where: { red: s.red },
      create: { ...s, orden: i, activo: true },
      update: { ...s, orden: i },
    })
  }
  console.log(`✓ ${SOCIAL_LINKS.length} redes sociales`)

  console.log("\n✅ Navegación seed completada")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
