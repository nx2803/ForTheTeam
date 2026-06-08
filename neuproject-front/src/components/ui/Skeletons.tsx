'use client';

import React from 'react';
import { useCalendarStore } from '@/store/calendarStore';

// 1. 캘린더 그리드 뼈대 컴포넌트
export function CalendarGridSkeleton() {
    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Days Header (SUN ~ SAT) */}
            <div className="hidden md:grid grid-cols-7 border-b border-zinc-800 bg-white/2 shrink-0">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <div key={d} className="py-3 text-center font-oswald text-lg text-zinc-500 font-bold uppercase tracking-[0.2em] border-r border-zinc-800/50 last:border-r-0">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid Cells (35 cells) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-7 auto-rows-[140px] md:grid-rows-5 md:auto-rows-fr border-t border-l border-zinc-800 no-scrollbar overflow-hidden">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div
                        key={i}
                        className="relative border-r border-b border-zinc-800 min-h-35 md:min-h-0 p-3 flex flex-col bg-zinc-900/10 space-y-3"
                    >
                        {/* Day Number placeholder */}
                        <div className="flex justify-between items-start">
                            <div className="w-7 h-7 bg-zinc-800/70 animate-pulse rounded" />
                            {i === 15 && (
                                <div className="w-12 h-5 bg-zinc-800/50 animate-pulse rounded" />
                            )}
                        </div>
                        {/* Event list placeholder */}
                        <div className="flex-1 space-y-2 overflow-hidden">
                            {(i % 3 === 0 || i % 5 === 0) && (
                                <div className="w-full h-7 bg-zinc-800/40 animate-pulse rounded border border-zinc-800/50 flex items-center justify-between px-2">
                                    <div className="w-1/2 h-2.5 bg-zinc-700/40 rounded" />
                                    <div className="w-6 h-2.5 bg-zinc-700/40 rounded" />
                                </div>
                            )}
                            {(i % 4 === 0) && (
                                <div className="w-full h-7 bg-zinc-800/30 animate-pulse rounded border border-zinc-800/50 flex items-center justify-between px-2">
                                    <div className="w-2/3 h-2.5 bg-zinc-700/30 rounded" />
                                    <div className="w-8 h-2.5 bg-zinc-700/30 rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 2. D-Day 매치 리스트 뼈대 컴포넌트
export function MatchListViewSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-[#121212]">
            <div className="max-w-5xl mx-auto space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col md:flex-row items-stretch md:items-center bg-zinc-800/10 border-b border-zinc-800/80 p-4 relative overflow-hidden space-y-3 md:space-y-0"
                    >
                        {/* D-Day & Date */}
                        <div className="shrink-0 w-full md:w-32 flex flex-row md:flex-col items-baseline md:items-start justify-between md:justify-center mr-4 md:mr-6 border-b md:border-b-0 md:border-r border-zinc-800/50 pb-2 md:pb-0 md:pr-6">
                            <div className="w-16 h-10 md:w-20 md:h-12 bg-zinc-800/70 animate-pulse rounded" />
                            <div className="w-10 h-4 bg-zinc-800/40 animate-pulse rounded mt-1" />
                        </div>

                        {/* Matchup Details */}
                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            {/* Home Team */}
                            <div className="flex items-center gap-3 justify-end text-right overflow-hidden">
                                <div className="hidden md:flex flex-col items-end space-y-1.5 flex-1 min-w-0">
                                    <div className="w-24 h-6 bg-zinc-800/40 animate-pulse rounded" />
                                    <div className="w-8 h-3 bg-zinc-800/20 rounded" />
                                </div>
                                <div className="w-12 h-12 bg-zinc-800/60 animate-pulse rounded-full shrink-0" />
                            </div>

                            {/* VS & Time */}
                            <div className="flex flex-col items-center justify-center px-2">
                                <div className="w-6 h-4 bg-zinc-800/30 animate-pulse rounded" />
                                <div className="w-14 h-5 bg-zinc-800/50 animate-pulse rounded mt-1.5" />
                            </div>

                            {/* Away Team */}
                            <div className="flex items-center gap-3 justify-start text-left overflow-hidden">
                                <div className="w-12 h-12 bg-zinc-800/60 animate-pulse rounded-full shrink-0" />
                                <div className="hidden md:flex flex-col items-start space-y-1.5 flex-1 min-w-0">
                                    <div className="w-24 h-6 bg-zinc-800/40 animate-pulse rounded" />
                                    <div className="w-8 h-3 bg-zinc-800/20 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. 순위표 테이블 뼈대 컴포넌트
export function StandingsViewSkeleton() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#121212] p-2 md:p-6 h-full">
            {/* League Hero Banner Placeholder (Desktop only) */}
            <div className="relative overflow-hidden mb-4 md:mb-6 p-4 md:p-6 border border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between h-28 hidden md:flex shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-855/60 border border-zinc-800 animate-pulse rounded-lg shrink-0" />
                    <div className="flex flex-col space-y-2">
                        <div className="w-12 h-3 bg-zinc-800/50 animate-pulse rounded" />
                        <div className="w-28 h-6 bg-zinc-800 animate-pulse rounded" />
                        <div className="w-40 h-3 bg-zinc-800/30 animate-pulse rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-8 border-l border-zinc-850 pl-8 mr-6">
                    <div className="w-12 h-8 bg-zinc-850/60 rounded" />
                    <div className="w-12 h-8 bg-zinc-850/60 rounded" />
                </div>
            </div>

            {/* Standings Table Container */}
            <div className="flex-1 overflow-auto no-scrollbar bg-[#18181b]/10 border border-zinc-800/50">
                <table className="w-full text-left border-collapse min-w-full md:min-w-[600px]">
                    <thead className="sticky top-0 z-10 bg-zinc-950/90 border-b border-zinc-800/80">
                        <tr className="text-[10px] md:text-[11px] font-mono font-bold tracking-widest text-zinc-600 uppercase">
                            <th className="py-3 px-2 md:py-4 md:px-4 w-10 md:w-16 text-center">Rank</th>
                            <th className="py-3 px-2 md:py-4 md:px-4">Team</th>
                            <th className="py-3 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Played</th>
                            <th className="py-3 px-1 md:py-4 md:px-3 text-center">W</th>
                            <th className="py-3 px-1 md:py-4 md:px-3 text-center">L</th>
                            <th className="py-3 px-1 md:py-4 md:px-3 text-center font-bold">PTS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <tr key={idx} className="border-b border-zinc-800/30">
                                {/* Rank */}
                                <td className="py-3.5 px-2 md:py-4 md:px-4 text-center">
                                    <div className="w-4 h-5 bg-zinc-800/60 animate-pulse rounded mx-auto" />
                                </td>
                                {/* Team logo & name */}
                                <td className="py-3.5 px-2 md:py-4 md:px-4 flex items-center gap-2 md:gap-3">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-zinc-800 animate-pulse rounded shrink-0 border border-zinc-800/50" />
                                    <div className="w-24 h-4 md:w-32 bg-zinc-800/50 animate-pulse rounded" />
                                </td>
                                {/* Played */}
                                <td className="py-3.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">
                                    <div className="w-6 h-4 bg-zinc-850 animate-pulse rounded mx-auto" />
                                </td>
                                {/* Won */}
                                <td className="py-3.5 px-1 md:py-4 md:px-3 text-center">
                                    <div className="w-5 h-4 bg-zinc-850 animate-pulse rounded mx-auto" />
                                </td>
                                {/* Lost */}
                                <td className="py-3.5 px-1 md:py-4 md:px-3 text-center">
                                    <div className="w-5 h-4 bg-zinc-850 animate-pulse rounded mx-auto" />
                                </td>
                                {/* Points */}
                                <td className="py-3.5 px-1 md:py-4 md:px-3 text-center font-bold">
                                    <div className="w-6 h-4 bg-zinc-800 animate-pulse rounded mx-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 4. 메인 캘린더 통합 스케줄러 스켈레톤 컴포넌트
export default function MainCalendarSkeleton() {
    const { viewMode } = useCalendarStore();

    if (viewMode === 'calendar') {
        return <CalendarGridSkeleton />;
    } else if (viewMode === 'list') {
        return <MatchListViewSkeleton />;
    } else {
        return <StandingsViewSkeleton />;
    }
}
