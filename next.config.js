/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic (no static generation during build)
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    // Force dynamic rendering for all pages
    isrMemoryCacheSize: 0,
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
}

module.exports = nextConfig