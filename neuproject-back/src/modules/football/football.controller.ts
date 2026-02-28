import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FootballService } from './football.service';

@ApiTags('football')
@Controller('football')
export class FootballController {
    constructor(private readonly footballService: FootballService) { }

    @Get('matches/:league')
    @ApiOperation({
        summary: '특정 리그 경기 일정 조회',
        description:
            'football-data.org API를 통해 특정 리그의 경기 일정을 가져옵니다. PL(EPL), BL1(분데스리가), PD(라리가), SA(세리에A) 중 선택.',
    })
    @ApiParam({
        name: 'league',
        enum: ['PL', 'BL1', 'PD', 'SA'],
        description:
            '리그 코드 - PL: Premier League, BL1: Bundesliga, PD: La Liga, SA: Serie A',
    })
    async getLeagueMatches(
        @Param('league') league: 'PL' | 'BL1' | 'PD' | 'SA',
    ) {
        return await this.footballService.getMatches(league);
    }

    @Get('matches')
    @ApiOperation({
        summary: '4대 리그 전체 경기 일정 조회',
        description:
            'EPL, 분데스리가, 라리가, 세리에A 4개 리그의 경기 일정을 한번에 가져옵니다. 응답은 리그 코드별(PL, BL1, PD, SA)로 분류됩니다.',
    })
    async getAllMatches() {
        return await this.footballService.getAllLeagueMatches();
    }
}
