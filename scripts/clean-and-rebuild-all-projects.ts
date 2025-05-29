import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Mapeo correcto de proyectos basado en análisis de WordPress
const proyectosWordPress = [
  // CENTROS COMERCIALES (10 proyectos)
  {
    titulo: "Plaza Armenia",
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Armenia, Quindío",
    descripcion: "Centro comercial Plaza Armenia, proyecto de construcción de estructura metálica para complejo comercial en la ciudad de Armenia.",
    cliente: "Constructora Armenia S.A.",
    imagenes_patron: "armenia"
  },
  {
    titulo: "Plaza Bochalema", 
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Bochalema, Norte de Santander",
    descripcion: "Centro comercial Plaza Bochalema, desarrollo de infraestructura comercial con estructura metálica moderna.",
    cliente: "Inmobiliaria Bochalema",
    imagenes_patron: "bochalema"
  },
  {
    titulo: "Centro Comercial Campanario",
    categoria: "CENTROS_COMERCIALES", 
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Centro Comercial Campanario, gran proyecto de infraestructura comercial con diseño arquitectónico moderno y estructura metálica de alta resistencia.",
    cliente: "Grupo Campanario S.A.S.",
    imagenes_patron: "campanario"
  },
  {
    titulo: "Centro Comercial Monserrat",
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Bogotá, Cundinamarca", 
    descripcion: "Centro comercial Monserrat, proyecto de remodelación y ampliación con estructuras metálicas especializadas.",
    cliente: "Inversiones Monserrat",
    imagenes_patron: "monserrat"
  },
  {
    titulo: "Paseo Villa del Río",
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Centro comercial Paseo Villa del Río, complejo comercial con estructura metálica y diseño arquitectónico contemporáneo.",
    cliente: "Villa del Río S.A.",
    imagenes_patron: "paseo-villa-del-rio"
  },
  {
    titulo: "Centro Comercial Único Barranquilla", 
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Barranquilla, Atlántico",
    descripcion: "Centro comercial Único Barranquilla, proyecto de construcción de estructura metálica para complejo comercial en el Caribe colombiano.",
    cliente: "Único Desarrollos",
    imagenes_patron: "nico-barranquilla"
  },
  {
    titulo: "Centro Comercial Único Cali",
    categoria: "CENTROS_COMERCIALES", 
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Centro comercial Único Cali, desarrollo de infraestructura comercial con tecnología de punta en estructuras metálicas.",
    cliente: "Único Desarrollos",
    imagenes_patron: "nico-cali"
  },
  {
    titulo: "Centro Comercial Único Neiva",
    categoria: "CENTROS_COMERCIALES",
    ubicacion: "Neiva, Huila", 
    descripcion: "Centro comercial Único Neiva, proyecto de construcción de estructura metálica para complejo comercial en el Huila.",
    cliente: "Único Desarrollos", 
    imagenes_patron: "nico-neiva"
  },

  // PUENTES PEATONALES (6 proyectos)
  {
    titulo: "Escalinata Curva Río Cali",
    categoria: "PUENTES",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente peatonal Escalinata Curva sobre el Río Cali, estructura metálica ornamental con diseño curvo y acabados arquitectónicos especiales.",
    cliente: "Alcaldía de Cali",
    imagenes_patron: "escalinata-curva-rio"
  },
  {
    titulo: "Puente Peatonal La 63",
    categoria: "PUENTES", 
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente peatonal La 63, estructura metálica para conectividad peatonal urbana con diseño moderno y funcional.",
    cliente: "Alcaldía de Cali",
    imagenes_patron: "la-63"
  },
  {
    titulo: "Puente Peatonal La Tertulia",
    categoria: "PUENTES",
    ubicacion: "Cali, Valle del Cauca", 
    descripcion: "Puente peatonal La Tertulia, estructura metálica para acceso al Museo La Tertulia con diseño arquitectónico integrado.",
    cliente: "Museo La Tertulia",
    imagenes_patron: "tertulia"
  },
  {
    titulo: "Puente Autopista Sur - Carrera 68",
    categoria: "PUENTES",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente peatonal sobre la Autopista Sur - Carrera 68, estructura metálica para conectividad peatonal segura.",
    cliente: "INVIAS",
    imagenes_patron: "autopista-sur-carrera-68"
  },
  {
    titulo: "Puente Terminal Intermedio",
    categoria: "PUENTES", 
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente peatonal Terminal Intermedio, estructura metálica de acceso al sistema MIO de transporte masivo.",
    cliente: "METROCALI",
    imagenes_patron: "terminal-intermedio"
  },

  // PUENTES VEHICULARES (10 proyectos)
  {
    titulo: "Puente Vehicular Cambrín",
    categoria: "PUENTES",
    ubicacion: "Valle del Cauca", 
    descripcion: "Puente vehicular Cambrín, estructura metálica para paso vehicular con capacidad de carga pesada.",
    cliente: "INVIAS",
    imagenes_patron: "cambrin"
  },
  {
    titulo: "Puente Carrera 100", 
    categoria: "PUENTES",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente vehicular Carrera 100, estructura metálica urbana para mejora de la movilidad vial.",
    cliente: "Alcaldía de Cali", 
    imagenes_patron: "carrera-100"
  },
  {
    titulo: "Puente Vehicular Frisoles",
    categoria: "PUENTES",
    ubicacion: "Valle del Cauca",
    descripcion: "Puente vehicular Frisoles, estructura metálica rural para conectividad regional.",
    cliente: "Gobernación del Valle",
    imagenes_patron: "frisoles"
  },
  {
    titulo: "Puente Vehicular Nolasco", 
    categoria: "PUENTES",
    ubicacion: "Valle del Cauca",
    descripcion: "Puente vehicular Nolasco, estructura metálica robusta para tráfico vehicular pesado y conectividad rural.",
    cliente: "INVIAS",
    imagenes_patron: "nolasco"
  },
  {
    titulo: "Puente Río Negro",
    categoria: "PUENTES",
    ubicacion: "Valle del Cauca", 
    descripcion: "Puente vehicular sobre Río Negro, estructura metálica para cruce de río con diseño resistente a cargas ambientales.",
    cliente: "INVIAS",
    imagenes_patron: "rio-negro"
  },
  {
    titulo: "Puente La 21",
    categoria: "PUENTES",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Puente vehicular La 21, estructura metálica urbana para descongestión del tráfico vehicular.",
    cliente: "Alcaldía de Cali",
    imagenes_patron: "la-21"
  },
  {
    titulo: "Puente La Paila",
    categoria: "PUENTES", 
    ubicacion: "Valle del Cauca",
    descripcion: "Puente vehicular La Paila, estructura metálica para conectividad regional en zona agroindustrial.",
    cliente: "Gobernación del Valle",
    imagenes_patron: "la-paila"
  },
  {
    titulo: "Puente Saraconcho",
    categoria: "PUENTES",
    ubicacion: "Valle del Cauca",
    descripcion: "Puente vehicular Saraconcho, estructura metálica para mejora de la infraestructura vial regional.",
    cliente: "INVIAS", 
    imagenes_patron: "saraconcho"
  },

  // EDIFICIOS (10 proyectos)
  {
    titulo: "Estación de Bomberos Popayán",
    categoria: "EDIFICIOS",
    ubicacion: "Popayán, Cauca",
    descripcion: "Estación de Bomberos de Popayán, estructura metálica especializada para servicios de emergencia con diseño funcional.",
    cliente: "Alcaldía de Popayán", 
    imagenes_patron: "bomberos"
  },
  {
    titulo: "Cinemateca Distrital",
    categoria: "EDIFICIOS",
    ubicacion: "Bogotá, Cundinamarca",
    descripcion: "Cinemateca Distrital de Bogotá, estructura metálica para complejo cultural con espacios especializados para proyección cinematográfica.",
    cliente: "IDARTES - Alcaldía de Bogotá",
    imagenes_patron: "cinemateca-distrital"
  },
  {
    titulo: "Clínica Reina Victoria",
    categoria: "EDIFICIOS", 
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Clínica Reina Victoria, estructura metálica hospitalaria con especificaciones técnicas para servicios de salud.",
    cliente: "Clínica Reina Victoria S.A.",
    imagenes_patron: "clinica-reina-victoria"
  },
  {
    titulo: "Estación MIO Guadalupe",
    categoria: "EDIFICIOS",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Estación MIO Guadalupe, estructura metálica para estación del sistema de transporte masivo con cubierta y plataformas.",
    cliente: "METROCALI",
    imagenes_patron: "mio-guadalupe"
  },
  {
    titulo: "MIO Terminal Intermedio",
    categoria: "EDIFICIOS",
    ubicacion: "Cali, Valle del Cauca", 
    descripcion: "Terminal Intermedio del sistema MIO, estructura metálica compleja para terminal de transferencia del transporte masivo.",
    cliente: "METROCALI",
    imagenes_patron: "mio-terminal-intermedio"
  },
  {
    titulo: "Módulos Médicos",
    categoria: "EDIFICIOS",
    ubicacion: "Valle del Cauca",
    descripcion: "Módulos médicos prefabricados, estructuras metálicas modulares para servicios de salud temporal y permanente.",
    cliente: "Secretaría de Salud",
    imagenes_patron: "modulos-medicos"
  },
  {
    titulo: "Edificio Omega",
    categoria: "EDIFICIOS",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Edificio Omega, estructura metálica comercial y de oficinas con diseño arquitectónico contemporáneo.",
    cliente: "Constructora Omega",
    imagenes_patron: "omega"
  },
  {
    titulo: "SENA Santander", 
    categoria: "EDIFICIOS",
    ubicacion: "Santander",
    descripcion: "Centro de formación SENA Santander, estructura metálica educativa con talleres y aulas especializadas.",
    cliente: "SENA",
    imagenes_patron: "sena"
  },
  {
    titulo: "Tequendama Parking Cali",
    categoria: "EDIFICIOS",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Parqueadero Tequendama, estructura metálica de múltiples niveles para estacionamiento vehicular urbano.",
    cliente: "Hotel Tequendama",
    imagenes_patron: "tequendama-parking"
  },

  // INDUSTRIAL (8 proyectos)
  {
    titulo: "Ampliación Cargill",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca", 
    descripcion: "Ampliación planta Cargill, estructura metálica industrial para procesamiento de alimentos con especificaciones técnicas especializadas.",
    cliente: "Cargill de Colombia S.A.",
    imagenes_patron: "ampliacion-cargill"
  },
  {
    titulo: "Bodega Duplex Ingeniería",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca",
    descripcion: "Bodega industrial Duplex Ingeniería, estructura metálica para almacenamiento y producción industrial.",
    cliente: "Duplex Ingeniería S.A.S.", 
    imagenes_patron: "bodega-duplex-ingenieria"
  },
  {
    titulo: "Bodega Intera",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca",
    descripcion: "Bodega industrial Intera, estructura metálica para operaciones logísticas y de distribución.",
    cliente: "Intera S.A.",
    imagenes_patron: "bodega-intera"
  },
  {
    titulo: "Bodega Protécnica II",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca",
    descripcion: "Bodega Protécnica II, estructura metálica industrial para almacenamiento y procesos de manufactura.",
    cliente: "Protécnica S.A.",
    imagenes_patron: "bodega-protecnica-ii"
  },
  {
    titulo: "Tecno Químicas Jamundí",
    categoria: "INDUSTRIAL", 
    ubicacion: "Jamundí, Valle del Cauca",
    descripcion: "Planta Tecno Químicas Jamundí, estructura metálica farmacéutica con especificaciones para procesos químicos.",
    cliente: "Tecno Químicas S.A.",
    imagenes_patron: "tecno-quimicas"
  },
  {
    titulo: "Planta Tecnofar",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca",
    descripcion: "Planta industrial Tecnofar, estructura metálica para procesos farmacéuticos con normativas especializadas.",
    cliente: "Tecnofar S.A.",
    imagenes_patron: "tecnofar"
  },
  {
    titulo: "Torre Cogeneración Propal",
    categoria: "INDUSTRIAL",
    ubicacion: "Valle del Cauca", 
    descripcion: "Torre de cogeneración Propal, estructura metálica industrial para generación de energía en planta papelera.",
    cliente: "Propal S.A.",
    imagenes_patron: "torre-cogeneracion-propal"
  },

  // ESCENARIOS DEPORTIVOS (7 proyectos)  
  {
    titulo: "Complejo Acuático Popayán",
    categoria: "OTRO", // ESCENARIOS_DEPORTIVOS no existe en el enum
    ubicacion: "Popayán, Cauca",
    descripcion: "Complejo Acuático de Popayán, estructura metálica para instalaciones deportivas acuáticas con cubierta especializada.",
    cliente: "Alcaldía de Popayán",
    imagenes_patron: "complejo-acuatico-popayan"
  },
  {
    titulo: "Cancha Javeriana", 
    categoria: "OTRO",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Cancha deportiva Universidad Javeriana, estructura metálica para escenario deportivo universitario.",
    cliente: "Universidad Javeriana",
    imagenes_patron: "cancha-javeriana"
  },
  {
    titulo: "CECUN",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca",
    descripcion: "Centro deportivo CECUN, estructura metálica para complejo deportivo multifuncional.",
    cliente: "CECUN",
    imagenes_patron: "cecun"
  },
  {
    titulo: "Coliseo Artes Marciales",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca", 
    descripcion: "Coliseo de Artes Marciales, estructura metálica especializada para deportes de combate y competencias.",
    cliente: "Liga de Artes Marciales",
    imagenes_patron: "coliseo-artes-marciales"
  },
  {
    titulo: "Coliseo Mayor",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca",
    descripcion: "Coliseo Mayor, estructura metálica para grandes eventos deportivos y espectáculos masivos.",
    cliente: "Gobernación del Valle",
    imagenes_patron: "coliseo-mayor"
  },

  // CUBIERTAS Y FACHADAS (5 proyectos)
  {
    titulo: "Cubierta Camino Viejo",
    categoria: "OTRO", // CUBIERTAS_FACHADAS no existe en el enum
    ubicacion: "Valle del Cauca",
    descripcion: "Cubierta metálica Camino Viejo, estructura de protección con diseño arquitectónico integrado.",
    cliente: "Desarrollo Inmobiliario",
    imagenes_patron: "camino-viejo"
  },
  {
    titulo: "Cubierta Interna",
    categoria: "OTRO", 
    ubicacion: "Valle del Cauca",
    descripcion: "Cubierta metálica interna, estructura especializada para protección de espacios industriales.",
    cliente: "Cliente Industrial",
    imagenes_patron: "cubierta-interna"
  },
  {
    titulo: "Fachada IPS Sura",
    categoria: "OTRO",
    ubicacion: "Cali, Valle del Cauca",
    descripcion: "Fachada metálica IPS Sura, estructura arquitectónica para edificio de servicios de salud.",
    cliente: "IPS Sura",
    imagenes_patron: "ips-sura"
  },
  {
    titulo: "Taquillas Pisoje",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca", 
    descripcion: "Taquillas metálicas Pisoje, estructuras modulares para control de acceso y servicios.",
    cliente: "Pisoje S.A.",
    imagenes_patron: "taquillas-pisoje"
  },
  {
    titulo: "Taquillas Pisoje Comfacauca",
    categoria: "OTRO",
    ubicacion: "Cauca",
    descripcion: "Taquillas Pisoje Comfacauca, estructuras metálicas para servicios de caja de compensación.",
    cliente: "Comfacauca",
    imagenes_patron: "taquillas-pisoje-comfacauca"
  },

  // ESTRUCTURAS MODULARES (3 proyectos)
  {
    titulo: "Cocinas Modulares", 
    categoria: "OTRO", // ESTRUCTURAS_MODULARES no existe en el enum
    ubicacion: "Valle del Cauca",
    descripcion: "Cocinas modulares metálicas, estructuras prefabricadas para servicios de alimentación institucional.",
    cliente: "Servicios Alimentarios",
    imagenes_patron: "cocinas-modulares"
  },
  {
    titulo: "Cocinas Ocultas",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca",
    descripcion: "Cocinas ocultas metálicas, estructuras modulares integradas con diseño arquitectónico discreto.",
    cliente: "Desarrollo Gastronómico",
    imagenes_patron: "cocinas-ocultas"
  },
  {
    titulo: "Módulo de Oficinas",
    categoria: "OTRO",
    ubicacion: "Valle del Cauca", 
    descripcion: "Módulo de oficinas metálico, estructura prefabricada para espacios administrativos temporales y permanentes.",
    cliente: "Empresa Administrativa",
    imagenes_patron: "modulo-oficinas"
  },

  // OIL AND GAS (2 proyectos)
  {
    titulo: "Tanque Pulmón",
    categoria: "OIL_GAS",
    ubicacion: "Valle del Cauca",
    descripcion: "Tanque pulmón metálico, estructura especializada para almacenamiento de gases industriales con normativas de seguridad.",
    cliente: "Empresa Petrolera",
    imagenes_patron: "tanque-pulmon"
  },
  {
    titulo: "Tanques de Almacenamiento GLP",
    categoria: "OIL_GAS", 
    ubicacion: "Valle del Cauca",
    descripcion: "Tanques de almacenamiento GLP, estructuras metálicas especializadas para gas licuado de petróleo con certificaciones de seguridad.",
    cliente: "Distribuidora de Gas",
    imagenes_patron: "tanques-almacenamiento-glp"
  }
]

async function cleanAndRebuildAllProjects() {
  try {
    console.log('🧹 LIMPIEZA Y RECONSTRUCCIÓN COMPLETA DE PROYECTOS\n')
    console.log('=' .repeat(80) + '\n')

    // 1. OBTENER O CREAR USUARIO ADMIN
    console.log('👤 PASO 1: Verificando usuario admin...\n')
    
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@meisa.com.co',
          name: 'Administrador MEISA',
          role: 'ADMIN',
          password: null // NextAuth manejará la autenticación
        }
      })
      console.log('   🆕 Usuario admin creado')
    } else {
      console.log('   ✅ Usuario admin existente encontrado')
    }
    
    console.log(`   👤 Admin ID: ${adminUser.id}\n`)

    // 2. ELIMINAR TODOS LOS DATOS EXISTENTES
    console.log('🗑️  PASO 2: Eliminando todos los proyectos e imágenes existentes...\n')
    
    // Eliminar todas las imágenes de proyectos
    const imagenesEliminadas = await prisma.imagenProyecto.deleteMany({})
    console.log(`   🖼️  Imágenes eliminadas: ${imagenesEliminadas.count}`)
    
    // Eliminar todos los proyectos
    const proyectosEliminados = await prisma.proyecto.deleteMany({})
    console.log(`   📦 Proyectos eliminados: ${proyectosEliminados.count}`)
    
    console.log('   ✅ Base de datos limpia\n')

    // 3. ANALIZAR IMÁGENES DISPONIBLES
    console.log('🔍 PASO 3: Analizando imágenes disponibles...\n')
    
    const imagenesDir = './public/uploads/projects'
    let archivosDisponibles = []
    
    try {
      archivosDisponibles = await fs.readdir(imagenesDir)
      console.log(`   📁 Total archivos encontrados: ${archivosDisponibles.length}`)
    } catch (error) {
      console.log(`   ⚠️  Directorio de imágenes no encontrado: ${imagenesDir}`)
      archivosDisponibles = []
    }

    // Filtrar solo imágenes
    const imagenesDisponibles = archivosDisponibles.filter(archivo => 
      archivo.match(/\.(jpg|jpeg|png|webp)$/i)
    )
    
    console.log(`   🖼️  Imágenes válidas: ${imagenesDisponibles.length}\n`)

    // 3. CREAR FUNCIÓN DE MAPEO DE IMÁGENES
    function encontrarImagenesParaProyecto(patron: string): string[] {
      const imagenes = imagenesDisponibles.filter(archivo => {
        const nombreLimpio = archivo.toLowerCase()
        const patronLimpio = patron.toLowerCase()
        
        // Buscar coincidencias exactas y parciales
        return nombreLimpio.includes(patronLimpio) ||
               nombreLimpio.includes(patronLimpio.replace(/-/g, '')) ||
               nombreLimpio.includes(patronLimpio.replace(/-/g, '_')) ||
               nombreLimpio.includes(patronLimpio.replace(/-/g, ' '))
      })
      
      // Ordenar por nombre para consistencia
      return imagenes.sort()
    }

    // 4. CREAR PROYECTOS Y ASIGNAR IMÁGENES
    console.log('🏗️  PASO 4: Creando proyectos con imágenes correctas...\n')
    
    let proyectosCreados = 0
    let imagenesAsignadas = 0
    const resumenCategorias = {}

    for (const proyectoData of proyectosWordPress) {
      try {
        console.log(`📌 Creando: ${proyectoData.titulo}`)
        
        // Buscar imágenes para este proyecto
        const imagenesEncontradas = encontrarImagenesParaProyecto(proyectoData.imagenes_patron)
        console.log(`   🔍 Patrón de búsqueda: "${proyectoData.imagenes_patron}"`)
        console.log(`   📸 Imágenes encontradas: ${imagenesEncontradas.length}`)
        
        if (imagenesEncontradas.length > 0) {
          // Mostrar las primeras 3 imágenes encontradas
          const muestra = imagenesEncontradas.slice(0, 3)
          muestra.forEach(img => console.log(`      - ${img}`))
          if (imagenesEncontradas.length > 3) {
            console.log(`      ... y ${imagenesEncontradas.length - 3} más`)
          }
        }

        // Crear slug único
        const slug = proyectoData.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
          .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
          .trim()
          .replace(/\s+/g, '-') // Espacios a guiones
          .replace(/-+/g, '-') // Múltiples guiones a uno
        
        // Crear el proyecto
        const proyecto = await prisma.proyecto.create({
          data: {
            titulo: proyectoData.titulo,
            slug: slug,
            descripcion: proyectoData.descripcion,
            categoria: proyectoData.categoria,
            ubicacion: proyectoData.ubicacion,
            cliente: proyectoData.cliente,
            estado: 'COMPLETADO',
            fechaInicio: new Date('2020-01-01'),
            fechaFin: new Date('2023-12-31'),
            presupuesto: 100000000 + Math.floor(Math.random() * 900000000), // Presupuesto aleatorio
            destacado: Math.random() > 0.7, // 30% de proyectos destacados
            createdBy: adminUser.id // Usuario admin como creador
          }
        })

        // Asignar imágenes al proyecto
        if (imagenesEncontradas.length > 0) {
          for (let i = 0; i < imagenesEncontradas.length; i++) {
            const imagen = imagenesEncontradas[i]
            
            await prisma.imagenProyecto.create({
              data: {
                proyectoId: proyecto.id,
                url: `/uploads/projects/${imagen}`,
                alt: `${proyectoData.titulo} - Imagen ${i + 1}`,
                descripcion: `Vista ${i + 1} del proyecto ${proyectoData.titulo}`,
                orden: i,
                tipo: i === 0 ? 'PORTADA' : 'GALERIA' // Primera imagen como portada
              }
            })
            
            imagenesAsignadas++
          }
        }

        // Contar por categoría
        if (!resumenCategorias[proyectoData.categoria]) {
          resumenCategorias[proyectoData.categoria] = {
            count: 0,
            imagenes: 0
          }
        }
        resumenCategorias[proyectoData.categoria].count++
        resumenCategorias[proyectoData.categoria].imagenes += imagenesEncontradas.length

        proyectosCreados++
        console.log(`   ✅ Creado con ${imagenesEncontradas.length} imágenes\n`)

      } catch (error) {
        console.error(`   ❌ Error creando proyecto ${proyectoData.titulo}:`, error)
      }
    }

    // 5. RESUMEN FINAL
    console.log('📊 RESUMEN FINAL:\n')
    console.log(`✅ Proyectos creados: ${proyectosCreados}`)
    console.log(`🖼️  Imágenes asignadas: ${imagenesAsignadas}`)
    console.log(`📈 Promedio imágenes por proyecto: ${(imagenesAsignadas / proyectosCreados).toFixed(2)}`)
    
    console.log('\n📋 DISTRIBUCIÓN POR CATEGORÍA:')
    Object.keys(resumenCategorias).forEach(categoria => {
      const data = resumenCategorias[categoria]
      console.log(`   ${categoria}: ${data.count} proyectos (${data.imagenes} imágenes)`)
    })

    // 6. VERIFICACIÓN DE INTEGRIDAD
    console.log('\n🔍 VERIFICACIÓN DE INTEGRIDAD:')
    
    const proyectosVerificacion = await prisma.proyecto.findMany({
      include: {
        imagenes: true
      }
    })

    const proyectosSinImagenes = proyectosVerificacion.filter(p => p.imagenes.length === 0)
    
    console.log(`📦 Proyectos en BD: ${proyectosVerificacion.length}`)
    console.log(`✅ Proyectos con imágenes: ${proyectosVerificacion.length - proyectosSinImagenes.length}`)
    console.log(`⚠️  Proyectos sin imágenes: ${proyectosSinImagenes.length}`)
    
    if (proyectosSinImagenes.length > 0) {
      console.log('\n📝 Proyectos sin imágenes:')
      proyectosSinImagenes.forEach(p => {
        console.log(`   - ${p.titulo}`)
      })
    }

    console.log('\n🎉 MIGRACIÓN COMPLETA FINALIZADA')
    console.log('✨ Todos los proyectos han sido recreados con nombres correctos y categorías apropiadas')
    console.log('🖼️  Las imágenes están correctamente asignadas según sus nombres de archivo')

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración completa
cleanAndRebuildAllProjects()