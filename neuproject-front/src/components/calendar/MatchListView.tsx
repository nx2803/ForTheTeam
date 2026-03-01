'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Team } from '@/types/team';

interface MatchListViewProps {
    displayedEvents: any[];
    myTeams: Team[];
    themeColors: any;
    getDDay: (dateStr: string) => string;
}

export default function MatchListView({
    displayedEvents,
    myTeams,
    themeColors,
    getDDay
}: MatchListViewProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-[#121212]">
            <div className="max-w-5xl mx-auto space-y-3">
                {displayedEvents.length === 0 ? (
                    <div className="text-center text-zinc-500 font-oswald text-2xl py-20 uppercase italic">
                        No Upcoming Matches Scheduled
                    </div>
                ) : (
                    displayedEvents
                        .filter(event => event.score === null)
                        .map((event, idx) => {
                            const dDay = getDDay(event.date);
                            const isImminent = dDay === 'D-DAY' || dDay === 'D-1';

                            if (event.type !== 'race' && (!event.homeTeamName || !event.awayTeamName)) return null;

                            const buildSearchUrl = (e: any) => {
                                const query = e.type === 'race'
                                    ? `${e.homeTeamName} ${e.date}`
                                    : `${e.homeTeamName} vs ${e.awayTeamName} ${e.date}`;
                                return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                            };

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => window.open(buildSearchUrl(event), '_blank')}
                                    className={`flex flex-col md:flex-row items-stretch md:items-center bg-zinc-800/40 border-b border-zinc-700 p-4 relative overflow-hidden group hover:bg-zinc-800/70 transition-colors cursor-pointer`}
                                    style={{ borderLeft: isImminent ? `4px solid ${themeColors.primary}` : '4px solid transparent' }}
                                >
                                    <div className="shrink-0 w-full md:w-32 flex flex-row md:flex-col items-baseline md:items-start justify-between md:justify-center mb-2 md:mb-0 mr-4 md:mr-6 border-b md:border-b-0 md:border-r border-zinc-700/50 pb-2 md:pb-0 md:pr-6">
                                        <div
                                            className="text-4xl md:text-5xl font-black font-oswald italic tracking-tighter leading-none"
                                            style={{ color: isImminent ? themeColors.primary : '#FFFFFF' }}
                                        >
                                            {dDay}
                                        </div>
                                        <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                            {event.date.slice(5)}
                                        </div>
                                    </div>

                                    {event.type === 'race' ? (
                                        <div className="flex-1 flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-2xl md:text-3xl font-bold uppercase italic font-oswald leading-none tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                                                    {event.homeTeamName}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-700 px-1.5">{event.league?.name || 'F1'}</span>
                                                    <span className="text-[10px] font-bold text-zinc-600 uppercase italic">@{event.venue}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <div className="text-white font-mono font-bold text-xl md:text-2xl">
                                                        {event.time}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">LOCAL TIME</div>
                                                </div>
                                                <span className="text-3xl md:text-4xl">🏎️</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                            <div className="flex items-center gap-3 justify-end text-right overflow-hidden min-w-0">
                                                <div className="flex flex-col items-end min-w-0 flex-1">
                                                    <span className="text-2xl md:text-3xl font-bold uppercase italic font-oswald leading-none tracking-tight text-zinc-200">
                                                        {event.homeTeamName}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">HOME</span>
                                                </div>
                                                {/* Logo Container with Fallback */}
                                                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                                    {(() => {
                                                        const homeTeam = event.homeTeam || myTeams.find((t: Team) => t.id === event.teamId);
                                                        if (homeTeam?.logoUrl) {
                                                            return <img src={homeTeam.logoUrl} alt={event.homeTeamName} className="w-full h-full object-contain" />;
                                                        }
                                                        return <span className="text-4xl">{homeTeam?.logo || '🛡️'}</span>;
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center shrink-0 px-2">
                                                <span className="text-zinc-700 font-black italic text-lg leading-none">VS</span>
                                                <div className="text-white font-mono font-bold text-sm bg-zinc-900 border border-zinc-700 px-2 py-0.5 mt-1">
                                                    {event.time}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 justify-start text-left overflow-hidden min-w-0">
                                                {/* Logo Container with Fallback */}
                                                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                                    {(() => {
                                                        const awayTeam = event.awayTeam || myTeams.find((t: Team) => t.id === event.awayTeamId);
                                                        if (awayTeam?.logoUrl) {
                                                            return <img src={awayTeam.logoUrl} alt={event.awayTeamName} className="w-full h-full object-contain" />;
                                                        }
                                                        return <span className="text-4xl">{awayTeam?.logo || '🛡️'}</span>;
                                                    })()}
                                                </div>
                                                <div className="flex flex-col items-start min-w-0 flex-1">
                                                    <span className="text-2xl md:text-3xl font-bold uppercase italic font-oswald leading-none tracking-tight text-zinc-400">
                                                        {event.awayTeamName}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-zinc-600 uppercase">AWAY</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                )}
            </div>
        </div>
    );
}
