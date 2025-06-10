import { Metadata } from 'next'
import PaginasPageClient from '@/components/admin/PaginasPageClient'

export const metadata: Metadata = {
  title: 'Páginas | Panel de Administración',
  description: 'Gestión de páginas del sitio web',
}

export default function PaginasPage() {
  return <PaginasPageClient />
}