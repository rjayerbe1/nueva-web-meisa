import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const backupName = searchParams.get('backup')
    
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
    const validExtensions = ['.json', '.sql', '.zip']
    const isValidBackup = validExtensions.some(ext => backupName.endsWith(ext))
    
    if (!isValidBackup) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }
    
    try {
      // Leer el archivo
      const fileBuffer = fs.readFileSync(backupPath)
      const stats = fs.statSync(backupPath)
      
      // Determinar el tipo de contenido
      let contentType = 'application/octet-stream'
      if (backupName.endsWith('.json')) {
        contentType = 'application/json'
      } else if (backupName.endsWith('.sql')) {
        contentType = 'application/sql'
      } else if (backupName.endsWith('.zip')) {
        contentType = 'application/zip'
      }
      
      // Crear respuesta con headers apropiados para descarga
      const response = new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${backupName}"`,
          'Content-Length': stats.size.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      return response
      
    } catch (error) {
      console.error('Error leyendo backup:', error)
      return NextResponse.json({ 
        error: 'Error al leer el archivo de backup' 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error en download backup:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}