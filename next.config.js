/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic (no static generation during build)
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  // Skip static page generation during build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  webpack: (config, { isServer }) => {
    // Configuración para pdfjs-dist
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      }
    }
    return config
  },
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'meisa.com.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'meisa.com.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/meisa-imagenes/**',
      },
    ],
  },
  env: {
    UPLOADCARE_PUBLIC_KEY: process.env.UPLOADCARE_PUBLIC_KEY,
  },
  async headers() {
    return [
      // dev.meisa.com.co no debe indexarse en Google (contenido duplicado
      // del dominio principal). Mismo build sirve ambos dominios, por eso
      // el header se condiciona por host.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dev.meisa.com.co' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  async redirects() {
    return [
      // www → apex (canonical). El mapping de Cloud Run sirve ambos hosts
      // con el mismo container; canonicalizamos aquí.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.meisa.com.co' }],
        destination: 'https://meisa.com.co/:path*',
        permanent: true,
      },
      // Fase 3: las rutas viejas quedan con redirect 301 permanente
      {
        source: '/tecnologia',
        destination: '/procesos-tecnologias',
        permanent: true,
      },
      {
        source: '/politicas',
        destination: '/calidad',
        permanent: true,
      },
      // Landing local Cali migrada a la ruta dinámica /estructuras-metalicas/[ciudad]
      {
        source: '/estructuras-metalicas-cali',
        destination: '/estructuras-metalicas/cali',
        permanent: true,
      },
      // Migración WordPress (Hostinger) → Next.js, junio 2026.
      // URLs tomadas del sitemap del sitio viejo (All in One SEO).
      { source: '/nuestra-empresa', destination: '/empresa', permanent: true },
      { source: '/nuestro-equipo', destination: '/empresa', permanent: true },
      { source: '/politica-tratamiento-datos', destination: '/politica-datos', permanent: true },
      { source: '/manual-sagrilaft', destination: '/sagrilaft', permanent: true },
      { source: '/politica-programa', destination: '/empresa', permanent: true },
      { source: '/hello-world', destination: '/', permanent: true },
      { source: '/category/:path*', destination: '/', permanent: true },
      { source: '/industry/centros-comerciales', destination: '/proyectos/categoria/comercial', permanent: true },
      { source: '/industry/edificios', destination: '/proyectos/categoria/edificaciones', permanent: true },
      { source: '/industry/industria', destination: '/proyectos/categoria/industrial', permanent: true },
      { source: '/industry/oil-and-gas', destination: '/proyectos/categoria/industrial', permanent: true },
      { source: '/industry/puentes-vehiculares', destination: '/proyectos/categoria/puentes', permanent: true },
      { source: '/industry/puentes-peatonales', destination: '/proyectos/categoria/puentes', permanent: true },
      { source: '/industry/escenarios-deportivos', destination: '/proyectos/categoria/institucional', permanent: true },
      // cubiertas-y-fachadas rankeaba pos 2 (214 impr) en el WP viejo: consolidar
      // esa autoridad en la landing optimizada, no en el listado genérico.
      { source: '/industry/cubiertas-y-fachadas', destination: '/soluciones/cubiertas-metalicas', permanent: true },
      // catch-all para el resto del taxonomy "industry" (estructuras-modulares
      // y cualquier otro) — no tienen equivalente directo
      { source: '/industry/:slug*', destination: '/proyectos', permanent: true },
      // Proyectos del WP viejo (/project/*). Eran páginas indexadas; sin esta
      // regla daban 404. Los 2 slugs que coinciden exacto van a su detalle;
      // el resto (slugs viejos sin equivalente directo) al hub /proyectos.
      { source: '/project/industria-ampliacion-cargill', destination: '/proyectos/detalle/industria-ampliacion-cargill', permanent: true },
      { source: '/project/centro-comercial-campanario', destination: '/proyectos/detalle/centro-comercial-campanario', permanent: true },
      // rankeaba para "complejo deportivo popayan" (la única query comercial con
      // volumen real de MEISA): mandarlo al detalle del proyecto, no al hub.
      { source: '/project/escenarios-deportivos-complejo-acuatico-popayan', destination: '/proyectos/detalle/complejo-acuatico-popayan', permanent: true },
      { source: '/project/:slug*', destination: '/proyectos', permanent: true },
      // Páginas/feeds de autor del WP viejo — basura, al home
      { source: '/author/:path*', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig