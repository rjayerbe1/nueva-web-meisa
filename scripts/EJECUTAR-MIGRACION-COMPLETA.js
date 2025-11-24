const { execSync } = require('child_process')
const path = require('path')

console.log('╔' + '═'.repeat(78) + '╗')
console.log('║' + ' '.repeat(18) + 'MIGRACIÓN COMPLETA DE CATEGORÍAS' + ' '.repeat(28) + '║')
console.log('╚' + '═'.repeat(78) + '╝')
console.log()
console.log('Este script ejecutará los siguientes pasos:')
console.log('  1. 🧹 Limpiar proyectos problemáticos y duplicados')
console.log('  2. 📦 Migrar TODOS los proyectos faltantes')
console.log('  3. 📊 Actualizar contadores de categorías')
console.log('  4. ✅ Generar reporte final')
console.log()
console.log('⚠️  ADVERTENCIA: Se eliminarán proyectos con datos incorrectos')
console.log()
console.log('Iniciando en 3 segundos...')
console.log()

// Esperar 3 segundos
setTimeout(() => {
  try {
    const scriptsDir = __dirname

    console.log('='.repeat(80))
    console.log('PASO 1/3: LIMPIEZA')
    console.log('='.repeat(80))
    console.log()

    execSync('node ' + path.join(scriptsDir, 'paso1-limpiar-problematicos.js'), {
      stdio: 'inherit',
      cwd: path.join(scriptsDir, '..')
    })

    console.log()
    console.log('='.repeat(80))
    console.log('PASO 2/3: MIGRACIÓN')
    console.log('='.repeat(80))
    console.log()

    execSync('node ' + path.join(scriptsDir, 'paso2-migrar-todos.js'), {
      stdio: 'inherit',
      cwd: path.join(scriptsDir, '..')
    })

    console.log()
    console.log('='.repeat(80))
    console.log('PASO 3/3: ACTUALIZACIÓN DE CONTADORES')
    console.log('='.repeat(80))
    console.log()

    execSync('node ' + path.join(scriptsDir, 'paso3-actualizar-contadores.js'), {
      stdio: 'inherit',
      cwd: path.join(scriptsDir, '..')
    })

    console.log()
    console.log('╔' + '═'.repeat(78) + '╗')
    console.log('║' + ' '.repeat(25) + '🎉 MIGRACIÓN COMPLETADA 🎉' + ' '.repeat(28) + '║')
    console.log('╚' + '═'.repeat(78) + '╝')
    console.log()
    console.log('✅ Todos los proyectos han sido migrados exitosamente')
    console.log()
    console.log('Para ver el estado final, ejecuta:')
    console.log('  node scripts/quick-status.js')
    console.log()

  } catch (error) {
    console.error()
    console.error('╔' + '═'.repeat(78) + '╗')
    console.error('║' + ' '.repeat(32) + '❌ ERROR ❌' + ' '.repeat(35) + '║')
    console.error('╚' + '═'.repeat(78) + '╝')
    console.error()
    console.error('La migración falló:', error.message)
    console.error()
    process.exit(1)
  }
}, 3000)
