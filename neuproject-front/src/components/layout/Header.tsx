'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import AboutModal from '@/components/ui/AboutModal';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useCalendarStore } from '@/store/calendarStore';
import { useTeamStore } from '@/store/teamStore';
import { Team } from '@/types/team';

interface HeaderProps { 
    isPending?: boolean;
    startTransition?: (callback: () => void) => void;
}

export default function Header({ isPending, startTransition }: HeaderProps) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { themeColors, setMainTeam, mainTeam } = useTheme();
    const { user, isLoggedIn, logout, handleLoginSuccess } = useAuth();
    const { currentDate: currentDateStr, viewMode, setViewMode, nextMonth, prevMonth } = useCalendarStore();
    const { myTeams, reorderTeams } = useTeamStore();
    const [isReorderMode, setIsReorderMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentDate = new Date(currentDateStr);
    const selectedTeamId = mainTeam?.id || null;

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <>
            <header className="fixed top-16 inset-x-0 z-40 flex items-center justify-between px-4 md:px-10 py-2 md:py-0 pointer-events-auto">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex flex-col group cursor-pointer shrink-0" onClick={() => window.location.href = '/'}>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic font-oswald text-white leading-[0.85] flex gap-1 md:gap-3">
                            FOR THE <span style={{ color: themeColors.primary }}>TEAM</span>
                        </h1>
                        <div
                            className="hidden md:block h-1 w-full bg-transparent mt-2 transition-all duration-300 group-hover:block"
                            style={{ backgroundColor: themeColors.primary }}
                        ></div>
                    </div>

                    {/* Original View Toggle Switch - Desktop Only */}
                    <div 
                        className="hidden xl:flex bg-[#18181b]/80 backdrop-blur-md border p-1 relative shrink-0 w-25 md:w-30"
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
                </div>

                 {/* 2. Center: Original Month Navigation (Larger) - Desktop Only */}
                <div className={`hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-4 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    <button
                        onClick={() => startTransition ? startTransition(() => prevMonth()) : prevMonth()}
                        disabled={isPending}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-oswald italic uppercase text-white tracking-tighter shadow-black drop-shadow-xl leading-none text-center whitespace-nowrap">
                        {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                        <span className="text-zinc-500 ml-2 md:ml-3 break-keep">{currentDate.getFullYear()}</span>
                    </h2>

                    <button
                        onClick={() => startTransition ? startTransition(() => nextMonth()) : nextMonth()}
                        disabled={isPending}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* 3. Right: Team Filter (Desktop) & User Profile */}
                <div className="flex items-center gap-4">
                    {/* Desktop Team Filter */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div
                            className="relative bg-[#18181b]/80 backdrop-blur-md px-3 md:px-4 flex items-center justify-end gap-2 border shadow-xl h-10 md:h-14 shrink-0"
                            style={{ borderColor: themeColors.secondary }}
                        >
                            <div className="flex flex-col mr-auto">
                                <button
                                    onClick={() => setMainTeam(null)}
                                    className={`text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-200 hover:text-white ${!selectedTeamId ? 'text-white' : 'text-zinc-500 hover:underline hover:underline-offset-4'}`}
                                    title="Show all teams"
                                >
                                    ALL
                                </button>
                                <button
                                    onClick={() => setIsReorderMode(!isReorderMode)}
                                    className={`text-[8px] font-mono font-bold uppercase tracking-tighter transition-all duration-200 flex items-center gap-1 ${isReorderMode ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                                >
                                    <span className={`w-1.5 h-1.5 ${isReorderMode ? 'bg-sport-red animate-pulse' : 'bg-current'}`} style={{ backgroundColor: isReorderMode ? themeColors.primary : undefined }}></span>
                                    {isReorderMode ? 'EDIT' : 'SORT'}
                                </button>
                            </div>
                            <Reorder.Group
                                axis="x"
                                values={myTeams}
                                onReorder={(newTeams) => isReorderMode && reorderTeams(newTeams, user?.uid)}
                                className="flex gap-1.5 items-center h-full overflow-x-auto no-scrollbar max-w-50 md:max-w-100"
                            >
                                {myTeams.map(team => (
                                    <Reorder.Item
                                        key={team.id}
                                        value={team}
                                        dragListener={isReorderMode}
                                        className={`
                                            w-7 h-7 md:w-9 md:h-9 shrink-0 flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300
                                            ${selectedTeamId === team.id ? 'scale-110 opacity-100' : (!selectedTeamId ? 'opacity-100' : 'opacity-40 brightness-50 hover:opacity-100 hover:brightness-100')}
                                        `}
                                        onClick={() => !isReorderMode && setMainTeam(selectedTeamId === team.id ? null : team)}
                                    >
                                        {team.logoUrl ? (
                                            <img src={team.logoUrl} alt="" className="w-full h-full object-contain p-1 pointer-events-none" />
                                        ) : (
                                            <span className="text-xs font-bold pointer-events-none">{team.logo}</span>
                                        )}
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    </div>

                    {/* Mobile Login Button */}
                    <div className="relative md:hidden" ref={dropdownRef}>
                        {!isLoggedIn ? (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="px-4 py-2 bg-white text-black text-[10px] font-black font-oswald tracking-widest uppercase shadow-lg active:scale-95"
                            >
                                Login
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-4 py-2 bg-zinc-900 border text-white text-[10px] font-black font-oswald tracking-widest uppercase shadow-md active:scale-95 flex items-center gap-2"
                                style={{ borderColor: themeColors.secondary }}
                            >
                                <span className="w-1.5 h-1.5 bg-green-500"></span>
                                {user?.nickname}
                            </button>
                        )}

                        <AnimatePresence>
                            {isLoggedIn && isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-40 bg-zinc-900 border shadow-2xl py-1 z-50 overflow-hidden"
                                    style={{ borderColor: themeColors.secondary }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsAboutOpen(true);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-colors border-b border-zinc-800"
                                    >
                                        About
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left text-zinc-400 hover:text-sport-red text-[10px] font-bold uppercase transition-colors"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Login Button */}
                    <div className="hidden md:block relative" ref={dropdownRef}>
                        {!isLoggedIn ? (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="relative h-10 md:h-14 px-8 bg-white border text-black text-sm font-black font-oswald tracking-widest uppercase transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 group overflow-hidden flex items-center justify-center"
                                style={{ borderColor: themeColors.secondary }}
                            >
                                <div
                                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                    style={{ backgroundColor: themeColors.primary }}
                                />
                                <span className="relative block group-hover:text-white transition-colors duration-300">
                                    Login
                                </span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="relative h-10 md:h-14 px-6 bg-zinc-900 border text-white text-sm font-black font-oswald tracking-widest uppercase transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 flex items-center gap-2"
                                    style={{ borderColor: themeColors.secondary }}
                                >
                                    <span className="w-2 h-2 bg-green-500"></span>
                                    {user?.nickname}
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-zinc-900 border-2 shadow-2xl overflow-hidden py-2"
                                            style={{ borderColor: themeColors.secondary }}
                                        >
                                            <div className="px-4 py-3 border-b border-zinc-800">
                                                <p className="text-white font-bold text-xs uppercase">{user?.nickname}</p>
                                                <p className="text-zinc-500 text-[10px] mt-1 truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsAboutOpen(true);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-zinc-400 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-3 border-b border-zinc-800"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                About
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-zinc-400 hover:bg-red-900/20 hover:text-sport-red transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-3"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* About Modal */}
            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />
        </>
    );
}