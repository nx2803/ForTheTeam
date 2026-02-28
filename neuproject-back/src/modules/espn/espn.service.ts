import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// ESPN 비공식 API - 스포츠/리그 매핑
const SPORTS = {
    NFL: {
        sport: 'football',
        league: 'nfl',
        name: 'NFL',
    },
    NHL: {
        sport: 'hockey',
        league: 'nhl',
        name: 'NHL',
    },
    NBA: {
        sport: 'basketball',
        league: 'nba',
        name: 'NBA',
    },
    MLB: {
        sport: 'baseball',
        league: 'mlb',
        name: 'MLB',
    },
} as const;

type SportCode = keyof typeof SPORTS;

@Injectable()
export class EspnService {
    private readonly logger = new Logger(EspnService.name);
    private readonly apiUrl =
        'https://site.api.espn.com/apis/site/v2/sports';

    constructor(private readonly httpService: HttpService) { }

    /**
     * 특정 날짜의 경기 일정 조회
     * @param sportCode NFL, NHL, NBA, MLB
     * @param date YYYYMMDD 형식
     */
    async getScoreboard(sportCode: SportCode, date?: string) {
        const config = SPORTS[sportCode];
        try {
            this.logger.log(`Fetching ${config.name} scoreboard...`);

            const params: Record<string, any> = { limit: 100 };
            if (date) params.dates = date;

            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                    { params },
                ),
            );

            this.logger.log(
                `Successfully fetched ${response.data.events?.length ?? 0} ${config.name} events`,
            );
            return response.data;
        } catch (error: any) {
            this.logger.error(
                `Failed to fetch ${config.name} scoreboard: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * 시즌 전체 일정 조회 (날짜 범위로 가져오기)
     * @param sportCode NFL, NHL, NBA, MLB
     * @param season 시즌 연도 (예: 2025)
     */
    async getSeasonSchedule(sportCode: SportCode, season?: number) {
        const config = SPORTS[sportCode];
        try {
            this.logger.log(`Fetching ${config.name} season schedule...`);

            const params: Record<string, any> = { limit: 200 };
            if (season) params.season = season;

            // ESPN의 schedule 엔드포인트 사용
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                    {
                        params: {
                            ...params,
                            // 시즌 전체 범위를 가져오기 위해 dates 범위 지정
                            dates: this.getSeasonDateRange(sportCode, season),
                        },
                    },
                ),
            );

            this.logger.log(
                `Successfully fetched ${response.data.events?.length ?? 0} ${config.name} season events`,
            );
            return response.data;
        } catch (error: any) {
            this.logger.error(
                `Failed to fetch ${config.name} season schedule: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * 모든 스포츠(NFL, NHL, NBA, MLB) 시즌 전체 일정 한번에 가져오기
     */
    async getAllSportsSchedule() {
        const results: Record<string, any> = {};

        for (const code of Object.keys(SPORTS) as SportCode[]) {
            try {
                results[code] = await this.getScoreboard(code);
            } catch (error: any) {
                this.logger.error(`Failed to fetch ${code}: ${error.message}`);
                results[code] = { error: error.message };
            }
        }

        return results;
    }

    /**
     * 시즌 날짜 범위 생성 (YYYYMMDD-YYYYMMDD)
     */
    private getSeasonDateRange(sportCode: SportCode, season?: number): string {
        const year = season || new Date().getFullYear();

        if (sportCode === 'NFL') {
            // NFL 시즌: 9월 ~ 다음해 2월
            return `${year}0901-${year + 1}0215`;
        } else if (sportCode === 'NBA') {
            // NBA 시즌: 10월 ~ 다음해 6월
            return `${year}1001-${year + 1}0630`;
        } else if (sportCode === 'MLB') {
            // MLB 시즌: 3월 ~ 11월
            return `${year}0320-${year}1110`;
        } else {
            // NHL 시즌: 10월 ~ 다음해 6월
            return `${year}1001-${year + 1}0630`;
        }
    }
}
