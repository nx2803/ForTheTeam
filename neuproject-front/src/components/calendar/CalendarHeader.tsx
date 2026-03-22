'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Team } from '@/types/team';

import { useCalendarStore } from '@/store/calendarStore';
import { useTeamStore } from '@/store/teamStore';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface CalendarHeaderProps {
    isPending?: boolean;
    startTransition?: (callback: () => void) => void;
}

export default function CalendarHeader({ isPending, startTransition }: CalendarHeaderProps) {
    const { themeColors, setMainTeam, mainTeam } = useTheme();
    const { user } = useAuth();
    const { currentDate: currentDateStr, viewMode, setViewMode, nextMonth, prevMonth } = useCalendarStore();
    const { myTeams, reorderTeams } = useTeamStore();
    const [isReorderMode, setIsReorderMode] = useState(false);
    const currentDate = new Date(currentDateStr);
    const selectedTeamId = mainTeam?.id || null;

    return (
        <div className="md:hidden flex flex-col gap-3 mb-4">
            {/* 1. Month Navigation - No Box (Like Desktop) */}
            <div className={`flex items-center justify-center gap-6 py-2 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <button 
                    onClick={() => startTransition ? startTransition(() => prevMonth()) : prevMonth()} 
                    disabled={isPending}
                    className="text-zinc-400 hover:text-white p-2 disabled:opacity-30"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-3xl font-black font-oswald italic uppercase text-white tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-none text-center">
                    {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                    <span className="text-zinc-500 ml-2">{currentDate.getFullYear()}</span>
                </h2>
                <button 
                    onClick={() => startTransition ? startTransition(() => nextMonth()) : nextMonth()} 
                    disabled={isPending}
                    className="text-zinc-400 hover:text-white p-2 disabled:opacity-30"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div className="flex gap-2 h-11">
                {/* 2. View Toggle */}
                <div 
                    className="flex-none w-28 bg-[#18181b]/80 backdrop-blur-md border p-1 flex relative"
                    style={{ borderColor: themeColors.secondary }}
                >
                    <div className="absolute inset-1">
                        <motion.div
                            className="absolute top-0 bottom-0 shadow-md"
                            initial={false}
                            animate={{
                                left: viewMode === 'calendar' ? '0%' : '50%',
                                width: '50%',
                                backgroundColor: viewMode === 'list' ? themeColors.primary : '#FFFFFF'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${viewMode === 'calendar' ? 'text-black' : 'text-zinc-500'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${viewMode === 'list' ? '' : 'text-zinc-500'}`}
                        style={{ color: viewMode === 'list' ? themeColors.primaryText : undefined }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                {/* 3. Team Filter */}
                <div 
                    className="flex-1 min-w-0 bg-[#18181b]/80 backdrop-blur-md border p-1 px-2 flex items-center gap-2 overflow-hidden shadow-xl"
                    style={{ borderColor: themeColors.secondary }}
                >
                    <div className="flex flex-col shrink-0 border-r border-zinc-800 pr-2">
                        <button
                            onClick={() => setMainTeam(null)}
                            className={`text-[7px] font-mono font-bold uppercase tracking-widest ${!selectedTeamId ? 'text-white' : 'text-zinc-500'}`}
                        >
                            ALL
                        </button>
                        <button
                            onClick={() => setIsReorderMode(!isReorderMode)}
                            className={`text-[7px] font-mono font-bold uppercase tracking-tighter flex items-center gap-1 ${isReorderMode ? 'text-white' : 'text-zinc-600'}`}
                        >
                            <span className={`w-1 h-1 ${isReorderMode ? 'animate-pulse' : ''}`} style={{ backgroundColor: isReorderMode ? themeColors.primary : 'currentColor' }}></span>
                            {isReorderMode ? 'EDIT' : 'SORT'}
                        </button>
                    </div>
                    <Reorder.Group
                        axis="x"
                        values={myTeams}
                        onReorder={(newTeams) => reorderTeams(newTeams, user?.uid)}
                        className="flex gap-2 items-center h-full overflow-x-auto no-scrollbar"
                    >
                        {myTeams.map(team => (
                            <Reorder.Item
                                key={team.id}
                                value={team}
                                dragListener={isReorderMode}
                                className={`w-8 h-8 shrink-0 flex items-center justify-center relative overflow-hidden transition-all duration-300 ${selectedTeamId === team.id ? 'scale-110 opacity-100' : (!selectedTeamId ? 'opacity-100' : 'opacity-40 brightness-50')}`}
                                onClick={() => setMainTeam(selectedTeamId === team.id ? null : team)}
                            >
                                {team.logoUrl ? (
                                    <img src={team.logoUrl} alt="" className="w-full h-full object-contain p-0.5 pointer-events-none" />
                                ) : (
                                    <span className="text-[10px] font-bold pointer-events-none">{team.logo}</span>
                                )}
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>
            </div>
        </div>
    );
}
