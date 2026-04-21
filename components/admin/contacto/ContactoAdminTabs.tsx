"use client"

import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { ListCrudEditor } from "@/components/admin/shared/ListCrudEditor"
import { SingletonEditor, type SingletonSection } from "@/components/admin/shared/SingletonEditor"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { PLANT_FIELDS, plantTemplate, PlantPreview } from "@/components/admin/empresa/PlantFields"
import type { ConfiguracionContacto, FormOption, Plant } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface Props {
  config: ConfiguracionContacto | null
  formOptions: FormOption[]
  plantas: Plant[]
}

const configSections: SingletonSection[] = [
  {
    id: "comunicacion",
    title: "Teléfonos y email",
    description: "Canales directos mostrados en la página Contacto y en el Footer.",
    fields: [
      { name: "pbx", label: "PBX", kind: "text", placeholder: "+57 602 XXX XXXX" },
      { name: "movil", label: "Móvil", kind: "text", placeholder: "+57 3XX XXX XXXX" },
      { name: "email", label: "Email", kind: "text", placeholder: "info@meisa.com.co" },
      { name: "whatsappNumero", label: "WhatsApp", kind: "text", placeholder: "573XXXXXXXXX (sin +)" },
    ],
  },
  {
    id: "horarios",
    title: "Horarios y dirección",
    description: "Horario de atención y ubicación administrativa principal.",
    fields: [
      { name: "horarioSemana", label: "Horario semana", kind: "text", placeholder: "Lun–Vie 7:00am – 5:00pm" },
      { name: "horarioSabado", label: "Horario sábado", kind: "text", placeholder: "Sáb 7:00am – 12:00m" },
      { name: "direccionLinea1", label: "Dirección — línea 1", kind: "text", gridSpan: 2 },
      { name: "direccionLinea2", label: "Dirección — línea 2", kind: "text", gridSpan: 2 },
    ],
  },
]

const formOptionFields: FieldDef[] = [
  {
    name: "grupo",
    label: "Grupo",
    kind: "select",
    required: true,
    options: [
      { value: "TIPO_PROYECTO", label: "Tipo de proyecto" },
      { value: "SERVICIO_CONTACTO", label: "Servicio (formulario contacto)" },
    ],
  },
  { name: "valor", label: "Valor técnico", kind: "text", required: true, placeholder: "estructura-edificacion" },
  { name: "label", label: "Etiqueta mostrada", kind: "text", required: true, gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function ContactoAdminTabs({ config, formOptions, plantas }: Props) {
  return (
    <AdminTabsLayout
      title="Contacto"
      description="Datos de contacto, opciones del formulario y plantas mostradas en /contacto."
      tabs={[
        {
          id: "config",
          label: "Datos generales",
          content: (
            <SingletonEditor<ConfiguracionContacto>
              data={config}
              sections={configSections}
              endpoint="/api/admin/contacto/config"
              sectionTitle="Información de contacto"
              description="Aparece en /contacto y en el Footer."
            />
          ),
        },
        {
          id: "form-options",
          label: "Opciones de formulario",
          count: formOptions.length,
          content: (
            <ListCrudEditor<FormOption>
              items={formOptions}
              fields={formOptionFields}
              endpoint="/api/admin/contacto/form-options"
              emptyTemplate={{
                grupo: "TIPO_PROYECTO",
                valor: "",
                label: "",
                orden: 0,
                activo: true,
              }}
              addLabel="Agregar opción"
              renderPreview={(o) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {o.grupo}
                    </Badge>
                    <span className="font-medium text-gray-900">{o.label}</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-gray-500">{o.valor}</div>
                </div>
              )}
            />
          ),
        },
        {
          id: "plantas",
          label: "Plantas",
          count: plantas.length,
          content: (
            <ListCrudEditor<Plant>
              items={plantas}
              fields={PLANT_FIELDS}
              endpoint="/api/admin/plantas"
              emptyTemplate={plantTemplate(plantas.length)}
              addLabel="Agregar planta"
              renderPreview={(p) => <PlantPreview plant={p} />}
            />
          ),
        },
      ]}
    />
  )
}
