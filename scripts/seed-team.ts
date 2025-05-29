import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function seedTeam() {
  try {
    // Crear miembros del equipo de ejemplo
    const teamMembers = [
      {
        nombre: 'Carlos Eduardo Martínez',
        cargo: 'Gerente General',
        bio: 'Ingeniero Civil con más de 20 años de experiencia en el sector de estructuras metálicas. Especialista en gestión de proyectos de gran envergadura y desarrollo de estrategias empresariales.',
        foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        email: 'carlos.martinez@meisa.com.co',
        telefono: '+57 300 123 4567',
        linkedin: 'https://linkedin.com/in/carlos-martinez-meisa',
        orden: 1
      },
      {
        nombre: 'Ana María González',
        cargo: 'Directora Técnica',
        bio: 'Ingeniera Estructural con especialización en diseño de estructuras metálicas. Magíster en Ingeniería Estructural con experiencia en proyectos industriales y comerciales.',
        foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        email: 'ana.gonzalez@meisa.com.co',
        telefono: '+57 300 234 5678',
        linkedin: 'https://linkedin.com/in/ana-gonzalez-meisa',
        orden: 2
      },
      {
        nombre: 'Roberto Sánchez',
        cargo: 'Jefe de Producción',
        bio: 'Tecnólogo en Soldadura con certificación internacional AWS. Más de 15 años de experiencia en fabricación de estructuras metálicas y gestión de equipos de producción.',
        foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        email: 'roberto.sanchez@meisa.com.co',
        telefono: '+57 300 345 6789',
        linkedin: 'https://linkedin.com/in/roberto-sanchez-meisa',
        orden: 3
      },
      {
        nombre: 'María Fernanda López',
        cargo: 'Coordinadora de Proyectos',
        bio: 'Arquitecta con especialización en gestión de proyectos. Experta en coordinación de equipos multidisciplinarios y seguimiento de cronogramas de obra.',
        foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        email: 'maria.lopez@meisa.com.co',
        telefono: '+57 300 456 7890',
        linkedin: 'https://linkedin.com/in/maria-lopez-meisa',
        orden: 4
      },
      {
        nombre: 'Diego Alejandro Herrera',
        cargo: 'Ingeniero de Diseño',
        bio: 'Ingeniero Civil especializado en análisis estructural con software avanzado. Experto en modelado 3D y cálculos de estructuras complejas.',
        foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        email: 'diego.herrera@meisa.com.co',
        telefono: '+57 300 567 8901',
        linkedin: 'https://linkedin.com/in/diego-herrera-meisa',
        orden: 5
      },
      {
        nombre: 'Claudia Patricia Ramírez',
        cargo: 'Directora Administrativa',
        bio: 'Administradora de Empresas con MBA en Finanzas. Responsable de la gestión financiera y administrativa de la empresa con enfoque en optimización de procesos.',
        foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        email: 'claudia.ramirez@meisa.com.co',
        telefono: '+57 300 678 9012',
        linkedin: 'https://linkedin.com/in/claudia-ramirez-meisa',
        orden: 6
      },
      {
        nombre: 'Andrés Felipe Castro',
        cargo: 'Supervisor de Montaje',
        bio: 'Tecnólogo en Construcciones con certificación en trabajo en alturas. Especialista en montaje de estructuras metálicas con más de 12 años de experiencia.',
        foto: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
        email: 'andres.castro@meisa.com.co',
        telefono: '+57 300 789 0123',
        linkedin: 'https://linkedin.com/in/andres-castro-meisa',
        orden: 7
      },
      {
        nombre: 'Laura Cristina Vargas',
        cargo: 'Ingeniera de Calidad',
        bio: 'Ingeniera Industrial con especialización en gestión de calidad. Responsable de implementar y mantener los estándares de calidad ISO en todos los procesos.',
        foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
        email: 'laura.vargas@meisa.com.co',
        telefono: '+57 300 890 1234',
        linkedin: 'https://linkedin.com/in/laura-vargas-meisa',
        orden: 8
      }
    ]

    console.log('🚀 Creando miembros del equipo...')

    for (const member of teamMembers) {
      await prisma.miembroEquipo.create({
        data: member
      })
      console.log(`✅ Creado: ${member.nombre} - ${member.cargo}`)
    }

    console.log(`\n🎉 ¡${teamMembers.length} miembros del equipo creados exitosamente!`)
    
    // Verificar resultado
    const totalMembers = await prisma.miembroEquipo.count()
    console.log(`📊 Total de miembros en la base de datos: ${totalMembers}`)
    
  } catch (error) {
    console.error('❌ Error al crear miembros del equipo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTeam()