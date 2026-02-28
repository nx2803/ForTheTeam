import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const leaguesToAdd = [
        { name: 'Premier League', category: 'Soccer' },
        { name: 'La Liga', category: 'Soccer' },
        { name: 'Serie A', category: 'Soccer' },
        { name: 'NBA', category: 'Basketball' },
        { name: 'MLB', category: 'Baseball' },
        { name: 'NFL', category: 'Football' },
        { name: 'NHL', category: 'Hockey' },
    ];

    console.log('--- Checking/Adding Leagues ---');
    for (const l of leaguesToAdd) {
        const existing = await prisma.leagues.findFirst({
            where: { name: { contains: l.name } }
        });
        if (!existing) {
            const created = await prisma.leagues.create({ data: l });
            console.log(`Created: ${created.name}`);
        } else {
            console.log(`Exists: ${existing.name}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
