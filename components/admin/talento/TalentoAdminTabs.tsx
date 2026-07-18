"use client"

import { AdminTabsLayout, type AdminTab } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import { SingletonEditor } from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { CandidatosTab } from "./CandidatosTab"
import { ComparativosTab } from "./ComparativosTab"
import { PipelineTab } from "./PipelineTab"
import { VacanteIAPanel } from "./VacanteIAPanel"
import { CANALES_PUBLICACION, ESTADOS_VACANTE } from "./constants"
import type {
  CandidatoSer,
  ComparativoSer,
  ConfigTalentoSer,
  PostulacionSer,
  PublicacionSer,
  VacanteSer,
} from "./types"

const vacanteFields = (): FieldDef[] => [
  { name: "titulo", label: "Cargo / título de la vacante", kind: "text", required: true },
  { name: "estado", label: "Estado", kind: "select", options: ESTADOS_VACANTE },
  {
    name: "area",
    label: "Área",
    kind: "text",
    placeholder: "Producción, Montaje, Ingeniería…",
  },
  { name: "ciudad", label: "Ciudad", kind: "text", placeholder: "Jamundí, Cali…" },
  {
    name: "modalidad",
    label: "Modalidad",
    kind: "select",
    options: [
      { value: "", label: "Sin definir" },
      { value: "presencial", label: "Presencial" },
      { value: "hibrido", label: "Híbrido" },
      { value: "remoto", label: "Remoto" },
    ],
  },
  {
    name: "tipoContrato",
    label: "Tipo de contrato",
    kind: "select",
    options: [
      { value: "", label: "Sin definir" },
      { value: "indefinido", label: "Término indefinido" },
      { value: "fijo", label: "Término fijo" },
      { value: "obra-labor", label: "Obra o labor" },
      { value: "aprendizaje", label: "Contrato de aprendizaje" },
    ],
    hint: "La reforma laboral (Ley 2466/2025) hace del término indefinido la regla general.",
  },
  {
    name: "jornada",
    label: "Jornada (Google for Jobs)",
    kind: "select",
    options: [
      { value: "", label: "Sin definir" },
      { value: "FULL_TIME", label: "Tiempo completo" },
      { value: "PART_TIME", label: "Medio tiempo" },
      { value: "TEMPORARY", label: "Temporal" },
      { value: "CONTRACTOR", label: "Contratista" },
      { value: "INTERN", label: "Práctica / aprendiz" },
    ],
  },
  {
    name: "salarioMin",
    label: "Salario desde (COP/mes)",
    kind: "number",
    min: 0,
    step: 100000,
    hint: "Obligatorio informarlo al registrar la vacante en el SPE.",
  },
  { name: "salarioMax", label: "Salario hasta (COP/mes)", kind: "number", min: 0, step: 100000 },
  {
    name: "salarioVisible",
    label: "Mostrar salario cuando la página sea pública",
    kind: "boolean",
  },
  { name: "fechaPublicacion", label: "Fecha de apertura", kind: "date" },
  {
    name: "fechaCierre",
    label: "Fecha de cierre",
    kind: "date",
    hint: "Será el validThrough de Google for Jobs cuando la página sea pública.",
  },
  {
    name: "descripcion",
    label: "Descripción del cargo",
    kind: "textarea",
    rows: 5,
    gridSpan: 2,
  },
  {
    name: "requisitos",
    label: "Requisitos",
    kind: "stringArray",
    gridSpan: 2,
    hint: "Solo méritos: experiencia, formación, certificaciones. Nunca edad, sexo, estado civil ni libreta militar (Ley 931/2004, Ley 1861/2017).",
  },
  { name: "responsabilidades", label: "Responsabilidades", kind: "stringArray", gridSpan: 2 },
  { name: "beneficios", label: "Beneficios", kind: "stringArray", gridSpan: 2 },
]

const publicacionFields = (vacantes: VacanteSer[]): FieldDef[] => [
  {
    name: "vacanteId",
    label: "Vacante",
    kind: "select",
    required: true,
    options: vacantes.map((v) => ({ value: v.id, label: v.titulo })),
  },
  {
    name: "canal",
    label: "Canal",
    kind: "select",
    required: true,
    options: CANALES_PUBLICACION,
    hint: "El registro en un prestador del SPE (SENA o caja de compensación) es obligatorio dentro de los 10 días hábiles — esta fila es tu constancia.",
  },
  { name: "url", label: "URL de la publicación", kind: "url" },
  { name: "referencia", label: "Referencia / código del prestador", kind: "text" },
  { name: "fechaPublicacion", label: "Fecha de publicación", kind: "date" },
  { name: "fechaCierre", label: "Fecha de cierre", kind: "date" },
  { name: "notas", label: "Notas", kind: "textarea", gridSpan: 2, rows: 2 },
]

export function TalentoAdminTabs({
  vacantes,
  candidatos,
  postulaciones,
  publicaciones,
  comparativos,
  config,
}: {
  vacantes: VacanteSer[]
  candidatos: CandidatoSer[]
  postulaciones: PostulacionSer[]
  publicaciones: PublicacionSer[]
  comparativos: ComparativoSer[]
  config: ConfigTalentoSer | null
}) {
  const tabs: AdminTab[] = [
    {
      id: "pipeline",
      label: "Pipeline",
      count: postulaciones.filter((p) => !["CONTRATADA", "DESCARTADA"].includes(p.etapa)).length,
      content: <PipelineTab postulaciones={postulaciones} vacantes={vacantes} />,
    },
    {
      id: "candidatos",
      label: "Candidatos",
      count: candidatos.length,
      content: <CandidatosTab candidatos={candidatos} vacantes={vacantes} />,
    },
    {
      id: "vacantes",
      label: "Vacantes",
      count: vacantes.length,
      content: (
        <ListCrudEditor
          items={vacantes}
          fields={vacanteFields()}
          endpoint="/api/admin/talento/vacantes"
          emptyTemplate={{
            titulo: "",
            estado: "BORRADOR",
            descripcion: "",
            requisitos: [],
            responsabilidades: [],
            beneficios: [],
            salarioVisible: false,
          }}
          addLabel="Nueva vacante"
          emptyMessage="Crea la primera vacante. Recuerda registrarla también en el SPE (pestaña Publicaciones)."
          defaultView="table"
          canReorder
          tableColumns={[
            { key: "titulo", label: "Cargo" },
            { key: "area", label: "Área" },
            { key: "ciudad", label: "Ciudad" },
            { key: "estado", label: "Estado", className: "w-28" },
            { key: "postulacionesCount", label: "Postulaciones", className: "w-28 text-center" },
          ]}
          filters={[
            {
              key: "estado",
              label: "Estado",
              options: ESTADOS_VACANTE,
            },
          ]}
        />
      ),
    },
    {
      id: "comparativos",
      label: "Comparativos",
      count: comparativos.length,
      content: (
        <ComparativosTab
          vacantes={vacantes}
          candidatos={candidatos}
          comparativos={comparativos}
        />
      ),
    },
    {
      id: "publicaciones",
      label: "Publicaciones",
      count: publicaciones.length,
      content: (
        <div className="space-y-4">
          <VacanteIAPanel vacantes={vacantes} />
          <ListCrudEditor
            items={publicaciones}
            fields={publicacionFields(vacantes)}
            endpoint="/api/admin/talento/publicaciones"
            emptyTemplate={{ canal: "", url: "", referencia: "", notas: "" }}
            addLabel="Registrar publicación"
            emptyMessage="Registra aquí en qué canales se publicó cada vacante (SPE, Magneto, Computrabajo…). La fila del canal SPE documenta el cumplimiento legal."
            defaultView="table"
            canReorder={false}
            tableColumns={[
              { key: "vacanteTitulo", label: "Vacante" },
              { key: "canal", label: "Canal" },
              { key: "referencia", label: "Referencia" },
              { key: "fechaPublicacion", label: "Publicada", className: "w-28" },
            ]}
            renderPreview={(item: any) => (
              <div className="min-w-0">
                <span className="truncate font-bebas text-base uppercase tracking-wide text-slate-950">
                  {item.canal || "(canal)"}
                </span>
                <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
                  {item.vacanteTitulo ?? item.vacante?.titulo ?? ""}
                </p>
              </div>
            )}
          />
        </div>
      ),
    },
    {
      id: "config",
      label: "Configuración",
      content: (
        <SingletonEditor
          data={config}
          endpoint="/api/admin/talento/config"
          sections={[
            {
              id: "publica",
              title: "Página pública",
              description:
                "El switch de lanzamiento. Mientras esté apagado, todo el módulo es interno: nada se ve fuera del admin.",
              fields: [
                {
                  name: "paginaPublicaActiva",
                  label: "Activar /trabaja-con-nosotros (página pública)",
                  kind: "boolean",
                  hint: "La página pública se construirá en la siguiente etapa; este switch la encenderá sin necesidad de deploy. Déjalo apagado hasta validar la política de datos con jurídica.",
                },
                {
                  name: "emailNotificaciones",
                  label: "Correo para avisos de postulaciones",
                  kind: "text",
                  placeholder: "talentohumano@meisa.com.co",
                },
              ],
            },
            {
              id: "habeasdata",
              title: "Habeas data",
              description:
                "Retención y consentimiento según Ley 1581 de 2012. El plazo aplica a candidatos sin autorización de banco de talento.",
              fields: [
                {
                  name: "retencionMeses",
                  label: "Retención de CVs (meses)",
                  kind: "number",
                  min: 1,
                  max: 60,
                  hint: "Cumplido el plazo, los CVs de candidatos no contratados y sin autorización de banco deben suprimirse (la purga automática llega en la Etapa 2).",
                },
                {
                  name: "textoConsentimiento",
                  label: "Texto del consentimiento (checkbox del formulario público)",
                  kind: "textarea",
                  rows: 5,
                  gridSpan: 2,
                  hint: "Validar con el abogado laboral antes de encender la página pública.",
                },
              ],
            },
          ]}
        />
      ),
    },
  ]

  return (
    <AdminTabsLayout
      eyebrow="Operaciones"
      title="Talento Humano"
      description="Vacantes, banco de hojas de vida y pipeline de selección. Fase interna: los CVs se cargan aquí manualmente y las vacantes se publican por fuera (SPE, bolsas de empleo)."
      tabs={tabs}
    />
  )
}
