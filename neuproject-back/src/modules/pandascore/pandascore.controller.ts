import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PandaScoreService } from './pandascore.service';

@ApiTags('pandascore')
@Controller('pandascore')
export class PandaScoreController {
    constructor(private readonly pandaScoreService: PandaScoreService) { }

    @Get('lck-matches')
    @ApiOperation({
        summary: 'LCK(E-스포츠) 경기 일정 조회',
        description:
            'PandaScore API를 활용하여 LCK(League of Legends Champions Korea)의 최신 경기 일정을 가져옵니다.',
    })
    async getLckMatches() {
        return await this.pandaScoreService.getLckMatches();
    }
}
