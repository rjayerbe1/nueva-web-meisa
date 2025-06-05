import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkServiceNewFields() {
  try {
    // Find the service by slug
    const service = await prisma.servicio.findUnique({
      where: {
        slug: 'consultoria-en-diseno-estructural'
      }
    });

    if (!service) {
      console.log('❌ Service "consultoria-en-diseno-estructural" not found');
      return;
    }

    console.log('✅ Service found:', service.titulo);
    console.log('\n📊 Checking new fields:\n');

    // Check imagenesGaleria
    const imagenesGaleria = service.imagenesGaleria as any[] || [];
    console.log(`📸 imagenesGaleria: ${imagenesGaleria.length} items`);
    if (imagenesGaleria.length > 0) {
      console.log('   Sample:', JSON.stringify(imagenesGaleria[0], null, 2));
    }

    // Check estadisticas
    const estadisticas = service.estadisticas as any[] || [];
    console.log(`📈 estadisticas: ${estadisticas.length} items`);
    if (estadisticas.length > 0) {
      console.log('   Sample:', JSON.stringify(estadisticas[0], null, 2));
    }

    // Check procesoPasos
    const procesoPasos = service.procesoPasos as any[] || [];
    console.log(`🔄 procesoPasos: ${procesoPasos.length} items`);
    if (procesoPasos.length > 0) {
      console.log('   Sample:', JSON.stringify(procesoPasos[0], null, 2));
    }

    // Check competencias
    const competencias = service.competencias as any[] || [];
    console.log(`💪 competencias: ${competencias.length} items`);
    if (competencias.length > 0) {
      console.log('   Sample:', JSON.stringify(competencias[0], null, 2));
    }

    // Check casosExito
    const casosExito = service.casosExito as any[] || [];
    console.log(`🏆 casosExito: ${casosExito.length} items`);
    if (casosExito.length > 0) {
      console.log('   Sample:', JSON.stringify(casosExito[0], null, 2));
    }

    // Check testimonios
    const testimonios = service.testimonios as any[] || [];
    console.log(`💬 testimonios: ${testimonios.length} items`);
    if (testimonios.length > 0) {
      console.log('   Sample:', JSON.stringify(testimonios[0], null, 2));
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`Total fields with data: ${
      [imagenesGaleria, estadisticas, procesoPasos, competencias, casosExito, testimonios]
        .filter(field => field.length > 0).length
    } out of 6`);

  } catch (error) {
    console.error('Error checking service:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServiceNewFields();