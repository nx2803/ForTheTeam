'use client';

import React from 'react';
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
    const selectedTeamId = mainTeam?.id || null;

    return (
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between h-auto min-h-16 mb-4 z-10 relative gap-4 md:gap-0">
            {/* LEFT: View Controls (Toggle) */}
            <div className="flex bg-zinc-800 p-1 mr-auto relative">
                <div className="absolute inset-1 flex">
                    <motion.div
                        layoutId="viewModeHighlight"
                        className="bg-white absolute top-0 bottom-0 w-1/2 shadow-md"
                        initial={false}
                        animate={{
                            x: viewMode === 'calendar' ? '0%' : '100%',
                            backgroundColor: viewMode === 'list' ? themeColors.primary : '#FFFFFF'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                <button
                    onClick={() => setViewMode('calendar')}
                    className={`relative z-10 p-2 transition-colors duration-200 ${viewMode === 'calendar' ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`relative z-10 p-2 transition-colors duration-200 ${viewMode === 'list' ? '' : 'text-zinc-500 hover:text-white'}`}
                    style={{ color: viewMode === 'list' ? themeColors.primaryText : undefined }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* CENTER: Date Navigation */}
            <div className="absolute left-1/2 top-0 md:top-auto transform -translate-x-1/2 flex items-center justify-between gap-4 w-full md:w-120 pointer-events-none md:pointer-events-auto">
                {viewMode === 'calendar' ? (
                    <>
                        <button
                            onClick={prevMonth}
                            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center min-w-50">
                                {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                                <span className="text-zinc-500 ml-3">{currentDate.getFullYear()}</span>
                            </h2>
                        </div>
                        <button
                            onClick={nextMonth}
                            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                ) : (
                    <h2 className="text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center w-full">
                        UPCOMING <span style={{ color: themeColors.primary }}>MATCHES</span>
                    </h2>
                )}
            </div>

            {/* RIGHT: Team Filter */}
            <div className="flex items-center gap-4 ml-auto">
                <div
                    className="w-full md:w-auto relative bg-[#18181b] px-4 flex items-center justify-end gap-2 border-t border-x shadow-xl h-16 shrink-0"
                    style={{
                        borderBottom: '1px solid #18181b',
                        minWidth: '280px',
                        borderTopColor: themeColors.secondary,
                        borderLeftColor: themeColors.secondary,
                        borderRightColor: themeColors.secondary,
                        borderBottomColor: themeColors.secondary
                    }}
                >
                    <button
                        onClick={() => setMainTeam(null)}
                        className={`text-[10px] font-mono font-bold uppercase mr-auto tracking-widest hidden sm:block transition-all duration-200 hover:text-white ${!selectedTeamId ? 'text-white' : 'text-zinc-500 hover:underline hover:underline-offset-4'}`}
                        title="Show all teams"
                    >
                        ALL TEAMS
                    </button>
                    {setMyTeams ? (
                        <Reorder.Group
                            axis="x"
                            values={myTeams}
                            onReorder={setMyTeams}
                            className="flex gap-1 overflow-x-auto no-scrollbar max-w-50 md:max-w-none items-center h-full"
                        >
                            {myTeams.map(team => (
                                <Reorder.Item
                                    key={team.id}
                                    value={team}
                                    className={`
                                        w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-grab active:cursor-grabbing
                                        ${selectedTeamId === team.id ? 'scale-110 bg-white/10 shadow-lg opacity-100' : (!selectedTeamId ? 'opacity-100 hover:scale-110' : 'opacity-40 hover:opacity-100 hover:scale-110')}
                                    `}
                                    style={{ border: 'none', y: 0 }}
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
                        <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-50 md:max-w-none items-center h-full">
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
    );
}
