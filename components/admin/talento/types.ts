export type VacanteSer = {
  id: string
  slug: string
  titulo: string
  area: string | null
  ciudad: string | null
  modalidad: string | null
  descripcion: string
  requisitos: string[]
  responsabilidades: string[]
  beneficios: string[]
  tipoContrato: string | null
  jornada: string | null
  salarioMin: number | null
  salarioMax: number | null
  salarioVisible: boolean
  estado: string
  fechaPublicacion: string | null
  fechaCierre: string | null
  orden: number
  postulacionesCount: number
}

export type CandidatoSer = {
  id: string
  nombre: string
  email: string | null
  telefono: string | null
  ciudad: string | null
  cvPathGcs: string | null
  cvFileName: string | null
  origen: string | null
  origenDetalle: string | null
  consentimientoBanco: boolean
  notas: string | null
  createdAt: string
  postulaciones: {
    id: string
    etapa: string
    vacante: { id: string; titulo: string } | null
  }[]
}

export type PostulacionSer = {
  id: string
  candidatoId: string
  vacanteId: string | null
  etapa: string
  notasInternas: string | null
  scoreIA: number | null
  createdAt: string
  updatedAt: string
  candidato: {
    id: string
    nombre: string
    email: string | null
    telefono: string | null
    ciudad: string | null
    origen: string | null
    cvPathGcs: string | null
  }
  vacante: { id: string; titulo: string } | null
}

export type PublicacionSer = {
  id: string
  vacanteId: string
  vacanteTitulo?: string
  vacante?: { id: string; titulo: string } | null
  canal: string
  url: string | null
  referencia: string | null
  fechaPublicacion: string | null
  fechaCierre: string | null
  notas: string | null
}

export type ConfigTalentoSer = {
  id: string
  paginaPublicaActiva: boolean
  emailNotificaciones: string | null
  retencionMeses: number
  textoConsentimiento: string | null
}
