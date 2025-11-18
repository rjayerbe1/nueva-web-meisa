import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Get all distinct categories
    const projects = await prisma.proyecto.findMany({
      select: {
        id: true,
        titulo: true,
        categoria: true
      }
    })

    console.log('Projects in database:')
    projects.forEach(p => {
      console.log(`- ${p.titulo}: ${p.categoria} (${typeof p.categoria})`)
    })

    // Get distinct categories
    const distinctCategories = [...new Set(projects.map(p => p.categoria))]
    console.log('\nDistinct categories:', distinctCategories)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
