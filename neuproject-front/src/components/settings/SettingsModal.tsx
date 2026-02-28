// src/components/settings/SettingsModal.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '@/data/sportsData';
import { useTheme } from '@/hooks/useTheme';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    myTeams: Team[];
}

export default function SettingsModal({ isOpen, onClose, myTeams }: SettingsModalProps) {
    const { mainTeam, setMainTeam, themeColors } = useTheme();

    const handleTeamSelect = (team: Team) => {
        setMainTeam(team);
    };

    const handleReset = () => {
        setMainTeam(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with enhanced blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="bg-zinc-950 border-4 w-full max-w-2xl pointer-events-auto relative overflow-hidden shadow-[20px_20px_0_rgba(0,0,0,0.5)]"
                            style={{ borderColor: themeColors.primary }}
                        >
                            {/* Grid Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* Header: Sharp & Solid */}
                            <div
                                className="relative p-6 border-b-4"
                                style={{
                                    backgroundColor: themeColors.primary,
                                    borderColor: themeColors.secondary,
                                    color: themeColors.primaryText
                                }}
                            >
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <h2 className="text-5xl font-oswald font-black uppercase italic tracking-tighter leading-none mb-1">
                                            SETTINGS
                                        </h2>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-1 w-4 bg-current opacity-40" />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-black/10 transition-colors"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Sub-Header / Reset Bar */}
                            <div className="bg-zinc-900 border-b-2 border-zinc-800 px-8 py-3 flex justify-between items-center">
                                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-[0.3em]">
                                    Configuration v2.0
                                </span>
                                {mainTeam && (
                                    <button
                                        onClick={handleReset}
                                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sport-red hover:text-white transition-colors"
                                    >
                                        <span className="w-2 h-2 bg-current rotate-45 group-hover:rotate-0 transition-transform" />
                                        RESET TO DEFAULT THEME
                                    </button>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto relative no-scrollbar">
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6" style={{ backgroundColor: themeColors.primary }} />
                                            <h3 className="text-white font-oswald text-2xl uppercase tracking-tight">
                                                TEAM CUSTOMIZATION
                                            </h3>
                                        </div>
                                    </div>

                                    {myTeams.length === 0 ? (
                                        <div className="bg-white/2 border border-white/5 p-12 text-center">
                                            <div className="text-4xl mb-4 opacity-20">🏁</div>
                                            <p className="text-zinc-500 font-oswald text-lg uppercase tracking-wide">
                                                NO TEAMS FOLLOWED
                                            </p>
                                            <p className="text-zinc-600 text-sm mt-1">
                                                FOLLOW YOUR FAVORITE TEAMS TO UNLOCK THEMES
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {myTeams.map((team) => {
                                                const isSelected = mainTeam?.id === team.id;
                                                return (
                                                    <button
                                                        key={team.id}
                                                        onClick={() => handleTeamSelect(team)}
                                                        className={`
                                                            group relative p-1 transition-all duration-300 transform rounded-sm
                                                            ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
                                                        `}
                                                    >
                                                        <div
                                                            className={`
                                                                relative h-full p-4 flex items-center gap-4 border-2 transition-all duration-200
                                                                ${isSelected
                                                                    ? 'bg-zinc-900'
                                                                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                                                                }
                                                            `}
                                                            style={{
                                                                borderColor: isSelected ? team.mainColor : undefined,
                                                            }}
                                                        >
                                                            {/* Team Logo Container */}
                                                            <div
                                                                className="w-16 h-16 flex items-center justify-center bg-black/60 border-2 shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform"
                                                                style={{ borderColor: isSelected ? team.mainColor : 'rgba(255,255,255,0.05)' }}
                                                            >
                                                                {team.logoUrl ? (
                                                                    <img
                                                                        src={team.logoUrl}
                                                                        alt={team.name}
                                                                        className="w-12 h-12 object-contain relative z-10"
                                                                    />
                                                                ) : (
                                                                    <span className="text-3xl relative z-10">{team.logo}</span>
                                                                )}
                                                            </div>

                                                            {/* Team Details */}
                                                            <div className="flex-1 text-left">
                                                                <div className={`font-oswald font-black uppercase italic text-xl tracking-tight leading-none transition-colors ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                                    {team.name}
                                                                </div>
                                                                <div className="flex gap-1 mt-3">
                                                                    <div className="h-1.5 w-6" style={{ backgroundColor: team.mainColor }} />
                                                                    <div className="h-1.5 w-3" style={{ backgroundColor: team.subColor }} />
                                                                </div>
                                                            </div>

                                                            {/* Selection Indicator (Sharp) */}
                                                            {isSelected && (
                                                                <div className="absolute top-0 right-0 p-1">
                                                                    <div
                                                                        className="w-4 h-4"
                                                                        style={{
                                                                            background: `linear-gradient(135deg, transparent 50%, ${team.mainColor} 50%)`
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Preview Cards */}
                                {mainTeam && (
                                    <div className="border-t border-white/5 pt-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Live Preview</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Primary Card */}
                                            <div className="space-y-2">
                                                <div
                                                    className="h-24 p-4 flex flex-col justify-end border"
                                                    style={{
                                                        backgroundColor: themeColors.primary,
                                                        color: themeColors.primaryText,
                                                        borderColor: themeColors.secondary + '40'
                                                    }}
                                                >
                                                    <span className="text-[8px] uppercase tracking-widest opacity-60 font-bold mb-1">Primary Color</span>
                                                    <span className="font-oswald font-black text-xl italic uppercase leading-none">VIBRANT UI</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-500 uppercase flex justify-between px-1">
                                                    <span>HEX</span>
                                                    <span>{themeColors.primary}</span>
                                                </div>
                                            </div>

                                            {/* Secondary Card */}
                                            <div className="space-y-2">
                                                <div
                                                    className="h-24 p-4 flex flex-col justify-end border bg-zinc-900"
                                                    style={{
                                                        borderColor: themeColors.secondary,
                                                        color: '#FFFFFF'
                                                    }}
                                                >
                                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.secondary }} />
                                                    <span className="text-[8px] uppercase tracking-widest opacity-60 font-bold mb-1">Secondary Accent</span>
                                                    <span className="font-oswald font-black text-xl italic uppercase leading-none" style={{ color: themeColors.secondary }}>ACCENT BORDER</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-500 uppercase flex justify-between px-1">
                                                    <span>HEX</span>
                                                    <span>{themeColors.secondary}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer: Contrast fixed Button */}
                            <div className="p-6 bg-zinc-900 border-t-2 border-zinc-800 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="relative px-12 py-4 font-oswald font-black uppercase italic tracking-tighter text-2xl transition-all duration-200 active:scale-95 group overflow-hidden"
                                    style={{
                                        backgroundColor: themeColors.primary,
                                        color: themeColors.primaryText,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <span className="relative">APPLY CONFIG</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
