import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { FootballService } from '../football/football.service';
import { PandaScoreService } from '../pandascore/pandascore.service';
import { EspnService } from '../espn/espn.service';
import { KboService } from '../kbo/kbo.service';
import { MatchesGateway } from '../matches/matches.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        private prisma: PrismaService,
        private footballService: FootballService,
        private pandaScoreService: PandaScoreService,
        private espnService: EspnService,
        private kboService: KboService,
        private readonly matchesGateway: MatchesGateway,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    /**
     * 개별 종목별 동기화 실행 (시간대 분산)
     */
    @Cron('0 0 0,12 * * *')
    async cronFootball() {
        this.logger.log('[CRON_STAGGERED] Starting Football synchronization...');
        await this.syncFootball();
        await this.clearSyncCache();
        this.logger.log('[CRON_STAGGERED] Football synchronization completed');
    }

    @Cron('0 0 3,15 * * *')
    async cronEspn() {
        this.logger.log('[CRON_STAGGERED] Starting ESPN (MLB/NBA/NHL/NFL) synchronization...');
        await this.syncEspn();
        await this.clearSyncCache();
        this.logger.log('[CRON_STAGGERED] ESPN synchronization completed');
    }

    @Cron('0 0 6,18 * * *')
    async cronOthers() {
        this.logger.log('[CRON_STAGGERED] Starting KBO/LCK synchronization...');
        await this.syncLck();
        await this.syncKbo();
        await this.clearSyncCache();
        this.logger.log('[CRON_STAGGERED] KBO/LCK synchronization completed');
    }

    /**
     * 전체 일정 동기화 (수동 실행용)
     */
    async syncAll() {
        this.logger.log('[SYNC_MANUAL] Starting full schedule synchronization...');

        const results = {
            football: await this.syncFootball(),
            lck: await this.syncLck(),
            espn: await this.syncEspn(),
            kbo: await this.syncKbo(),
        };

        await this.clearSyncCache();
        this.logger.log('[SYNC_MANUAL] Full synchronization completed');
        return results;
    }

    private async clearSyncCache() {
        try {
            await this.cacheManager.reset();
            this.logger.log('[SYNC] Cache cleared');
        } catch (error) {
            this.logger.warn(`Failed to clear cache: ${error.message}`);
        }
    }

    /**
     * 라이브 스코어 동기화 (매 30분마다 - 오늘 + 진행중인 경기 점수 업데이트만)
     * 전체 시즌 동기화(syncAll)가 아닌, 오늘 날짜 경기만 빠르게 처리
     */
    @Cron('0 */30 * * * *')
    async syncLiveScores() {
        this.logger.log('[CRON_LIVE] Starting live scores synchronization (today only)...');
        try {
            await this.syncEspnToday();
        } catch (error) {
            this.logger.error(`[CRON_LIVE] Live scores sync failed: ${error.message}`);
        }
        this.logger.log('[CRON_LIVE] Live scores synchronization completed');
    }

    /**
     * 유럽 축구 데이터 동기화 (리그별 순차 처리로 메모리 최적화)
     */
    private async syncFootball() {
        this.logger.log('[SYNC_FOOTBALL] Starting football synchronization league by league...');
        
        const leagues = ['PL', 'BL1', 'PD', 'SA'] as const;
        let totalCount = 0;

        for (const leagueCode of leagues) {
            try {
                const response = await this.footballService.getMatches(leagueCode);
                const matches = response.matches || [];
                const league = await this.getLeagueByExternalId(leagueCode);
                
                if (!league) {
                    this.logger.warn(`League not found for code: ${leagueCode}`);
                    continue;
                }

                this.logger.log(`[SYNC_FOOTBALL] Processing ${matches.length} matches for ${league.name}`);

                for (const m of matches) {
                    await this.upsertMatch({
                        external_api_id: `FB_${m.id}`,
                        league_id: league.id,
                        league_code: league.code,
                        home_team_name: m.homeTeam.name,
                        away_team_name: m.awayTeam.name,
                        home_team_external_id: `FB_${m.homeTeam.id}`,
                        away_team_external_id: `FB_${m.awayTeam.id}`,
                        match_at: new Date(m.utcDate),
                        status: this.mapFootballStatus(m.status),
                        home_score: m.score.fullTime.home ?? 0,
                        away_score: m.score.fullTime.away ?? 0,
                        venue: m.venue,
                    });
                    totalCount++;
                }

                // 리그 간 처리 사이의 짧은 휴식 (가비지 컬렉션 및 API 부하 방지)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                this.logger.error(`Failed to sync football league ${leagueCode}: ${error.message}`);
            }
        }

        this.logger.log(`[SYNC_FOOTBALL] Completed football sync. Total ${totalCount} matches processed.`);
        return totalCount;
    }

    /**
     * KBO 데이터 동기화
     */
    private async syncKbo() {
        const now = new Date();
        const year = now.getFullYear().toString();
        // KBO 시즌은 보통 3월(시범경기)부터 11월(포스트시즌)까지 진행됨
        const months = ['03', '04', '05', '06', '07', '08', '09', '10', '11'];

        try {
            const league = await this.prisma.leagues.findFirst({ where: { name: { contains: 'KBO' } } });
            if (!league) return 0;

            let totalCount = 0;
            for (const month of months) {
                this.logger.log(`[SYNC_KBO] Syncing KBO matches for ${year}-${month}...`);
                try {
                    const data = await this.kboService.getSchedule(year, month);
                    for (const g of data.games) {
                        await this.upsertMatch({
                            external_api_id: `KBO_${g.gameId}`,
                            league_id: league.id,
                            league_code: 'KBO',
                            home_team_name: g.homeTeam.name,
                            away_team_name: g.awayTeam.name,
                            match_at: new Date(g.dateTime),
                            status: this.mapKboStatus(g.statusCode),
                            home_score: g.homeTeam.score,
                            away_score: g.awayTeam.score,
                            venue: g.venue,
                        });
                        totalCount++;
                    }
                } catch (monthError) {
                    this.logger.warn(`Failed to sync KBO for ${month}: ${monthError.message}`);
                }
            }
            this.logger.log(`[SYNC_KBO] Total ${totalCount} KBO matches synced`);
            return totalCount;
        } catch (error) {
            this.logger.error(`KBO Sync failed: ${error.message}`);
            return 0;
        }
    }

    /**
     * LCK 단독 동기화 (외부 호출용 - 컨트롤러에서 사용)
     */
    async syncLckPublic() {
        this.logger.log('[SYNC_LCK_MANUAL] Starting manual LCK synchronization...');
        const count = await this.syncLck();
        await this.clearSyncCache();
        this.logger.log(`[SYNC_LCK_MANUAL] LCK sync complete: ${count} matches`);
        return count;
    }

    /**
     * LCK 데이터 동기화
     */
    private async syncLck() {
        try {
            const matches = await this.pandaScoreService.getLckMatches();
            const league = await this.prisma.leagues.findFirst({ where: { name: { contains: 'LCK' } } });
            if (!league) return 0;

            let count = 0;
            for (const m of matches) {
                await this.upsertMatch({
                    external_api_id: `PS_${m.id}`,
                    league_id: league.id,
                    league_code: 'LCK',
                    home_team_name: m.opponents[0]?.opponent.name,
                    away_team_name: m.opponents[1]?.opponent.name,
                    home_team_external_id: m.opponents[0] ? `PS_${m.opponents[0].opponent.id}` : undefined,
                    away_team_external_id: m.opponents[1] ? `PS_${m.opponents[1].opponent.id}` : undefined,
                    match_at: new Date(m.begin_at),
                    status: this.mapPandaStatus(m.status),
                    home_score: m.results[0]?.score ?? 0,
                    away_score: m.results[1]?.score ?? 0,
                    venue: m.league.name,
                });
                count++;
            }
            return count;
        } catch (error) {
            this.logger.error(`LCK Sync failed: ${error.message}`);
            return 0;
        }
    }

    /**
     * ESPN 스포츠 (NBA, MLB, NFL, NHL) 전체 시즌 동기화
     */
    private async syncEspn() {
        let totalCount = 0;

        await this.espnService.processAllSportsSchedule(async (sportCode, events) => {
            this.logger.log(`[SYNC_ESPN] Processing ${events.length} total events for ${sportCode}`);

            if (events.length === 0) {
                this.logger.warn(`[SYNC_ESPN] No events found to sync for ${sportCode}`);
                return;
            }

            const league = await this.prisma.leagues.findFirst({ 
                where: { name: { contains: sportCode, mode: 'insensitive' } } 
            });
            
            if (!league) {
                this.logger.warn(`[SYNC_ESPN] League not found in DB for: ${sportCode}`);
                return;
            }

            // 리그 팀 목록을 미리 한 번에 캐싱 (매 경기마다 findMany 방지)
            const leagueTeamsCache = await this.prisma.teams.findMany({
                where: { league_id: league.id }
            });

            this.logger.log(`[SYNC_ESPN] Syncing ${events.length} events for ${sportCode} (${leagueTeamsCache.length} teams cached)...`);

            for (const e of events) {
                try {
                    const competition = e.competitions[0];
                    if (!competition) continue;

                    const home = competition.competitors.find((c: any) => c.homeAway === 'home');
                    const away = competition.competitors.find((c: any) => c.homeAway === 'away');

                    if (!home || !away) continue;

                    await this.upsertMatch({
                        external_api_id: `ESPN_${e.id}`,
                        league_id: league.id,
                        league_code: sportCode,
                        home_team_name: home.team.displayName,
                        away_team_name: away.team.displayName,
                        home_team_external_id: `ESPN_${sportCode}_${home.team.id}`,
                        away_team_external_id: `ESPN_${sportCode}_${away.team.id}`,
                        match_at: new Date(e.date),
                        status: this.mapEspnStatus(e.status.type.name),
                        home_score: parseInt(home.score) || 0,
                        away_score: parseInt(away.score) || 0,
                        venue: competition.venue?.fullName,
                    }, leagueTeamsCache);
                    totalCount++;
                } catch (eventError) {
                    this.logger.error(`[SYNC_ESPN] Failed to sync event ${e.id}: ${eventError.message}`);
                }
            }
            
            // 한 종목 처리가 끝나면 가비지 컬렉션을 위해 명시적으로 참조 해제 유도
            (events as any) = null;
        });

        return totalCount;
    }

    /**
     * ESPN 오늘 경기만 동기화 (라이브 스코어 업데이트용, 메모리 절약)
     */
    private async syncEspnToday() {
        const sportCodes = ['NFL', 'NHL', 'NBA', 'MLB'] as const;
        let totalCount = 0;

        // 오늘 날짜 (YYYYMMDD)
        const now = new Date();
        const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

        for (const sportCode of sportCodes) {
            try {
                const data = await this.espnService.getScoreboard(sportCode, todayStr);
                const events = data.events || [];

                if (events.length === 0) continue;

                const league = await this.prisma.leagues.findFirst({ 
                    where: { name: { contains: sportCode, mode: 'insensitive' } } 
                });
                if (!league) continue;

                this.logger.log(`[SYNC_LIVE] Syncing ${events.length} today's ${sportCode} events...`);

                for (const e of events) {
                    try {
                        const competition = e.competitions[0];
                        if (!competition) continue;

                        const home = competition.competitors.find((c: any) => c.homeAway === 'home');
                        const away = competition.competitors.find((c: any) => c.homeAway === 'away');
                        if (!home || !away) continue;

                        await this.upsertMatch({
                            external_api_id: `ESPN_${e.id}`,
                            league_id: league.id,
                            league_code: sportCode,
                            home_team_name: home.team.displayName,
                            away_team_name: away.team.displayName,
                            home_team_external_id: `ESPN_${sportCode}_${home.team.id}`,
                            away_team_external_id: `ESPN_${sportCode}_${away.team.id}`,
                            match_at: new Date(e.date),
                            status: this.mapEspnStatus(e.status.type.name),
                            home_score: parseInt(home.score) || 0,
                            away_score: parseInt(away.score) || 0,
                            venue: competition.venue?.fullName,
                        });
                        totalCount++;
                    } catch (eventError) {
                        this.logger.error(`[SYNC_LIVE] Failed to sync event ${e.id}: ${eventError.message}`);
                    }
                }
            } catch (error) {
                this.logger.warn(`[SYNC_LIVE] Failed to fetch today's ${sportCode} scoreboard: ${error.message}`);
            }
        }

        this.logger.log(`[SYNC_LIVE] Total ${totalCount} today's ESPN events synced`);
        return totalCount;
    }

    // --- 헬퍼 메서드들 ---

    private async upsertMatch(data: any, leagueTeamsCache?: any[]) {
        if (!data.home_team_name || !data.away_team_name) return;

        const homeTeam = await this.findTeam(
            data.home_team_name,
            data.league_id,
            data.league_code,
            data.home_team_external_id,
            leagueTeamsCache,
        );
        const awayTeam = await this.findTeam(
            data.away_team_name,
            data.league_id,
            data.league_code,
            data.away_team_external_id,
            leagueTeamsCache,
        );

        const matchesModel = (this.prisma as any).matches;

        if (!matchesModel) {
            const availableModels = Object.keys(this.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
            this.logger.error(`matches model not found. Available models: ${availableModels.join(', ')}`);
            this.logger.warn('Please run "npx prisma generate" and RESTART your server command.');
            return;
        }

        // --- Smart Upsert: 변경 사항이 있을 때만 DB 쓰기 발생 ---
        try {
            const existing = await matchesModel.findUnique({
                where: { external_api_id: data.external_api_id }
            });

            if (existing) {
                const needsUpdate =
                    existing.status !== data.status ||
                    existing.home_score !== data.home_score ||
                    existing.away_score !== data.away_score ||
                    existing.match_at.getTime() !== data.match_at.getTime() ||
                    existing.venue !== data.venue;

                if (!needsUpdate) return; // 변경 내용 없음 -> DB 쓰지 않음

                const updated = await matchesModel.update({
                    where: { external_api_id: data.external_api_id },
                    data: {
                        status: data.status,
                        home_score: data.home_score,
                        away_score: data.away_score,
                        match_at: data.match_at,
                        venue: data.venue,
                        updated_at: new Date(),
                    },
                });

                // 실시간 업데이트 방송
                this.matchesGateway.emitMatchesUpdated({
                    matchId: updated.id,
                    homeScore: data.home_score,
                    awayScore: data.away_score,
                    status: data.status,
                });

                return updated;
            }

            if (!homeTeam || !awayTeam) {
                this.logger.warn(`[SYNC_MATCH_FAIL] League: ${data.league_code}, Date: ${data.match_at.toISOString()}`);
                if (!homeTeam) this.logger.warn(`  - Home Team NOT Found: "${data.home_team_name}"`);
                if (!awayTeam) this.logger.warn(`  - Away Team NOT Found: "${data.away_team_name}"`);
            }

            return await matchesModel.create({
                data: {
                    external_api_id: data.external_api_id,
                    league_id: data.league_id,
                    home_team_id: homeTeam?.id,
                    away_team_id: awayTeam?.id,
                    home_team_name: data.home_team_name,
                    away_team_name: data.away_team_name,
                    match_at: data.match_at,
                    status: data.status,
                    home_score: data.home_score,
                    away_score: data.away_score,
                    venue: data.venue,
                },
            });
        } catch (error) {
            // 중복 데이터 생성 시도 시 조용히 넘어가거거나 업데이트 시도
            if (error.code === 'P2002') {
                this.logger.debug(`[SYNC_UP_RETRY] Race condition handled for ${data.external_api_id}`);
                return;
            }
            this.logger.error(`[SYNC_MATCH_ERROR] ${data.league_code} - ${data.external_api_id}: ${error.message}`);
            if (error.stack) this.logger.debug(error.stack);
            throw error;
        }
    }

    private async findTeam(name: string, leagueId: string, leagueCode?: string, externalApiId?: string, leagueTeamsCache?: any[]) {
        if (!name && !externalApiId) return null;

        // 캐시가 있으면 DB 조회 없이 캐시에서만 검색
        if (leagueTeamsCache) {
            return this.findTeamFromCache(leagueTeamsCache, name, externalApiId);
        }

        // 1. external_api_id 기반 최우선 매칭 (가장 정확함)
        if (externalApiId) {
            const team = await this.prisma.teams.findFirst({
                where: { external_api_id: externalApiId }
            });
            if (team) return team;
        }

        // 2. 종목 특화 ID 기반 매칭 (KBO 등)
        if (leagueCode) {
            let possibleApiId = '';
            if (leagueCode === 'KBO') {
                const shortName = this.getKboShortName(name);
                if (shortName) possibleApiId = `KBO_${shortName}`;
            }

            if (possibleApiId) {
                const team = await this.prisma.teams.findFirst({
                    where: { league_id: leagueId, external_api_id: possibleApiId }
                });
                if (team) return team;
            }
        }

        if (!name) return null;
        const cleanName = name.trim();

        // 3. 이름 완벽 일치 검색
        const exactMatch = await this.prisma.teams.findFirst({
            where: { league_id: leagueId, name: cleanName }
        });
        if (exactMatch) return exactMatch;

        // 4. 대소문자 무시 완벽 일치
        const caseInsensitiveMatch = await this.prisma.teams.findFirst({
            where: {
                league_id: leagueId,
                name: { equals: cleanName, mode: 'insensitive' }
            }
        });
        if (caseInsensitiveMatch) return caseInsensitiveMatch;

        // 5. 정규화된 이름 기반 검색 (특수문자, FC/Utd 등 제거)
        const normalizedName = this.normalizeTeamName(cleanName);
        const normMatch = await this.prisma.teams.findFirst({
            where: {
                league_id: leagueId,
                name: { contains: normalizedName, mode: 'insensitive' }
            }
        });
        if (normMatch) return normMatch;

        // 6. 리그 전체 팀 조회 후 부분 일치 검색
        const allLeagueTeams = await this.prisma.teams.findMany({
            where: { league_id: leagueId }
        });

        return this.findTeamFromCache(allLeagueTeams, cleanName, externalApiId);
    }

    /**
     * 캐시된 팀 목록에서 팀 검색 (DB 조회 없음)
     */
    private findTeamFromCache(teams: any[], name?: string, externalApiId?: string) {
        if (!teams || teams.length === 0) return null;

        // external_api_id 기반 검색
        if (externalApiId) {
            const byId = teams.find(t => t.external_api_id === externalApiId);
            if (byId) return byId;
        }

        if (!name) return null;
        const cleanName = name.trim();

        // 정확한 이름 일치
        const exact = teams.find(t => t.name === cleanName);
        if (exact) return exact;

        // 대소문자 무시 일치
        const caseInsensitive = teams.find(t => t.name.toLowerCase() === cleanName.toLowerCase());
        if (caseInsensitive) return caseInsensitive;

        // 악센트 제거 및 특수문자 제거한 비교용 이름 생성
        const simplifier = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9가-힣]/g, "").toLowerCase();
        const simpleCleanName = simplifier(cleanName);

        const found = teams.find(t => {
            const simpleDbName = simplifier(t.name);
            return simpleCleanName.includes(simpleDbName) || simpleDbName.includes(simpleCleanName);
        });
        return found || null;
    }

    /**
     * 팀 이름 정규화 (매칭 확률을 높이기 위해 불필요한 단어 제거)
     */
    private normalizeTeamName(name: string): string {
        return name
            .replace(/\s(FC|United|Utd|CF|AC|RC|SC|AS|Real|City|Hotspur)$|^(FC|Real)\s/i, '')
            .trim();
    }

    private getKboShortName(name: string): string | null {
        const map: any = {
            '삼성': 'SS', '삼성 라이온즈': 'SS', 'Samsung': 'SS',
            'NC': 'NC', 'NC 다이노스': 'NC',
            'LG': 'LG', 'LG 트윈스': 'LG',
            'KT': 'KT', 'KT 위즈': 'KT',
            'SSG': 'SK', 'SSG 랜더스': 'SK', 'SK': 'SK',
            '키움': 'WO', '키움 히어로즈': 'WO', '히어로즈': 'WO',
            '한화': 'HH', '한화 이글스': 'HH',
            '롯데': 'LT', '롯데 자이언츠': 'LT',
            '두산': 'OB', '두산 베어스': 'OB',
            'KIA': 'HT', 'KIA 타이거즈': 'HT', '기아': 'HT',
        };

        // 1. 정확한 매핑 확인
        if (map[name]) return map[name];

        // 2. 포함 관계 확인 (예: '삼성'이 포함되어 있는지)
        for (const [key, value] of Object.entries(map)) {
            if (name.includes(key as string)) return value as string;
        }

        return null;
    }

    private async getLeagueByExternalId(code: string) {
        const leagueMap: any = {
            'PL': 'EPL',
            'BL1': 'Bundesliga',
            'PD': 'La Liga',
            'SA': 'Serie A'
        };
        const name = leagueMap[code] || code;
        const league = await this.prisma.leagues.findFirst({ where: { name: { contains: name } } });
        if (!league) return null;
        return { ...league, code };
    }

    private mapFootballStatus(status: string) {
        if (status === 'FINISHED') return 'finished';
        if (status === 'IN_PLAY') return 'ongoing';
        return 'scheduled';
    }

    private mapKboStatus(status: string) {
        if (status === 'RESULT') return 'finished';
        if (status === 'RUN') return 'ongoing';
        return 'scheduled';
    }

    private mapPandaStatus(status: string) {
        if (status === 'finished') return 'finished';
        if (status === 'running') return 'ongoing';
        return 'scheduled';
    }

    private mapEspnStatus(status: string) {
        if (status === 'STATUS_FINAL') return 'finished';
        if (status === 'STATUS_IN_PROGRESS') return 'ongoing';
        return 'scheduled';
    }
}
