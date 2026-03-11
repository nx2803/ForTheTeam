import { useSuspenseQuery } from '@tanstack/react-query';
import { matchService } from '@/lib/services/matchService';
import { useAuth } from '@/hooks/useAuth';
import { Team } from '@/types/team';

export function useMatches(
    year: number, 
    month: number, 
    myTeams: Team[] = [], 
    selectedTeamId: string | number | null = null
) {
    const { user, isLoggedIn } = useAuth();

    return useSuspenseQuery({
        queryKey: ['matches', year, month, isLoggedIn ? user?.uid : 'guest'],
        queryFn: () => matchService.getCalendarMatches({
            year,
            month,
            memberUid: isLoggedIn ? user?.uid : undefined,
        }),
        select: (rawData) => {
            // 1. 기본 데이터 포맷팅
            const formattedMatches = rawData.map((m: any) => {
                const isRace = !m.home_team_id && !m.away_team_id;
                const matchDate = new Date(m.match_at);
                const isUTC = m.match_at.includes('Z') || m.match_at.includes('+');

                let dateStr, timeStr;

                if (isUTC && !isNaN(matchDate.getTime())) {
                    const y = matchDate.getFullYear();
                    const mo = String(matchDate.getMonth() + 1).padStart(2, '0');
                    const d = String(matchDate.getDate()).padStart(2, '0');
                    dateStr = `${y}-${mo}-${d}`;
                    timeStr = matchDate.toTimeString().slice(0, 5);
                } else {
                    const parts = m.match_at.split('T');
                    dateStr = parts[0];
                    timeStr = parts[1] ? parts[1].slice(0, 5) : '00:00';
                }

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
            });

            // 2. 필터링 로직
            let filtered = formattedMatches;
            if (myTeams.length > 0) {
                const myTeamIds = myTeams.map(t => t.id);
                filtered = filtered.filter((e: any) => {
                    if (e.type === 'race') {
                        return myTeams.some((t: Team) => t.leagueId === e.league?.id);
                    }
                    return myTeamIds.includes(e.teamId) || (e.awayTeam && myTeamIds.includes(e.awayTeam.id));
                });
            } else {
                filtered = [];
            }

            if (selectedTeamId) {
                const activeT = myTeams.find(t => t.id === selectedTeamId);
                filtered = filtered.filter((e: any) => {
                    if (e.type === 'race') {
                        return activeT?.leagueId === e.league?.id;
                    }
                    return e.teamId === selectedTeamId || (e.awayTeam && e.awayTeam.id === selectedTeamId);
                });
            }

            // 3. 정렬 로직
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            return [...filtered].sort((a, b) => {
                const dateA = new Date(`${a.date}T00:00:00`);
                const dateB = new Date(`${b.date}T00:00:00`);
                const timeA = new Date(`${a.date}T${a.time}`).getTime() || 0;
                const timeB = new Date(`${b.date}T${b.time}`).getTime() || 0;

                const isFinishedA = a.score !== null;
                const isFinishedB = b.score !== null;
                const isPastA = dateA < now || isFinishedA;
                const isPastB = dateB < now || isFinishedB;

                if (isPastA !== isPastB) return isPastA ? 1 : -1;
                return !isPastA ? timeA - timeB : timeB - timeA;
            });
        },
    });
}
