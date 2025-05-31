import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener configuración de backups
    const configs = await prisma.configuracionSitio.findMany({
      where: {
        clave: {
          in: [
            'backup_daily_enabled',
            'backup_daily_time',
            'backup_daily_retention_days',
            'backup_weekly_enabled', 
            'backup_weekly_day',
            'backup_weekly_time',
            'backup_weekly_retention_weeks'
          ]
        }
      }
    })
    
    const configMap = configs.reduce((acc, config) => {
      acc[config.clave] = config.valor
      return acc
    }, {} as Record<string, string>)
    
    return NextResponse.json({
      dailyBackup: {
        enabled: configMap.backup_daily_enabled === 'true',
        time: configMap.backup_daily_time || '02:00',
        retentionDays: parseInt(configMap.backup_daily_retention_days || '7')
      },
      weeklyBackup: {
        enabled: configMap.backup_weekly_enabled === 'true',
        day: configMap.backup_weekly_day || 'sunday',
        time: configMap.backup_weekly_time || '01:00',
        retentionWeeks: parseInt(configMap.backup_weekly_retention_weeks || '4')
      }
    })
    
  } catch (error) {
    console.error('Error obteniendo configuración de backups:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { dailyBackup, weeklyBackup } = await request.json()
    
    // Validaciones
    if (dailyBackup?.time && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(dailyBackup.time)) {
      return NextResponse.json({ error: 'Formato de hora inválido para backup diario' }, { status: 400 })
    }
    
    if (weeklyBackup?.time && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(weeklyBackup.time)) {
      return NextResponse.json({ error: 'Formato de hora inválido para backup semanal' }, { status: 400 })
    }
    
    if (weeklyBackup?.day && !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(weeklyBackup.day)) {
      return NextResponse.json({ error: 'Día de la semana inválido' }, { status: 400 })
    }
    
    // Actualizar configuraciones
    const configs = [
      { clave: 'backup_daily_enabled', valor: String(dailyBackup?.enabled || false) },
      { clave: 'backup_daily_time', valor: dailyBackup?.time || '02:00' },
      { clave: 'backup_daily_retention_days', valor: String(dailyBackup?.retentionDays || 7) },
      { clave: 'backup_weekly_enabled', valor: String(weeklyBackup?.enabled || false) },
      { clave: 'backup_weekly_day', valor: weeklyBackup?.day || 'sunday' },
      { clave: 'backup_weekly_time', valor: weeklyBackup?.time || '01:00' },
      { clave: 'backup_weekly_retention_weeks', valor: String(weeklyBackup?.retentionWeeks || 4) }
    ]
    
    for (const config of configs) {
      await prisma.configuracionSitio.upsert({
        where: { clave: config.clave },
        update: { 
          valor: config.valor,
          updatedAt: new Date()
        },
        create: {
          clave: config.clave,
          valor: config.valor,
          descripcion: getConfigDescription(config.clave),
          tipo: getConfigType(config.clave),
          categoria: 'backup'
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Configuración de backups actualizada exitosamente'
    })
    
  } catch (error) {
    console.error('Error actualizando configuración de backups:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

function getConfigDescription(clave: string): string {
  const descriptions: Record<string, string> = {
    'backup_daily_enabled': 'Habilitar backups diarios automáticos',
    'backup_daily_time': 'Hora para ejecutar backup diario',
    'backup_daily_retention_days': 'Días de retención para backups diarios',
    'backup_weekly_enabled': 'Habilitar backups semanales automáticos',
    'backup_weekly_day': 'Día de la semana para backup semanal',
    'backup_weekly_time': 'Hora para ejecutar backup semanal',
    'backup_weekly_retention_weeks': 'Semanas de retención para backups semanales'
  }
  return descriptions[clave] || ''
}

function getConfigType(clave: string): string {
  if (clave.includes('enabled')) return 'BOOLEAN'
  if (clave.includes('time')) return 'TEXTO'
  if (clave.includes('day')) return 'TEXTO'
  if (clave.includes('retention')) return 'NUMERO'
  return 'TEXTO'
}