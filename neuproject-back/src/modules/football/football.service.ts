import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// 4대 리그 코드 매핑
const LEAGUE_CODES = {
    PL: { code: 'PL', name: 'Premier League', country: 'England' },
    BL1: { code: 'BL1', name: 'Bundesliga', country: 'Germany' },
    PD: { code: 'PD', name: 'La Liga', country: 'Spain' },
    SA: { code: 'SA', name: 'Serie A', country: 'Italy' },
} as const;

type LeagueCode = keyof typeof LEAGUE_CODES;

@Injectable()
export class FootballService {
    private readonly logger = new Logger(FootballService.name);
    private readonly apiUrl = 'https://api.football-data.org/v4';
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('FOOTBALL_API_KEY') || '';
    }

    /**
     * 특정 리그의 경기 일정 가져오기
     */
    async getMatches(leagueCode: LeagueCode) {
        try {
            const league = LEAGUE_CODES[leagueCode];
            this.logger.log(`Fetching ${league.name} matches...`);

            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.apiUrl}/competitions/${leagueCode}/matches`,
                    {
                        headers: {
                            'X-Auth-Token': this.apiKey,
                        },
                    },
                ),
            );

            this.logger.log(
                `Successfully fetched ${response.data.matches?.length ?? 0} ${league.name} matches`,
            );
            return response.data;
        } catch (error: any) {
            this.logger.error(
                `Failed to fetch ${leagueCode} matches: ${error.message}`,
            );
            if (error.response) {
                this.logger.error(
                    `Error response: ${JSON.stringify(error.response.data)}`,
                );
            }
            throw error;
        }
    }

    /**
     * 4대 리그 전체 경기 일정 한번에 가져오기
     */
    async getAllLeagueMatches() {
        const results: Record<string, any> = {};

        for (const code of Object.keys(LEAGUE_CODES) as LeagueCode[]) {
            try {
                results[code] = await this.getMatches(code);
            } catch (error: any) {
                this.logger.error(`Failed to fetch ${code}: ${error.message}`);
                results[code] = { error: error.message };
            }
        }

        return results;
    }
}
