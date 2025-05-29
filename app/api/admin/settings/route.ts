import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'

// En un escenario real, esto se almacenaría en la base de datos
// Por ahora simulamos con un objeto en memoria
let settings = {
  companyName: 'MEISA - Metálicas e Ingeniería S.A.',
  siteUrl: 'https://meisa.com.co',
  description: 'Líderes en diseño, fabricación y montaje de estructuras metálicas en Colombia.',
  contactEmail: 'info@meisa.com.co',
  notificationEmail: 'admin@meisa.com.co',
  emailNotifications: true,
  twoFactorAuth: false,
  lastBackup: '2025-05-27',
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    // Actualizar configuraciones
    settings = {
      ...settings,
      ...data,
      // Mantener campos que no se pueden cambiar desde la interfaz
      lastBackup: settings.lastBackup,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}