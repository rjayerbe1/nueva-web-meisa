import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener proyectos con filtros
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const departamento = searchParams.get('departamento')
    const año = searchParams.get('año')
    const busqueda = searchParams.get('busqueda')
    const soloVisibles = searchParams.get('soloVisibles') === 'true'

    const where: any = {}

    if (soloVisibles) {
      where.visible = true
    }

    if (departamento) {
      where.departamento = departamento
    }

    if (año) {
      const yearInt = parseInt(año)
      // Incluir proyectos que estén activos durante este año
      // (empiezan antes/durante Y terminan durante/después)
      where.AND = [
        {
          fechaInicio: {
            lte: new Date(`${yearInt}-12-31`)
          }
        },
        {
          fechaFin: {
            gte: new Date(`${yearInt}-01-01`)
          }
        }
      ]
    }

    if (busqueda) {
      where.OR = [
        { entidadContratante: { contains: busqueda, mode: 'insensitive' } },
        { objetoContrato: { contains: busqueda, mode: 'insensitive' } },
        { ubicacion: { contains: busqueda, mode: 'insensitive' } }
      ]
    }

    const proyectos = await prisma.proyectoHojaVida.findMany({
      where,
      orderBy: [
        { destacado: 'desc' },
        { fechaInicio: 'desc' },
        { orden: 'asc' }
      ]
    })

    return NextResponse.json(proyectos)
  } catch (error) {
    console.error('Error fetching proyectos:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo proyecto (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const proyecto = await prisma.proyectoHojaVida.create({
      data: {
        entidadContratante: body.entidadContratante,
        objetoContrato: body.objetoContrato,
        fechaInicio: new Date(body.fechaInicio),
        fechaFin: new Date(body.fechaFin),
        pesoKg: body.pesoKg ? parseFloat(body.pesoKg) : null,
        areaM2: body.areaM2 ? parseFloat(body.areaM2) : null,
        ubicacion: body.ubicacion,
        departamento: body.departamento || null,
        valorContrato: parseFloat(body.valorContrato),
        moneda: body.moneda || 'COP',
        imagenes: body.imagenes || null,
        destacado: body.destacado || false,
        visible: body.visible !== false,
        orden: body.orden || 0
      }
    })

    return NextResponse.json(proyecto, { status: 201 })
  } catch (error) {
    console.error('Error creating proyecto:', error)
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    )
  }
}
