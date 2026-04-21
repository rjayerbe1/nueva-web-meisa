import { prisma } from "@/lib/prisma"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type { ProcesoFase } from "@prisma/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

const fields: FieldDef[] = [
  { name: "numero", label: "Número de fase", kind: "number", required: true, min: 1, placeholder: "1" },
  { name: "titulo", label: "Título", kind: "text", required: true, placeholder: "Consultoría BIM" },
  {
    name: "descripcion",
    label: "Descripción",
    kind: "textarea",
    rows: 3,
    required: true,
    gridSpan: 2,
  },
  {
    name: "fortalezas",
    label: "Fortalezas",
    kind: "stringArray",
    gridSpan: 2,
    hint: "Viñetas de fortalezas de la fase.",
  },
  {
    name: "icono",
    label: "Icono (nombre Lucide)",
    kind: "text",
    placeholder: "Calculator | Cog | HardHat | Award",
  },
  { name: "imagen", label: "Imagen", kind: "image" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export default async function ProcesoIntegralAdminPage() {
  const fases = await prisma.procesoFase.findMany({ orderBy: { numero: "asc" } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proceso Integral</h1>
        <p className="mt-1 text-sm text-gray-600">
          Las 4 fases mostradas en la sección &quot;Proceso Integral&quot; de{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">/servicios</code>.
        </p>
      </div>
      <ListCrudEditor<ProcesoFase>
        items={fases}
        fields={fields}
        endpoint="/api/admin/proceso-fases"
        emptyTemplate={{
          numero: fases.length + 1,
          titulo: "",
          descripcion: "",
          fortalezas: [],
          icono: null,
          imagen: null,
          orden: fases.length,
          activo: true,
        }}
        addLabel="Agregar fase"
        renderPreview={(f) => (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-mono text-sm font-semibold text-blue-700">
                {f.numero}
              </span>
              <span className="font-medium text-gray-900">{f.titulo}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{f.descripcion}</p>
          </div>
        )}
      />
    </div>
  )
}
