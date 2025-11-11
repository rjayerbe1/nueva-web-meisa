import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProyectosHojaVidaList } from '@/components/admin/ProyectosHojaVidaList'

export const metadata: Metadata = {
  title: 'Proyectos Hoja de Vida | Admin',
  description: 'Gestión de proyectos de la hoja de vida corporativa'
}

export default function TrayectoriaAdminPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Proyectos Hoja de Vida
          </h1>
          <p className="text-slate-600 mt-1">
            Gestiona los proyectos que aparecen en la página de trayectoria
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/trayectoria/configuracion">
            <Button variant="outline">
              Configuración
            </Button>
          </Link>
          <Link href="/admin/trayectoria/nuevo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>
      </div>

      <ProyectosHojaVidaList />
    </div>
  )
}
