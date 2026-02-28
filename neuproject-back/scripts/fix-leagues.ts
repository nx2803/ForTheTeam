import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting league category fix...');

    const leagueFixes = [
        { id: '31a794f8-86cd-4d07-ba83-4f5963915512', category: 'Soccer' },     // Bundesliga
        { id: 'b0f16e7b-72d2-4e94-861e-546fe11ad4ea', category: 'Baseball' },   // KBO
        { id: '08dec493-da36-4afa-a43c-6548f6baada1', category: 'Esports' },    // LCK
        { id: 'f8f58fc2-a97d-4ece-b21e-41983bfef093', category: 'Motorsport' }  // F1
    ];

    for (const fix of leagueFixes) {
        try {
            const updated = await prisma.leagues.update({
                where: { id: fix.id },
                data: { category: fix.category }
            });
            console.log(`✅ Updated league: ${updated.name} -> ${updated.category}`);
        } catch (error) {
            console.error(`❌ Failed to update league ID ${fix.id}:`, error);
        }
    }

    console.log('✨ League category fix completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
