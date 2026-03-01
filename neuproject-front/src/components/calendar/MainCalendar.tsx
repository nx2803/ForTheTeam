'use client';

import React, { useState, useMemo } from 'react';
import { Team } from '@/types/team';
import { useTheme } from '@/hooks/useTheme';
import { useMatches } from '@/hooks/useMatches';
import { getDDay } from '@/lib/dateUtils';

import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MatchListView from './MatchListView';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MainCalendarProps {
    myTeams: Team[];
    setMyTeams?: (teams: Team[]) => void;
}

export default function MainCalendar({ myTeams, setMyTeams }: MainCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const { mainTeam, setMainTeam, themeColors } = useTheme();
    const selectedTeamId = mainTeam?.id || null;

    // React Query를 통한 데이터 페칭
    const { data: matches = [], isLoading, isError } = useMatches(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
    );

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    // 필터링 및 정렬 로직 (메모이제이션)
    const displayedEvents = useMemo(() => {
        let events = matches;

        if (myTeams.length > 0) {
            const myTeamIds = myTeams.map(t => t.id);
            events = events.filter((e: any) => {
                if (e.type === 'race') {
                    return myTeams.some((t: Team) => t.leagueId === e.league?.id);
                }
                return myTeamIds.includes(e.teamId) || (e.awayTeam && myTeamIds.includes(e.awayTeam.id));
            });
        } else {
            events = [];
        }

        if (selectedTeamId) {
            const activeT = myTeams.find(t => t.id === selectedTeamId);
            events = events.filter((e: any) => {
                if (e.type === 'race') {
                    return activeT?.leagueId === e.league?.id;
                }
                return e.teamId === selectedTeamId || (e.awayTeam && e.awayTeam.id === selectedTeamId);
            });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return [...events].sort((a, b) => {
            const dateA = new Date(`${a.date}T00:00:00`);
            const dateB = new Date(`${b.date}T00:00:00`);
            const timeA = new Date(`${a.date}T${a.time}`).getTime() || 0;
            const timeB = new Date(`${b.date}T${b.time}`).getTime() || 0;

            const isFinishedA = a.score !== null;
            const isFinishedB = b.score !== null;
            const isPastA = dateA < now || isFinishedA;
            const isPastB = dateB < now || isFinishedB;

            // 1. 미래 경기(오늘 포함/미완료) vs 과거 경기(지났거나 완료됨)
            if (isPastA !== isPastB) {
                return isPastA ? 1 : -1;
            }

            // 2. 같은 카테고리(둘 다 미래 또는 둘 다 과거) 내에서의 정렬
            if (!isPastA) {
                // 미래/오늘 경기: 가까운 순서대로 (오름차순)
                return timeA - timeB;
            } else {
                // 과거 경기: 최근 끝난 순서대로 (내림차순)
                return timeB - timeA;
            }
        });
    }, [matches, myTeams, selectedTeamId]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                <LoadingSpinner size="xl" text="LOADING SCHEDULE" />
            </div>
        );
    }

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
            <CalendarHeader
                currentDate={currentDate}
                viewMode={viewMode}
                setViewMode={setViewMode}
                nextMonth={nextMonth}
                prevMonth={prevMonth}
                myTeams={myTeams}
                setMyTeams={setMyTeams}
                mainTeam={mainTeam}
                setMainTeam={setMainTeam}
                themeColors={themeColors}
            />

            <div
                className="flex-1 bg-[#18181b] border relative shadow-2xl flex flex-col overflow-hidden"
                style={{ borderColor: themeColors.secondary }}
            >
                {viewMode === 'calendar' ? (
                    <CalendarGrid
                        currentDate={currentDate}
                        displayedEvents={displayedEvents}
                        myTeams={myTeams}
                        themeColors={themeColors}
                        startDay={startDay}
                        daysInMonth={daysInMonth}
                    />
                ) : (
                    <MatchListView
                        displayedEvents={displayedEvents}
                        myTeams={myTeams}
                        themeColors={themeColors}
                        getDDay={getDDay}
                    />
                )}
            </div>
        </div>
    );
}
