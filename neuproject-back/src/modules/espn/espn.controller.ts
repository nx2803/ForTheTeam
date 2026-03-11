import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EspnService } from './espn.service';

@ApiTags('espn')
@Controller('espn')
export class EspnController {
    constructor(private readonly espnService: EspnService) { }

    @Get('scoreboard/:sport')
    @ApiOperation({
        summary: '종목별 경기 일정 조회 (Scoreboard)',
        description:
            'ESPN 공식 스코어보드 API를 통해 특정 종목의 현재 혹은 특정 날짜 경기 일정을 가져옵니다. (NFL, NHL, NBA, MLB 지원)',
    })
    @ApiParam({
        name: 'sport',
        enum: ['NFL', 'NHL', 'NBA', 'MLB'],
        description: '스포츠 종목 코드',
    })
    @ApiQuery({
        name: 'date',
        required: false,
        description: '조회 날짜 (YYYYMMDD 형식). 미지정 시 최신/오늘 데이터 반환.',
    })
    async getScoreboard(
        @Param('sport') sport: 'NFL' | 'NHL' | 'NBA' | 'MLB',
        @Query('date') date?: string,
    ) {
        return await this.espnService.getScoreboard(sport, date);
    }

    @Get('season/:sport')
    @ApiOperation({
        summary: '시즌 전체 일정 조회 (캘린더 기반)',
        description:
            'ESPN 캘린더 메타데이터를 활용하여 해당 종목의 한 시즌 전체 경기 일정을 단계적으로 수집합니다. (NFL, NHL, NBA, MLB 지원)',
    })
    @ApiParam({
        name: 'sport',
        enum: ['NFL', 'NHL', 'NBA', 'MLB'],
        description: '스포츠 종목 코드',
    })
    @ApiQuery({
        name: 'season',
        required: false,
        description: '시즌 연도 (예: 2025). 미지정 시 현재 진행 중인 시즌 기준.',
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
        summary: '미국 4대 프로 스포츠 전체 경기 일정 조회',
        description:
            'NFL, NHL, NBA, MLB의 최신 경기 일정을 한 번에 병렬로 조회하여 종목별로 결과를 반환합니다.',
    })
    async getAllScoreboard() {
        return await this.espnService.getAllSportsSchedule();
    }
}
