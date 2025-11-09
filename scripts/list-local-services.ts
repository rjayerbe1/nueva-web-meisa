import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const servicios = await prisma.servicio.findMany({
    orderBy: { orden: 'asc' }
  });
  
  console.log('\n📋 SERVICIOS EN BASE DE DATOS LOCAL:\n');
  servicios.forEach((s, i) => {
    console.log(`${i+1}. ${s.nombre}`);
    console.log(`   Slug: ${s.slug}`);
    console.log(`   Visible: ${s.visible}`);
    console.log('');
  });
  
  console.log(`TOTAL: ${servicios.length} servicios`);
}

main()
  .finally(() => prisma.$disconnect());
