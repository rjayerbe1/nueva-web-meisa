"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { SingletonEditor } from "./shared/SingletonEditor"
import type { FieldDef } from "./shared/FormFields"

interface DocData {
  titulo: string
  descripcion: string | null
  pdfUrl: string | null
  publicado: boolean
  activo: boolean
}

interface Props {
  politica: DocData | null
  sagrilaft: DocData | null
}

const fields: FieldDef[] = [
  {
    name: "titulo",
    label: "Título",
    kind: "text",
    placeholder: "Política de Tratamiento de Datos",
    gridSpan: 2,
  },
  {
    name: "descripcion",
    label: "Descripción (opcional)",
    kind: "textarea",
    rows: 2,
    gridSpan: 2,
  },
  {
    name: "pdfUrl",
    label: "PDF",
    kind: "document",
    required: true,
    gridSpan: 2,
    hint: "Sube el PDF a la biblioteca o pega una URL. Se mostrará como flipbook.",
  },
  {
    name: "publicado",
    label: "Publicado",
    kind: "boolean",
    hint: "Si está apagado, la URL pública devuelve 404.",
  },
  {
    name: "activo",
    label: "Activo",
    kind: "boolean",
    hint: "Apaga para esconder sin borrar.",
  },
]

export function DocumentosInstitucionalesEditor({ politica, sagrilaft }: Props) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Contenido del sitio
          </p>
          <h1 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
            Documentos institucionales
          </h1>
          <p className="mt-2 max-w-2xl font-lato text-sm text-slate-600">
            PDFs que aparecen en el footer del sitio (Política de Datos y SAGRILAFT). Se muestran
            como flipbook a pantalla completa.
          </p>
        </div>
      </div>

      <DocSlot
        eyebrow="Footer · Política de Datos"
        publicUrl="/politica-datos"
        publicado={politica?.publicado ?? false}
        activo={politica?.activo ?? false}
        hasPdf={Boolean(politica?.pdfUrl)}
      >
        <SingletonEditor
          data={politica}
          endpoint="/api/admin/documentos-institucionales/politica"
          emptyDefaults={{
            titulo: "Política de Tratamiento de Datos",
            descripcion: null,
            pdfUrl: null,
            publicado: false,
            activo: true,
          }}
          fields={fields}
        />
      </DocSlot>

      <DocSlot
        eyebrow="Footer · SAGRILAFT"
        publicUrl="/sagrilaft"
        publicado={sagrilaft?.publicado ?? false}
        activo={sagrilaft?.activo ?? false}
        hasPdf={Boolean(sagrilaft?.pdfUrl)}
      >
        <SingletonEditor
          data={sagrilaft}
          endpoint="/api/admin/documentos-institucionales/sagrilaft"
          emptyDefaults={{
            titulo: "Manual SAGRILAFT",
            descripcion: null,
            pdfUrl: null,
            publicado: false,
            activo: true,
          }}
          fields={fields}
        />
      </DocSlot>
    </div>
  )
}

function DocSlot({
  eyebrow,
  publicUrl,
  publicado,
  activo,
  hasPdf,
  children,
}: {
  eyebrow: string
  publicUrl: string
  publicado: boolean
  activo: boolean
  hasPdf: boolean
  children: React.ReactNode
}) {
  const isLive = publicado && activo && hasPdf
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 font-lato text-[11px] font-bold uppercase tracking-wider ${
              isLive ? "text-green-700" : "text-slate-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isLive ? "bg-green-500" : "bg-slate-300"}`}
            />
            {isLive ? "En vivo" : "No publicado"}
          </span>
          {isLive && (
            <Link
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-red-600 hover:underline"
            >
              {publicUrl}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
