import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@meisa.com.co'
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Administrador MEISA',
        role: 'ADMIN',
      },
    })

    console.log('✅ Usuario administrador creado/actualizado:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Rol: ${user.role}`)
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()