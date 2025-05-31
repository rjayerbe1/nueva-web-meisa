import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema de validación para el contacto
const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar los datos
    const validatedData = contactSchema.parse(body)
    
    // Guardar en la base de datos
    const contact = await prisma.contactForm.create({
      data: {
        nombre: validatedData.nombre,
        email: validatedData.email,
        telefono: validatedData.telefono || null,
        empresa: validatedData.empresa || null,
        mensaje: validatedData.mensaje,
        origen: request.headers.get('referer') || 'contacto',
      }
    })
    
    // Aquí podrías agregar lógica adicional como:
    // - Enviar un email de notificación
    // - Integrar con un servicio de CRM
    // - Enviar confirmación al usuario
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje recibido correctamente',
        id: contact.id 
      },
      { status: 200 }
    )
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Datos inválidos',
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    console.error('Error al procesar contacto:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al procesar el mensaje. Por favor, intenta nuevamente.' 
      },
      { status: 500 }
    )
  }
}

// GET para obtener contactos (solo para admin)
export async function GET(request: NextRequest) {
  try {
    // Aquí deberías verificar autenticación de admin
    // Por ahora solo devolvemos los contactos
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const leido = searchParams.get('leido') === 'true' ? true : searchParams.get('leido') === 'false' ? false : undefined
    const respondido = searchParams.get('respondido') === 'true' ? true : searchParams.get('respondido') === 'false' ? false : undefined
    
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (leido !== undefined) where.leido = leido
    if (respondido !== undefined) where.respondido = respondido
    
    const [contactos, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactForm.count({ where })
    ])
    
    return NextResponse.json({
      success: true,
      data: contactos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error al obtener contactos:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener los contactos' 
      },
      { status: 500 }
    )
  }
}