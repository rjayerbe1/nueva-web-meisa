const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function quickStatus() {
  console.log('\n' + '='.repeat(80))
  console.log('ESTADO ACTUAL DE MIGRACIÓN - RESUMEN RÁPIDO')
  console.log('='.repeat(80) + '\n')

  // 1. Proyectos por categoría
  const stats = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: { _all: true }
  })

  console.log('📊 DISTRIBUCIÓN ACTUAL:')
  console.log('-'.repeat(80))
  console.log('Categoría              | Actual | Esperado | Faltantes | Estado')
  console.log('-'.repeat(80))

  const esperado = {
    COMERCIAL: 55,
    INDUSTRIAL: 70,
    PUENTES: 50,
    INFRAESTRUCTURA_URBANA: 8,
    EDIFICACIONES: 42,
    DEPORTES_EDUCACION: 35
  }

  let totalActual = 0
  let totalEsperado = 0

  Object.entries(esperado).forEach(([cat, exp]) => {
    const actual = stats.find(s => s.categoria === cat)?._count._all || 0
    const falta = exp - actual
    const status = falta === 0 ? '✅' : (falta < 0 ? '⚠️ ' : '❌')
    const pad = ' '.repeat(22 - cat.length)
    console.log(`${cat}${pad} | ${String(actual).padStart(6)} | ${String(exp).padStart(8)} | ${String(falta).padStart(9)} | ${status}`)
    totalActual += actual
    totalEsperado += exp
  })

  console.log('-'.repeat(80))
  console.log(`TOTAL                     ${String(totalActual).padStart(6)} | ${String(totalEsperado).padStart(8)} | ${String(totalEsperado - totalActual).padStart(9)}`)

  // 2. Proyectos en HojaVida
  console.log('\n📋 PROYECTOS EN ProyectoHojaVida:')
  console.log('-'.repeat(80))
  const enHojaVida = await prisma.proyectoHojaVida.count()
  const vinculados = await prisma.proyectoHojaVida.count({
    where: { proyectoDetalladoId: { not: null } }
  })

  console.log(`Total en ProyectoHojaVida: ${enHojaVida}`)
  console.log(`Vinculados a Proyecto:     ${vinculados}`)
  console.log(`Sin vincular (faltantes):  ${enHojaVida - vinculados}`)

  // 3. Problemáticos
  console.log('\n⚠️  PROYECTOS PROBLEMÁTICOS:')
  console.log('-'.repeat(80))
  const problematicos = await prisma.proyecto.count({
    where: { cliente: { contains: 'Consorcio Cine Cultura' } }
  })
  const con490 = await prisma.proyecto.count({
    where: { toneladas: 490 }
  })

  console.log(`Con cliente placeholder:   ${problematicos}`)
  console.log(`Con 490 toneladas (fake):  ${con490}`)

  // 4. Diagnóstico
  console.log('\n🔍 DIAGNÓSTICO:')
  console.log('-'.repeat(80))

  const proyectosValidos = totalActual - problematicos
  const proyectosFaltantes = totalEsperado - proyectosValidos

  console.log(`✅ Proyectos VÁLIDOS actuales:     ${proyectosValidos}`)
  console.log(`❌ Proyectos PROBLEMÁTICOS:        ${problematicos}`)
  console.log(`📦 Proyectos FALTANTES por migrar: ${proyectosFaltantes}`)
  console.log(`📊 Total esperado según plan:      ${totalEsperado}`)

  console.log('\n🎯 ACCIONES NECESARIAS:')
  console.log('-'.repeat(80))
  console.log(`1. 🧹 LIMPIAR ${problematicos} proyectos con datos placeholder/incorrectos`)
  console.log(`2. 📦 MIGRAR ${enHojaVida - vinculados} proyectos de ProyectoHojaVida a Proyecto`)
  console.log(`3. 🏷️  CLASIFICAR proyectos según categorías del plan`)
  console.log(`4. ✅ VERIFICAR que totales coincidan con plan`)

  console.log('\n' + '='.repeat(80))
  console.log('✅ ANÁLISIS COMPLETADO')
  console.log('='.repeat(80) + '\n')

  await prisma.$disconnect()
}

quickStatus().catch((e) => {
  console.error('❌ Error:', e)
  process.exit(1)
})
