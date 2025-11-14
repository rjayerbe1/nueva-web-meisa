import type { Metadata } from 'next'
import { Bebas_Neue, Lato } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SessionProvider } from '@/components/providers/SessionProvider'

// Bebas Neue para títulos - alto impacto, condensada
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

// Lato para cuerpo - excelente legibilidad
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

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
      <body className={`${lato.variable} ${bebasNeue.variable} font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}