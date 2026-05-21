import { useSuspenseQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

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
    extraInfo?: string;
}

export function useStandings(leagueId: string | null) {
    return useSuspenseQuery<StandingItem[]>({
        queryKey: ['standings', leagueId],
        queryFn: async () => {
            if (!leagueId) return [];
            const response = await apiClient.get<StandingItem[]>(`/standings/${leagueId}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 30, // 30분 캐시 유지
        gcTime: 1000 * 60 * 60,    // 1시간 가비지 컬렉션
    });
}
