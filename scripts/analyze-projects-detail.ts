import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeProjectsCoverage() {
  try {
    // 1. Total proyectos visibles
    const totalProyectos = await prisma.proyecto.count({
      where: { visible: true }
    })
    console.log('=== 1. TOTAL PROYECTOS VISIBLES ===')
    console.log(`Total: ${totalProyectos}\n`)

    // 2. Cobertura de campos scalar
    console.log('=== 2. COBERTURA DE CAMPOS SCALAR ===')
    const allVisibleProjects = await prisma.proyecto.findMany({
      where: { visible: true },
      select: {
        id: true,
        descripcion: true,
        cliente: true,
        ubicacion: true,
        fechaFin: true,
        presupuesto: true,
        costoReal: true,
        areaTotal: true,
        toneladas: true,
        tags: true,
        destacado: true,
        metaTitle: true,
        metaDescription: true
      }
    })

    const scalarMetrics = {
      descripcion: 0,
      cliente: 0,
      ubicacion: 0,
      fechaFin: 0,
      presupuesto: 0,
      costoReal: 0,
      areaTotal: 0,
      toneladas: 0,
      tags: 0,
      destacado: 0,
      metaTitle: 0,
      metaDescription: 0
    }

    allVisibleProjects.forEach(p => {
      if (p.descripcion && p.descripcion.length > 10) scalarMetrics.descripcion++
      if (p.cliente) scalarMetrics.cliente++
      if (p.ubicacion) scalarMetrics.ubicacion++
      if (p.fechaFin) scalarMetrics.fechaFin++
      if (p.presupuesto && Number(p.presupuesto) > 0) scalarMetrics.presupuesto++
      if (p.costoReal && Number(p.costoReal) > 0) scalarMetrics.costoReal++
      if (p.areaTotal && Number(p.areaTotal) > 0) scalarMetrics.areaTotal++
      if (p.toneladas && Number(p.toneladas) > 0) scalarMetrics.toneladas++
      if (p.tags && Array.isArray(p.tags) && p.tags.length > 0) scalarMetrics.tags++
      if (p.destacado === true) scalarMetrics.destacado++
      if (p.metaTitle) scalarMetrics.metaTitle++
      if (p.metaDescription) scalarMetrics.metaDescription++
    })

    Object.entries(scalarMetrics).forEach(([field, count]) => {
      const pct = ((count / totalProyectos) * 100).toFixed(1)
      console.log(`${field}: ${count}/${totalProyectos} (${pct}%)`)
    })

    // 3. Cobertura de relaciones
    console.log('\n=== 3. COBERTURA DE RELACIONES ===')

    const relationsData = await prisma.proyecto.findMany({
      where: { visible: true },
      select: {
        id: true,
        imagenes: { select: { id: true } },
        historia: { select: { id: true } },
        progreso: { select: { id: true } },
        timeline: { select: { id: true } },
        documentos: { select: { id: true } },
        clienteRel: { select: { id: true } }
      }
    })

    const relationMetrics = {
      imagenes_any: 0,
      imagenes_3_plus: 0,
      imagenes_10_plus: 0,
      historia: 0,
      progreso: 0,
      timeline: 0,
      documentos: 0,
      clienteRel: 0
    }

    relationsData.forEach(p => {
      if (p.imagenes.length > 0) relationMetrics.imagenes_any++
      if (p.imagenes.length >= 3) relationMetrics.imagenes_3_plus++
      if (p.imagenes.length >= 10) relationMetrics.imagenes_10_plus++
      if (p.historia) relationMetrics.historia++
      if (p.progreso.length > 0) relationMetrics.progreso++
      if (p.timeline.length > 0) relationMetrics.timeline++
      if (p.documentos.length > 0) relationMetrics.documentos++
      if (p.clienteRel) relationMetrics.clienteRel++
    })

    Object.entries(relationMetrics).forEach(([field, count]) => {
      const pct = ((count / totalProyectos) * 100).toFixed(1)
      console.log(`${field}: ${count}/${totalProyectos} (${pct}%)`)
    })

    // 4. Tipos de imágenes
    console.log('\n=== 4. TIPOS DE IMÁGENES ===')
    const allImages = await prisma.imagenProyecto.findMany({
      where: { proyecto: { visible: true } },
      select: {
        id: true,
        tipo: true,
        titulo: true,
        descripcion: true,
        alt: true,
        urlOptimized: true,
        url: true
      }
    })

    const totalImages = allImages.length
    console.log(`Total de imágenes: ${totalImages}`)

    const imageTypeDistribution: Record<string, number> = {}
    allImages.forEach(img => {
      imageTypeDistribution[img.tipo] = (imageTypeDistribution[img.tipo] || 0) + 1
    })
    console.log('Distribución por tipo:')
    Object.entries(imageTypeDistribution).forEach(([type, count]) => {
      const pct = ((count / totalImages) * 100).toFixed(1)
      console.log(`  ${type}: ${count} (${pct}%)`)
    })

    const imagensWithMeta = allImages.filter(img => img.titulo || img.descripcion || img.alt).length
    const imagensWithOptimized = allImages.filter(img => img.urlOptimized).length
    console.log(`Imágenes con metadata (título/desc/alt): ${imagensWithMeta}/${totalImages} (${((imagensWithMeta/totalImages)*100).toFixed(1)}%)`)
    console.log(`Imágenes con URL optimizada: ${imagensWithOptimized}/${totalImages} (${((imagensWithOptimized/totalImages)*100).toFixed(1)}%)`)

    // 5. Cobertura de HistoriaProyecto
    console.log('\n=== 5. COBERTURA DE HISTORIA ===')
    const historias = await prisma.historiaProyecto.findMany({
      where: { proyecto: { visible: true } }
    })

    if (historias.length > 0) {
      const historiaMetrics: Record<string, number> = {
        contexto: 0,
        desafios: 0,
        problemasIniciales: 0,
        solucionTecnica: 0,
        innovaciones: 0,
        equipoEspecialista: 0,
        resultados: 0,
        impactoCliente: 0,
        testimonioCliente: 0,
        fasesEjecucion: 0,
        recursos: 0,
        reconocimientos: 0,
        leccionesAprendidas: 0,
        imagenDestacada: 0,
        videoUrl: 0,
        infografias: 0,
        tagsTecnicos: 0
      }

      historias.forEach(h => {
        if (h.contexto) historiaMetrics.contexto++
        if (h.desafios && Array.isArray(h.desafios) && h.desafios.length > 0) historiaMetrics.desafios++
        if (h.problemasIniciales) historiaMetrics.problemasIniciales++
        if (h.solucionTecnica) historiaMetrics.solucionTecnica++
        if (h.innovaciones && Array.isArray(h.innovaciones) && h.innovaciones.length > 0) historiaMetrics.innovaciones++
        if (h.equipoEspecialista && Array.isArray(h.equipoEspecialista) && h.equipoEspecialista.length > 0) historiaMetrics.equipoEspecialista++
        if (h.resultados && Array.isArray(h.resultados) && h.resultados.length > 0) historiaMetrics.resultados++
        if (h.impactoCliente) historiaMetrics.impactoCliente++
        if (h.testimonioCliente) historiaMetrics.testimonioCliente++
        if (h.fasesEjecucion && Array.isArray(h.fasesEjecucion) && h.fasesEjecucion.length > 0) historiaMetrics.fasesEjecucion++
        if (h.recursos && Array.isArray(h.recursos) && h.recursos.length > 0) historiaMetrics.recursos++
        if (h.reconocimientos && Array.isArray(h.reconocimientos) && h.reconocimientos.length > 0) historiaMetrics.reconocimientos++
        if (h.leccionesAprendidas) historiaMetrics.leccionesAprendidas++
        if (h.imagenDestacada) historiaMetrics.imagenDestacada++
        if (h.videoUrl) historiaMetrics.videoUrl++
        if (h.infografias && Array.isArray(h.infografias) && h.infografias.length > 0) historiaMetrics.infografias++
        if (h.tagsTecnicos && Array.isArray(h.tagsTecnicos) && h.tagsTecnicos.length > 0) historiaMetrics.tagsTecnicos++
      })

      console.log(`Total historias: ${historias.length}/${totalProyectos} (${((historias.length/totalProyectos)*100).toFixed(1)}%)`)
      Object.entries(historiaMetrics).forEach(([field, count]) => {
        const pct = ((count / historias.length) * 100).toFixed(1)
        console.log(`  ${field}: ${count}/${historias.length} (${pct}%)`)
      })
    } else {
      console.log('No historias encontradas')
    }

    // 6. Datos del proyecto específico
    console.log('\n=== 6. PROYECTO: centro-comercial-bochalema-plaza ===')
    const specificProj = await prisma.proyecto.findFirst({
      where: { slug: 'centro-comercial-bochalema-plaza' },
      include: {
        imagenes: true,
        historia: true,
        progreso: true,
        timeline: true,
        documentos: true,
        clienteRel: true
      }
    })

    if (specificProj) {
      console.log(`Título: ${specificProj.titulo}`)
      console.log(`Descripción: ${specificProj.descripcion?.substring(0, 100)}...`)
      console.log(`Cliente: ${specificProj.cliente}`)
      console.log(`Ubicación: ${specificProj.ubicacion}`)
      console.log(`Presupuesto: ${specificProj.presupuesto}`)
      console.log(`Costo Real: ${specificProj.costoReal}`)
      console.log(`Área Total: ${specificProj.areaTotal} m2`)
      console.log(`Toneladas: ${specificProj.toneladas}`)
      console.log(`Imágenes: ${specificProj.imagenes.length}`)
      console.log(`Historia: ${specificProj.historia ? 'Sí' : 'No'}`)
      console.log(`Progreso: ${specificProj.progreso.length} entries`)
      console.log(`Timeline: ${specificProj.timeline.length} entries`)
      console.log(`Documentos: ${specificProj.documentos.length}`)
      console.log(`Cliente relacionado: ${specificProj.clienteRel ? 'Sí' : 'No'}`)
      
      if (specificProj.historia) {
        console.log('\n--- HISTORIA DETALLE ---')
        const h = specificProj.historia
        console.log(`Contexto: ${h.contexto ? 'Sí' : 'No'}`)
        console.log(`Desafíos: ${h.desafios?.length || 0}`)
        console.log(`Problemas Iniciales: ${h.problemasIniciales ? 'Sí' : 'No'}`)
        console.log(`Solución Técnica: ${h.solucionTecnica ? 'Sí' : 'No'}`)
        console.log(`Innovaciones: ${h.innovaciones?.length || 0}`)
        console.log(`Equipo Especialista: ${h.equipoEspecialista?.length || 0}`)
        console.log(`Resultados: ${h.resultados?.length || 0}`)
        console.log(`Impacto Cliente: ${h.impactoCliente ? 'Sí' : 'No'}`)
        console.log(`Testimonios: ${h.testimonioCliente ? 'Sí' : 'No'}`)
        console.log(`Fases Ejecución: ${h.fasesEjecucion?.length || 0}`)
        console.log(`Recursos: ${h.recursos?.length || 0}`)
        console.log(`Reconocimientos: ${h.reconocimientos?.length || 0}`)
        console.log(`Lecciones Aprendidas: ${h.leccionesAprendidas ? 'Sí' : 'No'}`)
        console.log(`Video URL: ${h.videoUrl ? 'Sí' : 'No'}`)
        console.log(`Infografías: ${h.infografias?.length || 0}`)
        console.log(`Tags Técnicos: ${h.tagsTecnicos?.length || 0}`)
      }
    } else {
      console.log('Proyecto no encontrado')
    }

    // 7. Top 5 con más contenido
    console.log('\n=== 7. TOP 5 PROYECTOS RICOS ===')
    const topProjects = await prisma.proyecto.findMany({
      where: { visible: true },
      select: {
        id: true,
        titulo: true,
        slug: true,
        imagenes: { select: { id: true } },
        historia: { select: { id: true } },
        progreso: { select: { id: true } },
        timeline: { select: { id: true } },
        documentos: { select: { id: true } }
      }
    })

    const projectScores = topProjects.map(p => ({
      titulo: p.titulo,
      slug: p.slug,
      score: p.imagenes.length + (p.historia ? 1 : 0) + p.progreso.length + p.timeline.length + p.documentos.length,
      imagenes: p.imagenes.length,
      historia: p.historia ? 1 : 0,
      progreso: p.progreso.length,
      timeline: p.timeline.length,
      documentos: p.documentos.length
    })).sort((a, b) => b.score - a.score)

    projectScores.slice(0, 5).forEach((p, i) => {
      console.log(`${i+1}. ${p.titulo} (${p.slug}): ${p.score} puntos`)
      console.log(`   Imágenes: ${p.imagenes}, Historia: ${p.historia}, Progreso: ${p.progreso}, Timeline: ${p.timeline}, Docs: ${p.documentos}`)
    })

    // 8. Bottom 5 con menos contenido
    console.log('\n=== 8. BOTTOM 5 PROYECTOS POBRES ===')
    projectScores.slice(-5).reverse().forEach((p, i) => {
      console.log(`${i+1}. ${p.titulo} (${p.slug}): ${p.score} puntos`)
      console.log(`   Imágenes: ${p.imagenes}, Historia: ${p.historia}, Progreso: ${p.progreso}, Timeline: ${p.timeline}, Docs: ${p.documentos}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeProjectsCoverage()
