import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KboService {
    private readonly logger = new Logger(KboService.name);
    private readonly apiUrl = 'https://api-gw.sports.naver.com/schedule/games';

    constructor(private readonly httpService: HttpService) { }

    /**
     * 특정 연도와 월의 KBO 일정 조회
     * @param year 연도 (예: 2025)
     * @param month 월 (예: 03)
     */
    async getSchedule(year: string, month: string) {
        try {
            const fromDate = `${year}-${month}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const toDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

            this.logger.log(`Fetching KBO schedule: ${fromDate} ~ ${toDate}`);

            const response = await firstValueFrom(
                this.httpService.get(this.apiUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Referer': 'https://m.sports.naver.com/kbaseball/schedule/index',
                        'Origin': 'https://m.sports.naver.com',
                    },
                    params: {
                        upperCategoryId: 'kbaseball',
                        categoryId: 'kbo',
                        fromDate,
                        toDate,
                        fields: 'basic,schedule,baseball,manualRelayUrl',
                        size: 500,
                    },
                }),
            );

            const games = response.data.result?.games || [];
            this.logger.log(`Successfully fetched ${games.length} KBO games`);

            return {
                year,
                month,
                category: 'KBO',
                games: this.mapGames(games),
            };
        } catch (error: any) {
            this.logger.error(`Failed to fetch KBO schedule: ${error.message}`);
            if (error.response) {
                this.logger.error(`Error details: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }

    /**
     * 네이버 API 응답 데이터를 내부 포맷으로 매핑
     */
    private mapGames(games: any[]) {
        return games.map(game => ({
            gameId: game.gameId,
            date: game.gameDate,
            dateTime: game.gameDateTime,
            status: game.statusInfo,
            statusCode: game.statusCode,
            homeTeam: {
                code: game.homeTeamCode,
                name: game.homeTeamName,
                score: game.homeTeamScore,
                emblem: game.homeTeamEmblemUrl,
            },
            awayTeam: {
                code: game.awayTeamCode,
                name: game.awayTeamName,
                score: game.awayTeamScore,
                emblem: game.awayTeamEmblemUrl,
            },
            venue: game.stadium,
            isCancel: game.cancel || false,
            winner: game.winner,
        }));
    }
}
