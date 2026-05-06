import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { BrochureForm } from "@/components/admin/BrochureForm"

export const dynamic = "force-dynamic"

async function getData(brochureId: string) {
  const [brochure, categorias] = await Promise.all([
    prisma.brochure.findUnique({
      where: { id: brochureId },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        pdfUrl: true,
        categoriaId: true,
        publicado: true,
        activo: true,
      },
    }),
    prisma.categoriaProyecto.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        brochure: { select: { id: true } },
      },
    }),
  ])
  if (!brochure) return null
  const available = categorias
    .filter((c) => !c.brochure || c.id === brochure.categoriaId)
    .map((c) => ({ id: c.id, nombre: c.nombre }))
  return { brochure, categorias: available }
}

export default async function EditBrochurePage({ params }: { params: { id: string } }) {
  const data = await getData(params.id)
  if (!data) notFound()
  const { brochure, categorias } = data

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/admin/brochures"
        className="mb-4 inline-flex items-center gap-1 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3 w-3" /> Brochures
      </Link>

      <h1 className="font-bebas text-3xl uppercase tracking-wide text-slate-950">
        Editar brochure
      </h1>
      <p className="mt-1 mb-8 font-lato text-sm text-slate-500">{brochure.titulo}</p>

      <div className="max-w-4xl border border-slate-200 bg-white p-6 md:p-8">
        <BrochureForm
          initial={{
            id: brochure.id,
            titulo: brochure.titulo,
            descripcion: brochure.descripcion,
            urlAmigable: brochure.urlAmigable,
            pdfUrl: brochure.pdfUrl,
            categoriaId: brochure.categoriaId,
            publicado: brochure.publicado,
            activo: brochure.activo,
          }}
          categorias={categorias}
        />
      </div>
    </div>
  )
}
