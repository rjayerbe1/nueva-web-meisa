import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.user.update({
    where: { email: 'rjayerbe@meisa.com.co' },
    data: { name: 'Roberto José Ayerbe Otoya' },
  })
  console.log('✅ Actualizado:', updated.email, '→', updated.name)
}

main().finally(() => prisma.$disconnect())
