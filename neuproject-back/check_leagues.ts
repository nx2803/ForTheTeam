import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const leagues = await prisma.leagues.findMany();
    console.log('Leagues in DB:', JSON.stringify(leagues, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
