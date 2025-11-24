import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function verificarAssets() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║  VERIFICACIÓN DE ASSETS DE CATEGORÍAS                    ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  const categorias = await prisma.categoriaProyecto.findMany({
    orderBy: { orden: 'asc' },
  })

  let todosExisten = true

  for (const cat of categorias) {
    console.log(`📁 ${cat.nombre} (${cat.key})`)
    console.log(`   Slug: /${cat.slug}`)
    console.log(`   Orden: ${cat.orden}`)
    console.log(`   Destacada: ${cat.destacada ? '⭐ Sí' : 'No'}`)
    console.log(`   Proyectos: ${cat.totalProyectos}`)
    console.log('')

    // Verificar icono
    if (cat.icono) {
      console.log(`   Icono: ${cat.icono}`)
      if (cat.icono.startsWith('image:')) {
        const iconKey = cat.icono.replace('image:', '')
        console.log(`     → Tipo: PNG/imagen personalizada (${iconKey})`)
      } else {
        console.log(`     → Tipo: Lucide Icon`)
      }
    } else {
      console.log('   ❌ NO TIENE ICONO')
      todosExisten = false
    }

    // Verificar cover
    if (cat.imagenCover) {
      const coverPath = path.join(process.cwd(), 'public', cat.imagenCover)
      const existe = fs.existsSync(coverPath)
      console.log(`   Cover: ${cat.imagenCover}`)
      console.log(`     → ${existe ? '✅ Archivo existe' : '❌ Archivo NO existe'}`)
      if (!existe) todosExisten = false
    } else {
      console.log('   ❌ NO TIENE COVER')
      todosExisten = false
    }

    // Verificar banner si existe
    if (cat.imagenBanner) {
      const bannerPath = path.join(process.cwd(), 'public', cat.imagenBanner)
      const existe = fs.existsSync(bannerPath)
      console.log(`   Banner: ${cat.imagenBanner}`)
      console.log(`     → ${existe ? '✅ Archivo existe' : '❌ Archivo NO existe'}`)
    }

    // Verificar video si existe
    if (cat.videoCover) {
      console.log(`   Video Cover: ${cat.videoCover}`)
    }

    console.log(`   Colores:`)
    console.log(`     Primario: ${cat.color}`)
    console.log(`     Secundario: ${cat.colorSecundario || 'No definido'}`)
    console.log('')
    console.log('   ─────────────────────────────────────────────────────────')
    console.log('')
  }

  if (todosExisten) {
    console.log('╔═══════════════════════════════════════════════════════════╗')
    console.log('║  ✅ TODOS LOS ASSETS VERIFICADOS EXITOSAMENTE            ║')
    console.log('╚═══════════════════════════════════════════════════════════╝\n')
  } else {
    console.log('╔═══════════════════════════════════════════════════════════╗')
    console.log('║  ⚠️  ALGUNOS ASSETS FALTAN O NO EXISTEN                  ║')
    console.log('╚═══════════════════════════════════════════════════════════╝\n')
  }

  await prisma.$disconnect()
}

verificarAssets()
