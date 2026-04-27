import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import {
  sendContactNotificationEmail,
  sendContactConfirmationEmail,
} from '@/lib/email'

const adjuntoSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  size: z.number().optional(),
  mime: z.string().optional(),
})

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Teléfono inválido'),
  empresa: z.string().nullable().optional(),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  tipoProyecto: z.string().min(1, 'Tipo requerido'),
  etapa: z.string().min(1, 'Etapa requerida'),
  escalaValor: z.number().nullable().optional(),
  escalaUnidad: z.enum(['M2', 'TON', 'NA']).nullable().optional(),
  descripcion: z.string().min(10, 'Mensaje muy corto'),
  adjuntos: z.array(adjuntoSchema).max(10).optional(),
})

function buildReferencia(id: string): string {
  return `MEISA-${id.slice(-6).toUpperCase()}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    const origen = request.headers.get('referer') || 'contacto'

    const contact = await prisma.contactForm.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        empresa: data.empresa || null,
        ciudad: data.ciudad,
        tipoProyecto: data.tipoProyecto,
        etapa: data.etapa,
        escalaValor: data.escalaValor ?? null,
        escalaUnidad: data.escalaUnidad ?? null,
        mensaje: data.descripcion,
        adjuntos: data.adjuntos && data.adjuntos.length > 0 ? data.adjuntos : undefined,
        origen,
      },
    })

    const referencia = buildReferencia(contact.id)
    await prisma.contactForm.update({
      where: { id: contact.id },
      data: { referencia },
    })

    // Notificaciones — no fallar el request si los emails fallan
    const emailResults = await Promise.allSettled([
      sendContactNotificationEmail({
        contactId: contact.id,
        referencia,
        nombre: data.nombre,
        empresa: data.empresa,
        email: data.email,
        telefono: data.telefono,
        ciudad: data.ciudad,
        tipoProyecto: data.tipoProyecto,
        etapa: data.etapa,
        escalaValor: data.escalaValor ?? null,
        escalaUnidad: data.escalaUnidad ?? null,
        mensaje: data.descripcion,
        adjuntos: data.adjuntos as
          | Array<{ name: string; url: string; size?: number; mime?: string }>
          | undefined,
        origen,
      }),
      sendContactConfirmationEmail({
        to: data.email,
        nombre: data.nombre,
        referencia,
      }),
    ])

    emailResults.forEach((res, i) => {
      if (res.status === 'rejected') {
        const tag = i === 0 ? 'admin' : 'cliente'
        console.error(`[contact] email ${tag} falló:`, res.reason)
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje recibido correctamente',
        id: contact.id,
        referencia,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error('Error al procesar contacto:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar el mensaje. Por favor, intenta nuevamente.',
      },
      { status: 500 },
    )
  }
}

// GET para listar contactos (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const role = session?.user?.role

    if (!session || (role !== UserRole.ADMIN && role !== UserRole.EDITOR)) {
      return NextResponse.json(
        {
          success: false,
          message: 'No autorizado',
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const estado = searchParams.get('estado') || undefined
    const search = searchParams.get('search') || undefined

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (estado) where.estado = estado
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
        { referencia: { contains: search, mode: 'insensitive' } },
        { ciudad: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [contactos, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactForm.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: contactos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error al obtener contactos:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los contactos',
      },
      { status: 500 },
    )
  }
}
