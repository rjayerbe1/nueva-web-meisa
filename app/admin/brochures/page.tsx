import Link from "next/link"
import { Plus, ExternalLink, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getBrochures() {
  return prisma.brochure.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      titulo: true,
      urlAmigable: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
      updatedAt: true,
      categoria: { select: { nombre: true, slug: true } },
    },
  })
}

export default async function BrochuresPage() {
  const brochures = await getBrochures()

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bebas text-3xl uppercase tracking-wide text-slate-950">
            Brochures
          </h1>
          <p className="mt-1 font-lato text-sm text-slate-500">
            Sube un PDF y aparecerá como flipbook en /brochure/&lt;slug&gt;.
          </p>
        </div>
        <Link
          href="/admin/brochures/new"
          className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo brochure
        </Link>
      </div>

      {brochures.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-lato text-sm text-slate-500">
            Todavía no hay brochures. Crea el primero.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-stone-50">
              <tr>
                <Th>Título</Th>
                <Th>Categoría</Th>
                <Th>URL amigable</Th>
                <Th className="text-center">PDF</Th>
                <Th className="text-center">Publicado</Th>
                <Th className="text-center">Activo</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {brochures.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 hover:bg-stone-50">
                  <Td>
                    <Link
                      href={`/admin/brochures/${b.id}`}
                      className="font-lato text-sm font-semibold text-slate-900 hover:text-red-600"
                    >
                      {b.titulo}
                    </Link>
                  </Td>
                  <Td>
                    <span className="font-lato text-sm text-slate-600">
                      {b.categoria?.nombre ?? "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-xs text-slate-500">{b.urlAmigable}</span>
                  </Td>
                  <Td className="text-center">
                    <Dot ok={Boolean(b.pdfUrl)} />
                  </Td>
                  <Td className="text-center">
                    <Dot ok={b.publicado} />
                  </Td>
                  <Td className="text-center">
                    <Dot ok={b.activo} />
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      {b.publicado && b.activo && b.pdfUrl && (
                        <a
                          href={`/brochure/${b.urlAmigable}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-slate-900"
                          title="Abrir público"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/admin/brochures/${b.id}`}
                        className="inline-flex items-center border border-slate-300 bg-white px-3 py-1 font-lato text-[11px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:text-red-600"
                      >
                        Editar
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-green-500" : "bg-slate-300"}`}
      aria-label={ok ? "sí" : "no"}
    />
  )
}
