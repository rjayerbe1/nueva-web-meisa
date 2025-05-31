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

    const { backupName, confirmPhrase } = await request.json()
    
    // Verificación de seguridad
    if (confirmPhrase !== 'CONFIRMO RESTAURAR BASE DE DATOS') {
      return NextResponse.json({ 
        error: 'Frase de confirmación incorrecta. Debe escribir exactamente: CONFIRMO RESTAURAR BASE DE DATOS' 
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
    
    // Obtener URL de la base de datos
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: 'DATABASE_URL no configurada' }, { status: 500 })
    }
    
    try {
      // Primero hacer un backup de seguridad de la BD actual
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const safetyBackupName = `safety-backup-${timestamp}.json`
      const safetyBackupPath = path.join(backupDir, safetyBackupName)
      
      console.log('Creando backup de seguridad antes de restaurar...')
      
      // Crear backup de seguridad
      const currentData = {
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
      
      const safetyData = JSON.stringify(currentData, (key, value) => {
        if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
          return value.toString()
        }
        return value
      }, 2)
      
      fs.writeFileSync(safetyBackupPath, safetyData)
      
      // Leer backup a restaurar
      const backupContent = fs.readFileSync(backupPath, 'utf8')
      const backupData = JSON.parse(backupContent)
      
      // Solo manejar backups JSON por ahora
      // Los backups ZIP completos deben ser restaurados manualmente
      if (!backupName.endsWith('.json')) {
        return NextResponse.json({ 
          error: 'Solo se pueden restaurar backups de base de datos (.json). Los backups completos (.zip) deben ser restaurados manualmente.' 
        }, { status: 400 })
      }
      
      console.log('Restaurando base de datos desde backup...')
      
      // PostgreSQL no necesita desactivar foreign key checks
      // Las relaciones se manejan con el orden correcto de eliminación e inserción
      
      // Limpiar todas las tablas en orden correcto para PostgreSQL
      // Primero eliminar registros que dependen de otros (relaciones)
      await prisma.comentarioProyecto.deleteMany({})
      await prisma.timelineEntry.deleteMany({})
      await prisma.progresoProyecto.deleteMany({})
      await prisma.documentoProyecto.deleteMany({})
      await prisma.imagenProyecto.deleteMany({})
      await prisma.proyecto.deleteMany({})
      
      // Luego eliminar tablas independientes
      await prisma.contactForm.deleteMany({})
      await prisma.configuracionSitio.deleteMany({})
      await prisma.miembroEquipo.deleteMany({})
      await prisma.servicio.deleteMany({})
      await prisma.cliente.deleteMany({})
      
      // Finalmente eliminar sesiones y usuarios
      await prisma.session.deleteMany({})
      await prisma.account.deleteMany({})
      await prisma.user.deleteMany({})
      
      // Restaurar datos
      if (backupData.data.users?.length > 0) {
        for (const user of backupData.data.users) {
          const { createdAt, updatedAt, ...userData } = user
          await prisma.user.create({ data: userData })
        }
      }
      
      if (backupData.data.clientes?.length > 0) {
        for (const cliente of backupData.data.clientes) {
          const { id, createdAt, updatedAt, ...clienteData } = cliente
          await prisma.cliente.create({ data: clienteData })
        }
      }
      
      if (backupData.data.servicios?.length > 0) {
        for (const servicio of backupData.data.servicios) {
          const { id, createdAt, updatedAt, ...servicioData } = servicio
          await prisma.servicio.create({ data: servicioData })
        }
      }
      
      if (backupData.data.miembrosEquipo?.length > 0) {
        for (const miembro of backupData.data.miembrosEquipo) {
          const { id, createdAt, updatedAt, ...miembroData } = miembro
          await prisma.miembroEquipo.create({ data: miembroData })
        }
      }
      
      if (backupData.data.proyectos?.length > 0) {
        for (const proyecto of backupData.data.proyectos) {
          const { id, imagenes, documentos, progreso, timeline, comentarios, clienteRel, createdAt, updatedAt, ...proyectoData } = proyecto
          
          const nuevoProyecto = await prisma.proyecto.create({ data: proyectoData })
          
          // Restaurar imágenes
          if (imagenes?.length > 0) {
            for (const imagen of imagenes) {
              const { id, proyectoId, createdAt, updatedAt, ...imagenData } = imagen
              await prisma.imagenProyecto.create({
                data: {
                  ...imagenData,
                  proyectoId: nuevoProyecto.id
                }
              })
            }
          }
          
          // Restaurar documentos
          if (documentos?.length > 0) {
            for (const documento of documentos) {
              await prisma.documentoProyecto.create({
                data: {
                  ...documento,
                  proyectoId: nuevoProyecto.id
                }
              })
            }
          }
          
          // Restaurar progreso
          if (progreso?.length > 0) {
            for (const prog of progreso) {
              await prisma.progresoProyecto.create({
                data: {
                  ...prog,
                  proyectoId: nuevoProyecto.id
                }
              })
            }
          }
          
          // Restaurar timeline
          if (timeline?.length > 0) {
            for (const entry of timeline) {
              await prisma.timelineEntry.create({
                data: {
                  ...entry,
                  proyectoId: nuevoProyecto.id
                }
              })
            }
          }
          
          // Restaurar comentarios
          if (comentarios?.length > 0) {
            for (const comentario of comentarios) {
              await prisma.comentarioProyecto.create({
                data: {
                  ...comentario,
                  proyectoId: nuevoProyecto.id
                }
              })
            }
          }
        }
      }
      
      if (backupData.data.formulariosContacto?.length > 0) {
        for (const formulario of backupData.data.formulariosContacto) {
          await prisma.contactForm.create({ data: formulario })
        }
      }
      
      if (backupData.data.configuracion?.length > 0) {
        for (const config of backupData.data.configuracion) {
          await prisma.configuracionSitio.create({ data: config })
        }
      }
      
      // PostgreSQL: Las restricciones se manejan automáticamente
      
      return NextResponse.json({
        success: true,
        message: 'Base de datos restaurada exitosamente',
        safetyBackup: safetyBackupName
      })
      
    } catch (error) {
      console.error('Error restaurando backup:', error)
      return NextResponse.json({ 
        error: `Error al restaurar el backup: ${error.message}` 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error en restore:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}