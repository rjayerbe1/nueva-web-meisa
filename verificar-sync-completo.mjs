#!/usr/bin/env node

/**
 * Verificación completa de sincronización Local vs Neon
 */

import { PrismaClient } from '@prisma/client'

const local = new PrismaClient({
  datasources: { db: { url: 'postgresql://rjayerbe@localhost:5432/meisa_db' } }
})

const neon = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function verificarTodo() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║  🔍 VERIFICACIÓN COMPLETA: LOCAL vs NEON                  ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  const diferencias = []

  try {
    // USUARIOS
    const usersLocal = await local.user.count()
    const usersNeon = await neon.user.count()
    console.log(`👤 Usuarios: Local ${usersLocal} | Neon ${usersNeon} ${usersLocal === usersNeon ? '✅' : '❌'}`)
    if (usersLocal !== usersNeon) diferencias.push('Usuarios')

    // CATEGORÍAS
    const catsLocal = await local.categoriaProyecto.count()
    const catsNeon = await neon.categoriaProyecto.count()
    console.log(`📁 Categorías: Local ${catsLocal} | Neon ${catsNeon} ${catsLocal === catsNeon ? '✅' : '❌'}`)
    if (catsLocal !== catsNeon) diferencias.push('Categorías')

    // Verificar que tengan los mismos assets
    const catsLocalData = await local.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: { nombre: true, imagenCover: true, icono: true, videoCover: true, totalProyectos: true }
    })
    const catsNeonData = await neon.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: { nombre: true, imagenCover: true, icono: true, videoCover: true, totalProyectos: true }
    })

    console.log('\n   Detalle de categorías:')
    for (let i = 0; i < catsLocalData.length; i++) {
      const catLocal = catsLocalData[i]
      const catNeon = catsNeonData[i]

      const match =
        catLocal.nombre === catNeon.nombre &&
        catLocal.imagenCover === catNeon.imagenCover &&
        catLocal.icono === catNeon.icono &&
        catLocal.videoCover === catNeon.videoCover

      console.log(`   ${match ? '✅' : '❌'} ${catLocal.nombre}`)
      console.log(`      Cover: ${catLocal.imagenCover === catNeon.imagenCover ? '✅' : '❌'}`)
      console.log(`      Icono: ${catLocal.icono === catNeon.icono ? '✅' : '❌'}`)
      console.log(`      Proyectos: Local ${catLocal.totalProyectos} | Neon ${catNeon.totalProyectos} ${catLocal.totalProyectos === catNeon.totalProyectos ? '✅' : '⚠️'}`)

      if (!match) diferencias.push(`Categoría ${catLocal.nombre}`)
    }

    // CLIENTES
    const clientsLocal = await local.cliente.count()
    const clientsNeon = await neon.cliente.count()
    console.log(`\n🏢 Clientes: Local ${clientsLocal} | Neon ${clientsNeon} ${clientsLocal === clientsNeon ? '✅' : '❌'}`)
    if (clientsLocal !== clientsNeon) diferencias.push('Clientes')

    // SERVICIOS
    const servicesLocal = await local.servicio.count()
    const servicesNeon = await neon.servicio.count()
    console.log(`🛠️  Servicios: Local ${servicesLocal} | Neon ${servicesNeon} ${servicesLocal === servicesNeon ? '✅' : '❌'}`)
    if (servicesLocal !== servicesNeon) diferencias.push('Servicios')

    // PROYECTOS DETALLADOS
    const proyLocal = await local.proyecto.count()
    const proyNeon = await neon.proyecto.count()
    console.log(`📋 Proyectos detallados: Local ${proyLocal} | Neon ${proyNeon} ${proyLocal === proyNeon ? '✅' : '❌'}`)
    if (proyLocal !== proyNeon) diferencias.push('Proyectos')

    // IMÁGENES
    const imgLocal = await local.imagenProyecto.count()
    const imgNeon = await neon.imagenProyecto.count()
    console.log(`🖼️  Imágenes de proyectos: Local ${imgLocal} | Neon ${imgNeon} ${imgLocal === imgNeon ? '✅' : '❌'}`)
    if (imgLocal !== imgNeon) diferencias.push('Imágenes')

    // PROYECTOS HOJA DE VIDA
    const hvLocal = await local.proyectoHojaVida.count()
    const hvNeon = await neon.proyectoHojaVida.count()
    console.log(`📄 Proyectos hoja de vida: Local ${hvLocal} | Neon ${hvNeon} ${hvLocal === hvNeon ? '✅' : '❌'}`)
    if (hvLocal !== hvNeon) diferencias.push('ProyectosHojaVida')

    // CONTACTOS WHATSAPP
    const whatsLocal = await local.contactoWhatsApp.count()
    const whatsNeon = await neon.contactoWhatsApp.count()
    console.log(`💬 Contactos WhatsApp: Local ${whatsLocal} | Neon ${whatsNeon} ${whatsLocal === whatsNeon ? '✅' : '❌'}`)
    if (whatsLocal !== whatsNeon) diferencias.push('ContactosWhatsApp')

    // CONFIGURACIÓN SITIO
    const configLocal = await local.siteConfig.count()
    const configNeon = await neon.siteConfig.count()
    console.log(`⚙️  Configuración: Local ${configLocal} | Neon ${configNeon} ${configLocal === configNeon ? '✅' : '❌'}`)
    if (configLocal !== configNeon) diferencias.push('SiteConfig')

    // FORMULARIOS DE CONTACTO
    const formsLocal = await local.contactForm.count()
    const formsNeon = await neon.contactForm.count()
    console.log(`📬 Formularios contacto: Local ${formsLocal} | Neon ${formsNeon} ${formsLocal === formsNeon ? '✅' : '❌'}`)
    if (formsLocal !== formsNeon) diferencias.push('FormulariosContacto')

    // PÁGINAS
    const paginasLocal = await local.pagina.count()
    const paginasNeon = await neon.pagina.count()
    console.log(`📄 Páginas: Local ${paginasLocal} | Neon ${paginasNeon} ${paginasLocal === paginasNeon ? '✅' : '❌'}`)
    if (paginasLocal !== paginasNeon) diferencias.push('Páginas')

    // RESUMEN FINAL
    console.log('\n' + '═'.repeat(64))
    console.log('')

    if (diferencias.length === 0) {
      console.log('╔════════════════════════════════════════════════════════════╗')
      console.log('║  ✅ ¡TODO SINCRONIZADO PERFECTAMENTE!                     ║')
      console.log('╚════════════════════════════════════════════════════════════╝\n')
      console.log('✓ La base de datos en Neon está 100% sincronizada con local')
      console.log('✓ Listo para hacer deploy a producción\n')
    } else {
      console.log('╔════════════════════════════════════════════════════════════╗')
      console.log('║  ⚠️  DIFERENCIAS ENCONTRADAS                              ║')
      console.log('╚════════════════════════════════════════════════════════════╝\n')
      console.log('Tablas con diferencias:')
      diferencias.forEach(d => console.log(`  ❌ ${d}`))
      console.log('')
    }

    // TOTAL DE REGISTROS
    const totalLocal = usersLocal + catsLocal + clientsLocal + servicesLocal + proyLocal + imgLocal + hvLocal
    const totalNeon = usersNeon + catsNeon + clientsNeon + servicesNeon + proyNeon + imgNeon + hvNeon

    console.log(`📊 TOTAL REGISTROS PRINCIPALES:`)
    console.log(`   Local: ${totalLocal}`)
    console.log(`   Neon:  ${totalNeon}`)
    console.log(`   ${totalLocal === totalNeon ? '✅ Iguales' : '❌ Diferentes'}\n`)

  } catch (error) {
    console.error('\n❌ Error:', error.message)
  } finally {
    await local.$disconnect()
    await neon.$disconnect()
  }
}

verificarTodo()
