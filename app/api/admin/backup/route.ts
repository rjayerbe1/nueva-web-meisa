import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createEnhancedBackup } from '@/enhanced-backup-system'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { type, backupType = 'database' } = await request.json()
    
    if (type === 'manual') {
      // Backup completo con imágenes y logos
      if (backupType === 'complete') {
        try {
          const result = await createEnhancedBackup()
          
          if (result.success) {
            return NextResponse.json({
              success: true,
              backup: {
                name: path.basename(result.backupPath!),
                path: result.backupPath,
                size: result.size,
                created: new Date().toISOString(),
                type: 'complete',
                includes: result.includes,
                stats: result.stats
              }
            })
          } else {
            return NextResponse.json({ 
              error: result.error || 'Error al crear backup completo' 
            }, { status: 500 })
          }
        } catch (error) {
          console.error('Error en backup completo:', error)
          return NextResponse.json({ 
            error: 'Error al crear backup completo' 
          }, { status: 500 })
        }
      }
      
      // Backup solo de base de datos (comportamiento original)
      // Crear backup manual usando Prisma
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupName = `backup-meisa-${timestamp}.json`
      const backupDir = path.join(process.cwd(), 'backups')
      
      // Crear directorio de backups si no existe
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }
      
      const backupPath = path.join(backupDir, backupName)
      
      try {
        // Exportar datos usando Prisma
        const backupData = {
          timestamp: new Date().toISOString(),
          database: 'meisa',
          version: '1.0',
          data: {
            users: await prisma.user.findMany(),
            proyectos: await prisma.proyecto.findMany({
              include: {
                imagenes: true,
                documentos: true,
                progreso: true,
                timeline: true,
                comentarios: true,
                clienteRel: true
              }
            }),
            clientes: await prisma.cliente.findMany(),
            servicios: await prisma.servicio.findMany(),
            miembrosEquipo: await prisma.miembroEquipo.findMany(),
            formulariosContacto: await prisma.contactForm.findMany(),
            configuracion: await prisma.configuracionSitio.findMany()
          }
        }
        
        // Convertir Decimal a string para serialización JSON
        const jsonData = JSON.stringify(backupData, (key, value) => {
          if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
            return value.toString()
          }
          return value
        }, 2)
        
        // Escribir backup
        fs.writeFileSync(backupPath, jsonData)
        
        const stats = fs.statSync(backupPath)
        
        return NextResponse.json({
          success: true,
          backup: {
            name: backupName,
            path: backupPath,
            size: stats.size,
            created: new Date().toISOString(),
            type: 'database',
            includes: {
              database: true,
              projectImages: false,
              clientLogos: false
            }
          }
        })
        
      } catch (error) {
        console.error('Error creando backup:', error)
        return NextResponse.json({ error: 'Error al crear el backup' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Tipo de backup no válido' }, { status: 400 })
    
  } catch (error) {
    console.error('Error en backup:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] })
    }
    
    const files = fs.readdirSync(backupDir)
    const backups = files
      .filter(file => file.endsWith('.json') || file.endsWith('.sql') || file.endsWith('.zip'))
      .map(file => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)
        
        // Determinar tipo de backup basado en el nombre del archivo
        let backupType = 'database'
        let includes = {
          database: true,
          projectImages: false,
          clientLogos: false
        }
        
        if (file.includes('complete-backup') || file.endsWith('.zip')) {
          backupType = 'complete'
          includes = {
            database: true,
            projectImages: true,
            clientLogos: true
          }
        }
        
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
          type: backupType,
          includes
        }
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    
    return NextResponse.json({ backups })
    
  } catch (error) {
    console.error('Error obteniendo backups:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}