"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import {
  SingletonEditor,
  type SingletonSection,
} from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { OrdenSeccionesEditor, type SeccionItem } from "./OrdenSeccionesEditor"
import { HeroImagesEditor } from "./HeroImagesEditor"
import { HeroVideosEditor } from "./HeroVideosEditor"
import type {
  HomeHeroEspecialidad,
  HomeStat,
  HomeFeaturedProject,
  HomeServicioDestacado,
  HomeSeccionConfig,
  OrdenSeccionesHome,
} from "@prisma/client"

interface Props {
  especialidades: HomeHeroEspecialidad[]
  stats: HomeStat[]
  featured: HomeFeaturedProject | null
  servicios: HomeServicioDestacado[]
  seccionConfig: HomeSeccionConfig | null
  orden: OrdenSeccionesHome | null
}

const especialidadFields: FieldDef[] = [
  {
    name: "label",
    label: "Texto",
    kind: "text",
    required: true,
    placeholder: "DISEÑO\\nESTRUCTURAL",
    hint: "Usa \\n para saltos de línea en el hero.",
    gridSpan: 2,
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const statFields: FieldDef[] = [
  {
    name: "clave",
    label: "Clave técnica",
    kind: "text",
    required: true,
    placeholder: "anios_experiencia",
    hint: "Identificador único. Usa 'anios_experiencia' para que el valor se calcule automáticamente.",
  },
  {
    name: "valor",
    label: "Valor",
    kind: "text",
    required: true,
    placeholder: "200+ o AUTO",
    hint: "Usa 'AUTO' para cálculos dinámicos (solo para anios_experiencia).",
  },
  { name: "label", label: "Etiqueta", kind: "text", required: true, placeholder: "Años de experiencia" },
  { name: "icono", label: "Icono (nombre)", kind: "text", placeholder: "Calendar" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const featuredFields: FieldDef[] = [
  { name: "eyebrowTexto", label: "Eyebrow (texto superior)", kind: "text", placeholder: "Proyecto destacado" },
  { name: "nombre", label: "Nombre del proyecto", kind: "text", required: true, gridSpan: 2 },
  { name: "ubicacion", label: "Ubicación", kind: "text", placeholder: "Popayán, Cauca" },
  { name: "anioEntregado", label: "Año entregado", kind: "text", placeholder: "2024" },
  {
    name: "descripcion",
    label: "Descripción",
    kind: "textarea",
    rows: 3,
    gridSpan: 2,
  },
  {
    name: "imagen",
    label: "Imagen",
    kind: "image",
    gridSpan: 2,
    hint: "Aparece como fondo del destacado.",
  },
  {
    name: "proyectoSlug",
    label: "Slug de proyecto (opcional)",
    kind: "text",
    hint: "Si este destacado es un proyecto del catálogo, pon su slug para enlazar.",
  },
  { name: "ctaTexto", label: "Texto del CTA", kind: "text", placeholder: "Ver proyecto completo" },
  { name: "ctaUrl", label: "URL del CTA", kind: "url", placeholder: "/proyectos/detalle/..." },
]

const servicioFields: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true, placeholder: "edificaciones" },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "subtitulo", label: "Subtítulo", kind: "text" },
  { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  { name: "imagen", label: "Imagen", kind: "image", gridSpan: 2 },
  { name: "video", label: "Video (opcional)", kind: "video", gridSpan: 2 },
  {
    name: "color",
    label: "Color de acento",
    kind: "color",
    placeholder: "from-blue-600 to-blue-700",
    hint: "Clases Tailwind de gradiente.",
  },
  { name: "overlayColor", label: "Overlay color", kind: "text", placeholder: "#000000" },
  {
    name: "overlayOpacity",
    label: "Overlay opacity",
    kind: "number",
    min: 0,
    max: 1,
    step: 0.05,
    placeholder: "0.4",
  },
  { name: "hrefAncla", label: "Ancla/URL", kind: "text", placeholder: "/servicios#edificaciones" },
  {
    name: "servicioSlug",
    label: "Slug de servicio relacionado",
    kind: "text",
    hint: "Opcional: enlaza a un servicio del catálogo.",
  },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

const clientesSections: SingletonSection[] = [
  {
    id: "clientes",
    title: "Sección Clientes",
    description: "Textos y CTAs de la franja de clientes (logos).",
    fields: [
      { name: "clientesEyebrow", label: "Eyebrow", kind: "text" },
      { name: "clientesTitulo", label: "Título", kind: "text" },
      { name: "clientesDescripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
      { name: "clientesCtaTexto", label: "CTA — texto", kind: "text" },
      { name: "clientesCtaUrl", label: "CTA — URL", kind: "url" },
      { name: "clientesProyectosTitulo", label: "Título interno de proyectos", kind: "text", gridSpan: 2 },
    ],
  },
]

const contactoSections: SingletonSection[] = [
  {
    id: "contacto",
    title: "Sección Contacto",
    description: "Copy del bloque final de contacto en el home.",
    fields: [
      { name: "contactoEyebrow", label: "Eyebrow", kind: "text" },
      { name: "contactoTitulo", label: "Título", kind: "text" },
      { name: "contactoDescripcion", label: "Descripción", kind: "textarea", rows: 2, gridSpan: 2 },
      { name: "contactoCta1Texto", label: "CTA principal — texto", kind: "text" },
      { name: "contactoCta2Texto", label: "CTA secundaria — texto", kind: "text" },
    ],
  },
]

export function HomeAdminTabs(props: Props) {
  const { especialidades, stats, featured, servicios, seccionConfig, orden } = props
  const ordenItems = (orden?.orden as unknown as SeccionItem[] | null) ?? []

  return (
    <AdminTabsLayout
      title="Inicio"
      description="Contenido de la página principal del sitio público."
      tabs={[
        {
          id: "hero",
          label: "Hero",
          count: especialidades.length,
          content: (
            <div className="space-y-6">
              <HeroImagesEditor />
              <HeroVideosEditor initial={seccionConfig} />
              <div className="rounded-md border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
                    Especialidades del hero
                  </h2>
                  <p className="mt-1.5 max-w-2xl font-lato text-sm text-slate-600">
                    Textos que rotan en el hero (ej. “DISEÑO / ESTRUCTURAL”). Usa{" "}
                    <code className="font-mono text-xs">\n</code> para saltos de línea.
                  </p>
                </div>
                <div className="px-6 py-6">
                  <ListCrudEditor<HomeHeroEspecialidad>
                    items={especialidades}
                    fields={especialidadFields}
                    endpoint="/api/admin/home/especialidades"
                    emptyTemplate={{ label: "", orden: especialidades.length, activo: true }}
                    addLabel="Agregar especialidad"
                    renderPreview={(e) => (
                      <div>
                        <div className="font-medium text-gray-900 whitespace-pre-line">{e.label}</div>
                        <div className="text-xs text-gray-500">Orden: {e.orden}</div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "stats",
          label: "Estadísticas",
          count: stats.length,
          content: (
            <ListCrudEditor<HomeStat>
              items={stats}
              fields={statFields}
              endpoint="/api/admin/home/stats"
              emptyTemplate={{
                clave: "",
                valor: "",
                label: "",
                icono: null,
                orden: stats.length,
                activo: true,
              }}
              addLabel="Agregar stat"
              renderPreview={(s) => (
                <div>
                  <div className="font-medium text-gray-900">
                    <span className="font-mono text-blue-700">{s.valor}</span>{" "}
                    <span className="text-gray-700">· {s.label}</span>
                  </div>
                  <div className="text-xs font-mono text-gray-500">{s.clave}</div>
                </div>
              )}
            />
          ),
        },
        {
          id: "featured",
          label: "Proyecto destacado",
          content: (
            <SingletonEditor<HomeFeaturedProject>
              data={featured}
              fields={featuredFields}
              endpoint="/api/admin/home/featured"
              sectionTitle="Proyecto destacado del home"
              description="Aparece después del hero, antes de la sección de servicios."
              emptyDefaults={{ nombre: "Proyecto destacado" }}
            />
          ),
        },
        {
          id: "servicios",
          label: "Servicios destacados",
          count: servicios.length,
          content: (
            <ListCrudEditor<HomeServicioDestacado>
              items={servicios}
              fields={servicioFields}
              endpoint="/api/admin/home/servicios"
              emptyTemplate={{
                slug: "",
                nombre: "",
                subtitulo: null,
                descripcion: null,
                video: null,
                imagen: null,
                color: null,
                overlayColor: null,
                overlayOpacity: 0.4,
                hrefAncla: null,
                servicioSlug: null,
                orden: servicios.length,
                activo: true,
              }}
              addLabel="Agregar servicio destacado"
            />
          ),
        },
        {
          id: "clientes",
          label: "Clientes",
          content: (
            <SingletonEditor<HomeSeccionConfig>
              data={seccionConfig}
              sections={clientesSections}
              endpoint="/api/admin/home/seccion-config"
              sectionTitle="Franja de clientes"
              description="Copy de la sección de logos de clientes."
            />
          ),
        },
        {
          id: "contacto",
          label: "Contacto",
          content: (
            <SingletonEditor<HomeSeccionConfig>
              data={seccionConfig}
              sections={contactoSections}
              endpoint="/api/admin/home/seccion-config"
              sectionTitle="Bloque de contacto del home"
              description="Copy del bloque final de contacto. La info (teléfono, email, etc.) se gestiona en Contacto."
            />
          ),
        },
        {
          id: "orden",
          label: "Orden de secciones",
          content: <OrdenSeccionesEditor initial={ordenItems} />,
        },
      ]}
    />
  )
}
