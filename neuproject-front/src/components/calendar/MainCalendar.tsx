'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, SPORTS_DATA } from '@/data/sportsData';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface MainCalendarProps {
    myTeams: Team[];
}

export default function MainCalendar({ myTeams }: MainCalendarProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [matches, setMatches] = useState<any[]>([]);
    const { mainTeam, setMainTeam, themeColors } = useTheme();
    const { user, isLoggedIn } = useAuth();

    // API 호출: 경기 데이터 가져오기
    const fetchMatches = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            let url = `http://localhost:3001/matches/calendar?year=${year}&month=${month}`;
            if (isLoggedIn && user?.uid) {
                url += `&memberUid=${user.uid}`;
            }
            const res = await fetch(url);
            const data = await res.json();

            // API 데이터를 CalendarEvent 형식에 맞게 변환
            const formatted = data.map((m: any) => ({
                id: m.id,
                teamId: m.home_team_id || '',
                opponent: m.away_team_id ? m.away_team?.name : m.away_team_name,
                home: true,
                date: m.match_at.split('T')[0],
                time: m.match_at.split('T')[1].slice(0, 5),
                type: 'match',
                score: m.status === 'finished' ? `${m.home_score}:${m.away_score}` : null,
                // 프론트엔드 렌더링을 위한 추가 정보
                homeTeam: m.home_team,
                awayTeam: m.away_team,
                league: m.leagues
            }));
            setMatches(formatted);
        } catch (error) {
            console.error('Failed to fetch matches:', error);
        }
    };

    React.useEffect(() => {
        fetchMatches();
    }, [currentDate, isLoggedIn, user?.uid]);

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    // Filter Logic
    const displayedEvents = useMemo(() => {
        let events = matches;

        // 1. Filter by 'My Teams' first (global filter)
        if (myTeams.length > 0) {
            const myTeamIds = myTeams.map(t => t.id);
            events = events.filter(e =>
                myTeamIds.includes(e.teamId) ||
                (e.awayTeam && myTeamIds.includes(e.awayTeam.id))
            );
        } else {
            // 팔로우하는 팀이 없으면 경기 일정 없음
            events = [];
        }

        // 2. Filter by 'Selected Active Team' (tab filter)
        if (selectedTeamId) {
            events = events.filter(e => e.teamId === selectedTeamId || (e.awayTeam && e.awayTeam.id === selectedTeamId));
        }

        return events;
    }, [matches, myTeams, selectedTeamId]);

    const activeTeam = myTeams.find(t => t.id === selectedTeamId);
    const accentColor = activeTeam?.mainColor || '#fff';

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // D-Day Calculation
    const getDDay = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);
        const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "D-DAY";
        return `D-${diff}`;
    };

    return (
        <div className="w-full h-full flex flex-col p-2 md:p-4 text-zinc-300">

            {/* 1. Header Row (3-Column Layout) */}
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between h-auto min-h-16 mb-4 z-10 relative gap-4 md:gap-0">

                {/* LEFT: View Controls (Toggle) */}
                <div className="flex bg-zinc-800 p-1 mr-auto relative">
                    {/* Active Background Animation */}
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

                {/* CENTER: Date Navigation (Fixed Width & Centered) */}
                <div className="absolute left-1/2 top-0 md:top-auto transform -translate-x-1/2 flex items-center justify-between gap-4 w-full md:w-120 pointer-events-none md:pointer-events-auto">
                    {viewMode === 'calendar' ? (
                        <>
                            <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto">
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="flex flex-col items-center">

                                <h2 className="text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center min-w-50">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                                    <span className="text-zinc-500 ml-3">{currentDate.getFullYear()}</span>
                                </h2>
                            </div>
                            <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors pointer-events-auto">
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    ) : (
                        <h2 className="text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-lg leading-none text-center w-full">
                            UPCOMING <span style={{ color: themeColors.primary }}>MATCHES</span>
                        </h2>
                    )}
                </div>

                {/* RIGHT: Team Filter (Fixed Height) + Main Team Logo */}
                <div className="flex items-center gap-4 ml-auto">

                    {/* Team Filter */}
                    <div
                        className="w-full md:w-auto relative bg-[#18181b] px-4 flex items-center justify-end gap-2 border-t border-x shadow-xl h-16 shrink-0"
                        style={{
                            borderBottom: '1px solid #18181b', // Match bg
                            minWidth: '280px',
                            borderTopColor: themeColors.secondary,
                            borderLeftColor: themeColors.secondary,
                            borderRightColor: themeColors.secondary,
                            borderBottomColor: themeColors.secondary
                        }}
                    >
                        <span className="text-zinc-400 text-[10px] font-mono font-bold uppercase mr-auto tracking-widest hidden sm:block">
                            {selectedTeamId ? 'FILTER ON' : 'ALL TEAMS'}
                        </span>
                        <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-50 md:max-w-none items-center h-full">
                            {myTeams.map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => {
                                        const isDeselecting = selectedTeamId === team.id;
                                        setSelectedTeamId(isDeselecting ? null : team.id);
                                        setMainTeam(isDeselecting ? null : team);
                                    }}
                                    className={`
                                        w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 relative overflow-hidden
                                        ${selectedTeamId === team.id ? 'scale-110 bg-white/10' : 'hover:scale-110 hover:bg-white/5 opacity-40 hover:opacity-100'}
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
                    </div>
                </div>
            </div>

            {/* 2. Main Body Container (No Rounded) */}
            <div
                className="flex-1 bg-[#18181b] border-2 relative shadow-2xl flex flex-col transition-colors duration-300 overflow-hidden"
                style={{
                    borderColor: selectedTeamId ? accentColor : themeColors.secondary
                }}
            >
                {viewMode === 'calendar' ? (
                    /* --- CALENDAR GRID VIEW --- */
                    <>
                        {/* Days Header */}
                        <div className="hidden md:grid grid-cols-7 border-b-2 border-zinc-700 bg-white/2">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                <div key={d} className="py-2 text-center font-oswald text-base text-zinc-400 font-bold uppercase tracking-widest border-r border-zinc-700/50 last:border-r-0">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-7 auto-rows-fr overflow-hidden">
                            {/* Empty Slots */}
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="hidden md:block bg-zinc-800/30 border-r border-b border-zinc-700"></div>
                            ))}

                            {/* Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                                const events = displayedEvents.filter(e => e.date === dateStr);

                                return (
                                    <div
                                        key={day}
                                        className={`
                                            relative group transition-colors flex flex-col gap-1
                                            md:p-1 md:h-full
                                            p-4 min-h-20
                                            ${events.length > 0 ? 'bg-white/2' : ''}
                                            ${isToday
                                                ? 'border-2 z-10 shadow-lg'
                                                : 'border-b border-zinc-700 md:border-r hover:bg-white/5'}
                                        `}
                                        style={{
                                            borderColor: isToday ? themeColors.primary : undefined,
                                            backgroundColor: isToday ? `${themeColors.primary}15` : undefined
                                        }}
                                    >
                                        <div className="flex justify-between items-start px-1 pt-1">
                                            <span className={`font-oswald text-2xl md:text-xl font-black italic leading-none ${events.length > 0 || isToday ? 'text-white' : 'text-zinc-600'}`}>
                                                {day}
                                                {isToday && <span className="ml-2 text-[10px] font-mono tracking-widest uppercase" style={{ color: themeColors.secondary }}>TODAY</span>}
                                            </span>
                                            {/* Mobile Day Label */}
                                            <span className="md:hidden font-mono text-xs text-zinc-500 font-bold">
                                                {new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Event List */}
                                        <div className="flex flex-col gap-1 mt-auto">
                                            {events.map(ev => {
                                                const team = myTeams.find(t => t.id === ev.teamId) || SPORTS_DATA.find(t => t.id === ev.teamId);
                                                const opponentTeam = myTeams.find(t => t.id === ev.opponent) || SPORTS_DATA.find(t => t.id === ev.opponent);

                                                // 상대팀 UUID가 myTeams에 없으면 원본 opponent 텍스트 사용
                                                const opponentName = opponentTeam ? opponentTeam.name : ev.opponent;

                                                // Bold Matchup Text calculation
                                                let homeText = ev.home && team ? team.name : opponentName;
                                                let awayText = ev.home ? opponentName : team ? team.name : opponentName;

                                                const isRace = ev.type === 'race';
                                                const simpleText = ev.opponent;
                                                const isFinished = ev.score !== null && ev.score !== undefined;

                                                return (
                                                    <div
                                                        key={ev.id}
                                                        className="relative group/ev flex items-center justify-between overflow-hidden bg-zinc-800/80 border border-zinc-600/50 hover:bg-zinc-700 hover:border-zinc-400 transition-all px-1 py-0.5 shadow-sm"
                                                    >
                                                        {isRace ? (
                                                            <div className="w-full flex justify-between items-center px-1">
                                                                <span className="font-oswald font-bold text-white text-[10px] uppercase truncate">{simpleText}</span>
                                                                <span className="text-[10px]">🏎️</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex-1 text-right overflow-hidden">
                                                                    <span className="font-oswald font-bold text-zinc-300 group-hover/ev:text-white text-[10px] md:text-xs uppercase truncate block leading-tight">
                                                                        {homeText}
                                                                    </span>
                                                                </div>
                                                                <div className="mx-1 flex flex-col items-center justify-center min-w-5">
                                                                    {isFinished ? (
                                                                        <span className="font-mono text-[10px] font-black leading-none" style={{ color: themeColors.primary }}>
                                                                            {ev.score}
                                                                        </span>
                                                                    ) : (
                                                                        <span
                                                                            className="font-mono text-[9px] text-zinc-500 font-bold transition-colors leading-none"
                                                                            style={{ color: 'inherit' }}
                                                                        >
                                                                            {ev.time}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 text-left overflow-hidden">
                                                                    <span className="font-oswald font-bold text-zinc-300 group-hover/ev:text-white text-[10px] md:text-xs uppercase truncate block leading-tight">
                                                                        {awayText}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Desktop Filler */}
                            {Array.from({ length: (35 - (startDay + daysInMonth) > 0 ? 35 - (startDay + daysInMonth) : 42 - (startDay + daysInMonth)) }).slice(0, 7).map((_, i) => (
                                <div key={`end-${i}`} className="hidden md:block bg-zinc-800/30 border-r border-b border-zinc-700"></div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* --- D-DAY LIST VIEW (Refined & Fixed) --- */
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-[#121212]">
                        <div className="max-w-5xl mx-auto space-y-3">
                            {displayedEvents.length === 0 ? (
                                <div className="text-center text-zinc-500 font-oswald text-2xl py-20 uppercase italic">
                                    No Upcoming Matches Scheduled
                                </div>
                            ) : (
                                displayedEvents.map((event, idx) => {
                                    const team = myTeams.find(t => t.id === event.teamId) || SPORTS_DATA.find(t => t.id === event.teamId);
                                    const opponentTeam = myTeams.find(t => t.id === event.opponent) || SPORTS_DATA.find(t => t.id === event.opponent);
                                    const opponentName = opponentTeam ? opponentTeam.name : event.opponent;

                                    if (!team) return null;
                                    const dDay = getDDay(event.date);
                                    const isImminent = dDay === 'D-DAY' || dDay === 'D-1';

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`flex flex-col md:flex-row items-stretch md:items-center bg-zinc-800/40 border-b border-zinc-700 p-4 relative overflow-hidden group hover:bg-zinc-800/70 transition-colors`}
                                            style={{ borderLeft: isImminent ? `4px solid ${themeColors.primary}` : '4px solid transparent' }}
                                        >
                                            {/* D-Day Badge (Fixed Width) */}
                                            <div className="shrink-0 w-full md:w-32 flex flex-row md:flex-col items-baseline md:items-start justify-between md:justify-center mb-2 md:mb-0 mr-4 md:mr-6 border-b md:border-b-0 md:border-r border-zinc-700/50 pb-2 md:pb-0 md:pr-6">
                                                <div
                                                    className="text-4xl md:text-5xl font-black font-oswald italic tracking-tighter leading-none"
                                                    style={{ color: isImminent ? themeColors.primary : '#FFFFFF' }}
                                                >
                                                    {dDay}
                                                </div>
                                                <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                                    {event.date.slice(5)} {/* Show MO-DY */}
                                                </div>
                                            </div>

                                            {/* Match Info (Grid Layout for equal spacing) */}
                                            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                                {/* Home/My Team */}
                                                <div className="flex items-center gap-3 justify-end text-right overflow-hidden min-w-0">
                                                    <div className="flex flex-col items-end min-w-0 flex-1">
                                                        <span className="text-2xl md:text-3xl font-bold uppercase italic font-oswald leading-none tracking-tight text-zinc-200">
                                                            {team.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">HOME</span>
                                                    </div>
                                                    <span className="text-3xl shrink-0">{team.logo}</span>
                                                </div>

                                                {/* VS Time (Center) */}
                                                <div className="flex flex-col items-center justify-center shrink-0 px-2">
                                                    <span className="text-zinc-700 font-black italic text-lg leading-none">VS</span>
                                                    <div className="text-white font-mono font-bold text-sm bg-zinc-900 border border-zinc-700 px-2 py-0.5 mt-1">
                                                        {event.time}
                                                    </div>
                                                </div>

                                                {/* Opponent */}
                                                <div className="flex items-center gap-3 justify-start text-left overflow-hidden min-w-0">
                                                    {/* Start with Opponent text logic to ensure it behaves same as Home */}
                                                    <div className="flex flex-col items-start min-w-0 flex-1">
                                                        <span className="text-2xl md:text-3xl font-bold uppercase italic font-oswald leading-none tracking-tight text-zinc-400">
                                                            {opponentName}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-zinc-600 uppercase">AWAY</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}