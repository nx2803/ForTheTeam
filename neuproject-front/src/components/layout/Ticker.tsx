'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Team } from '@/types/team';

interface TickerProps {
    myTeams?: Team[];
}

export default function Ticker({ myTeams }: TickerProps) {
    const { themeColors } = useTheme();
    const { user, isLoggedIn } = useAuth();
    const [recentMatches, setRecentMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const teamIds = myTeams?.map(t => t.id).join(',') || '';

    useEffect(() => {
        const fetchRecentMatches = async () => {
            try {
                setIsLoading(true);
                let url = 'http://localhost:3001/matches/recent?days=7';
                if (isLoggedIn && user?.uid) {
                    url += `&memberUid=${user.uid}`;
                } else if (teamIds) {
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

    // 대비 색상에 따른 텍스트 컬러 결정
    const isDarkText = themeColors.primaryText === '#000000';
    const contrastTextClass = isDarkText ? "text-black" : "text-white";
    const accentTextClass = isDarkText ? "text-black/70" : "text-white/80";
    const subTextClass = isDarkText ? "text-black/30" : "text-white/30";

    const tickerContent = (
        <React.Fragment>
            {isLoading ? (
                <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" text="" />
                    <span className={contrastTextClass}>LOADING LATEST RESULTS</span>
                </div>
            ) : recentMatches.length > 0 ? (
                recentMatches.map((match, idx) => {
                    const homeName = match.home_team?.name || match.home_team_id;
                    const awayName = match.away_team?.name || match.away_team_id;
                    const score = `${match.home_score} - ${match.away_score}`;
                    return (
                        <React.Fragment key={match.id}>
                            <span className={contrastTextClass}>
                                {homeName}{" "}
                                <span className={accentTextClass}>{score}</span>{" "}
                                {awayName}
                            </span>
                            <span className={`${subTextClass} mx-4`}>///</span>
                        </React.Fragment>
                    );
                })
            ) : (
                <span className={contrastTextClass}>NO RECENT MATCH RESULTS FOR YOUR TEAMS</span>
            )}
            {/* Always add default message to pad out */}
            {!isLoading && <span className={`${subTextClass} mx-4`}>///</span>}
            <span className={`${accentTextClass} font-black`}>SELECT YOUR TEAM FOR CUSTOM SCHEDULE</span>
            <span className={`${subTextClass} mx-4`}>///</span>
        </React.Fragment>
    );

    return (
        <div
            className="fixed top-0 inset-x-0 h-10 z-50 flex items-center overflow-hidden select-none shadow-lg transition-all duration-500"
            style={{
                backgroundColor: themeColors.primary,
                borderBottom: `2px solid ${isDarkText ? themeColors.secondary : 'rgba(255,255,255,0.1)'}`
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10 pointer-events-none opacity-50"></div>
            <motion.div
                className="flex whitespace-nowrap font-oswald font-bold text-base tracking-widest uppercase items-center"
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
