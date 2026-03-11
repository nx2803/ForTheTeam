'use client';

import React, { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { matchService } from '@/lib/services/matchService';
import { useAuth } from '@/hooks/useAuth';
import { Team } from '@/types/team';
import { useTheme } from '@/hooks/useTheme';
import { useMatches } from '@/hooks/useMatches';
import { getDDay } from '@/lib/dateUtils';

import CalendarHeader from './CalendarHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamic imports for bundle optimization
const CalendarGrid = dynamic(() => import('./CalendarGrid'), {
    loading: () => <LoadingSpinner size="lg" text="GRID LOADING..." />
});
const MatchListView = dynamic(() => import('./MatchListView'), {
    loading: () => <LoadingSpinner size="lg" text="LIST LOADING..." />
});


import { useTeamStore } from '@/store/teamStore';
import { useCalendarStore } from '@/store/calendarStore';

interface MainCalendarProps {
    isPending?: boolean;
    startTransition?: (callback: () => void) => void;
}

export default function MainCalendar({ isPending, startTransition }: MainCalendarProps) {
    const { myTeams } = useTeamStore();
    const { currentDate: currentDateStr, viewMode, setViewMode, nextMonth, prevMonth } = useCalendarStore();
    const currentDate = new Date(currentDateStr);

    const { mainTeam, setMainTeam, themeColors } = useTheme();
    const selectedTeamId = mainTeam?.id || null;

    const client = useQueryClient();
    const { isLoggedIn, user } = useAuth();

    // useMatches 훅 호출 (Suspense 대응)
    const { data: displayedEvents = [], isError } = useMatches(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        myTeams,
        selectedTeamId
    );

    // [New Tech] Prefetch next/prev months to make transitions instant
    React.useEffect(() => {
        const fetchMonth = (offset: number) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            
            client.prefetchQuery({
                queryKey: ['matches', y, m, isLoggedIn ? user?.uid : 'guest'],
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
    }, [currentDate, client, user?.uid, isLoggedIn]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    if (isError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                <div className="font-oswald text-2xl italic font-black text-sport-red tracking-tighter">
                    FAILED TO LOAD DATA
                </div>
            </div>
        );
    }

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
                {viewMode === 'calendar' ? (
                    <CalendarGrid
                        currentDate={currentDate}
                        displayedEvents={displayedEvents}
                        startDay={startDay}
                        daysInMonth={daysInMonth}
                    />
                ) : (
                    <MatchListView
                        displayedEvents={displayedEvents}
                        getDDay={getDDay}
                    />
                )}
            </div>
        </div>
    );
}
