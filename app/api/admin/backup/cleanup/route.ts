import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener configuración de retención
    const configs = await prisma.configuracionSitio.findMany({
      where: {
        clave: {
          in: ['backup_daily_retention_days', 'backup_weekly_retention_weeks']
        }
      }
    })
    
    const configMap = configs.reduce((acc, config) => {
      acc[config.clave] = config.valor
      return acc
    }, {} as Record<string, string>)
    
    const dailyRetentionDays = parseInt(configMap.backup_daily_retention_days || '7')
    const weeklyRetentionWeeks = parseInt(configMap.backup_weekly_retention_weeks || '4')
    
    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ message: 'No hay directorio de backups' })
    }
    
    const files = fs.readdirSync(backupDir)
    const now = Date.now()
    let deletedCount = 0
    const errors = []
    
    for (const file of files) {
      if (!file.endsWith('.json') && !file.endsWith('.sql')) continue
      
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      const fileAge = now - stats.birthtime.getTime()
      
      let shouldDelete = false
      
      // Determinar si debe eliminarse según el tipo y edad
      if (file.startsWith('backup-meisa-')) {
        // Backup diario
        const maxAge = dailyRetentionDays * 24 * 60 * 60 * 1000
        shouldDelete = fileAge > maxAge
      } else if (file.startsWith('weekly-backup-')) {
        // Backup semanal
        const maxAge = weeklyRetentionWeeks * 7 * 24 * 60 * 60 * 1000
        shouldDelete = fileAge > maxAge
      } else if (file.startsWith('safety-backup-')) {
        // Backups de seguridad - mantener solo por 24 horas
        const maxAge = 24 * 60 * 60 * 1000
        shouldDelete = fileAge > maxAge
      }
      
      if (shouldDelete) {
        try {
          fs.unlinkSync(filePath)
          deletedCount++
        } catch (error) {
          errors.push(`Error eliminando ${file}: ${error.message}`)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Limpieza completada. ${deletedCount} archivos eliminados`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Error en limpieza de backups:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}