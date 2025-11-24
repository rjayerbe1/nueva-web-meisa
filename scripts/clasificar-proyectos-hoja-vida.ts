import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

interface ProyectoParaClasificar {
  id: string
  objetoContrato: string
  entidadContratante: string
}

function clasificarProyecto(proyecto: ProyectoParaClasificar): CategoriaEnum {
  const nombre = proyecto.objetoContrato.toLowerCase()
  const cliente = proyecto.entidadContratante.toLowerCase()

  // ========== COMERCIAL ==========
  if (
    nombre.includes('centro comercial') ||
    nombre.includes('c.c.') ||
    nombre.includes('local comercial') ||
    nombre.includes('dollar city') ||
    nombre.includes('cine') ||
    nombre.includes('royal') ||
    nombre.includes('graderia') ||
    nombre.includes('mezanine') ||
    nombre.includes('mezzanine') ||
    cliente.includes('royal films')
  ) {
    return CategoriaEnum.COMERCIAL
  }

  // ========== PUENTES ==========
  if (
    nombre.includes('puente vehicular') ||
    nombre.includes('puente peatonal') ||
    nombre.includes('ciclopuente') ||
    nombre.includes('pasarela') ||
    (nombre.includes('viaducto') && nombre.includes('acueducto')) ||
    (nombre.includes('viaducto') && nombre.includes('tuberia')) ||
    nombre.includes('baranda metalica')
  ) {
    return CategoriaEnum.PUENTES
  }

  // ========== INFRAESTRUCTURA URBANA ==========
  if (
    nombre.includes('transmilenio') ||
    nombre.includes('estacion') ||
    nombre.includes('escultura') ||
    nombre.includes('monumento') ||
    (nombre.includes('estructura') && nombre.includes('urbana'))
  ) {
    return CategoriaEnum.INFRAESTRUCTURA_URBANA
  }

  // ========== INDUSTRIAL ==========
  if (
    nombre.includes('bodega') ||
    nombre.includes('centro de distribución') ||
    nombre.includes('centro de distribucion') ||
    nombre.includes('c.d.') ||
    nombre.includes('cuarto frio') ||
    nombre.includes('cuarto frío') ||
    nombre.includes('frigorifico') ||
    nombre.includes('ingenio') ||
    nombre.includes('azucar') ||
    nombre.includes('caña') ||
    nombre.includes('avicola') ||
    nombre.includes('avícola') ||
    nombre.includes('pollo') ||
    nombre.includes('farmaceutica') ||
    nombre.includes('farmacéutica') ||
    nombre.includes('planta') ||
    nombre.includes('tanque') ||
    nombre.includes('silos') ||
    cliente.includes('pollos bucanero') ||
    cliente.includes('pollo listo') ||
    cliente.includes('ingenio') ||
    cliente.includes('tecnofar')
  ) {
    return CategoriaEnum.INDUSTRIAL
  }

  // ========== DEPORTES & EDUCACIÓN ==========
  if (
    nombre.includes('coliseo') ||
    nombre.includes('polideportivo') ||
    nombre.includes('cancha') ||
    nombre.includes('deportiv') ||
    nombre.includes('colegio') ||
    nombre.includes('escuela') ||
    nombre.includes('educativ') ||
    nombre.includes('gimnasio')
  ) {
    return CategoriaEnum.DEPORTES_EDUCACION
  }

  // ========== EDIFICACIONES ==========
  if (
    nombre.includes('edificio') ||
    nombre.includes('oficina') ||
    nombre.includes('parqueadero') ||
    nombre.includes('parking') ||
    nombre.includes('cubierta') ||
    nombre.includes('fachada') ||
    nombre.includes('estructura metalica') ||
    nombre.includes('estructura metálica')
  ) {
    return CategoriaEnum.EDIFICACIONES
  }

  // Por defecto: INDUSTRIAL
  return CategoriaEnum.INDUSTRIAL
}

async function clasificarTodosLosProyectos() {
  try {
    console.log('=== CLASIFICANDO 252 PROYECTOS ===\n')

    // Obtener todos los proyectos
    const proyectos = await prisma.proyectoHojaVida.findMany({
      select: {
        id: true,
        objetoContrato: true,
        entidadContratante: true,
      },
    })

    console.log(`Total proyectos a clasificar: ${proyectos.length}\n`)

    // Contadores por categoría
    const contadores: Record<string, number> = {
      COMERCIAL: 0,
      INDUSTRIAL: 0,
      PUENTES: 0,
      INFRAESTRUCTURA_URBANA: 0,
      EDIFICACIONES: 0,
      DEPORTES_EDUCACION: 0,
    }

    // Clasificar y actualizar cada proyecto
    let actualizados = 0
    for (const proyecto of proyectos) {
      const categoria = clasificarProyecto(proyecto)

      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: { categoria },
      })

      contadores[categoria]++
      actualizados++

      if (actualizados % 50 === 0) {
        console.log(`  Procesados: ${actualizados}/${proyectos.length}`)
      }
    }

    console.log(`\n✅ ${actualizados} proyectos clasificados\n`)

    // Mostrar distribución
    console.log('📊 DISTRIBUCIÓN POR CATEGORÍA:\n')
    console.log(`  COMERCIAL: ${contadores.COMERCIAL} proyectos`)
    console.log(`  INDUSTRIAL: ${contadores.INDUSTRIAL} proyectos`)
    console.log(`  PUENTES: ${contadores.PUENTES} proyectos`)
    console.log(`  INFRAESTRUCTURA URBANA: ${contadores.INFRAESTRUCTURA_URBANA} proyectos`)
    console.log(`  EDIFICACIONES: ${contadores.EDIFICACIONES} proyectos`)
    console.log(`  DEPORTES & EDUCACIÓN: ${contadores.DEPORTES_EDUCACION} proyectos`)

    const total = Object.values(contadores).reduce((sum, count) => sum + count, 0)
    console.log(`\n  TOTAL: ${total} proyectos`)

    // Verificar algunos ejemplos
    console.log('\n📋 EJEMPLOS DE CLASIFICACIÓN:\n')

    for (const key of Object.keys(contadores)) {
      const ejemplo = await prisma.proyectoHojaVida.findFirst({
        where: { categoria: key as CategoriaEnum },
        select: {
          objetoContrato: true,
          entidadContratante: true,
          categoria: true,
        },
      })

      if (ejemplo) {
        console.log(`  ${ejemplo.categoria}:`)
        console.log(`    ${ejemplo.objetoContrato}`)
        console.log(`    Cliente: ${ejemplo.entidadContratante}\n`)
      }
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clasificarTodosLosProyectos()
