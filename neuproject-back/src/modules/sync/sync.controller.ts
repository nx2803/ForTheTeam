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
        this.syncService.syncAll().catch(err => {
            console.error('Background Sync All failed:', err);
        });
        return { message: 'Synchronization started in the background' };
    }

    @Post('lck')
    @ApiOperation({ 
        summary: 'LCK 일정 단독 동기화',
        description: 'LCK 경기 일정만 PandaScore에서 가져와 DB에 동기화합니다. 현재 연도 전체 시즌 데이터를 페이지네이션으로 전부 수집합니다.'
    })
    async syncLck() {
        this.syncService.syncLckPublic().catch(err => {
            console.error('Background LCK Sync failed:', err);
        });
        return { message: 'LCK synchronization started in the background' };
    }
}
