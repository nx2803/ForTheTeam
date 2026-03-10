'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Team } from '@/types/team';

interface CalendarHeaderProps {
    currentDate: Date;
    viewMode: 'calendar' | 'list';
    setViewMode: (mode: 'calendar' | 'list') => void;
    nextMonth: () => void;
    prevMonth: () => void;
    myTeams: Team[];
    setMyTeams?: (teams: Team[]) => void;
    mainTeam: Team | null;
    setMainTeam: (team: Team | null) => void;
    themeColors: any;
}

export default function CalendarHeader({
    currentDate,
    viewMode,
    setViewMode,
    nextMonth,
    prevMonth,
    myTeams,
    setMyTeams,
    mainTeam,
    setMainTeam,
    themeColors
}: CalendarHeaderProps) {
    const [isReorderMode, setIsReorderMode] = useState(false);
    const selectedTeamId = mainTeam?.id || null;

    return (
        <div className="flex flex-col w-full h-28 md:h-16 shrink-0 mb-4 z-10 relative gap-4">
            {/* ROW 1 (Mobile) / CENTER (Desktop): Date Navigation */}
            <div className="flex w-full h-12 md:h-auto shrink-0 justify-between items-center md:absolute md:left-1/2 md:top-0 md:transform md:-translate-x-1/2 gap-2 md:gap-4 md:w-120 pointer-events-auto z-20">
                {viewMode === 'calendar' ? (
                    <>
                        <button
                            onClick={prevMonth}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto shrink-0"
                        >
                            <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center whitespace-nowrap">
                                {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                                <span className="text-zinc-500 ml-2 md:ml-3 break-keep">{currentDate.getFullYear()}</span>
                            </h2>
                        </div>
                        <button
                            onClick={nextMonth}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto shrink-0"
                        >
                            <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                ) : (
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center w-full whitespace-nowrap">
                        UPCOMING <span style={{ color: themeColors.primary }}>MATCHES</span>
                    </h2>
                )}
            </div>

            {/* ROW 2 (Mobile) / FLANKING SIDES (Desktop) */}
            <div className="flex w-full justify-between items-center z-10">
                {/* LEFT: View Controls (Toggle) */}
                <div className="flex bg-zinc-800 p-1 relative shrink-0 w-25 md:w-30">
                    <div className="absolute inset-1">
                        <motion.div
                            className="absolute top-0 bottom-0 rounded shadow-md"
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
                        className={`relative z-10 flex-1 flex items-center justify-center p-2 transition-colors duration-200 ${viewMode === 'calendar' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`relative z-10 flex-1 flex items-center justify-center p-2 transition-colors duration-200 ${viewMode === 'list' ? '' : 'text-zinc-500 hover:text-white'}`}
                        style={{ color: viewMode === 'list' ? themeColors.primaryText : undefined }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                {/* RIGHT: Team Filter */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0 max-w-[65%] md:max-w-[450px] lg:max-w-[600px]">
                    <div
                        className="w-full relative bg-[#18181b] px-3 md:px-4 flex items-center justify-end gap-2 border-t border-x shadow-xl h-12 md:h-16 shrink-0"
                        style={{
                            borderBottom: '1px solid #18181b',
                            minWidth: 'auto',
                            borderTopColor: themeColors.secondary,
                            borderLeftColor: themeColors.secondary,
                            borderRightColor: themeColors.secondary,
                            borderBottomColor: themeColors.secondary
                        }}
                    >
                        <div className="flex flex-col mr-auto">
                            <button
                                onClick={() => setMainTeam(null)}
                                className={`text-[10px] font-mono font-bold uppercase tracking-widest hidden sm:block transition-all duration-200 hover:text-white ${!selectedTeamId ? 'text-white' : 'text-zinc-500 hover:underline hover:underline-offset-4'}`}
                                title="Show all teams"
                            >
                                ALL TEAMS
                            </button>
                            {setMyTeams && (
                                <button
                                    onClick={() => setIsReorderMode(!isReorderMode)}
                                    className={`text-[9px] font-mono font-bold uppercase tracking-tighter transition-all duration-200 flex items-center gap-1 ${isReorderMode ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isReorderMode ? 'bg-sport-red animate-pulse' : 'bg-current'}`} style={{ backgroundColor: isReorderMode ? themeColors.primary : undefined }}></span>
                                    {isReorderMode ? 'EDITING...' : 'REORDER'}
                                </button>
                            )}
                        </div>
                        {setMyTeams ? (
                            <Reorder.Group
                                axis="x"
                                values={myTeams}
                                onReorder={setMyTeams}
                                className="flex gap-1 overflow-x-auto no-scrollbar items-center h-full"
                            >
                                {myTeams.map(team => (
                                    <Reorder.Item
                                        key={team.id}
                                        value={team}
                                        dragListener={isReorderMode}
                                        className={`
                                            w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 relative overflow-hidden
                                            ${isReorderMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-white/20' : 'cursor-pointer'}
                                            ${selectedTeamId === team.id ? 'scale-110 bg-white/10 shadow-lg opacity-100 ring-2' : (!selectedTeamId ? 'opacity-100 hover:scale-110' : 'opacity-40 hover:opacity-100 hover:scale-110')}
                                        `}
                                        style={{ border: 'none', y: 0, boxShadow: selectedTeamId === team.id ? `0 0 0 2px ${themeColors.primary}` : undefined }}
                                        onPointerDown={() => {
                                            const isDeselecting = selectedTeamId === team.id;
                                            setMainTeam(isDeselecting ? null : team);
                                        }}
                                    >
                                        {team.logoUrl ? (
                                            <img
                                                src={team.logoUrl}
                                                alt={team.name}
                                                className="w-full h-full object-contain p-1 pointer-events-none"
                                            />
                                        ) : (
                                            <span className="text-lg pointer-events-none">{team.logo}</span>
                                        )}
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        ) : (
                            <div className="flex gap-1 overflow-x-auto no-scrollbar items-center h-full">
                                {myTeams.map(team => (
                                    <button
                                        key={team.id}
                                        onClick={() => {
                                            const isDeselecting = selectedTeamId === team.id;
                                            setMainTeam(isDeselecting ? null : team);
                                        }}
                                        className={`
                                            w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 relative overflow-hidden
                                            ${selectedTeamId === team.id ? 'scale-110 bg-white/10 opacity-100' : (!selectedTeamId ? 'opacity-100 hover:scale-110' : 'opacity-40 hover:opacity-100 hover:scale-110')}
                                        `}
                                        style={{ border: 'none' }}
                                    >
                                        {team.logoUrl ? (
                                            <img
                                                src={team.logoUrl}
                                                alt={team.name}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        ) : (
                                            <span className="text-lg">{team.logo}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
