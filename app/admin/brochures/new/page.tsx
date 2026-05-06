import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { BrochureForm } from "@/components/admin/BrochureForm"

export const dynamic = "force-dynamic"

async function getAvailableCategorias() {
  const categorias = await prisma.categoriaProyecto.findMany({
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      brochure: { select: { id: true } },
    },
  })
  return categorias
    .filter((c) => !c.brochure)
    .map((c) => ({ id: c.id, nombre: c.nombre }))
}

export default async function NewBrochurePage() {
  const categorias = await getAvailableCategorias()

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/admin/brochures"
        className="mb-4 inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3 w-3" /> Brochures
      </Link>

      <h1 className="font-bebas text-3xl uppercase tracking-wide text-slate-950">
        Nuevo brochure
      </h1>
      <p className="mt-1 mb-8 font-lato text-sm text-slate-500">
        Sube un PDF y queda disponible como flipbook público.
      </p>

      <div className="max-w-4xl border border-slate-200 bg-white p-6 md:p-8">
        <BrochureForm categorias={categorias} />
      </div>
    </div>
  )
}
