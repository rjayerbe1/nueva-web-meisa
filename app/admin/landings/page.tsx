import Link from "next/link"
import { Pencil, ExternalLink } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { landingPublicPath, type LandingTipoStr } from "@/lib/landings-schema"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

const GRUPOS: { tipo: LandingTipoStr; titulo: string; descripcion: string }[] = [
  {
    tipo: "SOLUCION",
    titulo: "Soluciones",
    descripcion: "Landings /soluciones/[slug] — una por tipología de proyecto.",
  },
  {
    tipo: "GUIA",
    titulo: "Guías técnicas",
    descripcion: "Guías SEO standalone: precios, acero vs concreto, tipos y peso por m².",
  },
  {
    tipo: "CIUDAD",
    titulo: "Ciudades",
    descripcion: "Landings locales /estructuras-metalicas/[ciudad].",
  },
]

const BADGE_CLS: Record<LandingTipoStr, string> = {
  SOLUCION: "bg-red-600 text-white",
  GUIA: "bg-blue-700 text-white",
  CIUDAD: "bg-slate-700 text-white",
}

const BADGE_LABEL: Record<LandingTipoStr, string> = {
  SOLUCION: "Solución",
  GUIA: "Guía",
  CIUDAD: "Ciudad",
}

export default async function LandingsAdminPage() {
  const landings = await prisma.landingSeo.findMany({
    orderBy: [{ tipo: "asc" }, { orden: "asc" }],
    select: {
      id: true,
      slug: true,
      tipo: true,
      titulo: true,
      metaTitle: true,
      activa: true,
      updatedAt: true,
    },
  })

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Contenido del sitio
        </p>
        <h1 className="mt-1 font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
          Landings <span className="text-slate-400">SEO</span>
        </h1>
        <p className="mt-2 max-w-2xl font-lato text-sm text-slate-600">
          Contenido completo de las {landings.length} landings de posicionamiento:
          textos, precios, FAQ, meta tags y secciones. Los cambios quedan en vivo
          en ~1 minuto (ISR).
        </p>
      </div>

      {GRUPOS.map((grupo) => {
        const items = landings.filter((l) => l.tipo === grupo.tipo)
        if (items.length === 0) return null
        return (
          <section key={grupo.tipo} className="mb-10">
            <div className="mb-3">
              <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
                {grupo.titulo}{" "}
                <span className="text-slate-400">({items.length})</span>
              </h2>
              <p className="font-lato text-xs text-slate-500">{grupo.descripcion}</p>
            </div>

            <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
              {items.map((landing) => {
                const publicPath = landingPublicPath(
                  landing.tipo as LandingTipoStr,
                  landing.slug,
                )
                return (
                  <div
                    key={landing.id}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-stone-50"
                  >
                    <span
                      className={cn(
                        "hidden flex-shrink-0 rounded-none px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-[0.15em] sm:inline-block",
                        BADGE_CLS[landing.tipo as LandingTipoStr],
                      )}
                    >
                      {BADGE_LABEL[landing.tipo as LandingTipoStr]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/landings/${landing.id}`}
                        className="block truncate font-lato text-sm font-bold text-slate-950 transition-colors hover:text-red-600"
                      >
                        {landing.titulo}
                      </Link>
                      <p className="truncate font-mono text-xs text-slate-400">
                        {publicPath}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "flex-shrink-0 rounded-none px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-[0.15em]",
                        landing.activa
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-600",
                      )}
                    >
                      {landing.activa ? "Activa" : "Inactiva"}
                    </span>

                    <span className="hidden flex-shrink-0 font-lato text-[11px] text-slate-400 md:inline">
                      {new Date(landing.updatedAt).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <div className="flex flex-shrink-0 items-center gap-1">
                      <a
                        href={publicPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-slate-900"
                        title="Ver página pública"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Link
                        href={`/admin/landings/${landing.id}`}
                        className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-red-600"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {landings.length === 0 && (
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-lato text-sm text-slate-600">
            No hay landings en la base de datos. Corre el seed:
          </p>
          <code className="mt-2 inline-block bg-slate-950 px-3 py-1.5 font-mono text-xs text-white">
            npx tsx scripts/seed-landings.mjs
          </code>
        </div>
      )}
    </div>
  )
}
