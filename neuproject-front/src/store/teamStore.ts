import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team } from '@/types/team';
import { getFollowedTeams, toggleTeamFollow } from '@/lib/teamsApi';

interface TeamState {
    myTeams: Team[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    setMyTeams: (teams: Team[]) => void;
    fetchFollowedTeams: (memberUid: string) => Promise<void>;
    toggleTeam: (team: Team, memberUid?: string) => Promise<void>;
    reorderTeams: (newTeams: Team[], memberUid?: string) => void;
    clearMyTeams: () => void;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            myTeams: [],
            isLoading: false,
            error: null,

            setMyTeams: (teams) => set({ myTeams: teams }),

            fetchFollowedTeams: async (memberUid) => {
                set({ isLoading: true, error: null });
                try {
                    const followedTeams = await getFollowedTeams(memberUid);
                    const formattedTeams: Team[] = followedTeams.map(t => ({
                        id: t.id,
                        name: t.name,
                        logo: '', // 기본 로고 로직은 컴포넌트나 normalizeTeam에서 처리
                        logoUrl: t.logo_url || undefined,
                        mainColor: t.primary_color || '#ff4655',
                        subColor: t.secondary_color || '#000000',
                        leagueId: t.league_id,
                        sport: (t.leagues as any)?.category || 'Sports'
                    }));

                    // 저장된 순서 복원
                    const savedOrder = localStorage.getItem(`teamOrder_${memberUid}`);
                    if (savedOrder) {
                        try {
                            const orderArr: string[] = JSON.parse(savedOrder);
                            formattedTeams.sort((a, b) => {
                                const idxA = orderArr.indexOf(a.id);
                                const idxB = orderArr.indexOf(b.id);
                                if (idxA === -1 && idxB === -1) return 0;
                                if (idxA === -1) return 1;
                                if (idxB === -1) return -1;
                                return idxA - idxB;
                            });
                        } catch (e) {
                            console.error("Failed to parse saved order", e);
                        }
                    }
                    set({ myTeams: formattedTeams, isLoading: false });
                } catch (error) {
                    set({ error: '팔로우한 팀 목록을 가져오는데 실패했습니다', isLoading: false });
                }
            },

            toggleTeam: async (team, memberUid) => {
                const { myTeams } = get();
                const isCurrentlyFollowed = myTeams.find(t => t.id === team.id);
                
                // 낙관적 업데이트
                let newTeams: Team[];
                if (isCurrentlyFollowed) {
                    newTeams = myTeams.filter(t => t.id !== team.id);
                } else {
                    newTeams = [...myTeams, team];
                }
                
                set({ myTeams: newTeams });
                if (memberUid) {
                    localStorage.setItem(`teamOrder_${memberUid}`, JSON.stringify(newTeams.map(t => t.id)));
                    try {
                        await toggleTeamFollow(team.id, memberUid);
                    } catch (error) {
                        console.error('Failed to toggle team follow in DB:', error);
                        // 실패 시 롤백
                        set({ myTeams });
                    }
                }
            },

            reorderTeams: (newTeams, memberUid) => {
                set({ myTeams: newTeams });
                if (memberUid) {
                    localStorage.setItem(`teamOrder_${memberUid}`, JSON.stringify(newTeams.map(t => t.id)));
                }
            },

            clearMyTeams: () => set({ myTeams: [], error: null })
        }),
        {
            name: 'team-storage',
            partialize: (state) => ({ myTeams: state.myTeams }), // myTeams만 로컬 스토리지에 유지
        }
    )
);
