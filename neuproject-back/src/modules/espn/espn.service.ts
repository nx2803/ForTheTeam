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
     * 시즌 전체 일정 조회 (캘린더 기반 단계적 조회)
     * @param sportCode NFL, NHL, NBA, MLB
     * @param season 시즌 연도 (예: 2025)
     */
    async getSeasonSchedule(sportCode: SportCode, season?: number) {
        const config = SPORTS[sportCode];
        try {
            this.logger.log(`Fetching ${config.name} calendar structure...`);

            // 1. 먼저 현재 시점의 기본 정보를 가져와서 캘린더 구조 파악
            const baseResponse = await firstValueFrom(
                this.httpService.get(
                    `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                    { params: { limit: 1 } },
                ),
            );

            const calendar = baseResponse.data.leagues?.[0]?.calendar || [];
            if (calendar.length === 0) {
                this.logger.warn(`No calendar found for ${config.name}`);
                return baseResponse.data;
            }

            const allEvents: any[] = [];
            const processedDates = new Set<string>();

            // 2. 캘린더를 순회하며 데이터 수집
            // NFL은 'weeks', 나머지는 'entries' (주나 월 단위) 구조임
            for (const yearEntry of calendar) {
                // 특정 시즌 연도 필터링 (있는 경우)
                if (season && parseInt(yearEntry.label) !== season) continue;

                const entries = yearEntry.entries || yearEntry.weeks || [];
                for (const entry of entries) {
                    try {
                        const params: Record<string, any> = { limit: 100 };

                        // NFL 특화: seasontype과 week 사용
                        if (sportCode === 'NFL') {
                            params.seasontype = yearEntry.value; // 1: Pre, 2: Reg, 3: Post
                            params.week = entry.value;
                        } else {
                            // NBA/MLB/NHL: dates (YYYYMMDD) 사용
                            // entry.value가 "20241022-20250413" 형태일 수 있으므로 
                            // 범위 내의 개별 날짜나 시작일/범위를 적절히 처리
                            params.dates = entry.value;
                        }

                        const response = await firstValueFrom(
                            this.httpService.get(
                                `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                                { params },
                            ),
                        );

                        const events = response.data.events || [];
                        for (const event of events) {
                            if (!processedDates.has(event.id)) {
                                allEvents.push(event);
                                processedDates.add(event.id);
                            }
                        }

                        this.logger.debug(
                            `Fetched ${events.length} events for ${config.name} ${entry.label || entry.value}`,
                        );
                        
                        // API 가이드라인 준수를 위한 미세 지연 (옵션)
                        await new Promise(resolve => setTimeout(resolve, 50));

                    } catch (error: any) {
                        this.logger.warn(`Failed to fetch entry ${entry.value}: ${error.message}`);
                    }
                }
            }

            this.logger.log(
                `Successfully fetched total ${allEvents.length} unique ${config.name} events for season`,
            );

            // 기존 호환성을 위해 마지막 응답 구조에 전체 이벤트만 담아서 반환
            return { ...baseResponse.data, events: allEvents };

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
                this.logger.log(`Triggering full season sync for ${code}...`);
                results[code] = await this.getSeasonSchedule(code);
            } catch (error: any) {
                this.logger.error(`Failed to fetch ${code} season schedule: ${error.message}`);
                results[code] = { error: error.message, events: [] };
            }
        }

        return results;
    }
}
