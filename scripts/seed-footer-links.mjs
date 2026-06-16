/**
 * Puebla footer_links con el contenido actual del footer (las 13 landings +
 * Empresa + Legal). Reemplaza el seed viejo (servicios/recursos obsoletos).
 * NO toca social_links (ya están correctos en DB).
 * Correr: node scripts/seed-footer-links.mjs
 */
import fs from "node:fs"
for (const l of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^(DATABASE_URL)=(.*)$/)
  if (m) { let v = m[2].trim(); if (v[0] === '"' && v.endsWith('"')) v = v.slice(1, -1); process.env[m[1]] = v }
}
const { PrismaClient } = await import("@prisma/client")
const prisma = new PrismaClient()

const GROUPS = {
  soluciones: [
    ["Bodegas y naves", "/soluciones/estructura-metalica-para-bodegas"],
    ["Puentes metálicos", "/soluciones/puentes-metalicos"],
    ["Cubiertas y fachadas", "/soluciones/cubiertas-metalicas"],
    ["Centros comerciales", "/soluciones/estructura-metalica-centros-comerciales"],
    ["Escenarios deportivos", "/soluciones/estructura-metalica-escenarios-deportivos"],
    ["Edificios", "/soluciones/edificios-en-estructura-metalica"],
  ],
  guias: [
    ["Precios y costos", "/precios-estructuras-metalicas"],
    ["Acero vs. concreto", "/estructura-metalica-vs-concreto"],
    ["Tipos de estructuras", "/tipos-de-estructuras-metalicas"],
    ["Peso por m²", "/peso-estructura-metalica-por-m2"],
  ],
  ciudades: [
    ["Cali", "/estructuras-metalicas/cali"],
    ["Bogotá", "/estructuras-metalicas/bogota"],
    ["Popayán", "/estructuras-metalicas/popayan"],
  ],
  empresa: [
    ["Sobre MEISA", "/empresa"],
    ["Tecnología", "/procesos-tecnologias"],
    ["Calidad y Certificaciones", "/calidad"],
    ["Portfolio", "/proyectos"],
  ],
  legal: [
    ["Política de Datos", "/politica-datos"],
    ["Gobierno Corporativo", "/empresa#gobierno-corporativo"],
    ["Sistema de Gestión", "/calidad"],
  ],
}

await prisma.footerLink.deleteMany({})
let total = 0
for (const [grupo, links] of Object.entries(GROUPS)) {
  for (let i = 0; i < links.length; i++) {
    await prisma.footerLink.create({
      data: { grupo, label: links[i][0], href: links[i][1], orden: i, activo: true },
    })
    total++
  }
}
console.log(`✅ ${total} footer_links creados`)
const rows = await prisma.footerLink.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] })
for (const r of rows) console.log(`  [${r.grupo}] ${r.orden} ${r.label} -> ${r.href}`)
await prisma.$disconnect()
