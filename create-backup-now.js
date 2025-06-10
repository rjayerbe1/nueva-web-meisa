const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBackup() {
  try {
    console.log('🚀 Iniciando backup de la base de datos...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `backup-meisa-${timestamp}.json`);

    // Crear directorio de backups si no existe
    await fs.promises.mkdir(backupDir, { recursive: true });

    // Obtener todos los datos
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      users: await prisma.user.findMany(),
      proyectos: await prisma.proyecto.findMany(),
      imagenesProyecto: await prisma.imagenProyecto.findMany(),
      progresoProyecto: await prisma.progresoProyecto.findMany(),
      servicios: await prisma.servicio.findMany(),
      miembrosEquipo: await prisma.miembroEquipo.findMany(),
      contactForms: await prisma.contactForm.findMany(),
      clientes: await prisma.cliente.findMany(),
      configuracion: await prisma.configuracion.findMany(),
    };

    // Guardar el backup
    await fs.promises.writeFile(backupFile, JSON.stringify(data, null, 2));

    const stats = await fs.promises.stat(backupFile);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('✅ Backup completado exitosamente!');
    console.log(`📁 Archivo: ${backupFile}`);
    console.log(`📊 Tamaño: ${sizeInMB} MB`);
    console.log(`📋 Datos incluidos:`);
    console.log(`   - Usuarios: ${data.users.length}`);
    console.log(`   - Proyectos: ${data.proyectos.length}`);
    console.log(`   - Imágenes de proyectos: ${data.imagenesProyecto.length}`);
    console.log(`   - Servicios: ${data.servicios.length}`);
    console.log(`   - Miembros equipo: ${data.miembrosEquipo.length}`);
    console.log(`   - Clientes: ${data.clientes.length}`);
    console.log(`   - Configuración: ${data.configuracion.length}`);

  } catch (error) {
    console.error('❌ Error al crear backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();