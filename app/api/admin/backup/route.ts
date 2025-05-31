import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { type } = await request.json()
    
    if (type === 'manual') {
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
                comentarios: true
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
            created: new Date().toISOString()
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
      .filter(file => file.endsWith('.json') || file.endsWith('.sql'))
      .map(file => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    
    return NextResponse.json({ backups })
    
  } catch (error) {
    console.error('Error obteniendo backups:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}