"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import type {
  GrupoSeccion,
  Tecnologia,
  Equipo,
  ProcesoDigital,
  Plant,
} from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface Props {
  grupos: GrupoSeccion[]
  tecnologias: Tecnologia[]
  equipos: Equipo[]
  procesos: ProcesoDigital[]
  plantas: Plant[]
}

const grupoFields: FieldDef[] = [
  {
    name: "pagina",
    label: "Página",
    kind: "select",
    required: true,
    options: [
      { value: "tecnologia", label: "Procesos y Tecnologías" },
      { value: "calidad", label: "Políticas (SIG)" },
    ],
  },
  { name: "clave", label: "Clave técnica", kind: "text", required: true, placeholder: "diseno-analisis" },
  { name: "titulo", label: "Título", kind: "text", required: true },
  { name: "subtitulo", label: "Subtítulo", kind: "text", gridSpan: 2 },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "icono", label: "Icono (nombre Lucide)", kind: "text" },
  {
    name: "colorGradient",
    label: "Gradiente",
    kind: "color",
    placeholder: "from-blue-600 to-blue-700",
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const tecnologiaCategorias = [
  { value: "bim-diseno", label: "BIM / Diseño" },
  { value: "analisis-estructural", label: "Análisis estructural" },
  { value: "conexiones", label: "Conexiones" },
  { value: "otro", label: "Otro" },
]

const tecnologiaFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "categoria", label: "Categoría", kind: "select", required: true, options: tecnologiaCategorias },
  { name: "especialidad", label: "Especialidad", kind: "text" },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "imagen", label: "URL imagen", kind: "url", gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const equipoCategorias = [
  { value: "corte-cnc", label: "Corte CNC" },
  { value: "izaje", label: "Izaje" },
  { value: "especializados", label: "Especializados" },
  { value: "otro", label: "Otro" },
]

const procesoFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  {
    name: "beneficios",
    label: "Beneficios",
    kind: "stringArray",
    gridSpan: 2,
  },
  { name: "imagen", label: "URL imagen", kind: "url", gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function ProcesosTecnologiasAdminTabs({
  grupos,
  tecnologias,
  equipos,
  procesos,
  plantas,
}: Props) {
  const plantaOptions = [
    { value: "", label: "— Sin planta asociada —" },
    ...plantas.map((p) => ({ value: p.id, label: p.nombre })),
  ]

  const equipoFields: FieldDef[] = [
    { name: "slug", label: "Slug (único)", kind: "text", required: true },
    { name: "nombre", label: "Nombre", kind: "text", required: true },
    {
      name: "categoria",
      label: "Categoría",
      kind: "select",
      required: true,
      options: equipoCategorias,
    },
    { name: "descripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
    { name: "specs", label: "Especificaciones", kind: "stringArray", gridSpan: 2 },
    { name: "imagen", label: "URL imagen", kind: "url", gridSpan: 2 },
    {
      name: "plantaId",
      label: "Planta asociada (opcional)",
      kind: "select",
      options: plantaOptions,
    },
    { name: "orden", label: "Orden", kind: "number" },
    { name: "activo", label: "Activo", kind: "boolean" },
  ]

  return (
    <AdminTabsLayout
      title="Procesos y Tecnologías"
      description="Grupos de sección, software, equipos y procesos digitales de /procesos-tecnologias."
      tabs={[
        {
          id: "grupos",
          label: "Grupos de sección",
          count: grupos.length,
          content: (
            <ListCrudEditor<GrupoSeccion>
              items={grupos}
              fields={grupoFields}
              endpoint="/api/admin/grupos-seccion"
              emptyTemplate={{
                pagina: "tecnologia",
                clave: "",
                titulo: "",
                subtitulo: null,
                descripcion: null,
                icono: null,
                colorGradient: null,
                orden: 0,
                activo: true,
              }}
              addLabel="Agregar grupo"
              renderPreview={(g) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {g.pagina}
                    </Badge>
                    <span className="font-medium text-gray-900">{g.titulo}</span>
                  </div>
                  {g.subtitulo && <p className="mt-1 text-sm text-gray-600">{g.subtitulo}</p>}
                </div>
              )}
            />
          ),
        },
        {
          id: "tecnologias",
          label: "Software",
          count: tecnologias.length,
          content: (
            <ListCrudEditor<Tecnologia>
              items={tecnologias}
              fields={tecnologiaFields}
              endpoint="/api/admin/tecnologias"
              emptyTemplate={{
                slug: "",
                categoria: "bim-diseno",
                nombre: "",
                especialidad: null,
                descripcion: null,
                imagen: null,
                orden: tecnologias.length,
                activo: true,
              }}
              addLabel="Agregar software"
              renderPreview={(t) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{t.nombre}</span>
                    <Badge variant="outline" className="text-xs">
                      {t.categoria}
                    </Badge>
                  </div>
                  {t.especialidad && <p className="mt-1 text-sm text-gray-600">{t.especialidad}</p>}
                </div>
              )}
            />
          ),
        },
        {
          id: "equipos",
          label: "Equipos",
          count: equipos.length,
          content: (
            <ListCrudEditor<Equipo>
              items={equipos}
              fields={equipoFields}
              endpoint="/api/admin/equipos"
              emptyTemplate={{
                slug: "",
                categoria: "corte-cnc",
                nombre: "",
                descripcion: null,
                specs: [],
                imagen: null,
                plantaId: null,
                orden: equipos.length,
                activo: true,
              }}
              addLabel="Agregar equipo"
              renderPreview={(e) => (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{e.nombre}</span>
                    <Badge variant="outline" className="text-xs">
                      {e.categoria}
                    </Badge>
                  </div>
                  {e.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{e.descripcion}</p>
                  )}
                </div>
              )}
            />
          ),
        },
        {
          id: "procesos",
          label: "Procesos digitales",
          count: procesos.length,
          content: (
            <ListCrudEditor<ProcesoDigital>
              items={procesos}
              fields={procesoFields}
              endpoint="/api/admin/procesos-digitales"
              emptyTemplate={{
                slug: "",
                nombre: "",
                descripcion: null,
                beneficios: [],
                imagen: null,
                orden: procesos.length,
                activo: true,
              }}
              addLabel="Agregar proceso"
            />
          ),
        },
      ]}
    />
  )
}
