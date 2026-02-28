import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MatchesService {
    private readonly logger = new Logger(MatchesService.name);

    constructor(private prisma: PrismaService) { }

    async findCalendarMatches(year: number, month: number, memberUid?: string) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        this.logger.log(`Fetching matches for ${year}-${month}`);

        // 기본적인 경기 조회 쿼리 (팀 정보 포함)
        const matches = await this.prisma.matches.findMany({
            where: {
                match_at: {
                    gte: startDate,
                    lte: endDate,
                },
                ...(memberUid && {
                    OR: [
                        { home_team: { follows: { some: { member_uid: memberUid } } } },
                        { away_team: { follows: { some: { member_uid: memberUid } } } },
                        // F1 등 팀 단위가 아닌 이벤트 경기 필터링 (사용자가 해당 리그의 어떤 팀이라도 팔로우 한 경우)
                        {
                            AND: [
                                { home_team_id: null },
                                { away_team_id: null },
                                {
                                    leagues: {
                                        teams: {
                                            some: {
                                                follows: { some: { member_uid: memberUid } }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                }),
            },
            include: {
                home_team: true,
                away_team: true,
                leagues: true,
            },
            orderBy: {
                match_at: 'asc',
            },
        });

        return matches;
    }

    async findRecentMatches(days: number = 7, memberUid?: string) {
        const endDate = new Date(); // 현재 시간
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        this.logger.log(`Fetching recent matches past ${days} days`);

        const matches = await this.prisma.matches.findMany({
            where: {
                match_at: {
                    gte: startDate,
                    lte: endDate,
                },
                // 종료되었거나 점수가 있는 경우 (결과가 나온 매치)
                status: 'finished',
                ...(memberUid && {
                    OR: [
                        { home_team: { follows: { some: { member_uid: memberUid } } } },
                        { away_team: { follows: { some: { member_uid: memberUid } } } },
                    ],
                }),
            },
            include: {
                home_team: true,
                away_team: true,
                leagues: true,
            },
            orderBy: {
                match_at: 'desc', // 가장 최근 경기가 먼저 나오도록 내림차순 정렬
            },
            take: 20, // 임의로 최대 20개까지만 표시 제한 (티커용)
        });

        return matches;
    }
}
