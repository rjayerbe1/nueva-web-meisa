import { Metadata } from 'next'
import { TrayectoriaClient } from './TrayectoriaClient'

export const metadata: Metadata = {
  title: 'Nuestra Trayectoria | MEISA',
  description: '29 años construyendo Colombia. Conoce los proyectos más importantes que hemos desarrollado desde 1996.',
}

async function getProyectos() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/trayectoria/proyectos?soloVisibles=true`, {
    cache: 'no-store'
  })

  if (!res.ok) return []
  return res.json()
}

async function getStats() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/trayectoria/stats`, {
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}

export default async function TrayectoriaPage() {
  const [proyectos, stats] = await Promise.all([
    getProyectos(),
    getStats()
  ])

  return <TrayectoriaClient proyectos={proyectos} stats={stats} />
}
