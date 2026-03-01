'use client';

import React from 'react';
import { Team } from '@/types/team';

interface CalendarGridProps {
    currentDate: Date;
    displayedEvents: any[];
    myTeams: Team[];
    themeColors: any;
    startDay: number;
    daysInMonth: number;
}

interface ScrollableEventListProps {
    events: any[];
    themeColors: any;
}

const ScrollableEventList = ({ events, themeColors }: ScrollableEventListProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const scrollPosRef = React.useRef(0);
    const directionRef = React.useRef(1); // 1 for down, -1 for up
    const pauseCounterRef = React.useRef(0);

    React.useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            if (scrollRef.current && !isHovered && events.length >= 3) {
                const { scrollHeight, clientHeight } = scrollRef.current;

                if (scrollHeight > clientHeight) {
                    if (pauseCounterRef.current > 0) {
                        pauseCounterRef.current--;
                    } else {
                        // Update internal position
                        scrollPosRef.current += directionRef.current * 0.08;

                        // Reverse direction logic with pause
                        if (directionRef.current === 1 && scrollPosRef.current + clientHeight >= scrollHeight - 1) {
                            directionRef.current = -1;
                            pauseCounterRef.current = 120; // Pause for ~2 seconds
                        } else if (directionRef.current === -1 && scrollPosRef.current <= 0) {
                            directionRef.current = 1;
                            pauseCounterRef.current = 120; // Pause for ~2 seconds
                        }

                        // Apply to DOM
                        scrollRef.current.scrollTop = scrollPosRef.current;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovered, events.length]);

    return (
        <div className="flex-1 min-h-0 relative group/scroll">
            <div
                ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="h-full overflow-y-auto no-scrollbar pr-0.5 space-y-1"
            >
                {events.map((ev: any) => {
                    const isRace = ev.type === 'race';
                    const isFinished = ev.score !== null && ev.score !== undefined;

                    const buildSearchUrl = (e: any) => {
                        const query = e.type === 'race'
                            ? `${e.homeTeamName} ${e.date}`
                            : `${e.homeTeamName} vs ${e.awayTeamName} ${e.date}`;
                        return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    };

                    return (
                        <div
                            key={ev.id}
                            onClick={() => window.open(buildSearchUrl(ev), '_blank')}
                            className="relative group/ev flex items-center justify-between overflow-hidden bg-zinc-800/80 border border-zinc-600/50 hover:bg-zinc-700 hover:border-zinc-400 transition-all px-1.5 py-1 cursor-pointer"
                        >
                            {isRace ? (
                                <div className="w-full flex justify-between items-center px-2 overflow-hidden">
                                    <span className="font-oswald font-bold text-white text-xs md:text-sm uppercase truncate flex-1 tracking-tight">
                                        {ev.homeTeamName}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0 ml-1.5">
                                        <span className="font-mono text-xs md:text-sm text-zinc-400 font-bold">{ev.time}</span>
                                        <span className="text-sm">🏎️</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Home Team */}
                                    <div className="flex-1 flex items-center justify-end gap-1.5 overflow-hidden">
                                        <span className="font-oswald font-bold text-zinc-300 group-hover/ev:text-white text-xs md:text-sm uppercase truncate tracking-tighter">
                                            {ev.homeTeamAbbr || ev.homeTeamName?.slice(0, 3)}
                                        </span>
                                        <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 flex items-center justify-center">
                                            {ev.homeTeam?.logoUrl ? (
                                                <img src={ev.homeTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs md:text-sm">{ev.homeTeam?.logo || '🛡️'}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score/Time */}
                                    <div className="mx-1.5 flex flex-col items-center justify-center min-w-8 md:min-w-10">
                                        {isFinished ? (
                                            <span className="font-mono text-xs md:text-sm font-black leading-none" style={{ color: themeColors.primary }}>
                                                {ev.score}
                                            </span>
                                        ) : (
                                            <span className="font-mono text-[10px] md:text-xs text-zinc-500 font-bold leading-none">
                                                {ev.time}
                                            </span>
                                        )}
                                    </div>

                                    {/* Away Team */}
                                    <div className="flex-1 flex items-center justify-start gap-1.5 overflow-hidden">
                                        <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 flex items-center justify-center">
                                            {ev.awayTeam?.logoUrl ? (
                                                <img src={ev.awayTeam.logoUrl} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs md:text-sm">{ev.awayTeam?.logo || '🛡️'}</span>
                                            )}
                                        </div>
                                        <span className="font-oswald font-bold text-zinc-300 group-hover/ev:text-white text-xs md:text-sm uppercase truncate tracking-tighter">
                                            {ev.awayTeamAbbr || ev.awayTeamName?.slice(0, 3)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function CalendarGrid({
    currentDate,
    displayedEvents,
    myTeams,
    themeColors,
    startDay,
    daysInMonth
}: CalendarGridProps) {
    return (
        <>
            {/* Days Header */}
            <div className="hidden md:grid grid-cols-7 border-b border-zinc-800 bg-white/2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <div key={d} className="py-3 text-center font-oswald text-lg text-zinc-500 font-bold uppercase tracking-[0.2em] border-r border-zinc-800/50 last:border-r-0">
                        {d}
                    </div>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-7 auto-rows-fr overflow-hidden border-t border-l border-zinc-800">
                {/* Empty Slots */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="hidden md:block bg-zinc-900/20 border-r border-b border-zinc-800"></div>
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                    const events = displayedEvents.filter((e: any) => e.date === dateStr);

                    return (
                        <div
                            key={day}
                            className={`
                            relative group transition-colors flex flex-col
                            md:p-2 h-full min-h-[140px] md:min-h-0
                            ${events.length > 0 ? 'bg-white/2' : ''}
                            ${isToday
                                    ? 'border-2 z-10 shadow-lg'
                                    : 'border-b border-zinc-800 md:border-r hover:bg-white/5'}
                        `}
                            style={{
                                borderColor: isToday ? themeColors.primary : undefined,
                                backgroundColor: isToday ? `${themeColors.primary}15` : undefined
                            }}
                        >
                            <div className="flex justify-between items-start px-1 pt-1 mb-1 shrink-0">
                                <span className={`font-oswald text-3xl md:text-2xl font-black italic leading-none ${events.length > 0 || isToday ? 'text-white' : 'text-zinc-600'}`}>
                                    {day}
                                </span>
                                {isToday && (
                                    <div
                                        className="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-white text-black shadow-lg -skew-x-12"
                                        style={{ backgroundColor: themeColors.primary, color: themeColors.primaryText }}
                                    >
                                        TODAY
                                    </div>
                                )}
                                <span className="md:hidden font-mono text-sm text-zinc-500 font-bold">
                                    {new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                </span>
                            </div>

                            {/* Event List */}
                            <ScrollableEventList events={events} themeColors={themeColors} />
                        </div>
                    );
                })}

                {/* Desktop Filler */}
                {Array.from({ length: (35 - (startDay + daysInMonth) > 0 ? 35 - (startDay + daysInMonth) : 42 - (startDay + daysInMonth)) }).slice(0, 7).map((_, i) => (
                    <div key={`end-${i}`} className="hidden md:block bg-zinc-900/20 border-r border-b border-zinc-800"></div>
                ))}
            </div>
        </>
    );
}

// Ensure header is also present if it was part of the file (it wasn't, fixed during rewrite)
