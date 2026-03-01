import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { FootballService } from '../football/football.service';
import { PandaScoreService } from '../pandascore/pandascore.service';
import { EspnService } from '../espn/espn.service';
import { KboService } from '../kbo/kbo.service';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        private prisma: PrismaService,
        private footballService: FootballService,
        private pandaScoreService: PandaScoreService,
        private espnService: EspnService,
        private kboService: KboService,
    ) { }

    /**
     * 전체 일정 동기화 (매 12시간마다 - 새로운 일정 확보용)
     */
    @Cron('0 0 */12 * * *')
    async syncAll() {
        this.logger.log('[CRON_FULL] Starting full schedule synchronization...');

        const results = {
            football: await this.syncFootball(),
            lck: await this.syncLck(),
            espn: await this.syncEspn(),
            kbo: await this.syncKbo(),
        };

        this.logger.log('[CRON_FULL] Full synchronization completed');
        return results;
    }

    /**
     * 라이브 스코어 동기화 (매 30분마다 - 현재 진행중이거나 오늘 경기 점수 업데이트)
     */
    @Cron('0 */30 * * * *')
    async syncLiveScores() {
        this.logger.log('[CRON_LIVE] Starting live scores synchronization...');
        // 스코어 업데이트를 위해 syncAll을 재사용하거나 
        // 추후 API별로 '오늘' 경기 전용 엔드포인트가 있다면 분리 가능
        // 현재는 API들이 전체 혹은 최근 일정을 주므로 동일하게 수행하되 upsert 로직에서 쓰기 최소화
        await this.syncAll();
        this.logger.log('[CRON_LIVE] Live scores synchronization completed');
    }

    /**
     * 유럽 축구 데이터 동기화
     */
    private async syncFootball() {
        const data = await this.footballService.getAllLeagueMatches();
        let count = 0;

        for (const [leagueCode, leagueData] of Object.entries(data)) {
            const matches = (leagueData as any).matches || [];
            const league = await this.getLeagueByExternalId(leagueCode);
            if (!league) {
                this.logger.warn(`League not found for code: ${leagueCode}`);
                continue;
            }

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
                count++;
            }
        }
        return count;
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
     * ESPN 스포츠 (NBA, MLB, NFL, NHL) 동기화
     */
    private async syncEspn() {
        const results = await this.espnService.getAllSportsSchedule();
        let totalCount = 0;

        for (const [sportCode, data] of Object.entries(results)) {
            const events = (data as any).events || [];
            const league = await this.prisma.leagues.findFirst({ where: { name: { contains: sportCode } } });
            if (!league) continue;

            for (const e of events) {
                const competition = e.competitions[0];
                const home = competition.competitors.find((c: any) => c.homeAway === 'home');
                const away = competition.competitors.find((c: any) => c.homeAway === 'away');

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
            }
        }
        return totalCount;
    }

    // --- 헬퍼 메서드들 ---

    private async upsertMatch(data: any) {
        if (!data.home_team_name || !data.away_team_name) return;

        const homeTeam = await this.findTeam(
            data.home_team_name,
            data.league_id,
            data.league_code,
            data.home_team_external_id,
        );
        const awayTeam = await this.findTeam(
            data.away_team_name,
            data.league_id,
            data.league_code,
            data.away_team_external_id,
        );

        const matchesModel = (this.prisma as any).matches;

        if (!matchesModel) {
            const availableModels = Object.keys(this.prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
            this.logger.error(`matches model not found. Available models: ${availableModels.join(', ')}`);
            this.logger.warn('Please run "npx prisma generate" and RESTART your server command.');
            return;
        }

        // --- Smart Upsert: 변경 사항이 있을 때만 DB 쓰기 발생 ---
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

            return matchesModel.update({
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
        }

        if (!homeTeam || !awayTeam) {
            this.logger.warn(`[SYNC_MATCH_FAIL] League: ${data.league_code}, Date: ${data.match_at.toISOString()}`);
            if (!homeTeam) this.logger.warn(`  - Home Team NOT Found: "${data.home_team_name}"`);
            if (!awayTeam) this.logger.warn(`  - Away Team NOT Found: "${data.away_team_name}"`);
        }

        return matchesModel.create({
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
    }

    private async findTeam(name: string, leagueId: string, leagueCode?: string, externalApiId?: string) {
        if (!name && !externalApiId) return null;

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

        // 6. 리그 범용 특화: 부분 일치 기반 검색 (KBO, LCK, La Liga 등)
        const allLeagueTeams = await this.prisma.teams.findMany({
            where: { league_id: leagueId }
        });

        // 악센트 제거 및 특수문자 제거한 비교용 이름 생성
        const simplifier = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9가-힣]/g, "").toLowerCase();
        const simpleCleanName = simplifier(cleanName);

        const found = allLeagueTeams.find(t => {
            const simpleDbName = simplifier(t.name);
            return simpleCleanName.includes(simpleDbName) || simpleDbName.includes(simpleCleanName);
        });
        if (found) return found;

        return null;
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
