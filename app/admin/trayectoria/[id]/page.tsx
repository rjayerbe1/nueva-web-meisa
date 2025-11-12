import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProyectoHojaVidaForm } from '@/components/admin/ProyectoHojaVidaForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Editar Proyecto | Admin',
  description: 'Editar proyecto de la hoja de vida'
}

async function getProyecto(id: string) {
  const proyecto = await prisma.proyectoHojaVida.findUnique({
    where: { id }
  })

  if (!proyecto) {
    return null
  }

  // Convertir Decimal a número para el formulario
  // Solo retornar las propiedades necesarias para el formulario
  return {
    id: proyecto.id,
    entidadContratante: proyecto.entidadContratante,
    objetoContrato: proyecto.objetoContrato,
    tituloDisplay: proyecto.tituloDisplay,
    descripcionSecundaria: proyecto.descripcionSecundaria,
    fechaInicio: proyecto.fechaInicio,
    fechaFin: proyecto.fechaFin,
    pesoKg: proyecto.pesoKg ? Number(proyecto.pesoKg) : null,
    areaM2: proyecto.areaM2 ? Number(proyecto.areaM2) : null,
    ubicacion: proyecto.ubicacion,
    departamento: proyecto.departamento,
    valorContrato: Number(proyecto.valorContrato),
    moneda: proyecto.moneda,
    imagenes: proyecto.imagenes as string[] | null,
    visible: proyecto.visible,
    destacado: proyecto.destacado,
    orden: proyecto.orden
  }
}

export default async function EditarProyectoPage({ params }: { params: { id: string } }) {
  const proyecto = await getProyecto(params.id)

  if (!proyecto) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/trayectoria">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Editar Proyecto
        </h1>
        <p className="text-slate-600 mt-1">
          {proyecto.entidadContratante} - {proyecto.objetoContrato}
        </p>
      </div>

      <ProyectoHojaVidaForm proyecto={proyecto} />
    </div>
  )
}
