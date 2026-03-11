import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) { }

    @Get('calendar')
    @ApiOperation({ 
        summary: '달력 뷰 전용 경기 일정 조회',
        description: '특정 월의 전체 경기 일정을 조회합니다. 사용자 UID 전달 시 본인이 팔로우한 팀의 일정만 필터링하여 반환합니다.' 
    })
    @ApiQuery({ name: 'year', type: Number, required: true, description: '조회 연도' })
    @ApiQuery({ name: 'month', type: Number, required: true, description: '조회 월 (1-12시)' })
    @ApiQuery({ name: 'memberUid', type: String, required: false, description: '사용자 고유 UID (팔로우 필터링용)' })
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
    @ApiOperation({ 
        summary: '최근 경기 결과 조회 (메인 티커용)',
        description: '사용자가 팔로우한 팀들의 최근 경기 결과(종료된 경기)를 조회합니다.' 
    })
    @ApiQuery({ name: 'days', type: Number, required: false, description: '조회할 최근 날짜 범위 (기본값: 7일)' })
    @ApiQuery({ name: 'memberUid', type: String, required: false, description: '사용자 고유 UID' })
    @ApiQuery({ name: 'teamIds', type: String, required: false, description: '직접 지정할 팀 ID 목록 (쉼표 구분)' })
    async getRecentMatches(
        @Query('days') days?: string,
        @Query('memberUid') memberUid?: string,
        @Query('teamIds') teamIds?: string,
    ) {
        return this.matchesService.findRecentMatches(
            days ? parseInt(days) : 7,
            memberUid,
            teamIds,
        );
    }
}
