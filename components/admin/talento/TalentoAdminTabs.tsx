"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { AdminTabsLayout, type AdminTab } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import { SingletonEditor } from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { CandidatoPanel } from "./CandidatoPanel"
import { CandidatosTab } from "./CandidatosTab"
import { InformesTalento, InformeVacanteBoton } from "./InformesTalento"
import { PipelineTab } from "./PipelineTab"
import { ReferidosTab } from "./ReferidosTab"
import { AvisoFlotante, TalentoProvider, useTalento } from "./TalentoStore"
import { VacantesTab } from "./VacantesTab"
import { ESTADOS_VACANTE, ETAPAS_ACTIVAS } from "./constants"
import type {
  CandidatoSer,
  CodigoReferidoSer,
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
  { name: "ciudad", label: "Ciudad", kind: "text", placeholder: "Jamundí, Popayán, Villa Rica…" },
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
  {
    name: "elegibleReferidos",
    label: "Elegible para el Programa de Referidos",
    kind: "boolean",
    hint: "El objetivo estratégico del programa es el personal operativo de planta (soldador, armador, ayudante y oficios similares) — actívalo solo en esas vacantes. El campo de código de referido en la web solo aparece y cuenta cuando aplica a una vacante marcada aquí.",
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
  {
    name: "criteriosEvaluacion",
    label: "Matriz de evaluación del cargo",
    kind: "objectArray",
    gridSpan: 2,
    collapsible: true,
    hint: "Lo define el jefe del área. Sin matriz, la IA improvisa qué pesa más en cada corrida y el criterio técnico del área no queda registrado. Los pesos son % y deberían sumar 100.",
    itemLabel: (item, i) =>
      item.nombre
        ? `${item.nombre as string} — ${item.peso ?? 0}%`
        : `Criterio ${String(i + 1).padStart(2, "0")}`,
    itemTemplate: { nombre: "", peso: 20, guia: "" },
    itemFields: [
      {
        name: "nombre",
        label: "Criterio",
        kind: "text",
        gridSpan: 2,
        required: true,
        placeholder: "Dibujo técnico y desarrollo de planos",
      },
      { name: "peso", label: "Peso (%)", kind: "number", min: 1, max: 100, step: 5 },
      {
        name: "guia",
        label: "Qué mirar (opcional)",
        kind: "textarea",
        gridSpan: 2,
        rows: 2,
        placeholder:
          "Vistas, cortes, secciones, acotación, organización del archivo CAD, criterio de detallado…",
        hint: "Le dice a la IA qué evidencia buscar en el CV para calificar este criterio.",
      },
    ],
  },
]

/*
 * Organización (oct-2026): el módulo gira alrededor de la VACANTE, que es como
 * trabaja Talento Humano («¿cómo va Proyectista y a quién llamo?»). Antes eran
 * 7 pestañas del mismo nivel calcadas de las tablas de la base de datos y para
 * responder eso había que saltar entre 3 o 4. Comparativos y Publicaciones
 * viven ahora dentro de la ficha de cada vacante; Perfiles, Referidos y
 * Configuración quedan como pestañas secundarias a la derecha.
 */
export function TalentoAdminTabs({
  vacantes,
  candidatos,
  postulaciones,
  publicaciones,
  comparativos,
  codigosReferido,
  config,
}: {
  vacantes: VacanteSer[]
  candidatos: CandidatoSer[]
  postulaciones: PostulacionSer[]
  publicaciones: PublicacionSer[]
  comparativos: ComparativoSer[]
  codigosReferido: CodigoReferidoSer[]
  config: ConfigTalentoSer | null
}) {
  return (
    <TalentoProvider
      vacantes={vacantes}
      candidatos={candidatos}
      postulaciones={postulaciones}
      publicaciones={publicaciones}
      comparativos={comparativos}
    >
      <Contenido codigosReferido={codigosReferido} config={config} />
      <CandidatoPanel />
      <AvisoFlotante />
    </TalentoProvider>
  )
}

function Contenido({
  codigosReferido,
  config,
}: {
  codigosReferido: CodigoReferidoSer[]
  config: ConfigTalentoSer | null
}) {
  const { vacantes, candidatos, postulaciones } = useTalento()
  const vigentes = vacantes.filter((v) => v.estado === "ABIERTA" || v.estado === "PAUSADA")
  const idsVigentes = new Set(vigentes.map((v) => v.id))

  const tabs: AdminTab[] = [
    {
      id: "vacantes",
      label: "Vacantes",
      count: vigentes.length,
      content: <VacantesTab />,
    },
    {
      id: "candidatos",
      label: "Hojas de vida",
      count: candidatos.length,
      content: <CandidatosTab />,
    },
    {
      id: "pipeline",
      label: "Pipeline",
      count: postulaciones.filter(
        (p) => ETAPAS_ACTIVAS.includes(p.etapa) && (!p.vacanteId || idsVigentes.has(p.vacanteId)),
      ).length,
      content: <PipelineTab />,
    },
    {
      id: "perfiles",
      label: "Crear y editar vacantes",
      secondary: true,
      content: <PerfilesTab />,
    },
    {
      id: "referidos",
      label: "Referidos",
      secondary: true,
      content: <ReferidosTab codigos={codigosReferido} />,
    },
    {
      id: "config",
      label: "Configuración",
      secondary: true,
      content: <ConfigTab config={config} />,
    },
  ]

  return (
    <AdminTabsLayout
      eyebrow="Operaciones"
      title="Talento Humano"
      description="Hojas de vida que llegan por la página web y por la carpeta de Drive de Talento Humano (se sincroniza cada hora en horario laboral)."
      actions={<InformesTalento vacantes={vacantes} />}
      tabs={tabs}
      defaultTab="vacantes"
      shallow
      keepParams={["vacante"]}
    />
  )
}

function PerfilesTab() {
  const { vacantes, setVacantes, param, navegar } = useTalento()
  // Se lee una sola vez: si quedara en la URL, volver a esta pestaña reabriría
  // el formulario aunque ya se hubiera guardado.
  const [editar] = useState(() => param("editar"))
  useEffect(() => {
    if (editar) navegar({ editar: null })
  }, [editar, navegar])

  return (
    <ListCrudEditor
      items={vacantes}
      fields={vacanteFields()}
      endpoint="/api/admin/talento/vacantes"
      initialEditId={editar || null}
      onItemsChange={(items) =>
        setVacantes((prev) => {
          const previas = new Map(prev.map((v) => [v.id, v]))
          return (items as VacanteSer[]).map((v) => ({
            ...previas.get(v.id),
            ...v,
            // El PUT no trae el conteo y devuelve fechas con hora.
            postulacionesCount: previas.get(v.id)?.postulacionesCount ?? v.postulacionesCount ?? 0,
            fechaPublicacion: v.fechaPublicacion ? String(v.fechaPublicacion).slice(0, 10) : null,
            fechaCierre: v.fechaCierre ? String(v.fechaCierre).slice(0, 10) : null,
          }))
        })
      }
      emptyTemplate={{
        titulo: "",
        estado: "BORRADOR",
        descripcion: "",
        requisitos: [],
        responsabilidades: [],
        beneficios: [],
        salarioVisible: false,
        elegibleReferidos: false,
      }}
      addLabel="Nueva vacante"
      emptyMessage="Crea la primera vacante. Recuerda registrarla también en el SPE desde su ficha (Publicación y SPE)."
      defaultView="table"
      canReorder
      tableColumns={[
        { key: "titulo", label: "Cargo" },
        { key: "area", label: "Área" },
        { key: "ciudad", label: "Ciudad" },
        { key: "estado", label: "Estado", className: "w-28" },
        { key: "elegibleReferidos", label: "Referidos", className: "w-24 text-center" },
        { key: "postulacionesCount", label: "Postulaciones", className: "w-28 text-center" },
      ]}
      rowActions={(v: VacanteSer) => (
        <span className="inline-flex items-center gap-1.5">
          <InformeVacanteBoton vacante={v} compacto />
          <button
            type="button"
            onClick={() => navegar({ tab: "vacantes", ver: v.id, sec: null }, { historial: true })}
            className="inline-flex items-center gap-0.5 border border-slate-300 bg-white px-2 py-1 font-lato text-[10px] font-bold uppercase tracking-wide text-slate-700 hover:border-slate-900"
          >
            Abrir
            <ChevronRight className="h-3 w-3" />
          </button>
        </span>
      )}
      filters={[{ key: "estado", label: "Estado", options: ESTADOS_VACANTE }]}
    />
  )
}

function ConfigTab({ config }: { config: ConfigTalentoSer | null }) {
  return (
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
              hint: "Enciende o apaga la página sin necesidad de deploy. También retira el enlace del pie de página y la banda de /contacto.",
            },
            {
              name: "emailNotificaciones",
              label: "Correos para avisos de postulaciones",
              kind: "text",
              placeholder: "talento.humano@meisa.com.co, coordinacion.th@meisa.com.co",
              hint: "Puedes poner varios separados por coma: a todos les llega el aviso de cada postulación.",
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
              label: "Retención de hojas de vida (meses)",
              kind: "number",
              min: 1,
              max: 60,
              hint: "Cumplido el plazo, las hojas de vida de candidatos no contratados y sin autorización de banco deben suprimirse (aviso en la pestaña Hojas de vida).",
            },
            {
              name: "textoConsentimiento",
              label: "Texto del consentimiento (checkbox del formulario público)",
              kind: "textarea",
              rows: 5,
              gridSpan: 2,
              hint: "Validar con el abogado laboral.",
            },
          ],
        },
      ]}
    />
  )
}
