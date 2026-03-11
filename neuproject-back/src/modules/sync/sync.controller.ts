import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Post('all')
    @ApiOperation({ 
        summary: '모든 스포츠 리그 통합 동기화 (백그라운드 비동기 처리)',
        description: '축구(유럽 4대 리그), 야구(KBO), 미국 프로스포츠(NFL, NBA, MLB, NHL), E-스포츠(LCK)의 최신 일정을 한 번에 동기화합니다. 이 작업은 데이터 양이 많아 백그라운드에서 비동기적으로 실행됩니다.'
    })
    async syncAll() {
        // 작업을 기다리지 않고 바로 응답을 보냅니다 (504 에러 방지)
        this.syncService.syncAll().catch(err => {
            console.error('Background Sync All failed:', err);
        });
        
        return { message: 'Synchronization started in the background' };
    }
}
