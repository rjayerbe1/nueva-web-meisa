import { prisma } from '@/lib/prisma'
import ContactosWhatsAppClient from './ContactosWhatsAppClient'

export const dynamic = 'force-dynamic'

export default async function ContactosWhatsAppAdminPage() {
  // SSR: fetch inicial para eliminar el skeleton "Cargando..."
  const [contactos, configuracion] = await Promise.all([
    prisma.contactoWhatsApp.findMany({ orderBy: { orden: 'asc' } }),
    prisma.configuracionWhatsApp.findFirst(),
  ])

  // Si no existe configuración, crear una por defecto (mantiene el comportamiento del API)
  const configFinal =
    configuracion ??
    (await prisma.configuracionWhatsApp.create({
      data: {
        horarioAtencion: 'Lunes a Viernes: 7:00 AM - 5:00 PM',
        mensajeIntroduccion:
          'Elije la persona disponible para iniciar una conversación de WhatsApp',
        tituloWidget: 'Háblanos por WhatsApp',
        activo: true,
      },
    }))

  return (
    <ContactosWhatsAppClient
      initialContactos={JSON.parse(JSON.stringify(contactos))}
      initialConfiguracion={JSON.parse(JSON.stringify(configFinal))}
    />
  )
}
