'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Team } from '@/data/sportsData';

interface HeaderProps {
    myTeams?: Team[];
}

export default function Header({ myTeams = [] }: HeaderProps) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, isLoggedIn, logout, handleLoginSuccess } = useAuth();
    const { themeColors } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            <header className="fixed top-12 inset-x-8 z-40 flex items-start justify-between pointer-events-none">
                {/* 왼쪽: FTT 로고 (Floating) */}
                <div className="pointer-events-auto flex flex-col group cursor-pointer">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic font-oswald text-white leading-[0.85] drop-shadow-2xl flex gap-3">
                        FOR THE <span style={{ color: themeColors.primary }}>TEAM</span>
                    </h1>
                    <div
                        className="h-1 w-full bg-transparent mt-2 transition-all duration-300 group-hover:block"
                        style={{ backgroundColor: themeColors.primary }}
                    ></div>
                </div>

                {/* 우측: 로그인 버튼 또는 유저 프로필 */}
                <div className="pointer-events-auto relative" ref={dropdownRef}>
                    {!isLoggedIn ? (
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="relative px-8 py-3 bg-white text-black text-sm font-black font-oswald tracking-widest uppercase transition-all duration-300 skew-x-[-12deg] shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 group overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                style={{ backgroundColor: themeColors.primary }}
                            />
                            <span
                                className="relative block skew-x-[12deg] group-hover:text-current"
                                style={{ color: 'inherit' }}
                            // Note: We'll handle the text color change via a dynamic style or simple group-hover
                            >
                                <motion.span
                                    animate={{ color: undefined }} // Reset
                                    whileHover={{ color: themeColors.primaryText }}
                                >
                                    Login
                                </motion.span>
                            </span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="relative px-6 py-3 bg-zinc-900 border-2 border-zinc-700 text-white text-sm font-black font-oswald tracking-widest uppercase hover:border-sport-red transition-all duration-300 skew-x-[-12deg] shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-95"
                            >
                                <span className="block skew-x-[12deg] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {user?.nickname}
                                </span>
                            </button>

                            {/* 드롭다운 메뉴 */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-zinc-900 border-2 border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
                                    >
                                        {/* 유저 정보 */}
                                        <div className="p-4 border-b border-zinc-800">
                                            <p className="text-white font-bold font-mono text-xs uppercase tracking-wider">
                                                {user?.nickname}
                                            </p>
                                            <p className="text-zinc-500 font-mono text-xs mt-1 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* 메뉴 항목 */}
                                        <div className="py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-zinc-300 hover:bg-red-900/20 hover:text-sport-red transition-colors font-mono text-sm uppercase tracking-wider flex items-center gap-3"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}