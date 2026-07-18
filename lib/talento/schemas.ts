import { z } from "zod"
import { EstadoVacante, EtapaPostulacion } from "@prisma/client"
import { zNullableDate, zNullableInt, zNullableString } from "@/lib/admin/zod-helpers"
import { normalizarNombre } from "./nombres"

export const vacanteSchema = z.object({
  titulo: z.string().min(1),
  area: zNullableString.optional(),
  ciudad: zNullableString.optional(),
  modalidad: zNullableString.optional(),
  descripcion: z.string().default(""),
  requisitos: z.array(z.string()).optional(),
  responsabilidades: z.array(z.string()).optional(),
  beneficios: z.array(z.string()).optional(),
  tipoContrato: zNullableString.optional(),
  jornada: zNullableString.optional(),
  salarioMin: zNullableInt.optional(),
  salarioMax: zNullableInt.optional(),
  salarioVisible: z.boolean().optional(),
  estado: z.nativeEnum(EstadoVacante).optional(),
  fechaPublicacion: zNullableDate.optional(),
  fechaCierre: zNullableDate.optional(),
  orden: z.coerce.number().int().optional(),
})

export const candidatoSchema = z.object({
  nombre: z.string().min(1).transform(normalizarNombre),
  email: zNullableString.optional(),
  telefono: zNullableString.optional(),
  ciudad: zNullableString.optional(),
  cvPathGcs: zNullableString.optional(),
  cvFileName: zNullableString.optional(),
  cvContentType: zNullableString.optional(),
  cvSize: zNullableInt.optional(),
  origen: zNullableString.optional(),
  origenDetalle: zNullableString.optional(),
  areaInteres: zNullableString.optional(),
  consentimientoBanco: z.boolean().optional(),
  consentimientoVia: zNullableString.optional(),
  notas: zNullableString.optional(),
})

export const postulacionCreateSchema = z.object({
  candidatoId: z.string().min(1),
  vacanteId: zNullableString.optional(),
  etapa: z.nativeEnum(EtapaPostulacion).optional(),
  notasInternas: zNullableString.optional(),
})

export const postulacionUpdateSchema = z.object({
  etapa: z.nativeEnum(EtapaPostulacion).optional(),
  vacanteId: zNullableString.optional(),
  notasInternas: z.preprocess(
    (v) => (v === undefined ? undefined : v === "" ? null : v),
    z.string().nullable().optional(),
  ),
  scoreIA: zNullableInt.optional(),
})

export const publicacionSchema = z.object({
  vacanteId: z.string().min(1),
  canal: z.string().min(1),
  url: zNullableString.optional(),
  referencia: zNullableString.optional(),
  fechaPublicacion: zNullableDate.optional(),
  fechaCierre: zNullableDate.optional(),
  notas: zNullableString.optional(),
})

export const configTalentoSchema = z.object({
  paginaPublicaActiva: z.boolean().optional(),
  emailNotificaciones: zNullableString.optional(),
  retencionMeses: z.coerce.number().int().min(1).max(60).optional(),
  textoConsentimiento: zNullableString.optional(),
})

export function makeVacanteSlug(titulo: string): string {
  const base = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || "vacante"}-${suffix}`
}
