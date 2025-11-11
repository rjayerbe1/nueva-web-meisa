import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfiguracionTrayectoriaForm } from '@/components/admin/ConfiguracionTrayectoriaForm'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Configuración Trayectoria | Admin',
  description: 'Configurar información corporativa de la página de trayectoria'
}

async function getConfiguracion() {
  const config = await prisma.configuracionTrayectoria.findFirst()
  return config
}

export default async function ConfiguracionTrayectoriaPage() {
  const configuracion = await getConfiguracion()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/trayectoria">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a proyectos
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Configuración de Trayectoria
        </h1>
        <p className="text-slate-600 mt-1">
          Edita la información corporativa que aparece en la página de trayectoria
        </p>
      </div>

      <ConfiguracionTrayectoriaForm configuracion={configuracion} />
    </div>
  )
}
