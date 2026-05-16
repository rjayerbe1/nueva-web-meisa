import { prisma } from '@/lib/prisma'
import ClientesAdminClient from './ClientesAdminClient'

export const dynamic = 'force-dynamic'

export default async function ClientesAdminPage() {
  // SSR: fetch inicial para eliminar el skeleton "Cargando..."
  const clientes = await prisma.cliente.findMany({
    where: { activo: true },
    orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
  })

  return <ClientesAdminClient initialClientes={JSON.parse(JSON.stringify(clientes))} />
}
