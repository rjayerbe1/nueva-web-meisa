import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { backupName, confirmPhrase } = await request.json()
    
    // Verificación de seguridad
    if (confirmPhrase !== 'CONFIRMO ELIMINAR BACKUP') {
      return NextResponse.json({ 
        error: 'Frase de confirmación incorrecta. Debe escribir exactamente: CONFIRMO ELIMINAR BACKUP' 
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
    
    // Verificar que es un archivo de backup válido
    if (!backupName.endsWith('.json') && !backupName.endsWith('.sql')) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }
    
    // Prevenir eliminación de backups de seguridad recientes (menos de 1 hora)
    const stats = fs.statSync(backupPath)
    const isRecentSafetyBackup = backupName.startsWith('safety-backup-') && 
      (Date.now() - stats.birthtime.getTime()) < 60 * 60 * 1000 // 1 hora
    
    if (isRecentSafetyBackup) {
      return NextResponse.json({ 
        error: 'No se pueden eliminar backups de seguridad creados en la última hora' 
      }, { status: 400 })
    }
    
    try {
      // Eliminar el archivo
      fs.unlinkSync(backupPath)
      
      return NextResponse.json({
        success: true,
        message: 'Backup eliminado exitosamente'
      })
      
    } catch (error) {
      console.error('Error eliminando backup:', error)
      return NextResponse.json({ 
        error: 'Error al eliminar el archivo de backup' 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error en delete backup:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}