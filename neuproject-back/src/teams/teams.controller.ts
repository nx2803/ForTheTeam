import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    // GET /teams - 모든 팀 가져오기
    @Get()
    async getAllTeams() {
        return this.teamsService.getAllTeams();
    }

    // GET /teams/followed - 팔로우한 팀들 가져오기
    @Get('followed')
    async getFollowedTeams(@Query('memberUid') memberUid: string) {
        return this.teamsService.getFollowedTeams(memberUid);
    }

    // GET /teams/league/:leagueId - 특정 리그의 팀들 가져오기
    @Get('league/:leagueId')
    async getTeamsByLeague(@Param('leagueId') leagueId: string) {
        return this.teamsService.getTeamsByLeague(leagueId);
    }

    // GET /teams/:id - 특정 팀 가져오기
    @Get(':id')
    async getTeamById(@Param('id') id: string) {
        return this.teamsService.getTeamById(id);
    }

    // POST /teams/:id/follow - 팀 팔로우/언팔로우 토글
    @Post(':id/follow')
    async toggleFollow(
        @Param('id') teamId: string,
        @Body('memberUid') memberUid: string
    ) {
        return this.teamsService.toggleFollow(memberUid, teamId);
    }
}
