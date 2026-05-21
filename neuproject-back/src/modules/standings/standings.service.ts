import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FootballService } from '../football/football.service';
import { EspnService } from '../espn/espn.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface StandingItem {
  rank: number;
  teamId?: string;
  teamName: string;
  logoUrl?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  winRate?: number;
  gamesBehind?: string;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  extraInfo?: string; // 최근 10경기 성적, 연속 등 추가 정보
}

@Injectable()
export class StandingsService {
  private readonly logger = new Logger(StandingsService.name);
  private readonly CACHE_TTL = 1000 * 60 * 60 * 12; // 12시간 캐시 유지

  constructor(
    private readonly prisma: PrismaService,
    private readonly footballService: FootballService,
    private readonly espnService: EspnService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 특정 리그의 순위표 조회 (캐싱 적용)
   */
  async getStandings(leagueId: string): Promise<StandingItem[]> {
    const cacheKey = `standings:${leagueId}`;
    try {
      const cached = await this.cacheManager.get<StandingItem[]>(cacheKey);
      if (cached) {
        this.logger.log(`[STANDINGS] Returning cached standings for league: ${leagueId}`);
        return cached;
      }
    } catch (err) {
      this.logger.warn(`Cache read error: ${err.message}`);
    }

    // 캐시 미스 시 리그 정보 조회 및 분류
    const league = await this.prisma.leagues.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      throw new Error('League not found');
    }

    let standings: StandingItem[] = [];

    // 리그 종류별 분기
    const name = league.name.toUpperCase();
    if (name.includes('EPL') || name.includes('PREMIER LEAGUE')) {
      standings = await this.fetchFootballStandings(leagueId, 'PL');
    } else if (name.includes('BUNDESLIGA')) {
      standings = await this.fetchFootballStandings(leagueId, 'BL1');
    } else if (name.includes('LA LIGA')) {
      standings = await this.fetchFootballStandings(leagueId, 'PD');
    } else if (name.includes('SERIE A')) {
      standings = await this.fetchFootballStandings(leagueId, 'SA');
    } else if (name.includes('NBA')) {
      standings = await this.fetchEspnStandings(leagueId, 'NBA');
    } else if (name.includes('MLB')) {
      standings = await this.fetchEspnStandings(leagueId, 'MLB');
    } else if (name.includes('NFL')) {
      standings = await this.fetchEspnStandings(leagueId, 'NFL');
    } else if (name.includes('NHL')) {
      standings = await this.fetchEspnStandings(leagueId, 'NHL');
    } else if (name.includes('KBO')) {
      standings = await this.aggregateKboStandings(leagueId);
    } else if (name.includes('LCK')) {
      standings = await this.aggregateLckStandings(leagueId);
    } else {
      this.logger.warn(`No standings logic implemented for league: ${league.name}`);
      standings = [];
    }

    // 캐시에 적재
    if (standings.length > 0) {
      try {
        await this.cacheManager.set(cacheKey, standings, this.CACHE_TTL);
        this.logger.log(`[STANDINGS] Cached standings for league: ${leagueId}`);
      } catch (err) {
        this.logger.warn(`Cache write error: ${err.message}`);
      }
    }

    return standings;
  }

  /**
   * 유럽 축구 (Football-Data.org) 순위 데이터 조회 및 매핑
   */
  private async fetchFootballStandings(leagueId: string, leagueCode: 'PL' | 'BL1' | 'PD' | 'SA'): Promise<StandingItem[]> {
    try {
      const rawData = await this.footballService.getStandings(leagueCode);
      const rawStandings = rawData.standings?.[0]?.table || [];
      const teams = await this.prisma.teams.findMany({ where: { league_id: leagueId } });

      return rawStandings.map((item: any) => {
        const teamName = item.team.name;
        const externalId = `FB_${item.team.id}`;
        // DB의 Team 레코드와 매칭
        const matchedTeam = teams.find(t => t.external_api_id === externalId || t.name === teamName);

        return {
          rank: item.position,
          teamId: matchedTeam?.id,
          teamName: matchedTeam?.name || teamName,
          logoUrl: matchedTeam?.logo_url || item.team.crest,
          played: item.playedGames,
          won: item.won,
          drawn: item.draw,
          lost: item.lost,
          points: item.points,
          goalsFor: item.goalsFor,
          goalsAgainst: item.goalsAgainst,
          goalDifference: item.goalDifference,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to fetch football standings for ${leagueCode}: ${error.message}`);
      return [];
    }
  }

  /**
   * ESPN (MLB, NBA 등) 순위 데이터 조회 및 매핑
   */
  private async fetchEspnStandings(leagueId: string, sportCode: 'NBA' | 'MLB' | 'NFL' | 'NHL'): Promise<StandingItem[]> {
    try {
      const rawData = await this.espnService.getStandings(sportCode);
      const rawStandings = rawData.children || [];
      const teams = await this.prisma.teams.findMany({ where: { league_id: leagueId } });
      const items: StandingItem[] = [];

      // ESPN standings 구조 파싱 (일반적으로 컨퍼런스/디비전 구조로 쪼개져 있음)
      let globalIndex = 1;
      const parseStandingsGroup = (group: any) => {
        if (group.standings) {
          const entries = group.standings.entries || [];
          entries.forEach((entry: any) => {
            const teamData = entry.team;
            const externalId = `ESPN_${sportCode}_${teamData.id}`;
            const matchedTeam = teams.find(t => t.external_api_id === externalId || t.name === teamData.displayName);

            const stats = entry.stats || [];
            const findStat = (name: string) => stats.find((s: any) => s.name === name)?.value ?? 0;

            const won = findStat('wins');
            const lost = findStat('losses');
            const tied = findStat('ties');
            const played = won + lost + tied;
            const winRate = findStat('winPercent');
            const gamesBehind = stats.find((s: any) => s.name === 'gamesBehind')?.displayValue ?? '-';
            const points = findStat('points'); // NHL은 승점 있음

            items.push({
              rank: globalIndex++, // 임시 순위 부여 (디비전별 순위를 리그 전체 순위로 매핑)
              teamId: matchedTeam?.id,
              teamName: matchedTeam?.name || teamData.displayName,
              logoUrl: matchedTeam?.logo_url || teamData.logos?.[0]?.href,
              played,
              won,
              drawn: tied,
              lost,
              points,
              winRate,
              gamesBehind,
            });
          });
        }
        if (group.children) {
          group.children.forEach((c: any) => parseStandingsGroup(c));
        }
      };

      rawStandings.forEach((group: any) => parseStandingsGroup(group));

      // 승률(winRate) 순으로 내림차순 정렬하여 최종 랭킹 재부여
      return items
        .sort((a, b) => {
          if (sportCode === 'NHL') return b.points - a.points; // NHL은 승점순
          return (b.winRate || 0) - (a.winRate || 0);
        })
        .map((item, index) => ({ ...item, rank: index + 1 }));
    } catch (error) {
      this.logger.error(`Failed to fetch ESPN standings for ${sportCode}: ${error.message}`);
      return [];
    }
  }

  /**
   * KBO 순위 DB 자체 집계
   */
  private async aggregateKboStandings(leagueId: string): Promise<StandingItem[]> {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();

      // 올해 시즌에 속하고 완료된 KBO 경기들 가져오기
      const matches = await this.prisma.matches.findMany({
        where: {
          league_id: leagueId,
          status: 'finished',
          match_at: {
            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59Z`),
          },
        },
      });

      const teams = await this.prisma.teams.findMany({ where: { league_id: leagueId } });
      const statsMap = new Map<string, { won: number; lost: number; drawn: number; played: number }>();

      // 초기화
      teams.forEach(t => {
        statsMap.set(t.id, { won: 0, lost: 0, drawn: 0, played: 0 });
      });

      // 경기 데이터 집계
      matches.forEach(m => {
        const homeId = m.home_team_id;
        const awayId = m.away_team_id;
        if (!homeId || !awayId) return;

        const homeStats = statsMap.get(homeId) || { won: 0, lost: 0, drawn: 0, played: 0 };
        const awayStats = statsMap.get(awayId) || { won: 0, lost: 0, drawn: 0, played: 0 };

        homeStats.played++;
        awayStats.played++;

        if (m.home_score > m.away_score) {
          homeStats.won++;
          awayStats.lost++;
        } else if (m.home_score < m.away_score) {
          awayStats.won++;
          homeStats.lost++;
        } else {
          homeStats.drawn++;
          awayStats.drawn++;
        }

        statsMap.set(homeId, homeStats);
        statsMap.set(awayId, awayStats);
      });

      // StandingItem 배열로 가공
      const items: StandingItem[] = teams.map(t => {
        const stats = statsMap.get(t.id) || { won: 0, lost: 0, drawn: 0, played: 0 };
        // KBO 승률 계산법: 승리 / (승리 + 패배)
        const denominator = stats.won + stats.lost;
        const winRate = denominator > 0 ? parseFloat((stats.won / denominator).toFixed(3)) : 0;

        return {
          rank: 0,
          teamId: t.id,
          teamName: t.name,
          logoUrl: t.logo_url,
          played: stats.played,
          won: stats.won,
          drawn: stats.drawn,
          lost: stats.lost,
          points: 0,
          winRate,
        };
      });

      // 승률 내림차순 정렬 및 승수 내림차순 정렬
      items.sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate! - a.winRate!;
        return b.won - a.won;
      });

      // 게임차 계산
      const leader = items[0];
      return items.map((item, index) => {
        let gamesBehind = '-';
        if (index > 0 && leader) {
          // 게임차 계산공식: ((1위승리 - 내승리) + (내패배 - 1위패배)) / 2
          const gb = ((leader.won - item.won) + (item.lost - leader.lost)) / 2;
          gamesBehind = gb.toString();
        }
        return {
          ...item,
          rank: index + 1,
          gamesBehind,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to aggregate KBO standings: ${error.message}`);
      return [];
    }
  }

  /**
   * LCK 순위 DB 자체 집계
   */
  private async aggregateLckStandings(leagueId: string): Promise<StandingItem[]> {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();

      const matches = await this.prisma.matches.findMany({
        where: {
          league_id: leagueId,
          status: 'finished',
          match_at: {
            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59Z`),
          },
        },
      });

      const teams = await this.prisma.teams.findMany({ where: { league_id: leagueId } });
      const statsMap = new Map<string, { won: number; lost: number; played: number; points: number; goalsFor: number; goalsAgainst: number }>();

      // 초기화
      teams.forEach(t => {
        statsMap.set(t.id, { won: 0, lost: 0, played: 0, points: 0, goalsFor: 0, goalsAgainst: 0 });
      });

      // 경기 데이터 집계 (LCK는 매치 스코어가 2-0, 2-1 등으로 집계됨)
      matches.forEach(m => {
        const homeId = m.home_team_id;
        const awayId = m.away_team_id;
        if (!homeId || !awayId) return;

        const homeStats = statsMap.get(homeId) || { won: 0, lost: 0, played: 0, points: 0, goalsFor: 0, goalsAgainst: 0 };
        const awayStats = statsMap.get(awayId) || { won: 0, lost: 0, played: 0, points: 0, goalsFor: 0, goalsAgainst: 0 };

        homeStats.played++;
        awayStats.played++;

        // 세트 스코어 누적
        homeStats.goalsFor += m.home_score;
        homeStats.goalsAgainst += m.away_score;
        awayStats.goalsFor += m.away_score;
        awayStats.goalsAgainst += m.home_score;

        // 매치 승패
        if (m.home_score > m.away_score) {
          homeStats.won++;
          awayStats.lost++;
        } else if (m.home_score < m.away_score) {
          awayStats.won++;
          homeStats.lost++;
        }

        statsMap.set(homeId, homeStats);
        statsMap.set(awayId, awayStats);
      });

      const items: StandingItem[] = teams.map(t => {
        const stats = statsMap.get(t.id) || { won: 0, lost: 0, played: 0, points: 0, goalsFor: 0, goalsAgainst: 0 };
        // LCK 승점 = 세트 득실차 (득실차가 순위결정의 주요 요인)
        const diff = stats.goalsFor - stats.goalsAgainst;

        return {
          rank: 0,
          teamId: t.id,
          teamName: t.name,
          logoUrl: t.logo_url,
          played: stats.played,
          won: stats.won,
          drawn: 0,
          lost: stats.lost,
          points: diff, // 세트 득실차를 points 컬럼에 매핑
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          goalDifference: diff,
        };
      });

      // LCK 순위 결정 방식: 매치 승리수 -> 세트 득실차(points) -> 승자승(생략) 순
      return items
        .sort((a, b) => {
          if (b.won !== a.won) return b.won - a.won;
          return b.points - a.points;
        })
        .map((item, index) => ({ ...item, rank: index + 1 }));
    } catch (error) {
      this.logger.error(`Failed to aggregate LCK standings: ${error.message}`);
      return [];
    }
  }
}
