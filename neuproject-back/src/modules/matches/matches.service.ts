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
                // memberUid가 있을 경우 팔로우한 팀의 경기만 필터링
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
                match_at: 'asc',
            },
        });

        return matches;
    }
}
