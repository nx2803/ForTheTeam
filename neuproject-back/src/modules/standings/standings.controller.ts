import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { StandingsService, StandingItem } from './standings.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get(':leagueId')
  @ApiOperation({
    summary: '리그 순위 정보 조회',
    description: '특정 리그의 전체 팀 순위, 경기 수, 승/무/패, 승률, 승점 등을 조회합니다. 12시간 백엔드 캐싱이 적용됩니다.',
  })
  @ApiParam({
    name: 'leagueId',
    type: String,
    required: true,
    description: '조회할 리그의 UUID',
  })
  async getStandings(@Param('leagueId') leagueId: string): Promise<StandingItem[]> {
    if (!leagueId) {
      throw new BadRequestException('League ID is required');
    }
    return this.standingsService.getStandings(leagueId);
  }
}
