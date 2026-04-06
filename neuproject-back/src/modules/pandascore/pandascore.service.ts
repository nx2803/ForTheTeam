import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PandaScoreService {
    private readonly logger = new Logger(PandaScoreService.name);
    private readonly apiUrl = 'https://api.pandascore.co';
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('PANDASCORE_API_KEY') || '';
    }

    async getLckMatches() {
        try {
            this.logger.log('Fetching LCK matches from PandaScore (paginated)...');

            const allMatches: any[] = [];
            let page = 1;
            const perPage = 100;

            // 현재 시즌 기준 날짜 범위 (1월 ~ 12월)
            const year = new Date().getFullYear();
            const rangeStart = `${year}-01-01T00:00:00Z`;
            const rangeEnd = `${year}-12-31T23:59:59Z`;

            while (true) {
                const response = await firstValueFrom(
                    this.httpService.get(`${this.apiUrl}/lol/matches`, {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            Accept: 'application/json',
                        },
                        params: {
                            'filter[league_id]': 293,
                            'range[begin_at]': `${rangeStart},${rangeEnd}`,
                            'sort': 'begin_at',  // 오름차순 정렬 (오래된 순)
                            'per_page': perPage,
                            'page': page,
                        },
                    }),
                );

                const matches = response.data;
                if (!matches || matches.length === 0) break;

                allMatches.push(...matches);
                this.logger.log(`Page ${page}: fetched ${matches.length} matches (total: ${allMatches.length})`);

                // 마지막 페이지면 종료
                if (matches.length < perPage) break;
                page++;

                // 안전장치: 최대 10페이지 (1000개)
                if (page > 10) {
                    this.logger.warn('Reached max page limit (10). Stopping pagination.');
                    break;
                }
            }

            this.logger.log(`Successfully fetched total ${allMatches.length} LCK matches`);
            return allMatches;
        } catch (error: any) {
            this.logger.error(`Failed to fetch LCK matches: ${error.message}`);
            if (error.response) {
                this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
}
