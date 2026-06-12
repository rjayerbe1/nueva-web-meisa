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
  async redirects() {
    return [
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
      // catch-all para el resto del taxonomy "industry" (cubiertas-y-fachadas,
      // estructuras-modulares y cualquier otro) — no tienen equivalente directo
      { source: '/industry/:slug*', destination: '/proyectos', permanent: true },
    ]
  },
}

module.exports = nextConfig