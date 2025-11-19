import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedContactosWhatsApp() {
  console.log('🌱 Iniciando seed de contactos de WhatsApp...')

  try {
    // Crear configuración por defecto
    const config = await prisma.configuracionWhatsApp.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        horarioAtencion: 'Lunes a Viernes: 7:00 AM - 5:00 PM | Sábados: 8:00 AM - 12:00 PM',
        mensajeIntroduccion: 'Elije la persona disponible para iniciar una conversación de WhatsApp',
        tituloWidget: 'Háblanos por WhatsApp',
        activo: true
      }
    })
    console.log('✅ Configuración creada:', config.tituloWidget)

    // Crear contactos de ejemplo
    const contactos = [
      {
        nombre: 'Información General',
        cargo: 'Atención al Cliente',
        telefono: '+57 310 432 7227',
        mensajePredeterminado: 'Hola, me gustaría solicitar información general sobre los servicios de MEISA.',
        orden: 0,
        activo: true
      },
      {
        nombre: 'Gerencia Comercial',
        cargo: 'Ventas y Cotizaciones',
        telefono: '+57 310 432 7227',
        mensajePredeterminado: 'Hola, me gustaría solicitar una cotización para un proyecto de estructuras metálicas.',
        orden: 1,
        activo: true
      },
      {
        nombre: 'Gerencia de Proyectos',
        cargo: 'Proyectos en Ejecución',
        telefono: '+57 310 432 7227',
        mensajePredeterminado: 'Hola, necesito información sobre el seguimiento de mi proyecto en ejecución.',
        orden: 2,
        activo: true
      }
    ]

    for (const contacto of contactos) {
      const created = await prisma.contactoWhatsApp.create({
        data: contacto
      })
      console.log(`✅ Contacto creado: ${created.nombre} (${created.cargo})`)
    }

    console.log('\n✅ Seed de contactos de WhatsApp completado!')
    console.log(`📊 Total: ${contactos.length} contactos creados`)
    console.log('\n💡 Para ver los contactos en el admin, visita: /admin/contactos-whatsapp')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedContactosWhatsApp()
    .then(() => {
      console.log('\n✅ Proceso de seed finalizado correctamente')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error en el proceso de seed:', error)
      process.exit(1)
    })
}

export default seedContactosWhatsApp
