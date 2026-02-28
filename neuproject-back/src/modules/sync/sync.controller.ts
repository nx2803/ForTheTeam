import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Post('all')
    @ApiOperation({ summary: '모든 스포츠 리그 경기 데이터 동기화' })
    async syncAll() {
        return this.syncService.syncAll();
    }
}
