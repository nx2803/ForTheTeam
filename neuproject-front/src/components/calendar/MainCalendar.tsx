'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { matchService } from '@/lib/services/matchService';
import { useAuth } from '@/hooks/useAuth';
import { Team } from '@/types/team';
import { useTheme } from '@/hooks/useTheme';
import { useMatches } from '@/hooks/useMatches';
import { getDDay } from '@/lib/dateUtils';
import apiClient from '@/lib/apiClient';

import CalendarHeader from './CalendarHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyGuideOverlay from './EmptyGuideOverlay';
import MainCalendarSkeleton from '@/components/ui/Skeletons';

import CalendarGrid from './CalendarGrid';
import MatchListView from './MatchListView';
import StandingsView from './StandingsView';

import { useTeamStore } from '@/store/teamStore';
import { useCalendarStore } from '@/store/calendarStore';

// [New Tech] Error Boundary to handle suspense query errors locally
class QueryErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("QueryErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

interface MatchesViewProps {
    currentDate: Date;
    viewMode: 'calendar' | 'list';
}

// Sub-component that consumes useMatches query and suspends locally
function MatchesView({ currentDate, viewMode }: MatchesViewProps) {
    const { myTeams } = useTeamStore();
    const { mainTeam } = useTheme();
    const selectedTeamId = mainTeam?.id || null;

    const { data: displayedEvents = [] } = useMatches(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        myTeams,
        selectedTeamId
    );

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    if (viewMode === 'calendar') {
        return (
            <CalendarGrid
                currentDate={currentDate}
                displayedEvents={displayedEvents}
                startDay={startDay}
                daysInMonth={daysInMonth}
            />
        );
    }

    return (
        <MatchListView
            displayedEvents={displayedEvents}
            getDDay={getDDay}
        />
    );
}

interface MainCalendarProps {
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
}

export default function MainCalendar({ isPending, startTransition }: MainCalendarProps) {
    const { myTeams } = useTeamStore();
    const { currentDate: currentDateStr, viewMode } = useCalendarStore();
    const currentDate = new Date(currentDateStr);

    const { themeColors } = useTheme();
    const client = useQueryClient();
    const { isLoggedIn, user } = useAuth();

    // [New Tech] Prefetch next/prev months to make transitions instant
    React.useEffect(() => {
        const fetchMonth = (offset: number) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            
            client.prefetchQuery({
                queryKey: ['matches', y, m, isLoggedIn ? user?.uid : 'guest', myTeams.map(t => t.id).sort().join(',')],
                queryFn: () => matchService.getCalendarMatches({
                    year: y,
                    month: m,
                    memberUid: isLoggedIn ? user?.uid : undefined,
                }),
                staleTime: 1000 * 60 * 5,
            });
        };

        fetchMonth(1);  // Prefetch Next Month
        fetchMonth(-1); // Prefetch Prev Month

        // 3개 주요 리그 순위표 프리페칭 추가
        const leaguesToPrefetch = [
            'b0f16e7b-72d2-4e94-861e-546fe11ad4ea', // KBO
            '08dec493-da36-4afa-a43c-6548f6baada1', // LCK
            '9a268762-c365-49bf-aa5e-28982e2bde61'  // EPL
        ];
        
        leaguesToPrefetch.forEach(leagueId => {
            client.prefetchQuery({
                queryKey: ['standings', leagueId],
                queryFn: async () => {
                    const response = await apiClient.get(`/standings/${leagueId}`);
                    return response.data;
                },
                staleTime: 1000 * 60 * 5,
            });
        });
    }, [currentDate, client, user?.uid, isLoggedIn, myTeams]);

    return (
        <div className="w-full h-full flex flex-col p-2 md:p-4 text-zinc-300">
            <CalendarHeader isPending={isPending} startTransition={startTransition} />

            <div
                className={`flex-1 bg-[#18181b] border relative shadow-2xl flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-60' : 'opacity-100'}`}
                style={{ borderColor: themeColors.secondary }}
            >
                {/* [New Tech] Loading progress bar for Transition */}
                {isPending && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-50 overflow-hidden">
                        <motion.div 
                            className="h-full bg-current" 
                            style={{ backgroundColor: themeColors.primary }}
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </div>
                )}

                {/* Inner Suspense and Error Boundary so outer frame doesn't drop */}
                <QueryErrorBoundary
                    fallback={
                        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                            <div className="font-oswald text-2xl italic font-black text-sport-red tracking-tighter">
                                FAILED TO LOAD DATA
                            </div>
                        </div>
                    }
                >
                    <Suspense fallback={<MainCalendarSkeleton />}>
                        {viewMode === 'calendar' || viewMode === 'list' ? (
                            <MatchesView
                                currentDate={currentDate}
                                viewMode={viewMode}
                            />
                        ) : (
                            <StandingsView />
                        )}
                    </Suspense>
                </QueryErrorBoundary>

                {/* Guide Overlay for new users */}
                {myTeams.length === 0 && <EmptyGuideOverlay />}
            </div>
        </div>
    );
}
