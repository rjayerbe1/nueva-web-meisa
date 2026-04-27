import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloatingWidget } from '@/components/WhatsAppFloatingWidget'
import { getMenuItems } from '@/lib/content/navegacion'

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
      <main className="w-full">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingWidget />
    </>
  )
}
