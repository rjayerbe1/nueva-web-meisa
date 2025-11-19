import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function agregarContactoPrincipal() {
  console.log('📞 Agregando contacto principal de MEISA...')

  try {
    // Primero, limpiar los contactos de ejemplo
    const deleted = await prisma.contactoWhatsApp.deleteMany()
    console.log(`🗑️  ${deleted.count} contactos de ejemplo eliminados`)

    // Crear el contacto principal
    const contactoPrincipal = await prisma.contactoWhatsApp.create({
      data: {
        nombre: 'MEISA',
        cargo: 'Atención Comercial',
        telefono: '+57 310 432 7227',
        mensajePredeterminado: 'Hola, me gustaría solicitar información sobre sus servicios de estructuras metálicas.',
        orden: 0,
        activo: true
      }
    })

    console.log('✅ Contacto principal creado:')
    console.log(`   Nombre: ${contactoPrincipal.nombre}`)
    console.log(`   Cargo: ${contactoPrincipal.cargo}`)
    console.log(`   Teléfono: ${contactoPrincipal.telefono}`)

    // Verificar/crear configuración
    let config = await prisma.configuracionWhatsApp.findFirst()

    if (!config) {
      config = await prisma.configuracionWhatsApp.create({
        data: {
          horarioAtencion: 'Lunes a Viernes: 7:00 AM - 5:00 PM | Sábados: 8:00 AM - 12:00 PM',
          mensajeIntroduccion: 'Contáctanos por WhatsApp para recibir atención personalizada',
          tituloWidget: 'Háblanos por WhatsApp',
          activo: true
        }
      })
      console.log('✅ Configuración del widget creada')
    } else {
      console.log('✅ Configuración del widget ya existe')
    }

    console.log('\n💡 El widget ya está listo con el contacto principal de MEISA')
    console.log('💡 Puedes agregar más contactos desde: /admin/contactos-whatsapp')

  } catch (error) {
    console.error('❌ Error al agregar contacto:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
if (require.main === module) {
  agregarContactoPrincipal()
    .then(() => {
      console.log('\n✅ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
}

export default agregarContactoPrincipal
