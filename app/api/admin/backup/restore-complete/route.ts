import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { restoreCompleteBackup } from '@/restore-complete-backup'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { backupName, confirmPhrase } = await request.json()
    
    // Verificación de seguridad
    if (confirmPhrase !== 'CONFIRMO RESTAURAR BACKUP COMPLETO') {
      return NextResponse.json({ 
        error: 'Frase de confirmación incorrecta. Debe escribir exactamente: CONFIRMO RESTAURAR BACKUP COMPLETO' 
      }, { status: 400 })
    }
    
    if (!backupName) {
      return NextResponse.json({ error: 'Nombre de backup requerido' }, { status: 400 })
    }
    
    const backupDir = path.join(process.cwd(), 'backups')
    const backupPath = path.join(backupDir, backupName)
    
    // Verificar que el archivo existe
    if (!fs.existsSync(backupPath)) {
      return NextResponse.json({ error: 'Archivo de backup no encontrado' }, { status: 404 })
    }
    
    // Verificar que es un archivo ZIP
    if (!backupName.endsWith('.zip')) {
      return NextResponse.json({ 
        error: 'Solo se pueden restaurar backups completos en formato ZIP' 
      }, { status: 400 })
    }
    
    try {
      console.log(`Iniciando restauración completa de: ${backupName}`)
      
      // Ejecutar restauración completa
      const result = await restoreCompleteBackup(backupPath)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Backup completo restaurado exitosamente',
          restored: result.restoredComponents,
          stats: result.stats
        })
      } else {
        return NextResponse.json({ 
          error: result.error || 'Error desconocido en la restauración' 
        }, { status: 500 })
      }
      
    } catch (error) {
      console.error('Error restaurando backup completo:', error)
      return NextResponse.json({ 
        error: `Error al restaurar el backup completo: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error en restore-complete:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}