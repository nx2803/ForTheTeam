import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SyncService } from './src/modules/sync/sync.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const syncService = app.get(SyncService);

    console.log('Starting manual ESPN sync test...');
    try {
        const result = await (syncService as any).syncEspn();
        console.log('Sync result (count):', result);
    } catch (error) {
        console.error('Sync failed:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
