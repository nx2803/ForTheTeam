import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) { }

    @Get('calendar')
    @ApiOperation({ summary: '달력용 경기 일정 조회' })
    @ApiQuery({ name: 'year', type: Number, required: true })
    @ApiQuery({ name: 'month', type: Number, required: true })
    @ApiQuery({ name: 'memberUid', type: String, required: false })
    async getCalendarMatches(
        @Query('year') year: string,
        @Query('month') month: string,
        @Query('memberUid') memberUid?: string,
    ) {
        return this.matchesService.findCalendarMatches(
            parseInt(year),
            parseInt(month),
            memberUid,
        );
    }

    @Get('recent')
    @ApiOperation({ summary: '최근 경기 결과 조회 (티커용)' })
    @ApiQuery({ name: 'days', type: Number, required: false, description: '조회할 최근 일수 (기본값: 7)' })
    @ApiQuery({ name: 'memberUid', type: String, required: false })
    async getRecentMatches(
        @Query('days') days?: string,
        @Query('memberUid') memberUid?: string,
    ) {
        return this.matchesService.findRecentMatches(
            days ? parseInt(days) : 7,
            memberUid,
        );
    }
}
