const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function createBackup() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Iniciando backup simple...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `simple-backup-${timestamp}.json`);

    // Crear directorio de backups si no existe
    await fs.promises.mkdir(backupDir, { recursive: true });

    console.log('📊 Obteniendo datos de las tablas principales...');

    // Verificar conexión primero
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida');

    // Obtener datos de tablas principales
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metadata: {
        note: 'Backup después de modificaciones en servicios - eliminación Valor Agregado MEISA y mejoras UI',
        changes: [
          'Eliminada sección Valor Agregado MEISA de página general de servicios',
          'Mejorado diseño del hero section en detalles de servicios',
          'Cambiado icono de WhatsApp en botón de contacto',
          'Reducida información duplicada en tarjetas de servicios'
        ]
      }
    };

    // Intentar obtener datos de cada tabla
    try {
      data.servicios = await prisma.servicio.findMany();
      console.log(`✅ Servicios: ${data.servicios.length} registros`);
    } catch (e) {
      console.log('⚠️ No se pudo obtener servicios:', e.message);
      data.servicios = [];
    }

    try {
      data.proyectos = await prisma.proyecto.findMany();
      console.log(`✅ Proyectos: ${data.proyectos.length} registros`);
    } catch (e) {
      console.log('⚠️ No se pudo obtener proyectos:', e.message);
      data.proyectos = [];
    }

    try {
      data.clientes = await prisma.cliente.findMany();
      console.log(`✅ Clientes: ${data.clientes.length} registros`);
    } catch (e) {
      console.log('⚠️ No se pudo obtener clientes:', e.message);
      data.clientes = [];
    }

    // Guardar el backup
    await fs.promises.writeFile(backupFile, JSON.stringify(data, null, 2));

    const stats = await fs.promises.stat(backupFile);
    const sizeInKB = (stats.size / 1024).toFixed(2);

    console.log('✅ Backup completado exitosamente!');
    console.log(`📁 Archivo: ${backupFile}`);
    console.log(`📊 Tamaño: ${sizeInKB} KB`);

  } catch (error) {
    console.error('❌ Error al crear backup:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();