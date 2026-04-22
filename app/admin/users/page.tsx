import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UsersAdminClient from './UsersAdminClient'

export const dynamic = 'force-dynamic'

export default async function UsersAdminPage() {
  // Solo ADMIN puede entrar aquí (el admin/layout ya bloquea VIEWER).
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    redirect('/admin')
  }

  // SSR: fetch inicial de usuarios para eliminar skeleton
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <UsersAdminClient
      initialUsers={JSON.parse(JSON.stringify(users))}
      currentUserId={session.user.id}
    />
  )
}
