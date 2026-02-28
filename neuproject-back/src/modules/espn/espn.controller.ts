import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EspnService } from './espn.service';

@ApiTags('espn')
@Controller('espn')
export class EspnController {
    constructor(private readonly espnService: EspnService) { }

    @Get('scoreboard/:sport')
    @ApiOperation({
        summary: '특정 스포츠 경기 일정 조회',
        description:
            'ESPN API를 통해 NFL 또는 NHL의 경기 일정을 가져옵니다. date 파라미터를 지정하면 해당 날짜의 경기만 조회합니다.',
    })
    @ApiParam({
        name: 'sport',
        enum: ['NFL', 'NHL'],
        description: '스포츠 코드 - NFL: 미식축구, NHL: 아이스하키',
    })
    @ApiQuery({
        name: 'date',
        required: false,
        description: '조회 날짜 (YYYYMMDD 형식, 예: 20260301)',
    })
    async getScoreboard(
        @Param('sport') sport: 'NFL' | 'NHL',
        @Query('date') date?: string,
    ) {
        return await this.espnService.getScoreboard(sport, date);
    }

    @Get('season/:sport')
    @ApiOperation({
        summary: '시즌 전체 일정 조회',
        description:
            'NFL 또는 NHL의 시즌 전체 경기 일정을 가져옵니다. season 파라미터로 특정 시즌 조회 가능합니다.',
    })
    @ApiParam({
        name: 'sport',
        enum: ['NFL', 'NHL'],
        description: '스포츠 코드 - NFL: 미식축구, NHL: 아이스하키',
    })
    @ApiQuery({
        name: 'season',
        required: false,
        description: '시즌 연도 (예: 2025)',
        type: Number,
    })
    async getSeasonSchedule(
        @Param('sport') sport: 'NFL' | 'NHL',
        @Query('season') season?: number,
    ) {
        return await this.espnService.getSeasonSchedule(sport, season);
    }

    @Get('scoreboard')
    @ApiOperation({
        summary: 'NFL + NHL 전체 경기 일정 조회',
        description:
            'NFL과 NHL의 오늘 경기 일정을 한번에 가져옵니다. 응답은 스포츠 코드별(NFL, NHL)로 분류됩니다.',
    })
    async getAllScoreboard() {
        return await this.espnService.getAllSportsSchedule();
    }
}
