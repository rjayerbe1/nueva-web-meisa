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
  // Campos de detalle: opcionales (los califica el comercial en la llamada).
  ciudad: z.string().nullable().optional(),
  tipoProyecto: z.string().min(1, 'Tipo requerido'),
  etapa: z.string().nullable().optional(),
  escalaValor: z.number().nullable().optional(),
  escalaUnidad: z.enum(['M2', 'TON', 'NA']).nullable().optional(),
  descripcion: z.string().min(10, 'Mensaje muy corto'),
  adjuntos: z.array(adjuntoSchema).max(10).optional(),
  // Honeypot anti-spam: campo invisible para humanos; si llega con valor, es un bot
  website: z.string().optional(),
  // Flujo en 2 pasos:
  //  - parcial=true  → paso 1: guarda el lead esencial (estado PARCIAL) y alerta al comercial.
  //  - id=<cuid>     → paso 2: enriquece ese lead con los detalles y lo pasa a NUEVO.
  parcial: z.boolean().optional(),
  id: z.string().optional(),
})

type ContactData = z.infer<typeof contactSchema>

function buildReferencia(id: string): string {
  return `MEISA-${id.slice(-6).toUpperCase()}`
}

// Notificación interna al comercial. `parcial` marca los leads del paso 1 (aún sin detalles).
async function notifyInternal(
  contactId: string,
  referencia: string,
  data: ContactData,
  origen: string,
  parcial: boolean,
) {
  await sendContactNotificationEmail({
    contactId,
    referencia,
    nombre: data.nombre,
    empresa: data.empresa,
    email: data.email,
    telefono: data.telefono,
    ciudad: data.ciudad ?? null,
    tipoProyecto: data.tipoProyecto,
    etapa: data.etapa ?? null,
    escalaValor: data.escalaValor ?? null,
    escalaUnidad: data.escalaUnidad ?? null,
    mensaje: parcial
      ? `⚠️ SOLICITUD PARCIAL (el usuario aún no completó los detalles del paso 2, pero ya podés contactarlo):\n\n${data.descripcion}`
      : data.descripcion,
    adjuntos: data.adjuntos as
      | Array<{ name: string; url: string; size?: number; mime?: string }>
      | undefined,
    origen: parcial ? `${origen} · parcial` : origen,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    if (data.website && data.website.trim() !== '') {
      // Bot detectado: responder éxito falso sin crear registro ni enviar emails
      return NextResponse.json(
        { success: true, message: 'Mensaje recibido correctamente' },
        { status: 200 },
      )
    }

    const origen = request.headers.get('referer') || 'contacto'
    const adjuntos =
      data.adjuntos && data.adjuntos.length > 0 ? data.adjuntos : undefined

    // ── PASO 2: enriquecer un lead parcial existente ──────────────────────
    if (data.id) {
      const existing = await prisma.contactForm.findUnique({
        where: { id: data.id },
      })
      // Solo enriquecemos leads que quedaron PARCIALes (evita pisar leads ya cerrados).
      if (existing && existing.estado === 'PARCIAL') {
        const referencia = existing.referencia ?? buildReferencia(existing.id)
        await prisma.contactForm.update({
          where: { id: existing.id },
          data: {
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            empresa: data.empresa || null,
            ciudad: data.ciudad || null,
            tipoProyecto: data.tipoProyecto,
            etapa: data.etapa || null,
            escalaValor: data.escalaValor ?? null,
            escalaUnidad: data.escalaUnidad ?? null,
            mensaje: data.descripcion,
            adjuntos,
            estado: 'NUEVO',
            referencia,
          },
        })

        // Confirmación al cliente (rápida). La notificación interna:
        //  - SIN adjuntos → se manda acá.
        //  - CON adjuntos → la manda /api/contact/analyze (correo único con
        //    adjuntos + análisis IA), disparado por el cliente. No la mandamos
        //    acá para no duplicar y porque el análisis tarda demasiado.
        const enrichTasks: Array<Promise<unknown>> = [
          sendContactConfirmationEmail({
            to: data.email,
            nombre: data.nombre,
            referencia,
          }),
        ]
        if (!adjuntos) {
          enrichTasks.push(notifyInternal(existing.id, referencia, data, origen, false))
        }
        const enrichResults = await Promise.allSettled(enrichTasks)
        enrichResults.forEach((res) => {
          if (res.status === 'rejected') {
            console.error('[contact] email (enrich) falló:', res.reason)
          }
        })

        return NextResponse.json(
          {
            success: true,
            message: 'Solicitud completada correctamente',
            id: existing.id,
            referencia,
          },
          { status: 200 },
        )
      }
      // Si el lead parcial no existe o ya no es parcial, caemos a crear uno nuevo
      // (nunca perder la solicitud del usuario).
    }

    // ── CREAR: paso 1 (parcial) o envío directo (mini-form / fallback) ────
    const parcial = data.parcial === true
    const contact = await prisma.contactForm.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        empresa: data.empresa || null,
        ciudad: data.ciudad || null,
        tipoProyecto: data.tipoProyecto,
        etapa: data.etapa || null,
        escalaValor: data.escalaValor ?? null,
        escalaUnidad: data.escalaUnidad ?? null,
        mensaje: data.descripcion,
        adjuntos,
        origen,
        estado: parcial ? 'PARCIAL' : 'NUEVO',
      },
    })

    const referencia = buildReferencia(contact.id)
    await prisma.contactForm.update({
      where: { id: contact.id },
      data: { referencia },
    })

    // Notificaciones — no fallar el request si los emails fallan.
    //  - Parcial: solo alerta interna (el cliente completa el paso 2).
    //  - Directo: confirmación al cliente + alerta interna, salvo que haya
    //    adjuntos (en ese caso la notificación completa con análisis IA la manda
    //    /api/contact/analyze, disparado por el cliente).
    const emailTasks: Array<Promise<unknown>> = []
    if (parcial) {
      emailTasks.push(notifyInternal(contact.id, referencia, data, origen, true))
    } else {
      emailTasks.push(
        sendContactConfirmationEmail({
          to: data.email,
          nombre: data.nombre,
          referencia,
        }),
      )
      if (!adjuntos) {
        emailTasks.push(notifyInternal(contact.id, referencia, data, origen, false))
      }
    }
    const emailResults = await Promise.allSettled(emailTasks)
    emailResults.forEach((res) => {
      if (res.status === 'rejected') {
        console.error('[contact] email falló:', res.reason)
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: parcial
          ? 'Datos recibidos correctamente'
          : 'Mensaje recibido correctamente',
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
