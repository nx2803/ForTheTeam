import { Controller, Get, Query } from '@nestjs/common';
import { KboService } from './kbo.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('KBO')
@Controller('kbo')
export class KboController {
    constructor(private readonly kboService: KboService) { }

    @Get('schedule')
    @ApiOperation({ summary: 'KBO 경기 일정 조회' })
    @ApiQuery({ name: 'year', required: true, example: '2025' })
    @ApiQuery({ name: 'month', required: true, example: '03' })
    async getSchedule(
        @Query('year') year: string,
        @Query('month') month: string,
    ) {
        return this.kboService.getSchedule(year, month);
    }
}
