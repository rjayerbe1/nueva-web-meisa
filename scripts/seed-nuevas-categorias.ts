import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

const nuevasCategorias = [
  {
    key: CategoriaEnum.COMERCIAL,
    nombre: 'Comercial',
    slug: 'comercial',
    descripcion: 'Centros comerciales, locales retail, cines y espacios de entretenimiento',
    orden: 1,
    color: '#1e40af',
    colorSecundario: '#3b82f6',
    icono: 'ShoppingCart',
    visible: true,
    destacada: true,
  },
  {
    key: CategoriaEnum.INDUSTRIAL,
    nombre: 'Industrial',
    slug: 'industrial',
    descripcion: 'Bodegas, centros de distribución, plantas industriales y estructuras para producción',
    orden: 2,
    color: '#dc2626',
    colorSecundario: '#ef4444',
    icono: 'Factory',
    visible: true,
    destacada: true,
  },
  {
    key: CategoriaEnum.PUENTES,
    nombre: 'Puentes',
    slug: 'puentes',
    descripcion: 'Puentes vehiculares, peatonales, ciclopuentes y viaductos',
    orden: 3,
    color: '#0891b2',
    colorSecundario: '#06b6d4',
    icono: 'Bridge',
    visible: true,
    destacada: true,
  },
  {
    key: CategoriaEnum.INFRAESTRUCTURA_URBANA,
    nombre: 'Infraestructura Urbana',
    slug: 'infraestructura-urbana',
    descripcion: 'Estaciones de transporte, mobiliario urbano y estructuras públicas',
    orden: 4,
    color: '#7c3aed',
    colorSecundario: '#8b5cf6',
    icono: 'Building',
    visible: true,
    destacada: false,
  },
  {
    key: CategoriaEnum.EDIFICACIONES,
    nombre: 'Edificaciones',
    slug: 'edificaciones',
    descripcion: 'Edificios de oficinas, colegios, parqueaderos y estructuras arquitectónicas',
    orden: 5,
    color: '#16a34a',
    colorSecundario: '#22c55e',
    icono: 'Building2',
    visible: true,
    destacada: false,
  },
  {
    key: CategoriaEnum.DEPORTES_EDUCACION,
    nombre: 'Deportes & Educación',
    slug: 'deportes-educacion',
    descripcion: 'Coliseos, canchas, instalaciones deportivas y educativas',
    orden: 6,
    color: '#ea580c',
    colorSecundario: '#f97316',
    icono: 'Trophy',
    visible: true,
    destacada: false,
  },
]

async function seedCategorias() {
  try {
    console.log('=== CREANDO 6 NUEVAS CATEGORÍAS ===\n')

    for (const categoria of nuevasCategorias) {
      const created = await prisma.categoriaProyecto.upsert({
        where: { key: categoria.key },
        update: categoria,
        create: categoria,
      })
      console.log(`✓ ${created.nombre} (${created.key})`)
    }

    console.log('\n✅ Categorías creadas exitosamente')

    // Mostrar resumen
    const todas = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        nombre: true,
        slug: true,
        visible: true,
        destacada: true,
      },
    })

    console.log('\n📋 Categorías en la base de datos:')
    todas.forEach((cat, i) => {
      const destacada = cat.destacada ? '⭐' : '  '
      console.log(`  ${i + 1}. ${destacada} ${cat.nombre} (/${cat.slug})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategorias()
