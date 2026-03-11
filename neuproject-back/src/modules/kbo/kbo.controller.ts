import { Controller, Get, Query } from '@nestjs/common';
import { KboService } from './kbo.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('KBO')
@Controller('kbo')
export class KboController {
    constructor(private readonly kboService: KboService) { }

    @Get('schedule')
    @ApiOperation({ 
        summary: 'KBO 경기 일정 조회',
        description: 'KBO(한국프로야구)의 월별 경기 일정을 가져옵니다.'
    })
    @ApiQuery({ name: 'year', required: true, example: '2025', description: '조회 연도 (예: 2025)' })
    @ApiQuery({ name: 'month', required: true, example: '03', description: '조회 월 (01~12)' })
    async getSchedule(
        @Query('year') year: string,
        @Query('month') month: string,
    ) {
        return this.kboService.getSchedule(year, month);
    }
}
