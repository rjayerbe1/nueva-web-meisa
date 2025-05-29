import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Inicializando base de datos...')

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@meisa.com.co' },
    update: {},
    create: {
      email: 'admin@meisa.com.co',
      name: 'Administrador MEISA',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario administrador creado:', adminUser.email)

  // Crear algunos proyectos de ejemplo
  const proyectos = [
    {
      titulo: 'Centro Comercial Campanario',
      descripcion: 'Estructura metálica para centro comercial de 45,000 m² con diseño innovador y sostenible.',
      categoria: 'CENTROS_COMERCIALES',
      estado: 'COMPLETADO',
      fechaInicio: new Date('2023-01-15'),
      fechaFin: new Date('2023-09-15'),
      presupuesto: 2500000000,
      cliente: 'Inmobiliaria Campanario S.A.',
      ubicacion: 'Popayán, Cauca',
      slug: 'centro-comercial-campanario',
      destacado: true,
      tags: ['centros comerciales', 'estructura metálica', 'sostenible'],
      createdBy: adminUser.id,
    },
    {
      titulo: 'Torre Empresarial Bogotá',
      descripcion: 'Edificio de oficinas de 25 pisos con estructura metálica antisísmica de última generación.',
      categoria: 'EDIFICIOS',
      estado: 'COMPLETADO',
      fechaInicio: new Date('2023-03-01'),
      fechaFin: new Date('2024-02-28'),
      presupuesto: 3200000000,
      cliente: 'Constructora Capital S.A.S.',
      ubicacion: 'Bogotá, Colombia',
      slug: 'torre-empresarial-bogota',
      destacado: true,
      tags: ['edificios', 'antisísmico', 'oficinas'],
      createdBy: adminUser.id,
    },
    {
      titulo: 'Puente Río Magdalena',
      descripcion: 'Puente vehicular de 350 metros de longitud sobre el río Magdalena.',
      categoria: 'PUENTES',
      estado: 'COMPLETADO',
      fechaInicio: new Date('2022-06-01'),
      fechaFin: new Date('2023-03-30'),
      presupuesto: 1800000000,
      cliente: 'INVÍAS',
      ubicacion: 'Barrancabermeja, Santander',
      slug: 'puente-rio-magdalena',
      destacado: true,
      tags: ['puentes', 'infraestructura', 'río magdalena'],
      createdBy: adminUser.id,
    },
    {
      titulo: 'Planta Industrial Nestlé',
      descripcion: 'Estructura metálica para nueva planta de producción con tecnología de punta.',
      categoria: 'INDUSTRIAL',
      estado: 'COMPLETADO',
      fechaInicio: new Date('2022-08-01'),
      fechaFin: new Date('2023-01-31'),
      presupuesto: 2100000000,
      cliente: 'Nestlé Colombia',
      ubicacion: 'Medellín, Antioquia',
      slug: 'planta-industrial-nestle',
      destacado: true,
      tags: ['industrial', 'tecnología', 'producción'],
      createdBy: adminUser.id,
    },
  ]

  for (const proyecto of proyectos) {
    await prisma.proyecto.upsert({
      where: { slug: proyecto.slug },
      update: {},
      create: proyecto,
    })
  }

  console.log('✅ Proyectos de ejemplo creados')

  // Crear algunos servicios
  const servicios = [
    {
      nombre: 'Diseño Estructural',
      descripcion: 'Desarrollamos diseños estructurales innovadores y eficientes, optimizando recursos y garantizando la máxima seguridad.',
      slug: 'diseno-estructural',
      orden: 1,
      destacado: true,
    },
    {
      nombre: 'Fabricación',
      descripcion: 'Contamos con instalaciones de última generación para la fabricación de estructuras metálicas de alta calidad.',
      slug: 'fabricacion',
      orden: 2,
      destacado: true,
    },
    {
      nombre: 'Montaje',
      descripcion: 'Equipo especializado en el montaje seguro y eficiente de estructuras metálicas en cualquier tipo de proyecto.',
      slug: 'montaje',
      orden: 3,
      destacado: true,
    },
    {
      nombre: 'Consultoría',
      descripcion: 'Asesoría experta en todas las fases del proyecto, desde la concepción hasta la entrega final.',
      slug: 'consultoria',
      orden: 4,
      destacado: true,
    },
  ]

  for (const servicio of servicios) {
    await prisma.servicio.upsert({
      where: { slug: servicio.slug },
      update: {},
      create: servicio,
    })
  }

  console.log('✅ Servicios creados')

  console.log('🎉 Base de datos inicializada correctamente')
}

main()
  .catch((e) => {
    console.error('❌ Error inicializando base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })