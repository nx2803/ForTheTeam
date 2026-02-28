import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const leagues = await prisma.leagues.findMany();
    console.log('League Categories:');
    leagues.forEach(l => console.log(`${l.name}: ${l.category}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
