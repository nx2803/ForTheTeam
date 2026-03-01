'use client';

import { useQuery } from '@tanstack/react-query';
import { matchService } from '@/lib/services/matchService';
import { useAuth } from '@/hooks/useAuth';

export function useMatches(year: number, month: number) {
    const { user, isLoggedIn } = useAuth();

    return useQuery({
        queryKey: ['matches', year, month, isLoggedIn ? user?.uid : 'guest'],
        queryFn: () => matchService.getCalendarMatches({
            year,
            month,
            memberUid: isLoggedIn ? user?.uid : undefined,
        }),
        // 데이터 변환 로직 (기존 MainCalendar의 formatted 로직)
        select: (data) => data.map((m: any) => {
            const isRace = !m.home_team_id && !m.away_team_id;
            const matchDate = new Date(m.match_at);
            const isUTC = m.match_at.includes('Z') || m.match_at.includes('+');

            let dateStr, timeStr;

            if (isUTC && !isNaN(matchDate.getTime())) {
                const year = matchDate.getFullYear();
                const month = String(matchDate.getMonth() + 1).padStart(2, '0');
                const day = String(matchDate.getDate()).padStart(2, '0');
                dateStr = `${year}-${month}-${day}`;
                timeStr = matchDate.toTimeString().slice(0, 5);
            } else {
                const parts = m.match_at.split('T');
                dateStr = parts[0];
                timeStr = parts[1] ? parts[1].slice(0, 5) : '00:00';
            }

            // Helper to normalize team object
            const normalizeTeam = (team: any) => {
                if (!team) return null;
                return {
                    id: team.id,
                    name: team.name,
                    logo: team.logo || '🛡️',
                    logoUrl: team.logo_url || team.logoUrl,
                    mainColor: team.primary_color || team.mainColor || '#FFFFFF',
                    subColor: team.secondary_color || team.subColor || '#000000',
                };
            };

            return {
                id: m.id,
                teamId: m.home_team_id,
                awayTeamId: m.away_team_id,
                homeTeamName: m.home_team_name,
                awayTeamName: m.away_team_name,
                homeTeamAbbr: m.home_team?.abbreviation,
                awayTeamAbbr: m.away_team?.abbreviation,
                date: dateStr,
                time: timeStr,
                type: isRace ? 'race' : 'match',
                score: m.status === 'finished' ? `${m.home_score}:${m.away_score}` : null,
                homeTeam: normalizeTeam(m.home_team),
                awayTeam: normalizeTeam(m.away_team),
                league: m.leagues,
                venue: m.venue
            };
        }),
    });
}
