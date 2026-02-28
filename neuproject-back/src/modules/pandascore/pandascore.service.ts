import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
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
            this.logger.log('Fetching LCK matches from PandaScore...');

            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/lol/matches`, {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        Accept: 'application/json',
                    },
                    params: {
                        'filter[league_id]': 293,
                        'per_page': 50,
                    },
                }),
            );

            this.logger.log(`Successfully fetched ${response.data.length} matches`);
            return response.data;
        } catch (error: any) {
            this.logger.error(`Failed to fetch LCK matches: ${error.message}`);
            if (error.response) {
                this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
}
