'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTeamStore } from '@/store/teamStore';

interface TickerProps {}

export default function Ticker({}: TickerProps) {
    const { myTeams } = useTeamStore();
    const { themeColors } = useTheme();
    const { user, isLoggedIn } = useAuth();
    const [recentMatches, setRecentMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const teamIds = myTeams?.map(t => t.id).join(',') || '';

    useEffect(() => {
        const fetchRecentMatches = async () => {
            // 로그인 상태인데 아직 유저 정보가 없거나, 팀 목록이 로딩 중일 가능성 배제
            if (isLoggedIn && !user?.uid) return;
            if (!isLoggedIn && !teamIds) {
                // 비로그인인데 팔로우 팀도 선택 안 한 경우는 결과가 없으므로 fetch를 건너뜀
                setIsLoading(false);
                setRecentMatches([]);
                return;
            }

            try {
                setIsLoading(true);
                let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/recent?days=7`;

                if (isLoggedIn && user?.uid) {
                    url += `&memberUid=${user.uid}`;
                }

                // 로그인 여부와 무관하게 선택된 팀 ID가 있다면 추가 (비로그인 로컬 팔로우 지원)
                if (teamIds) {
                    url += `&teamIds=${teamIds}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                setRecentMatches(data);
            } catch (error) {
                console.error('Failed to fetch recent matches for ticker:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentMatches();
    }, [isLoggedIn, user?.uid, teamIds]);


    const tickerContent = (
        <React.Fragment>
            {isLoading ? (
                <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" text="" />
                    <span className="text-zinc-400">LOADING LATEST RESULTS</span>
                </div>
            ) : recentMatches.length > 0 ? (
                recentMatches.map((match, idx) => {
                    const homeName = match.home_team?.name || match.home_team_id;
                    const awayName = match.away_team?.name || match.away_team_id;
                    const score = `${match.home_score} - ${match.away_score}`;
                    return (
                        <React.Fragment key={match.id}>
                            <span className="text-white">
                                {homeName}{" "}
                                <span style={{ color: themeColors.primary }} className="font-black mx-1">{score}</span>{" "}
                                {awayName}
                            </span>
                            <span className="text-zinc-700 mx-4">///</span>
                        </React.Fragment>
                    );
                })
            ) : (
                <span className="text-zinc-500">NO RECENT MATCH RESULTS FOR YOUR TEAMS</span>
            )}
            {(!myTeams || myTeams.length === 0) && (
                <React.Fragment>
                    {!isLoading && <span className="text-zinc-700 mx-4">///</span>}
                    <span className="text-zinc-400 font-bold">SELECT YOUR TEAM FOR CUSTOM SCHEDULE</span>
                    <span className="text-zinc-700 mx-4">///</span>
                </React.Fragment>
            )}
        </React.Fragment>
    );

    return (
        <div
            className="fixed top-0 inset-x-0 h-10 z-50 flex items-center overflow-hidden select-none bg-zinc-950/80 backdrop-blur-md shadow-2xl transition-all duration-500"
            style={{
                borderBottom: `2px solid ${themeColors.primary}`
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10 pointer-events-none opacity-50"></div>
            <motion.div
                className="flex whitespace-nowrap font-oswald font-bold text-sm tracking-[0.2em] uppercase items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 70 }}
                style={{ width: "fit-content" }}
            >
                {/* Duplicate content enough times to fill screen and loop smoothly */}
                <div className="flex items-center px-4">{tickerContent}</div>
                <div className="flex items-center px-4">{tickerContent}</div>
                <div className="flex items-center px-4">{tickerContent}</div>
                <div className="flex items-center px-4">{tickerContent}</div>
            </motion.div>
        </div>
    );
}
