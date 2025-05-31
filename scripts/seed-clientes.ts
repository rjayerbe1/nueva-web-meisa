import { PrismaClient, SectorCliente } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
}

const clientesData = [
  // Sector Industrial
  {
    nombre: 'Tecnoquímicas',
    logo: '/images/clients/cliente-tecnoquimicas.png',
    logoBlanco: '/images/clients/cliente-tecnoquimicas.png',
    sector: SectorCliente.INDUSTRIAL,
    descripcion: 'Empresa líder en productos farmacéuticos y de consumo masivo',
    sitioWeb: 'https://www.tecnoquimicas.com',
    proyectoDestacado: 'Planta Industrial',
    capacidadProyecto: '508 toneladas',
    ubicacionProyecto: 'Jamundí, Valle',
    mostrarEnHome: true,
    destacado: true,
    orden: 1,
    activo: true
  },
  {
    nombre: 'Cargill',
    logo: '/images/clients/cliente-cargill.png',
    logoBlanco: '/images/clients/cliente-cargill.png',
    sector: SectorCliente.INDUSTRIAL,
    descripcion: 'Corporación multinacional de alimentos y agricultura',
    sitioWeb: 'https://www.cargill.com',
    proyectoDestacado: 'Ampliación Industrial',
    capacidadProyecto: '175 toneladas',
    ubicacionProyecto: 'Villa Rica, Cauca',
    mostrarEnHome: true,
    destacado: true,
    orden: 2,
    activo: true
  },
  {
    nombre: 'Tecnofar',
    logo: '/images/clients/cliente-tecnofar.png',
    logoBlanco: '/images/clients/cliente-tecnofar.png',
    sector: SectorCliente.INDUSTRIAL,
    descripcion: 'Empresa farmacéutica colombiana',
    mostrarEnHome: true,
    destacado: false,
    orden: 3,
    activo: true
  },
  {
    nombre: 'Protécnica',
    logo: '/images/clients/cliente-protecnica.png',
    logoBlanco: '/images/clients/cliente-protecnica.png',
    sector: SectorCliente.INDUSTRIAL,
    mostrarEnHome: true,
    destacado: false,
    orden: 4,
    activo: true
  },
  {
    nombre: 'Manuelita',
    logo: '/images/clients/cliente-manuelita.png',
    logoBlanco: '/images/clients/cliente-manuelita.png',
    sector: SectorCliente.INDUSTRIAL,
    descripcion: 'Ingenio azucarero y productor de biocombustibles',
    sitioWeb: 'https://www.manuelita.com',
    mostrarEnHome: true,
    destacado: false,
    orden: 5,
    activo: true
  },
  {
    nombre: 'Mayagüez',
    logo: '/images/clients/cliente-mayaguez.png',
    logoBlanco: '/images/clients/cliente-mayaguez.png',
    sector: SectorCliente.INDUSTRIAL,
    descripcion: 'Ingenio azucarero del Valle del Cauca',
    mostrarEnHome: true,
    destacado: false,
    orden: 6,
    activo: true
  },
  
  // Sector Comercial
  {
    nombre: 'Pollos Bucanero',
    logo: '/images/clients/cliente-pollos-bucanero.png',
    logoBlanco: '/images/clients/cliente-pollos-bucanero.png',
    sector: SectorCliente.COMERCIAL,
    descripcion: 'Cadena de restaurantes de pollo',
    mostrarEnHome: true,
    destacado: false,
    orden: 10,
    activo: true
  },
  {
    nombre: 'Éxito',
    logo: '/images/clients/cliente-exito.png',
    logoBlanco: '/images/clients/cliente-exito.png',
    sector: SectorCliente.COMERCIAL,
    descripcion: 'Principal cadena de supermercados en Colombia',
    sitioWeb: 'https://www.exito.com',
    mostrarEnHome: true,
    destacado: false,
    orden: 11,
    activo: true
  },
  {
    nombre: 'Royal Films',
    logo: '/images/clients/cliente-royal-films.png',
    logoBlanco: '/images/clients/cliente-royal-films.png',
    sector: SectorCliente.COMERCIAL,
    descripcion: 'Cadena de cines en Colombia',
    sitioWeb: 'https://www.royalfilms.com.co',
    mostrarEnHome: true,
    destacado: false,
    orden: 12,
    activo: true
  },
  
  // Sector Construcción
  {
    nombre: 'Colpatria',
    logo: '/images/clients/cliente-colpatria.png',
    logoBlanco: '/images/clients/cliente-colpatria.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Constructora colombiana de grandes proyectos',
    mostrarEnHome: true,
    destacado: false,
    orden: 20,
    activo: true
  },
  {
    nombre: 'Normandía',
    logo: '/images/clients/cliente-normandia.png',
    logoBlanco: '/images/clients/cliente-normandia.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Constructora especializada en vivienda',
    mostrarEnHome: true,
    destacado: false,
    orden: 21,
    activo: true
  },
  {
    nombre: 'Concreto',
    logo: '/images/clients/cliente-concreto.png',
    logoBlanco: '/images/clients/cliente-concreto.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Empresa de construcción y concreto',
    mostrarEnHome: true,
    destacado: false,
    orden: 22,
    activo: true
  },
  {
    nombre: 'Consorcio Edificar',
    logo: '/images/clients/cliente-consorcio-edificar.png',
    logoBlanco: '/images/clients/cliente-consorcio-edificar.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Consorcio de construcción',
    mostrarEnHome: true,
    destacado: false,
    orden: 23,
    activo: true
  },
  {
    nombre: 'Jaramillo',
    logo: '/images/clients/cliente-jaramillo.png',
    logoBlanco: '/images/clients/cliente-jaramillo.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Constructora Jaramillo',
    mostrarEnHome: true,
    destacado: false,
    orden: 24,
    activo: true
  },
  {
    nombre: 'ARINSA',
    logo: '/images/clients/cliente-arinsa.png',
    logoBlanco: '/images/clients/cliente-arinsa.png',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Arquitectura e Ingeniería S.A.',
    proyectoDestacado: 'Centro Comercial Campanario',
    capacidadProyecto: '2,500 toneladas',
    ubicacionProyecto: 'Popayán, Cauca',
    mostrarEnHome: true,
    destacado: true,
    orden: 25,
    activo: true
  },
  
  // Sector Institucional
  {
    nombre: 'SENA',
    logo: '/images/clients/cliente-sena.png',
    logoBlanco: '/images/clients/cliente-sena.png',
    sector: SectorCliente.INSTITUCIONAL,
    descripcion: 'Servicio Nacional de Aprendizaje',
    sitioWeb: 'https://www.sena.edu.co',
    mostrarEnHome: true,
    destacado: false,
    orden: 30,
    activo: true
  },
  {
    nombre: 'SURA',
    logo: '/images/clients/cliente-sura.png',
    logoBlanco: '/images/clients/cliente-sura.png',
    sector: SectorCliente.INSTITUCIONAL,
    descripcion: 'Grupo empresarial de servicios financieros',
    sitioWeb: 'https://www.sura.com',
    mostrarEnHome: true,
    destacado: false,
    orden: 31,
    activo: true
  },
  {
    nombre: 'Comfacauca',
    logo: '/images/clients/cliente-comfacauca.png',
    logoBlanco: '/images/clients/cliente-comfacauca.png',
    sector: SectorCliente.INSTITUCIONAL,
    descripcion: 'Caja de Compensación Familiar del Cauca',
    sitioWeb: 'https://www.comfacauca.com',
    mostrarEnHome: true,
    destacado: false,
    orden: 32,
    activo: true
  },
  {
    nombre: 'Seguridad Omega',
    logo: '/images/clients/cliente-seguridad-omega.png',
    logoBlanco: '/images/clients/cliente-seguridad-omega.png',
    sector: SectorCliente.INSTITUCIONAL,
    descripcion: 'Empresa de seguridad privada',
    mostrarEnHome: true,
    destacado: false,
    orden: 33,
    activo: true
  },
  
  // Cliente sin logo (ejemplo)
  {
    nombre: 'Consorcio del Cauca',
    sector: SectorCliente.CONSTRUCCION,
    descripcion: 'Consorcio de construcción vial',
    proyectoDestacado: 'Puente Nolasco',
    capacidadProyecto: '395 toneladas',
    ubicacionProyecto: 'Nátaga, Huila',
    mostrarEnHome: true,
    destacado: true,
    orden: 26,
    activo: true
  }
]

async function seedClientes() {
  console.log('🌱 Sembrando clientes...')

  try {
    // Eliminar clientes existentes
    await prisma.cliente.deleteMany()
    console.log('✅ Clientes existentes eliminados')

    // Crear nuevos clientes
    for (const cliente of clientesData) {
      const clienteWithSlug = {
        ...cliente,
        slug: cliente.slug || generateSlug(cliente.nombre)
      }
      const created = await prisma.cliente.create({
        data: clienteWithSlug
      })
      console.log(`✅ Cliente creado: ${created.nombre}`)
    }

    console.log(`\n✅ ${clientesData.length} clientes creados exitosamente`)
  } catch (error) {
    console.error('❌ Error al sembrar clientes:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedClientes()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })