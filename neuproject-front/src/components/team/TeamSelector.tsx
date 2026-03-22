'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Team } from '@/types/team';
import { useTheme } from '@/hooks/useTheme';
import { getAllTeams, TeamResponse } from '@/lib/teamsApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { useTeamStore } from '@/store/teamStore';
import { useAuth } from '@/hooks/useAuth';

interface TeamSelectorProps {}

interface Sport {
    id: string;
    name: string;
    icon: string;
    leagues: League[];
}

interface League {
    id: string;
    name: string;
    teams: Team[];
}

export default function TeamSelector({}: TeamSelectorProps) {
    const { myTeams, toggleTeam } = useTeamStore();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [sportsData, setSportsData] = useState<Sport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Selection State
    const [selectedSportId, setSelectedSportId] = useState<string>('');
    const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
    const { themeColors } = useTheme();

    // API에서 팀 데이터 가져오기
    useEffect(() => {
        async function fetchTeams() {
            try {
                setIsLoading(true);
                const teams = await getAllTeams();

                // 데이터를 Sport > League > Team 구조로 변환
                const sportMap = new Map<string, Sport>();

                teams.forEach((team: TeamResponse) => {
                    if (!team.league_id || !team.leagues) return;

                    // API에서 category 필드로 변경됨
                    const sportName = team.leagues.category || 'Other';
                    const sportId = sportName.toLowerCase().replace(/\s+/g, '-');

                    // Sport 생성 또는 가져오기 (이미 존재하면 기존 것 사용)
                    if (!sportMap.has(sportId)) {
                        sportMap.set(sportId, {
                            id: sportId,
                            name: sportName,
                            icon: getSportIcon(sportName),
                            leagues: [],
                        });
                    }

                    const sport = sportMap.get(sportId)!;

                    // League 찾기 또는 생성
                    let league = sport.leagues.find((l: League) => l.id === team.league_id);
                    if (!league) {
                        league = {
                            id: team.league_id,
                            name: team.leagues.name,
                            teams: [],
                        };
                        sport.leagues.push(league);
                    }

                    // Team 추가
                    league.teams.push({
                        id: team.id,
                        name: team.name,
                        logo: '🏆', // 기본 이모지
                        logoUrl: team.logo_url, // URL 따로 저장
                        mainColor: team.primary_color || '#FFFFFF',
                        subColor: team.secondary_color || '#000000',
                        leagueId: team.league_id,
                    });
                });

                const sports = Array.from(sportMap.values());
                setSportsData(sports);

                // 첫 번째 스포츠와 리그 선택
                if (sports.length > 0) {
                    setSelectedSportId(sports[0].id);
                    if (sports[0].leagues.length > 0) {
                        setSelectedLeagueId(sports[0].leagues[0].id);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '팀 데이터를 불러올 수 없습니다');
            } finally {
                setIsLoading(false);
            }
        }

        fetchTeams();
    }, []);

    // 스포츠 아이콘 매핑
    function getSportIcon(sportName: string): string {
        const iconMap: Record<string, string> = {
            '축구': '⚽',
            '야구': '⚾',
            '농구': '🏀',
            '모토스포츠': '🏁',
            'e스포츠': '🎮',
            '미식축구': '🏈',
            '아이스하키': '🏒',
        };
        return iconMap[sportName.toLowerCase()] || iconMap[sportName] || '🏆';
    }

    // Derived State
    const activeSport = sportsData.find(s => s.id === selectedSportId) || sportsData[0];
    const activeLeague = activeSport?.leagues.find((l: League) => l.id === selectedLeagueId) || activeSport?.leagues[0];

    const controls = useDragControls();

    return (
        <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: isOpen ? "0%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(event, info) => {
                if (info.offset.y > 50 || info.velocity.y > 500) {
                    setIsOpen(false);
                } else if (info.offset.y < -50 || info.velocity.y < -500) {
                    setIsOpen(true);
                }
            }}
        >
            {/* Unified Container */}
            <div
                className="w-full h-[75vh] md:h-[60vh] bg-zinc-950 pointer-events-auto flex flex-col relative border-t-2"
                style={{
                    borderTopColor: themeColors.primary,
                    boxShadow: isOpen ? `0 -20px 60px -10px ${themeColors.primary}33` : 'none'
                }}
            >

                {/* --- Ticker-style Peeking Handle (Restored) --- */}
                <div className="absolute -top-10 md:-top-12 left-0 right-0 h-10 md:h-12 z-50 flex justify-center pointer-events-none">
                    <div
                        className="w-full md:w-1/3 h-full cursor-pointer flex items-center justify-between px-4 md:px-6 pointer-events-auto transition-all group bg-zinc-950 border-t-2 border-x-2 relative overflow-hidden"
                        style={{ borderColor: themeColors.primary }}
                        onPointerDown={(e) => controls.start(e)}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {/* Ticker-style Decorative Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-0 pointer-events-none opacity-50"></div>

                        <span
                            className="relative z-10 font-oswald font-bold uppercase tracking-[0.2em] text-sm md:text-base"
                            style={{ color: themeColors.primary }}
                        >
                            {isOpen ? "CLOSE FEED" : "CUSTOMIZE TEAM"}
                        </span>
                        <div className="relative z-10 flex gap-1">
                            <div className="w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: themeColors.primary }}></div>
                            <div className="w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: themeColors.primary }}></div>
                            <div className="w-2 h-2 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: themeColors.primary }}></div>
                        </div>
                    </div>
                </div>

                {/* --- Main Content (Ticker Style List) --- */}
                <div className="flex-1 flex flex-col relative overflow-hidden">

                    {/* Premium Sport-Tech Background Pattern */}
                    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '15px 15px' }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-0 pointer-events-none"></div>

                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner size="md" text="FETCHING TEAMS" />
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-sport-red font-oswald text-xl uppercase tracking-wider">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 1. Sport & League Selector (Split Lines) */}
                            <div
                                className="bg-zinc-950 border-b flex flex-col z-10 shrink-0"
                                style={{ borderBottomColor: themeColors.secondary }}
                            >
                                {/* Row 1: Sports */}
                                <div
                                    className="h-12 flex items-center px-4 md:px-8 gap-4 overflow-x-auto no-scrollbar border-b"
                                    style={{ borderBottomColor: themeColors.secondary + '40' }}
                                >
                                    {sportsData.map(sport => (
                                        <button
                                            key={sport.id}
                                            onClick={() => { setSelectedSportId(sport.id); setSelectedLeagueId(sport.leagues[0]?.id || ''); }}
                                            className={`px-3 py-1 font-oswald font-semibold uppercase tracking-wider text-sm transition-all ${selectedSportId === sport.id
                                                ? 'bg-white text-black'
                                                : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            <span className="text-lg md:text-sm">{sport.icon}</span>
                                            <span className="hidden md:inline">{sport.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {/* Row 2: Leagues */}
                                <div className="h-12 flex items-center px-4 md:px-8 gap-6 overflow-x-auto no-scrollbar">
                                    {activeSport?.leagues.map((league: League) => (
                                        <button
                                            key={league.id}
                                            onClick={() => setSelectedLeagueId(league.id)}
                                            className={`font-oswald uppercase text-xs md:text-sm flex items-center gap-2 group transition-colors ${selectedLeagueId === league.id ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            {selectedLeagueId === league.id && <span className="text-white">///</span>}
                                            {league.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Teams List (Compact & Angular & Dynamic Colors) */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2">
                                    {activeLeague?.teams.map((team: Team) => {
                                        const isSelected = myTeams.some(t => t.id === team.id);
                                        return (
                                            <div
                                                key={team.id}
                                                onClick={() => toggleTeam(team, user?.uid)}
                                                className={`
                                                    group relative h-12 flex items-center justify-between px-4 cursor-pointer transition-all duration-150 border-2 overflow-hidden
                                                    ${isSelected
                                                        ? 'text-white border-white/20'
                                                        : 'bg-white/5 text-zinc-400 border-transparent hover:bg-white/10 hover:text-white hover:border-white/20'}`}
                                                style={{
                                                    backgroundColor: isSelected ? `${themeColors.primary}20` : undefined,
                                                    borderColor: isSelected ? themeColors.primary : undefined
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {team.logoUrl ? (
                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                            <img
                                                                src={team.logoUrl}
                                                                alt={team.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-xl w-6 text-center">{team.logo}</span>
                                                    )}
                                                    <span className="font-oswald font-bold uppercase tracking-wide text-sm pt-0.5">
                                                        {team.name}
                                                    </span>
                                                </div>

                                                {/* High-End Status Indicator (Vertical Accent Bar) */}
                                                <div className="flex items-center h-full relative z-20">
                                                    {isSelected ? (
                                                        <div 
                                                            className="absolute -right-4 top-[-24px] bottom-[-24px] w-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                            style={{ backgroundColor: themeColors.primary }}
                                                        />
                                                    ) : (
                                                        <span className="text-white/10 group-hover:text-white/30 text-xs font-black">///</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer Info */}
                    <div
                        className="h-10 flex items-center justify-between px-6 text-[10px] font-mono font-black uppercase tracking-[0.2em] z-20 border-t bg-zinc-950"
                        style={{
                            borderTopColor: themeColors.secondary,
                            color: themeColors.primary
                        }}
                    >
                        <span>{myTeams.length} TEAMS ACTIVE</span>
                        <span>CUSTOMIZE YOUR FEED</span>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}