/**
 * Seed de las 3 plantas de MEISA.
 *
 * Fuentes del contenido hardcoded que se consolida:
 * - lib/company-data.ts PLANTS (usado en /empresa)
 * - app/(public)/contacto/page.tsx plantas (usado en /contacto)
 *
 * Idempotente: usa upsert por slug.
 *
 * Correr con:  npx tsx prisma/seed-plantas.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PLANTAS = [
  {
    slug: "jamundi",
    nombre: "Sede Principal Jamundí",
    tipo: "Sede Administrativa y Producción",
    ubicacion: "Vía Panamericana 6 Sur – 195 – Valle del Cauca",
    ciudad: "Jamundí",
    departamento: "Valle del Cauca",
    areaM2: 6000,
    naves: 1,
    capacidadGruaTon: 20,
    mesasCnc: 1,
    equipamientoAdicional: ["Ensambladora de Perfiles"],
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM",
    googleMapsUrl:
      "https://www.google.com/maps/place/Met%C3%A1licas+e+Ingenier%C3%ADa+S.A.S./@3.2487893,-76.5289749,17z/data=!3m1!4b1!4m6!3m5!1s0x8e309ea112757501:0x2cfda6d9126079df!8m2!3d3.2487839!4d-76.5263946!16s%2Fg%2F11c75_b9hv?entry=ttu",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.090874524427!2d-76.5289749!3d3.2487893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e309ea112757501%3A0x2cfda6d9126079df!2zTWV0w6FsaWNhcyBlIEluZ2VuaWVyw61hIFMuQS5TLg!5e0!3m2!1ses!2sco!4v1699999999999",
    lat: 3.2487839,
    lng: -76.5263946,
    descripcion: "Planta de producción y sede administrativa de MEISA",
    colorGradient: "from-blue-500 to-blue-600",
    orden: 0,
    activo: true,
    esSedePrincipal: true,
  },
  {
    slug: "popayan",
    nombre: "Planta Popayán",
    tipo: "Planta Principal de Producción",
    ubicacion: "Bodega E13 Parque Industrial – Cauca",
    ciudad: "Popayán",
    departamento: "Cauca",
    areaM2: 4400,
    naves: 1,
    capacidadGruaTon: 10,
    mesasCnc: 2,
    equipamientoAdicional: [],
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM",
    googleMapsUrl:
      "https://www.google.com/maps/place/Met%C3%A1licas+E+Ingenier%C3%ADa+S.A./@2.5024221,-76.5623836,17z/data=!3m1!4b1!4m6!3m5!1s0x8e30042e3d132a67:0xedbc4d22716e928a!8m2!3d2.5024167!4d-76.5598033!16s%2Fg%2F1hdzvkr66?entry=ttu",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7609843675785!2d-76.5623836!3d2.5024221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30042e3d132a67%3A0xedbc4d22716e928a!2zTWV0w6FsaWNhcyBFIEluZ2VuaWVyw61hIFMuQS4!5e0!3m2!1ses!2sco!4v1699999999998",
    lat: 2.5024167,
    lng: -76.5598033,
    descripcion: "Planta de producción",
    colorGradient: "from-blue-600 to-blue-700",
    orden: 1,
    activo: true,
    esSedePrincipal: false,
  },
  {
    slug: "villa-rica",
    nombre: "Planta Villa Rica",
    tipo: "Planta de Apoyo",
    ubicacion: "Vía Puerto Tejada – Villa Rica, Vereda Agua Azul, Cauca",
    ciudad: "Villa Rica",
    departamento: "Cauca",
    areaM2: 4000,
    naves: 2,
    capacidadGruaTon: 20,
    mesasCnc: null,
    equipamientoAdicional: [],
    telefono: "+57 (2) 312 0050",
    email: "contacto@meisa.com.co",
    horario: "Lun-Vie: 7:00 AM - 5:00 PM",
    googleMapsUrl:
      "https://www.google.com/maps/place/MEISA+-+VILLA+RICA/@3.1879019,-76.4511832,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3a7700295ca9bf:0xa6b69c2179a47088!8m2!3d3.1878965!4d-76.4486029!16s%2Fg%2F11zkbv1dth?entry=ttu",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5371893449743!2d-76.4511832!3d3.1879019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3a7700295ca9bf%3A0xa6b69c2179a47088!2sMEISA%20-%20VILLA%20RICA!5e0!3m2!1ses!2sco!4v1699999999997",
    lat: 3.1878965,
    lng: -76.4486029,
    descripcion: "Planta de producción",
    colorGradient: "from-slate-600 to-slate-700",
    orden: 2,
    activo: true,
    esSedePrincipal: false,
  },
] as const

async function main() {
  let created = 0
  let updated = 0

  for (const planta of PLANTAS) {
    const existing = await prisma.plant.findUnique({
      where: { slug: planta.slug },
    })

    await prisma.plant.upsert({
      where: { slug: planta.slug },
      create: {
        ...planta,
        equipamientoAdicional: [...planta.equipamientoAdicional],
      },
      update: {
        ...planta,
        equipamientoAdicional: [...planta.equipamientoAdicional],
      },
    })

    if (existing) updated++
    else created++
  }

  console.log(`✓ Plantas seed: ${created} creadas, ${updated} actualizadas`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
