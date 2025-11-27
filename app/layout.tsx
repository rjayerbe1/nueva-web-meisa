import type { Metadata } from 'next'
import { Bebas_Neue, Lato } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { GlobalSchemas } from '@/components/seo/JsonLdSchema'

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
  metadataBase: new URL('https://meisa.com.co'),
  title: {
    default: 'MEISA | Estructuras Metálicas en Colombia | Diseño, Fabricación y Montaje',
    template: '%s | MEISA - Estructuras Metálicas Colombia',
  },
  description:
    'MEISA es líder en diseño, fabricación y montaje de estructuras metálicas en Colombia. Más de 40 años construyendo puentes, edificios, centros comerciales, naves industriales y estructuras de acero. Sedes en Popayán, Cali y Bogotá.',
  keywords: [
    'estructuras metálicas Colombia',
    'fabricación estructuras metálicas',
    'montaje estructuras metálicas',
    'puentes metálicos Colombia',
    'construcción en acero',
    'empresa estructuras metálicas Bogotá',
    'empresa estructuras metálicas Cali',
    'naves industriales metálicas',
    'cubiertas metálicas',
    'edificios estructura metálica',
    'centros comerciales estructura metálica',
    'puentes peatonales metálicos',
    'estructuras para estadios',
    'MEISA',
    'Metálicas e Ingeniería',
    'acero estructural Colombia',
  ],
  authors: [{ name: 'MEISA - Metálicas e Ingeniería S.A.' }],
  creator: 'MEISA',
  publisher: 'MEISA - Metálicas e Ingeniería S.A.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://meisa.com.co',
    siteName: 'MEISA - Estructuras Metálicas Colombia',
    title: 'MEISA | Estructuras Metálicas en Colombia | Diseño, Fabricación y Montaje',
    description:
      'Empresa líder en estructuras metálicas en Colombia. Diseñamos, fabricamos y montamos puentes, edificios, centros comerciales y naves industriales. +40 años de experiencia.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEISA - Estructuras Metálicas en Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEISA | Estructuras Metálicas en Colombia',
    description:
      'Líderes en diseño, fabricación y montaje de estructuras metálicas. Puentes, edificios, centros comerciales y más.',
    images: ['/images/og-image.jpg'],
    creator: '@meisa_colombia',
  },
  alternates: {
    canonical: 'https://meisa.com.co',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google', // Reemplazar con código real
  },
  category: 'construction',
  other: {
    'geo.region': 'CO',
    'geo.placename': 'Colombia',
    'og:country-name': 'Colombia',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <GlobalSchemas />
      </head>
      <body className={`${lato.variable} ${bebasNeue.variable} font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}