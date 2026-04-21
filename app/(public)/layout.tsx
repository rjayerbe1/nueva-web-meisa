import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloatingWidget } from '@/components/WhatsAppFloatingWidget'
import { getMenuItems } from '@/lib/content/navegacion'

const DEFAULT_IMAGE = '/images/hero/montaje-grua.jpg'

const IMAGE_BY_HREF: Record<string, string> = {
  '/': '/images/proyectos/puente-destacado.jpg',
  '/proyectos': '/images/hero/ciclopuente-atardecer.jpg',
  '/servicios': '/images/hero/estructura-perspectiva.jpg',
  '/empresa': '/images/about/meisa-planta-aerea.jpg',
  '/trayectoria': '/images/hero/coliseo-estructuras-rojas.jpg',
  '/procesos-tecnologias': '/images/hero/montaje-grua.jpg',
  '/politicas': '/images/hero/techo-metalico.jpg',
  '/contacto': '/images/hero/hero-construccion-industrial.jpg',
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItemsDB = await getMenuItems().catch(() => [])

  const menuItems = menuItemsDB.map((m) => ({
    name: m.label,
    href: m.href,
    image: m.imagen || IMAGE_BY_HREF[m.href] || DEFAULT_IMAGE,
    target: m.target ?? undefined,
  }))

  return (
    <>
      <Navbar items={menuItems.length > 0 ? menuItems : undefined} />
      <main className="w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingWidget />
    </>
  )
}
