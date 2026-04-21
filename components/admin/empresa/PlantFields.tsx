import type { Plant } from "@prisma/client"
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { Badge } from "@/components/ui/badge"

export const PLANT_FIELDS: FieldDef[] = [
  { name: "slug", label: "Slug (único)", kind: "text", required: true, placeholder: "jamundi" },
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  {
    name: "tipo",
    label: "Tipo",
    kind: "text",
    placeholder: "Planta principal / Planta satélite",
  },
  { name: "ubicacion", label: "Ubicación", kind: "text", required: true, placeholder: "Zona franca" },
  { name: "ciudad", label: "Ciudad", kind: "text" },
  { name: "departamento", label: "Departamento", kind: "text" },
  {
    name: "descripcion",
    label: "Descripción",
    kind: "textarea",
    rows: 2,
    gridSpan: 2,
  },
  { name: "areaM2", label: "Área (m²)", kind: "number", min: 0 },
  { name: "naves", label: "Naves", kind: "number", min: 0 },
  { name: "capacidadGruaTon", label: "Capacidad grúa (ton)", kind: "number", min: 0 },
  { name: "mesasCnc", label: "Mesas CNC", kind: "number", min: 0 },
  {
    name: "equipamientoAdicional",
    label: "Equipamiento adicional",
    kind: "stringArray",
    gridSpan: 2,
    placeholder: "Ej: Grúa pórtico 20 ton",
  },
  { name: "telefono", label: "Teléfono", kind: "text" },
  { name: "email", label: "Email", kind: "text" },
  { name: "horario", label: "Horario", kind: "text", gridSpan: 2 },
  {
    name: "googleMapsUrl",
    label: "URL Google Maps (link público)",
    kind: "url",
    gridSpan: 2,
  },
  {
    name: "mapEmbedUrl",
    label: "URL embed del mapa (iframe src)",
    kind: "url",
    gridSpan: 2,
  },
  { name: "lat", label: "Latitud", kind: "number", step: 0.00001 },
  { name: "lng", label: "Longitud", kind: "number", step: 0.00001 },
  { name: "imagen", label: "Imagen", kind: "image", gridSpan: 2 },
  {
    name: "colorGradient",
    label: "Gradiente de color",
    kind: "color",
    placeholder: "from-blue-600 to-blue-700",
  },
  { name: "esSedePrincipal", label: "Es sede principal", kind: "boolean" },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "activo", label: "Activo", kind: "boolean" },
]

export function plantTemplate(nextOrden: number): Omit<Partial<Plant>, "id"> {
  return {
    slug: "",
    nombre: "",
    tipo: null,
    ubicacion: "",
    ciudad: null,
    departamento: null,
    areaM2: null,
    naves: null,
    capacidadGruaTon: null,
    mesasCnc: null,
    equipamientoAdicional: [],
    telefono: null,
    email: null,
    horario: null,
    googleMapsUrl: null,
    mapEmbedUrl: null,
    lat: null,
    lng: null,
    imagen: null,
    descripcion: null,
    colorGradient: null,
    orden: nextOrden,
    activo: true,
    esSedePrincipal: false,
  }
}

export function PlantPreview({ plant }: { plant: Plant }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{plant.nombre}</span>
        {plant.esSedePrincipal && (
          <Badge className="bg-blue-600 text-white text-xs">Principal</Badge>
        )}
        {!plant.activo && (
          <Badge variant="outline" className="text-xs">
            Inactiva
          </Badge>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {plant.ciudad || plant.ubicacion}
        {plant.departamento ? `, ${plant.departamento}` : ""}
        {plant.areaM2 ? ` · ${plant.areaM2.toLocaleString()} m²` : ""}
      </p>
    </div>
  )
}
