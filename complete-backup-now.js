const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function createCompleteBackup() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Iniciando backup completo de MEISA...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `meisa-complete-backup-${timestamp}.json`);

    // Crear directorio de backups si no existe
    await fs.promises.mkdir(backupDir, { recursive: true });

    console.log('📊 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión establecida');

    console.log('📋 Obteniendo todos los datos...');

    const data = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      description: 'Backup completo después de mejoras en UI de servicios especializados',
      changes: [
        'Eliminada sección "Valor Agregado MEISA" de página general de servicios',
        'Mejorado diseño del hero section en páginas de detalle de servicios',
        'Implementado icono oficial de WhatsApp en botón de contacto',
        'Removida información duplicada en tarjetas laterales de servicios',
        'Optimizada jerarquía visual y reducido desorden en interfaces'
      ],
      database: {}
    };

    // Obtener todos los datos de todas las tablas
    const tables = [
      'user', 'proyecto', 'imagenProyecto', 'progresoProyecto', 
      'servicio', 'miembroEquipo', 'contactForm', 'cliente', 'configuracion'
    ];

    for (const table of tables) {
      try {
        console.log(`📋 Obteniendo datos de tabla: ${table}`);
        data.database[table] = await prisma[table].findMany();
        console.log(`✅ ${table}: ${data.database[table].length} registros`);
      } catch (error) {
        console.log(`⚠️ Error en tabla ${table}:`, error.message);
        data.database[table] = [];
      }
    }

    // Agregar estadísticas del backup
    data.stats = {
      totalTables: Object.keys(data.database).length,
      totalRecords: Object.values(data.database).reduce((sum, table) => sum + table.length, 0),
      tableStats: Object.entries(data.database).reduce((stats, [table, records]) => {
        stats[table] = records.length;
        return stats;
      }, {})
    };

    console.log('💾 Guardando backup...');
    await fs.promises.writeFile(backupFile, JSON.stringify(data, null, 2));

    const stats = await fs.promises.stat(backupFile);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n🎉 ¡BACKUP COMPLETO EXITOSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Archivo: ${backupFile}`);
    console.log(`📊 Tamaño: ${sizeInMB} MB`);
    console.log(`📋 Total de registros: ${data.stats.totalRecords}`);
    console.log('\n📊 Detalle por tabla:');
    
    Object.entries(data.stats.tableStats).forEach(([table, count]) => {
      console.log(`   ${table.padEnd(20)} ${count.toString().padStart(3)} registros`);
    });
    
    console.log('\n✨ Estado actual del sistema guardado correctamente');
    console.log('🔄 Cambios recientes incluidos en este backup:');
    data.changes.forEach(change => {
      console.log(`   • ${change}`);
    });

  } catch (error) {
    console.error('❌ Error al crear backup completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCompleteBackup();