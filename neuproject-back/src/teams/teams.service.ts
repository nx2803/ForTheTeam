import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) { }

    // 모든 팀 가져오기
    async getAllTeams() {
        return this.prisma.teams.findMany({
            include: {
                leagues: true, // 리그 정보도 함께 가져오기
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    // 특정 리그의 팀 가져오기
    async getTeamsByLeague(leagueId: string) {
        return this.prisma.teams.findMany({
            where: {
                league_id: leagueId,
            },
            include: {
                leagues: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    // ID로 특정 팀 가져오기
    async getTeamById(id: string) {
        return this.prisma.teams.findUnique({
            where: { id },
            include: {
                leagues: true,
            },
        });
    }

    // 팀 팔로우/언팔로우 토글
    async toggleFollow(memberUid: string, teamId: string) {
        // 이미 팔로우 중인지 확인
        const existingFollow = await this.prisma.follows.findFirst({
            where: {
                member_uid: memberUid,
                team_id: teamId,
            },
        });

        if (existingFollow) {
            // 언팔로우: 레코드 삭제
            return this.prisma.follows.delete({
                where: { id: existingFollow.id },
            });
        } else {
            // 팔로우: 레코드 생성
            return this.prisma.follows.create({
                data: {
                    member_uid: memberUid,
                    team_id: teamId,
                },
            });
        }
    }

    // 팔로우한 팀 목록 가져오기
    async getFollowedTeams(memberUid: string) {
        const follows = await this.prisma.follows.findMany({
            where: { member_uid: memberUid },
            include: {
                teams: {
                    include: {
                        leagues: true
                    }
                },
            },
        });

        // teams 객체만 추출해서 반환
        return follows.map(f => ({
            ...f.teams,
            isFollowed: true
        }));
    }
}
