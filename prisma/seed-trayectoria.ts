import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proyectos = [
  // 2024-2025 - Proyectos actuales
  {
    entidadContratante: "PAVCOL",
    objetoContrato: "Ciclopuente Calle 98 P11 GRUPO 7",
    fechaInicio: new Date("2024-12-15"),
    fechaFin: new Date("2025-08-30"),
    pesoKg: 381379,
    areaM2: 1528,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 6186781197
  },
  {
    entidadContratante: "MHC",
    objetoContrato: "Estaciones de Transmilenio Cra 11 y 19",
    fechaInicio: new Date("2024-01-22"),
    fechaFin: new Date("2025-06-12"),
    pesoKg: 424066,
    areaM2: null,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 5716407656
  },
  {
    entidadContratante: "OMEGA",
    objetoContrato: "Ampliacion Omega Tercer Piso",
    fechaInicio: new Date("2024-12-10"),
    fechaFin: new Date("2025-05-28"),
    pesoKg: 7939,
    areaM2: 263,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 160652922
  },
  {
    entidadContratante: "Dollar City",
    objetoContrato: "Construccion y Montaje Estructura Metalica Dollar City Mazuren",
    fechaInicio: new Date("2025-06-02"),
    fechaFin: new Date("2025-08-31"),
    pesoKg: 125755,
    areaM2: 789,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 1877621085
  },
  {
    entidadContratante: "Dollar City",
    objetoContrato: "Construccion y Montaje Estructura Metalica Dollar City Chapinero",
    fechaInicio: new Date("2025-08-01"),
    fechaFin: new Date("2025-11-01"),
    pesoKg: 59749,
    areaM2: 571.73,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 909552207
  },
  {
    entidadContratante: "Dollar City",
    objetoContrato: "Construccion y Montaje Estructura Metalica Dollar City Rio Negro Calle 100",
    fechaInicio: new Date("2025-08-11"),
    fechaFin: new Date("2025-12-29"),
    pesoKg: 74852,
    areaM2: 498,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 1235634693
  },
  {
    entidadContratante: "PAVCOL",
    objetoContrato: "Estación Calle 19 y Puente Peatonal Av. Esperanza Norte P8 Grupo 4",
    fechaInicio: new Date("2023-08-14"),
    fechaFin: new Date("2025-09-28"),
    pesoKg: 272664,
    areaM2: null,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 3943844058
  },
  {
    entidadContratante: "Construcción y Administración S.A Sucursal Colombia",
    objetoContrato: "Puente Vehicular OVEJAS",
    fechaInicio: new Date("2024-05-21"),
    fechaFin: new Date("2025-12-30"),
    pesoKg: 535657,
    areaM2: 2360,
    ubicacion: "Santander de Quilichao-Cauca",
    departamento: "Cauca",
    valorContrato: 8083051274
  },

  // 2024
  {
    entidadContratante: "Inverteq S.A.S. - Tecnosur",
    objetoContrato: "Construccion Estructura Metalica Mezzanine Esteriles - Tecnosur Villa Rica",
    fechaInicio: new Date("2024-11-25"),
    fechaFin: new Date("2025-01-18"),
    pesoKg: 106103,
    areaM2: 673,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 906945501
  },
  {
    entidadContratante: "Construandes S.A.S",
    objetoContrato: "Estructura Metalica Hangar Aeropuerto",
    fechaInicio: new Date("2024-09-02"),
    fechaFin: new Date("2024-10-26"),
    pesoKg: 47052,
    areaM2: 890,
    ubicacion: "Palmira - Valle",
    departamento: "Valle del Cauca",
    valorContrato: 716966921
  },
  {
    entidadContratante: "Dollar City",
    objetoContrato: "Construccion y Montaje Estructura Metalica Dollar City Alfaguara",
    fechaInicio: new Date("2024-09-02"),
    fechaFin: new Date("2024-12-19"),
    pesoKg: 53818,
    areaM2: 560,
    ubicacion: "Jamundi - Valle del Cauca",
    departamento: "Valle del Cauca",
    valorContrato: 810197559
  },
  {
    entidadContratante: "Dollar City",
    objetoContrato: "Construccion y Montaje Estructura Metalica Dollar City La Maria",
    fechaInicio: new Date("2024-10-24"),
    fechaFin: new Date("2024-12-14"),
    pesoKg: 59790,
    areaM2: 759,
    ubicacion: "Popayan-Cauca",
    departamento: "Cauca",
    valorContrato: 831492033
  },
  {
    entidadContratante: "Pollo Listo",
    objetoContrato: "Construccion y Montaje Estructura Metalica Cuarto Frio",
    fechaInicio: new Date("2024-04-26"),
    fechaFin: new Date("2024-11-30"),
    pesoKg: 30637,
    areaM2: 454,
    ubicacion: "Villa Gorgona - Valle del Cauca",
    departamento: "Valle del Cauca",
    valorContrato: 567505206
  },
  {
    entidadContratante: "Inverteq S.A.S. - Tecnosur",
    objetoContrato: "Construccion Estructura Metalica Modulo 8 - Tecnosur Villa Rica",
    fechaInicio: new Date("2024-05-21"),
    fechaFin: new Date("2024-10-31"),
    pesoKg: 108520,
    areaM2: 4081,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 845667364
  },
  {
    entidadContratante: "C.A.S.A. Sucol",
    objetoContrato: "Construccion y Montaje Estructura Metalica Puente Cascada",
    fechaInicio: new Date("2023-10-20"),
    fechaFin: new Date("2024-10-31"),
    pesoKg: 537152,
    areaM2: null,
    ubicacion: "Mondomo-Cauca",
    departamento: "Cauca",
    valorContrato: 6817855456
  },
  {
    entidadContratante: "Grupo Constructor y Prodigyo S.A",
    objetoContrato: "Construccion de Estructura Metalica y pintura para el Proyecto Cubierta Modulo Espiritu Santo",
    fechaInicio: new Date("2023-09-13"),
    fechaFin: new Date("2024-06-30"),
    pesoKg: 7194,
    areaM2: 2547,
    ubicacion: "Popayan-Cauca",
    departamento: "Cauca",
    valorContrato: 941509922
  },
  {
    entidadContratante: "Construandes",
    objetoContrato: "Galeria local 326 CC Llanogrande",
    fechaInicio: new Date("2023-11-14"),
    fechaFin: new Date("2024-06-30"),
    pesoKg: 325357,
    areaM2: 3024,
    ubicacion: "Palmira - Valle",
    departamento: "Valle del Cauca",
    valorContrato: 4409932991
  },
  {
    entidadContratante: "Astrelec S.A.S",
    objetoContrato: "Construccion estructura metalica locales comerciales Natura Park",
    fechaInicio: new Date("2023-05-26"),
    fechaFin: new Date("2024-03-12"),
    pesoKg: 73310,
    areaM2: 2327,
    ubicacion: "Jamundi-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1308035347
  },
  {
    entidadContratante: "Juan Tama",
    objetoContrato: "Infraestuctura de Trilladora de Café",
    fechaInicio: new Date("2020-12-08"),
    fechaFin: new Date("2024-01-30"),
    pesoKg: 77800,
    areaM2: 1065,
    ubicacion: "Inza-Cauca",
    departamento: "Cauca",
    valorContrato: 1610318540
  },
  {
    entidadContratante: "Sucroal S.A",
    objetoContrato: "Edificio Citrico",
    fechaInicio: new Date("2022-11-08"),
    fechaFin: new Date("2024-04-10"),
    pesoKg: 166000,
    areaM2: 1099,
    ubicacion: "Palmira - Valle",
    departamento: "Valle del Cauca",
    valorContrato: 4472543247
  },
  {
    entidadContratante: "Sucroal S.A",
    objetoContrato: "Centro de Distribución - Palmira",
    fechaInicio: new Date("2023-01-02"),
    fechaFin: new Date("2024-03-30"),
    pesoKg: 169678,
    areaM2: 2331,
    ubicacion: "Palmira - Valle",
    departamento: "Valle del Cauca",
    valorContrato: 9883845579
  },

  // 2023
  {
    entidadContratante: "JJVM S.A.S.",
    objetoContrato: "Entre Bosques",
    fechaInicio: new Date("2023-01-18"),
    fechaFin: new Date("2023-12-09"),
    pesoKg: 4901,
    areaM2: null,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 257107228
  },
  {
    entidadContratante: "Consorcio Deportivo GAMJ",
    objetoContrato: "Coliseo Menor Pereira",
    fechaInicio: new Date("2023-06-06"),
    fechaFin: new Date("2023-11-16"),
    pesoKg: 119198,
    areaM2: null,
    ubicacion: "Pereira",
    departamento: "Risaralda",
    valorContrato: 1871754428
  },
  {
    entidadContratante: "Unión Temporal Complejo Acuático Pereira",
    objetoContrato: "Complejo Acuatico Pereira",
    fechaInicio: new Date("2023-05-15"),
    fechaFin: new Date("2023-11-08"),
    pesoKg: 40119,
    areaM2: null,
    ubicacion: "Pereira",
    departamento: "Risaralda",
    valorContrato: 1283310568
  },
  {
    entidadContratante: "Ingenio Providencia S.A.",
    objetoContrato: "Bahía de Alcoholes",
    fechaInicio: new Date("2023-03-13"),
    fechaFin: new Date("2023-10-30"),
    pesoKg: 14571,
    areaM2: 270,
    ubicacion: "Cerrito-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1299426736
  },
  {
    entidadContratante: "Ingenio Providencia S.A.",
    objetoContrato: "Obras civiles y Estructura Metalica Zona de Catas Oficinas y Vestier",
    fechaInicio: new Date("2022-06-14"),
    fechaFin: new Date("2023-03-22"),
    pesoKg: 4656,
    areaM2: null,
    ubicacion: "Cerrito-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1362516557
  },
  {
    entidadContratante: "PAVCOL",
    objetoContrato: "Puente la Floresta",
    fechaInicio: new Date("2022-10-21"),
    fechaFin: new Date("2023-01-28"),
    pesoKg: 398198,
    areaM2: null,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 5288891122
  },
  {
    entidadContratante: "Tecnoquímicas S.A.",
    objetoContrato: "Construccion Estructura Metalica Solidos de Altos Volumenes TQ Jamundi",
    fechaInicio: new Date("2021-07-28"),
    fechaFin: new Date("2023-01-30"),
    pesoKg: 614723,
    areaM2: 3328,
    ubicacion: "Jamundi-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 8726150765
  },

  // 2022
  {
    entidadContratante: "Inverteq S.A.S. - Tecnosur",
    objetoContrato: "Centro de distribución - Villa Rica",
    fechaInicio: new Date("2022-08-25"),
    fechaFin: new Date("2022-12-30"),
    pesoKg: 840248,
    areaM2: 11879,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 6673961433
  },
  {
    entidadContratante: "Inverteq S.A.S. - Tecnosur",
    objetoContrato: "Construccion Estructura Metalica Modulo 7 - Tecnosur Villa Rica",
    fechaInicio: new Date("2021-07-28"),
    fechaFin: new Date("2023-01-30"),
    pesoKg: 154588,
    areaM2: 2928,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 1303845792
  },
  {
    entidadContratante: "Comfacauca",
    objetoContrato: "Construcción de la estructura metalica de cubierta caña dulce",
    fechaInicio: new Date("2022-02-02"),
    fechaFin: new Date("2022-08-02"),
    pesoKg: 110119,
    areaM2: 2260,
    ubicacion: "Santander de Quilichao-Cauca",
    departamento: "Cauca",
    valorContrato: 997094492
  },
  {
    entidadContratante: "Ingenio Providencia S.A.",
    objetoContrato: "Bodega 5 Azucar",
    fechaInicio: new Date("2021-12-01"),
    fechaFin: new Date("2022-06-06"),
    pesoKg: 227257,
    areaM2: 3544,
    ubicacion: "Cerrito-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 6339220884
  },
  {
    entidadContratante: "Constructora Normandia",
    objetoContrato: "Construcción estructura metalica CC Bochalema Plaza",
    fechaInicio: new Date("2020-04-07"),
    fechaFin: new Date("2022-05-07"),
    pesoKg: 1781497,
    areaM2: 16347,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 15556690698
  },
  {
    entidadContratante: "Ingenio Providencia S.A.",
    objetoContrato: "Construcción de obra civil, estructura metalica, fachada y cubierta del complejo industrial Piedechinche",
    fechaInicio: new Date("2020-12-30"),
    fechaFin: new Date("2022-06-30"),
    pesoKg: 812351,
    areaM2: 14519,
    ubicacion: "Cerrito-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 23999622816
  },

  // 2021
  {
    entidadContratante: "Consorcio Metrovial Sb",
    objetoContrato: "Terminal intermedio autopista Simon Bolivar parte 2",
    fechaInicio: new Date("2018-03-02"),
    fechaFin: new Date("2021-10-28"),
    pesoKg: 654000,
    areaM2: 8842,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 4670027698
  },
  {
    entidadContratante: "Diego María Romero",
    objetoContrato: "Construccion estructura metalica edificio de 3 pisos para parqueadero.Tequendama Parking",
    fechaInicio: new Date("2020-03-04"),
    fechaFin: new Date("2021-11-04"),
    pesoKg: 156087,
    areaM2: 9633,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 7261848318
  },
  {
    entidadContratante: "Tecnoquímicas S.A.",
    objetoContrato: "Construccion Estructura Metalica Edificio capsulas Blandas Envases y empaques TQ Jamundi",
    fechaInicio: new Date("2020-12-04"),
    fechaFin: new Date("2021-07-19"),
    pesoKg: 507990,
    areaM2: 3676,
    ubicacion: "Jamundi-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 3767071106
  },
  {
    entidadContratante: "Tecnoquímicas S.A.",
    objetoContrato: "Construccion Estructura Metalica Bodega 3 TQ Jamundi",
    fechaInicio: new Date("2020-12-04"),
    fechaFin: new Date("2021-06-09"),
    pesoKg: 132488,
    areaM2: 2100,
    ubicacion: "Jamundi-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 2109820591
  },
  {
    entidadContratante: "Constructora Inverteq S.A.S",
    objetoContrato: "Construccion de bodega semisolidos Tecnofar",
    fechaInicio: new Date("2020-07-15"),
    fechaFin: new Date("2021-03-13"),
    pesoKg: 612061,
    areaM2: 5141,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 3804133133
  },

  // 2020
  {
    entidadContratante: "Pontificia Universidad Javeriana",
    objetoContrato: "Construccion de estructura y acabados, proyecto cancha multiple- etapa 2",
    fechaInicio: new Date("2020-03-16"),
    fechaFin: new Date("2020-05-11"),
    pesoKg: 87000,
    areaM2: 1228,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1640534394
  },
  {
    entidadContratante: "Cuerpo de Bomberos Popayán",
    objetoContrato: "Construcción edificio administrativo cuerpo de bomberos Popayán",
    fechaInicio: new Date("2019-09-09"),
    fechaFin: new Date("2020-01-07"),
    pesoKg: 91505,
    areaM2: 1085,
    ubicacion: "Popayán-Cauca",
    departamento: "Cauca",
    valorContrato: 1151672897
  },
  {
    entidadContratante: "Ménsula Ingenieros S.A.S",
    objetoContrato: "Estructura metálica Centro Comercial Paseo Villa del Río",
    fechaInicio: new Date("2018-09-08"),
    fechaFin: new Date("2020-02-14"),
    pesoKg: 420000,
    areaM2: 2789,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 3259029390
  },
  {
    entidadContratante: "Propal",
    objetoContrato: "Construcción e instalación de estructura metálica para torre cogeneración",
    fechaInicio: new Date("2019-08-12"),
    fechaFin: new Date("2020-01-21"),
    pesoKg: 110000,
    areaM2: 1102,
    ubicacion: "Yumbo-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1385122442
  },

  // 2019
  {
    entidadContratante: "Cargill Colombia",
    objetoContrato: "Construcción e instalación de estructura métalica y ampliación de la cubierta",
    fechaInicio: new Date("2019-04-22"),
    fechaFin: new Date("2019-09-25"),
    pesoKg: 175753,
    areaM2: 3910,
    ubicacion: "Villa Rica-Cauca",
    departamento: "Cauca",
    valorContrato: 5638813987
  },
  {
    entidadContratante: "Consorcio Islas 2019",
    objetoContrato: "Puente Vehicular Cra 100",
    fechaInicio: new Date("2018-12-18"),
    fechaFin: new Date("2019-10-20"),
    pesoKg: 444880,
    areaM2: 75.92,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 3557668911
  },

  // 2018
  {
    entidadContratante: "Edgar Oliveros",
    objetoContrato: "Estructura metálica para el proyecto Cinemateca distrital Bogotá",
    fechaInicio: new Date("2016-12-01"),
    fechaFin: new Date("2018-06-05"),
    pesoKg: 490000,
    areaM2: 1636,
    ubicacion: "Bogotá",
    departamento: "Bogotá D.C.",
    valorContrato: 2955102224
  },
  {
    entidadContratante: "Consorcio Cambrin 2017",
    objetoContrato: "Puente Vehicular Cambrín",
    fechaInicio: new Date("2017-08-17"),
    fechaFin: new Date("2018-08-20"),
    pesoKg: 290000,
    areaM2: 90.85,
    ubicacion: "Rio Blanco-Tolima",
    departamento: "Tolima",
    valorContrato: 2173390562
  },
  {
    entidadContratante: "Construcciones Adriana Rivera S.A.S",
    objetoContrato: "Construcción de estructura metálica y cubiertas para Centro comercial Monserrat",
    fechaInicio: new Date("2017-11-08"),
    fechaFin: new Date("2018-12-08"),
    pesoKg: 212000,
    areaM2: 4308,
    ubicacion: "Popayán-Cauca",
    departamento: "Cauca",
    valorContrato: 1718808565
  },
  {
    entidadContratante: "Orlando Revelo Villota",
    objetoContrato: "Puente Vehicular Río Negro",
    fechaInicio: new Date("2018-05-11"),
    fechaFin: new Date("2018-12-12"),
    pesoKg: 54600,
    areaM2: 32,
    ubicacion: "Inzá-Cauca",
    departamento: "Cauca",
    valorContrato: 569188383
  },

  // 2017
  {
    entidadContratante: "Omega",
    objetoContrato: "Construcción edificio nueva sede Seguridad Omega",
    fechaInicio: new Date("2017-05-02"),
    fechaFin: new Date("2017-09-26"),
    pesoKg: 115000,
    areaM2: 1633,
    ubicacion: "Cali-Valle",
    departamento: "Valle del Cauca",
    valorContrato: 1761667070
  }
]

const configuracionInicial = {
  resenaHistorica: `Metálicas e Ingeniería S.A.S fue constituida en el año 1996 en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de Estructuras Metálicas. A la fecha, hemos participado activamente en la construcción y manejo de Proyectos y Obras Civiles en todo el territorio Nacional.

Con el objetivo de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año tras año ha incorporado talento humano altamente competente, y máquinas y equipos de última tecnología, permitiéndonos ser cada vez más eficientes en los tiempos de entrega y en la reducción de costos de los proyectos. En el año 2013 se inauguró la segunda planta de producción en la ciudad de Jamundí, duplicando la capacidad de producción a 600 toneladas/mes.`,

  mision: `Desarrollar soluciones a proyectos con estructuras metálicas y obras civiles, logrando el balance ideal entre costos, diseño, funcionalidad y excelente calidad, cumpliendo con las normas sismo resistentes vigentes, los estándares de fabricación y montajes actuales, de la mano del talento humano y responsabilidad de los trabajadores.`,

  vision: `Fortalecer la empresa a nivel nacional garantizando un crecimiento en el tiempo a través de calidad de los productos y servicios, generando rentabilidad, aumento de confianza, mayor satisfacción de clientes y colaboradores, para así mantener su consolidación y talento profesional ante el mercado y llegar a nuevos clientes.`,

  valores: JSON.stringify([
    { nombre: "Efectividad", descripcion: "Logramos resultados concretos y medibles en cada proyecto", icono: "target" },
    { nombre: "Integridad", descripcion: "Actuamos con honestidad y transparencia en todas nuestras relaciones", icono: "shield-check" },
    { nombre: "Respeto", descripcion: "Valoramos a cada persona y sus aportes al equipo", icono: "users" },
    { nombre: "Lealtad", descripcion: "Comprometidos con nuestros clientes y colaboradores", icono: "heart" },
    { nombre: "Proactividad", descripcion: "Anticipamos necesidades y tomamos iniciativa", icono: "zap" },
    { nombre: "Pasión", descripcion: "Amamos lo que hacemos y se refleja en cada obra", icono: "flame" },
    { nombre: "Disciplina", descripcion: "Cumplimos con excelencia cada compromiso adquirido", icono: "check-circle" },
    { nombre: "Aprendizaje continuo", descripcion: "Mejoramos constantemente nuestras capacidades", icono: "graduation-cap" }
  ])
}

async function main() {
  console.log('🌱 Iniciando seed de Trayectoria MEISA...')

  // Limpiar datos existentes
  await prisma.proyectoHojaVida.deleteMany({})
  await prisma.configuracionTrayectoria.deleteMany({})

  console.log('✅ Datos anteriores eliminados')

  // Insertar proyectos
  let count = 0
  for (const proyecto of proyectos) {
    await prisma.proyectoHojaVida.create({
      data: {
        ...proyecto,
        visible: true,
        destacado: false,
        orden: count++
      }
    })
  }

  console.log(`✅ ${count} proyectos insertados`)

  // Insertar configuración inicial
  await prisma.configuracionTrayectoria.create({
    data: configuracionInicial
  })

  console.log('✅ Configuración inicial creada')
  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
