import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloatingWidget } from '@/components/WhatsAppFloatingWidget'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { getNavegacionData } from '@/lib/content/navegacion'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getTalentoPublico } from '@/lib/talento/publico'

const DEFAULT_IMAGE = 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg'

const IMAGE_BY_HREF: Record<string, string> = {
  '/': 'https://storage.googleapis.com/meisa-imagenes/site/proyectos/puente-destacado.jpg',
  '/proyectos': 'https://storage.googleapis.com/meisa-imagenes/site/hero/ciclopuente-atardecer.jpg',
  '/servicios': 'https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg',
  '/empresa': 'https://storage.googleapis.com/meisa-imagenes/site/about/meisa-planta-aerea.jpg',
  '/trayectoria': 'https://storage.googleapis.com/meisa-imagenes/site/hero/coliseo-estructuras-rojas.jpg',
  '/procesos-tecnologias': 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg',
  '/calidad': 'https://storage.googleapis.com/meisa-imagenes/site/hero/techo-metalico.jpg',
  '/contacto': 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg',
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [nav, plantasDB, talento] = await Promise.all([
    getNavegacionData().catch(() => ({ menu: [], footer: [], social: [] })),
    getPlantasPublicas().catch(() => []),
    getTalentoPublico().catch(() => ({ activa: false, vacantes: [] })),
  ])

  const menuItems = nav.menu.map((m) => ({
    name: m.label,
    href: m.href,
    image: m.imagen || IMAGE_BY_HREF[m.href] || DEFAULT_IMAGE,
    target: m.target ?? undefined,
  }))

  const social = nav.social.map((s) => ({
    red: s.red,
    url: s.url,
    label: s.label,
    icono: s.icono,
  }))

  const footerLinks = nav.footer.map((f) => ({
    grupo: f.grupo,
    label: f.label,
    href: f.href,
  }))

  // El enlace de empleo NO vive en FooterLink: se inyecta según el switch de
  // Talento para que apagar la página pública desde el admin lo retire solo.
  // Va al final del grupo "empresa" (el Footer agrupa respetando este orden).
  if (talento.activa) {
    footerLinks.push({
      grupo: 'empresa',
      label: 'Trabaja con nosotros',
      href: '/trabaja-con-nosotros',
    })
  }

  const plantas = plantasDB.map((p) => ({
    nombre: p.nombre,
    ubicacion: p.ubicacion,
  }))

  return (
    <>
      <Navbar
        items={menuItems.length > 0 ? menuItems : undefined}
        social={social.length > 0 ? social : undefined}
      />
      <main className="w-full">
        {children}
      </main>
      <Footer links={footerLinks} social={social} plantas={plantas} />
      <WhatsAppFloatingWidget />
      <ChatWidget />
    </>
  )
}
