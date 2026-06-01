'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTeamStore } from '@/store/teamStore';
import { useTheme } from '@/hooks/useTheme';
import { useStandings } from '@/hooks/useStandings';
import Image from 'next/image';
import { Shield, Award } from 'lucide-react';

const ALL_LEAGUES = [
    { id: 'b0f16e7b-72d2-4e94-861e-546fe11ad4ea', name: 'KBO', category: '야구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/KBO.svg' },
    { id: '08dec493-da36-4afa-a43c-6548f6baada1', name: 'LCK', category: 'e스포츠', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/LCK.svg' },
    { id: '9a268762-c365-49bf-aa5e-28982e2bde61', name: 'EPL', category: '축구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/EPL.svg' },
    { id: '31a794f8-86cd-4d07-ba83-4f5963915512', name: 'Bundesliga', category: '축구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/Bundesliga.svg' },
    { id: '4d99fcdd-77f2-48ce-97eb-a3d3d8fe55a7', name: 'La Liga', category: '축구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/La%20Liga.svg' },
    { id: '17f81b1a-1fc7-4b8d-99d2-72b34894b071', name: 'Serie A', category: '축구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/Serie%20A.svg' },
    { id: '8b95f014-1852-4be4-a388-4b955741726d', name: 'MLB', category: '야구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/MLB.svg' },
    { id: 'c93a69f1-96e6-4855-b98f-04c703f80c10', name: 'NBA', category: '농구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/NBA.svg' },
    { id: '72690e92-536f-492e-8251-32e6ec1272ca', name: 'NFL', category: '미식축구', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/NFL.svg' },
    { id: '46ac7bbd-ff53-4d0c-b0a6-166d52ff2110', name: 'NHL', category: '아이스하키', logoUrl: 'https://exuuamlemfdojvzkkhaq.supabase.co/storage/v1/object/public/league-logos/NHL.svg' },
];

export default function StandingsView() {
    const { myTeams } = useTeamStore();
    const { themeColors } = useTheme();

    // 내가 팔로우한 팀들이 속한 리그 ID 세트 구하기
    const followedLeagueIds = useMemo(() => {
        return new Set(myTeams.map(t => t.leagueId).filter(Boolean));
    }, [myTeams]);

    // 첫 번째 리그를 기본값으로 선택
    const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(
        ALL_LEAGUES.length > 0 ? ALL_LEAGUES[0].id : null
    );

    const activeLeague = useMemo(() => {
        return ALL_LEAGUES.find(l => l.id === selectedLeagueId) || null;
    }, [selectedLeagueId]);

    // useStandings 훅 호출
    const { data: standings = [] } = useStandings(selectedLeagueId);

    const category = activeLeague?.category || 'Sports';
    const leagueName = activeLeague?.name || '';
    const leagueNameUpper = leagueName.toUpperCase();

    const isLck = leagueNameUpper.includes('LCK');
    const isSoccer = category === '축구' || category.toLowerCase() === 'soccer' || category.toLowerCase() === 'football' || leagueNameUpper.includes('EPL') || leagueNameUpper.includes('LIGA') || leagueNameUpper.includes('BUNDESLIGA') || leagueNameUpper.includes('SERIE');
    const isKbo = leagueNameUpper.includes('KBO');

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#121212] p-2 md:p-6 h-full">
            {/* 1. Leagues Tab Bar */}
            <div className="flex gap-1.5 pb-2 mb-3 border-b border-zinc-800/80 overflow-x-auto no-scrollbar shrink-0">
                {ALL_LEAGUES.map(league => {
                    const isActive = league.id === selectedLeagueId;
                    const isFollowed = followedLeagueIds.has(league.id);
                    return (
                        <button
                            key={league.id}
                            onClick={() => setSelectedLeagueId(league.id)}
                            className="px-3 py-1.5 md:px-5 md:py-3 font-oswald text-xs md:text-sm font-bold uppercase tracking-wider italic transition-all duration-300 border bg-zinc-900/50 hover:bg-zinc-800 shrink-0 flex items-center gap-2 md:gap-3 relative overflow-hidden"
                            style={{
                                borderColor: isActive ? themeColors.primary : '#27272a',
                                color: isActive ? '#FFFFFF' : '#71717a',
                                boxShadow: isActive ? `0 0 12px ${themeColors.primary}15` : undefined
                            }}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="activeLeagueIndicator"
                                    className="absolute bottom-0.5 left-2 right-2 md:left-3 md:right-3 h-[2px] md:h-[3px] rounded-full"
                                    style={{ backgroundColor: themeColors.primary }}
                                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                                />
                            )}
                            
                            {/* Followed Indicator dot */}
                            {isFollowed && (
                                <span 
                                    className="absolute top-1 right-1 w-1 h-1 md:top-1.5 md:right-1.5 md:w-1.5 md:h-1.5 rounded-full"
                                    style={{ backgroundColor: themeColors.primary }}
                                    title="팔로우 중인 팀이 있는 리그"
                                />
                            )}
                            
                            <div className={`w-4 h-4 md:w-6 md:h-6 p-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-zinc-800' : 'bg-zinc-900/80 border border-zinc-800'}`}>
                                {league.logoUrl ? (
                                    <Image src={league.logoUrl} alt="" className="object-contain" width={24} height={24} unoptimized />
                                ) : (
                                    <Award size={12} style={{ color: isActive ? themeColors.primary : 'currentColor' }} />
                                )}
                            </div>
                            <span>{league.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* 2. League Hero Banner (Glassmorphism & Large Logo) */}
            {activeLeague && (
                <div 
                    className="relative overflow-hidden mb-4 md:mb-6 p-4 md:p-6 border border-zinc-800/80 bg-gradient-to-r from-zinc-950/90 to-zinc-900/50 backdrop-blur-md shrink-0 hidden md:flex items-center justify-between"
                >
                    {/* Background Decorative Large Logo with Blur */}
                    {activeLeague.logoUrl && (
                        <div 
                            className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 blur-[1px] pointer-events-none select-none"
                            style={{
                                backgroundImage: `url(${activeLeague.logoUrl})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    )}
                    
                    <div className="flex items-center gap-6 relative z-10">
                        {/* Large League Logo Container */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-900 p-2 md:p-3 border border-zinc-800/80 rounded-lg flex items-center justify-center shrink-0 shadow-2xl">
                            {activeLeague.logoUrl ? (
                                <Image src={activeLeague.logoUrl} alt={activeLeague.name} className="object-contain" width={80} height={80} unoptimized />
                            ) : (
                                <Award size={36} className="text-zinc-600" />
                            )}
                        </div>
                        
                        {/* League Info Texts */}
                        <div className="flex flex-col">
                            <span 
                                className="text-[10px] font-bold font-mono tracking-widest uppercase mb-1"
                                style={{ color: themeColors.primary }}
                            >
                                {activeLeague.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black font-oswald italic uppercase text-white tracking-tight leading-none">
                                {activeLeague.name}
                            </h2>
                            <p className="text-[11px] text-zinc-500 font-mono mt-1">
                                {standings.length} TEAMS competing in the league
                            </p>
                        </div>
                    </div>

                    {/* Stats Summary Panel */}
                    <div className="hidden md:flex items-center gap-8 border-l border-zinc-800/80 pl-8 relative z-10 mr-6">
                        <div className="flex flex-col text-center">
                            <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-500 uppercase">Season</span>
                            <span className="text-lg font-black font-oswald text-white italic">{new Date().getFullYear()}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-500 uppercase">Status</span>
                            <span className="text-lg font-black font-oswald text-green-500 italic uppercase">ACTIVE</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Standings Table Container */}
            <motion.div 
                key={selectedLeagueId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="flex-1 overflow-auto no-scrollbar bg-[#18181b]/20 border border-zinc-800/50"
            >
                <table className="w-full text-left border-collapse min-w-full md:min-w-[600px]">
                    <thead className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/80">
                        <tr className="text-[10px] md:text-[11px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                            <th className="py-2.5 px-2 md:py-4 md:px-4 w-10 md:w-16 text-center">Rank</th>
                            <th className="py-2.5 px-2 md:py-4 md:px-4">Team</th>
                            <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Played</th>
                            <th className="py-2.5 px-1 md:py-4 md:px-3 text-center">
                                <span className="hidden sm:inline">Won</span>
                                <span className="sm:hidden">W</span>
                            </th>
                            {isSoccer && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Drawn</th>}
                            {isKbo && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Drawn</th>}
                            <th className="py-2.5 px-1 md:py-4 md:px-3 text-center">
                                <span className="hidden sm:inline">Lost</span>
                                <span className="sm:hidden">L</span>
                            </th>
                            {isSoccer && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden md:table-cell">GD</th>}
                            {isLck && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Set Diff</th>}
                            {!isLck && !isSoccer && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden sm:table-cell">Win %</th>}
                            {!isLck && !isKbo && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center font-bold">
                                <span className="hidden sm:inline">Points</span>
                                <span className="sm:hidden">PTS</span>
                            </th>}
                            {!isLck && !isSoccer && <th className="py-2.5 px-1 md:py-4 md:px-3 text-center hidden md:table-cell">GB</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30">
                        {standings.map((item, idx) => {
                            const isMyTeam = myTeams.some(t => t.id === item.teamId || t.name === item.teamName);
                            const getDiffText = (diff?: number) => {
                                if (diff === undefined || diff === null) return '0';
                                return diff > 0 ? `+${diff}` : `${diff}`;
                            };

                            const winRateText = item.winRate !== undefined && item.winRate !== null
                                ? item.winRate.toFixed(3).replace(/^0/, '') // 0.357 -> .357 형태
                                : '.000';

                            return (
                                <tr
                                    key={item.teamId || item.teamName}
                                    className={`group transition-all duration-200 hover:bg-zinc-800/40 ${isMyTeam ? 'bg-zinc-900/60 font-medium' : ''}`}
                                    style={{
                                        borderLeft: isMyTeam ? `4px solid ${themeColors.primary}` : '4px solid transparent'
                                    }}
                                >
                                    {/* 순위 */}
                                    <td className="py-2.5 px-2 md:py-4 md:px-4 text-center font-oswald text-base md:text-lg italic font-black text-zinc-400 group-hover:text-white transition-colors">
                                        {item.rank}
                                    </td>
                                    
                                    {/* 팀 로고 및 이름 */}
                                    <td className="py-2.5 px-2 md:py-4 md:px-4 flex items-center gap-2 md:gap-3">
                                        <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shrink-0 text-zinc-600 bg-zinc-900 p-0.5 md:p-1 border border-zinc-800/50">
                                            {item.logoUrl ? (
                                                <Image src={item.logoUrl} alt="" className="object-contain" width={32} height={32} unoptimized />
                                            ) : (
                                                <Shield size={14} className="md:w-4 md:h-4" />
                                            )}
                                        </div>
                                        <span 
                                            className="text-xs md:text-sm font-semibold tracking-tight transition-colors text-zinc-200 group-hover:text-white truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none"
                                            style={{ color: isMyTeam ? '#FFFFFF' : undefined }}
                                        >
                                            {item.teamName}
                                        </span>
                                    </td>

                                    {/* 경기 수 */}
                                    <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors hidden sm:table-cell">
                                        {item.played}
                                    </td>

                                    {/* 승 */}
                                    <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                        {item.won}
                                    </td>

                                    {/* 무 (축구 & KBO) */}
                                    {isSoccer && (
                                        <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors hidden sm:table-cell">
                                            {item.drawn}
                                        </td>
                                    )}
                                    {isKbo && (
                                        <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors hidden sm:table-cell">
                                            {item.drawn}
                                        </td>
                                    )}

                                    {/* 패 */}
                                    <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                        {item.lost}
                                    </td>

                                    {/* 득실 (축구 GD) */}
                                    {isSoccer && (
                                        <td className={`py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-[10px] md:text-xs font-semibold hidden md:table-cell ${
                                            (item.goalDifference || 0) > 0 ? 'text-green-500' : (item.goalDifference || 0) < 0 ? 'text-red-500' : 'text-zinc-500'
                                        }`}>
                                            {getDiffText(item.goalDifference)}
                                        </td>
                                    )}

                                    {/* 세트득실 (LCK Set Diff) */}
                                    {isLck && (
                                        <td className={`py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-[10px] md:text-xs font-semibold hidden sm:table-cell ${
                                            (item.points || 0) > 0 ? 'text-green-500' : (item.points || 0) < 0 ? 'text-red-500' : 'text-zinc-500'
                                        }`}>
                                            {getDiffText(item.points)}
                                        </td>
                                    )}

                                    {/* 승률 (KBO, NBA, MLB 등) */}
                                    {!isLck && !isSoccer && (
                                        <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors hidden sm:table-cell">
                                            {winRateText}
                                        </td>
                                    )}

                                    {/* 승점 (축구 Points, ESPN NHL Points 등) */}
                                    {!isLck && !isKbo && (
                                        <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm font-bold text-zinc-200 group-hover:text-white">
                                            {item.points}
                                        </td>
                                    )}

                                    {/* 게임차 (GB) */}
                                    {!isLck && !isSoccer && (
                                        <td className="py-2.5 px-1 md:py-4 md:px-3 text-center font-mono text-xs md:text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors hidden md:table-cell">
                                            {item.gamesBehind || '-'}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
}
