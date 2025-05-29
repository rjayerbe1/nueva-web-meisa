import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkUser() {
  console.log('🔍 Verificando usuario administrador...')

  const user = await prisma.user.findUnique({
    where: { email: 'admin@meisa.com.co' }
  })

  if (user) {
    console.log('✅ Usuario encontrado:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password
    })

    // Verificar que la contraseña funciona
    if (user.password) {
      const isValid = await bcrypt.compare('admin123', user.password)
      console.log('🔐 Contraseña válida:', isValid)
    }
  } else {
    console.log('❌ Usuario no encontrado')
    
    // Crear el usuario
    console.log('🆕 Creando usuario administrador...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const newUser = await prisma.user.create({
      data: {
        email: 'admin@meisa.com.co',
        name: 'Administrador MEISA',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    
    console.log('✅ Usuario creado:', newUser.email)
  }

  // Verificar proyectos
  const projectCount = await prisma.proyecto.count()
  console.log('📊 Proyectos en BD:', projectCount)
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect())