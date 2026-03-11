'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
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

interface MainCalendarProps {}

export default function MainCalendar({}: MainCalendarProps) {
    const { myTeams } = useTeamStore();
    const { currentDate: currentDateStr, viewMode, setViewMode, nextMonth, prevMonth } = useCalendarStore();
    const currentDate = new Date(currentDateStr);

    const { mainTeam, setMainTeam, themeColors } = useTheme();
    const selectedTeamId = mainTeam?.id || null;

    // useMatches 훅에서 필터링 및 정렬이 완료된 데이터를 가져옴
    const { data: displayedEvents = [], isError } = useMatches(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        myTeams,
        selectedTeamId
    );

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
            <CalendarHeader />

            <div
                className="flex-1 bg-[#18181b] border relative shadow-2xl flex flex-col overflow-hidden"
                style={{ borderColor: themeColors.secondary }}
            >
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
