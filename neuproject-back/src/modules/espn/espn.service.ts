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

            const calendarType = baseResponse.data.leagues?.[0]?.calendarType || 'day';
            const calendar = baseResponse.data.leagues?.[0]?.calendar || [];
            
            if (calendar.length === 0) {
                this.logger.warn(`No calendar found for ${config.name}`);
                return baseResponse.data;
            }

            const allEvents: any[] = [];
            const processedDates = new Set<string>();

            // 2. 캘린더 타입에 따른 수집 전략 분기
            if (calendarType === 'list') {
                // NFL 스타일: 연도/시즌별로 그룹화된 리스트 구조
                for (const yearEntry of calendar) {
                    const currentYear = new Date().getFullYear();
                    const entryYear = parseInt(yearEntry.label);
                    
                    if (season) {
                        if (entryYear !== season && entryYear !== season - 1 && entryYear !== season + 1) continue;
                    } else {
                        if (entryYear < currentYear - 1 || entryYear > currentYear + 1) continue;
                    }

                    const entries = yearEntry.entries || yearEntry.weeks || [];
                    this.logger.log(`Processing ${config.name} calendar for ${yearEntry.label} (${entries.length} entries)`);

                    for (const entry of entries) {
                        await this.fetchAndAddEvents(config, {
                            seasontype: yearEntry.value,
                            [sportCode === 'NFL' ? 'week' : 'dates']: entry.value
                        }, allEvents, processedDates);
                    }
                }
            } else {
                // NBA/NHL/MLB 스타일: 단순 날짜 배열 구조 (day 타입)
                // 호출 횟수를 줄이기 위해 월별(YYYYMM)로 그룹화하여 요청
                const monthSet = new Set<string>();
                
                // 1. 캘린더 데이터 기반 월 추가
                for (const dateStr of calendar) {
                    if (typeof dateStr !== 'string') continue;
                    const yyyymm = dateStr.substring(0, 7).replace('-', '');
                    monthSet.add(yyyymm);
                }

                // 2. [FIX] 캘린더가 불완전한 경우를 대비하여 현재/다음 연도의 주요 월 전수조사 추가
                const currentYear = new Date().getFullYear();
                const targetYears = [currentYear, currentYear + 1];
                
                for (const year of targetYears) {
                    for (let m = 1; m <= 12; m++) {
                        monthSet.add(`${year}${m.toString().padStart(2, '0')}`);
                    }
                }

                const months = Array.from(monthSet).sort();
                this.logger.log(`Processing ${config.name} calendar for ${months.length} months with Season Types (2, 3)`);

                for (const month of months) {
                    // 특정 시즌 필터링 (입력받은 season 연도 기준)
                    if (season) {
                        const mYear = parseInt(month.substring(0, 4));
                        if (mYear !== season && mYear !== season - 1 && mYear !== season + 1) continue;
                    }
                    
                    // Regular Season (2)와 Postseason (3)을 모두 확실히 긁어옴
                    // dates와 seasontype을 같이 명시해야 누락이 없음
                    for (const type of [2, 3]) {
                        await this.fetchAndAddEvents(config, { 
                            dates: month,
                            seasontype: type 
                        }, allEvents, processedDates);
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
     * API에서 이벤트를 가져와서 목록에 추가 (중복 제거 포함)
     */
    private async fetchAndAddEvents(
        config: any,
        params: Record<string, any>,
        allEvents: any[],
        processedDates: Set<string>
    ) {
        try {
            const finalParams = { limit: 1000, ...params };
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.apiUrl}/${config.sport}/${config.league}/scoreboard`,
                    { params: finalParams },
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
                    `Fetched ${events.length} events (${addedCount} new) for ${config.name} (params: ${JSON.stringify(params)})`,
                );
            }

            // API 부하 방지
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error: any) {
            this.logger.warn(`Failed to fetch for ${config.name} with params ${JSON.stringify(params)}: ${error.message}`);
        }
    }

    /**
     * 모든 스포츠(NFL, NHL, NBA, MLB) 시즌 전체 일정 한번에 가져오기
     * 각 스포츠 처리 후 GC 유도를 위해 순차 처리 + 일시정지
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
            // 각 종목 처리 후 잠시 대기 (GC 유도 및 API 부하 분산)
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return results;
    }

    /**
     * 모든 스포츠(NFL, NHL, NBA, MLB) 시즌 전체 일정을 콜백으로 처리 (메모리 절약)
     * 각 스포츠의 이벤트를 메모리에 전부 쌓지 않고 즉시 콜백으로 전달
     */
    async processAllSportsSchedule(
        callback: (sportCode: string, events: any[]) => Promise<void>
    ) {
        for (const code of Object.keys(SPORTS) as SportCode[]) {
            try {
                this.logger.log(`Triggering full season sync for ${code}...`);
                const data = await this.getSeasonSchedule(code);
                const events = data.events || [];
                await callback(code, events);
                // 처리 완료 후 메모리 해제를 위한 대기
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error: any) {
                this.logger.error(`Failed to process ${code} season schedule: ${error.message}`);
                await callback(code, []);
            }
        }
    }
}
