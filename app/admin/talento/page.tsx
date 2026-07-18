import { prisma } from "@/lib/prisma"
import { TalentoAdminTabs } from "@/components/admin/talento/TalentoAdminTabs"
import type {
  CandidatoSer,
  ComparativoSer,
  PostulacionSer,
  PublicacionSer,
  VacanteSer,
} from "@/components/admin/talento/types"

export const dynamic = "force-dynamic"
export const revalidate = 0

const dateOnly = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null)

async function getData() {
  const [vacantesRaw, candidatosRaw, postulacionesRaw, publicacionesRaw, comparativosRaw, config] =
    await Promise.all([
      prisma.vacante.findMany({
        orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
        include: { _count: { select: { postulaciones: true } } },
      }),
      prisma.candidato.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          postulaciones: {
            select: {
              id: true,
              etapa: true,
              vacante: { select: { id: true, titulo: true } },
            },
          },
        },
      }),
      prisma.postulacion.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          candidato: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              ciudad: true,
              origen: true,
              cvPathGcs: true,
            },
          },
          vacante: { select: { id: true, titulo: true } },
        },
      }),
      prisma.publicacionVacante.findMany({
        orderBy: { createdAt: "desc" },
        include: { vacante: { select: { id: true, titulo: true } } },
      }),
      prisma.comparativoVacante.findMany({
        orderBy: { createdAt: "desc" },
        include: { vacante: { select: { id: true, titulo: true } } },
      }),
      prisma.configuracionTalento.upsert({
        where: { id: "default" },
        create: { id: "default" },
        update: {},
      }),
    ])

  const vacantes: VacanteSer[] = vacantesRaw.map((v) => ({
    id: v.id,
    slug: v.slug,
    titulo: v.titulo,
    area: v.area,
    ciudad: v.ciudad,
    modalidad: v.modalidad,
    descripcion: v.descripcion,
    requisitos: v.requisitos,
    responsabilidades: v.responsabilidades,
    beneficios: v.beneficios,
    tipoContrato: v.tipoContrato,
    jornada: v.jornada,
    salarioMin: v.salarioMin,
    salarioMax: v.salarioMax,
    salarioVisible: v.salarioVisible,
    estado: v.estado,
    fechaPublicacion: dateOnly(v.fechaPublicacion),
    fechaCierre: dateOnly(v.fechaCierre),
    orden: v.orden,
    postulacionesCount: v._count.postulaciones,
  }))

  const candidatos: CandidatoSer[] = candidatosRaw.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    email: c.email,
    telefono: c.telefono,
    ciudad: c.ciudad,
    cvPathGcs: c.cvPathGcs,
    cvFileName: c.cvFileName,
    origen: c.origen,
    origenDetalle: c.origenDetalle,
    areaInteres: c.areaInteres,
    consentimientoBanco: c.consentimientoBanco,
    notas: c.notas,
    resumenIA: c.resumenIA,
    datosIA: c.datosIA,
    createdAt: c.createdAt.toISOString(),
    postulaciones: c.postulaciones,
  }))

  const postulaciones: PostulacionSer[] = postulacionesRaw.map((p) => ({
    id: p.id,
    candidatoId: p.candidatoId,
    vacanteId: p.vacanteId,
    etapa: p.etapa,
    notasInternas: p.notasInternas,
    scoreIA: p.scoreIA,
    matchIA: p.matchIA,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    candidato: p.candidato,
    vacante: p.vacante,
  }))

  const publicaciones: PublicacionSer[] = publicacionesRaw.map((p) => ({
    id: p.id,
    vacanteId: p.vacanteId,
    vacanteTitulo: p.vacante?.titulo,
    canal: p.canal,
    url: p.url,
    referencia: p.referencia,
    fechaPublicacion: dateOnly(p.fechaPublicacion),
    fechaCierre: dateOnly(p.fechaCierre),
    notas: p.notas,
  }))

  const comparativos: ComparativoSer[] = comparativosRaw.map((c) => ({
    id: c.id,
    vacanteId: c.vacanteId,
    vacanteTitulo: c.vacante?.titulo ?? "",
    resultados: c.resultados as ComparativoSer["resultados"],
    creadoPor: c.creadoPor,
    createdAt: c.createdAt.toISOString(),
  }))

  return { vacantes, candidatos, postulaciones, publicaciones, comparativos, config }
}

export default async function TalentoAdminPage() {
  const { vacantes, candidatos, postulaciones, publicaciones, comparativos, config } =
    await getData()
  return (
    <TalentoAdminTabs
      vacantes={vacantes}
      candidatos={candidatos}
      postulaciones={postulaciones}
      publicaciones={publicaciones}
      comparativos={comparativos}
      config={config}
    />
  )
}
