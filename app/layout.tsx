import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MEISA - Metálicas e Ingeniería S.A.',
  description: 'Líderes en diseño, fabricación y montaje de estructuras metálicas en Colombia. Más de 15 años de experiencia en proyectos de infraestructura.',
  keywords: 'estructuras metálicas, ingeniería, construcción, Colombia, MEISA, fabricación, montaje',
  openGraph: {
    title: 'MEISA - Metálicas e Ingeniería S.A.',
    description: 'Soluciones integrales en estructuras metálicas',
    url: 'https://meisa.com.co',
    siteName: 'MEISA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}