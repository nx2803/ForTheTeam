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
            for (const yearEntry of calendar) {
                // 특정 시즌 연도 필터링 (가져오려는 시즌과 일치하거나, 현재 연도 주변인 경우만)
                const currentYear = new Date().getFullYear();
                const entryYear = parseInt(yearEntry.label);
                
                if (season) {
                    if (entryYear !== season && entryYear !== season - 1 && entryYear !== season + 1) continue;
                } else {
                    // 기본적으로는 최근 2년 정도의 데이터만 타겟팅 (너무 오래된 데이터 방지)
                    if (entryYear < currentYear - 1 || entryYear > currentYear + 1) continue;
                }

                const entries = yearEntry.entries || yearEntry.weeks || [];
                this.logger.log(`Processing ${config.name} calendar for ${yearEntry.label} (${entries.length} entries)`);

                for (const entry of entries) {
                    try {
                        const params: Record<string, any> = { limit: 1000 };

                        // 공통: seasontype이 있다면 활용 (NFL은 필수, 나머지는 옵션)
                        if (yearEntry.value) {
                            params.seasontype = yearEntry.value;
                        }

                        if (sportCode === 'NFL') {
                            params.week = entry.value;
                        } else {
                            params.dates = entry.value;
                        }

                        const response = await firstValueFrom(
                            this.httpService.get(
                                `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                                { params },
                            ),
                        );

                        const events = response.data.events || [];
                        let addedCount = 0;
                        for (const event of events) {
                            if (!processedDates.has(event.id)) {
                                allEvents.push(event);
                                processedDates.add(event.id);
                                addedCount++;
                            }
                        }

                        if (addedCount > 0) {
                            this.logger.debug(
                                `Fetched ${events.length} events (${addedCount} new) for ${config.name} ${yearEntry.label}-${entry.label || entry.value}`,
                            );
                        }
                        
                        // API 부하 방지
                        await new Promise(resolve => setTimeout(resolve, 30));

                    } catch (error: any) {
                        this.logger.warn(`Failed to fetch ${config.name} entry ${entry.value}: ${error.message}`);
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
