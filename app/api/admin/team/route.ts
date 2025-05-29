import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const teamMembers = await prisma.miembroEquipo.findMany({
      orderBy: { orden: 'asc' }
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    const teamMember = await prisma.miembroEquipo.create({
      data: {
        nombre: data.nombre,
        cargo: data.cargo,
        bio: data.bio || null,
        foto: data.foto || null,
        email: data.email || null,
        telefono: data.telefono || null,
        linkedin: data.linkedin || null,
        orden: data.orden || 999,
      }
    })

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}