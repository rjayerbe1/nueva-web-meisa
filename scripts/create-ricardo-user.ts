import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'rjayerbe@meisa.com.co'
  const password = 'meisa2025'
  const name = 'Ricardo Ayerbe'

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('✅ Usuario ya existe:', email)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    }
  })

  console.log('✅ Usuario creado exitosamente!')
  console.log('   Email:', user.email)
  console.log('   Nombre:', user.name)
  console.log('   Role:', user.role)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
