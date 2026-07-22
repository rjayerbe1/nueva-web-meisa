import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'nomina@meisa.com.co'
  const password = 'Talento2026!'
  const name = 'Edith Patricia Chates Ramírez'

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: 'EDITOR',
      restrictedToTalento: true,
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'EDITOR',
      restrictedToTalento: true,
    },
  })

  console.log('✅ Usuario listo:', user.email, '| role:', user.role, '| restrictedToTalento:', user.restrictedToTalento)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
