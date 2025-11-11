import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProyectoHojaVidaForm } from '@/components/admin/ProyectoHojaVidaForm'

export const metadata: Metadata = {
  title: 'Nuevo Proyecto | Admin',
  description: 'Crear nuevo proyecto para la hoja de vida'
}

export default function NuevoProyectoPage() {
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
          Nuevo Proyecto
        </h1>
        <p className="text-slate-600 mt-1">
          Agrega un nuevo proyecto a la hoja de vida corporativa
        </p>
      </div>

      <ProyectoHojaVidaForm />
    </div>
  )
}
