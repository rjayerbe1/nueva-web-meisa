/**
 * Seed de Fase 4: Servicios "Proceso Integral" + Contacto.
 *
 * Migra:
 *   - procesoIntegral (4 fases) de app/(public)/servicios/page.tsx
 *   - tiposProyecto (8) + serviciosDisponibles (5) de contacto/ContactoContent.tsx
 *   - Datos de contacto generales (PBX, email, horarios)
 *
 * Correr: npx tsx prisma/seed-servicios-contacto.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const FASES = [
  {
    numero: 1,
    titulo: "Consultoría e Ingeniería BIM",
    descripcion:
      "Análisis estructural integral, modelado 3D avanzado y planeación detallada del proyecto",
    fortalezas: [
      "Análisis estructural y sísmico especializado",
      "Modelado 3D con Tekla Structures y BIM 360",
      "Software RISA-3D, RISAFloor, RISAConnection",
      "Modelos BIM 3D con coordinación multidisciplinaria",
      "Planos de fabricación y memorias de cálculo",
      "Plan de ejecución integral del proyecto",
    ],
    icono: "Calculator",
  },
  {
    numero: 2,
    titulo: "Fabricación y Logística Integral",
    descripcion:
      "Producción especializada con tecnología CNC, gestión integrada y transporte de cargas pesadas",
    fortalezas: [
      "Corte CNC con FastCAM de alta precisión",
      "Sistema de gestión de producción integrado",
      "Soldadura calificada con certificación AWS",
      "Protección anticorrosiva garantizada 50 años",
      "Estructuras fabricadas con trazabilidad completa",
      "Transporte especializado hasta 100 toneladas",
    ],
    icono: "Cog",
  },
  {
    numero: 3,
    titulo: "Montaje Especializado",
    descripcion:
      "Instalación con equipos especializados, trabajo en altura certificado e inspección continua SIG",
    fortalezas: [
      "Izaje con grúas y equipos especializados",
      "Trabajo en altura certificado",
      "Inspección continua con Sistema SIG",
      "Protocolos de seguridad ISO 45001",
      "Estructura montada con documentación completa",
      "Coordinación previa con modelo 3D",
    ],
    icono: "HardHat",
  },
  {
    numero: 4,
    titulo: "Entrega y Garantía",
    descripcion:
      "Puesta en marcha documentada con garantía de calidad, capacitación y soporte especializado",
    fortalezas: [
      "Documentación As-Built completa",
      "Capacitación técnica especializada al cliente",
      "Garantía de calidad certificada",
      "Soporte post-venta continuo",
      "Transferencia completa de conocimiento",
      "Seguimiento de desempeño del proyecto",
    ],
    icono: "Award",
  },
]

const TIPOS_PROYECTO = [
  "Estructura metálica para edificación",
  "Estructura industrial",
  "Cubierta metálica",
  "Puente o pasarela",
  "Tanque o recipiente",
  "Escalera metálica",
  "Mantenimiento o reparación",
  "Otro tipo de proyecto",
]

const SERVICIOS_CONTACTO = [
  "Diseño estructural",
  "Fabricación",
  "Montaje",
  "Pintura y acabados",
  "Mantenimiento",
]

const CONTACTO = {
  id: "default",
  pbx: "+57 (2) 312 0050",
  movil: "+57 (310) 432 7227",
  email: "contacto@meisa.com.co",
  horarioSemana: "Lunes a Viernes: 7:00 AM - 5:00 PM",
  horarioSabado: "Sábados: 8:00 AM - 12:00 PM",
  whatsappNumero: "+573104327227",
  direccionLinea1: "Vía Panamericana 6 Sur – 195",
  direccionLinea2: "Jamundí, Valle del Cauca",
}

function slugifyValor(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function main() {
  // Fases
  for (let i = 0; i < FASES.length; i++) {
    const f = FASES[i]
    await prisma.procesoFase.upsert({
      where: { numero: f.numero },
      create: { ...f, orden: i, activo: true },
      update: { ...f, orden: i },
    })
  }
  console.log(`✓ ${FASES.length} fases del proceso integral`)

  // Opciones de formulario
  for (let i = 0; i < TIPOS_PROYECTO.length; i++) {
    const label = TIPOS_PROYECTO[i]
    const valor = slugifyValor(label)
    await prisma.formOption.upsert({
      where: { grupo_valor: { grupo: "TIPO_PROYECTO", valor } },
      create: { grupo: "TIPO_PROYECTO", valor, label, orden: i, activo: true },
      update: { label, orden: i },
    })
  }
  console.log(`✓ ${TIPOS_PROYECTO.length} tipos de proyecto`)

  for (let i = 0; i < SERVICIOS_CONTACTO.length; i++) {
    const label = SERVICIOS_CONTACTO[i]
    const valor = slugifyValor(label)
    await prisma.formOption.upsert({
      where: { grupo_valor: { grupo: "SERVICIO_CONTACTO", valor } },
      create: {
        grupo: "SERVICIO_CONTACTO",
        valor,
        label,
        orden: i,
        activo: true,
      },
      update: { label, orden: i },
    })
  }
  console.log(`✓ ${SERVICIOS_CONTACTO.length} servicios del formulario`)

  // Configuración contacto
  await prisma.configuracionContacto.upsert({
    where: { id: "default" },
    create: CONTACTO,
    update: CONTACTO,
  })
  console.log("✓ ConfiguracionContacto (singleton)")

  console.log("\n✅ Servicios + Contacto seed completado")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
