'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function EmptyGuideOverlay() {
    const { themeColors } = useTheme();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVisible(false)}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-end pb-24 md:pb-32 cursor-pointer"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-zinc-900 border border-zinc-700 shadow-2xl p-6 rounded-none relative max-w-sm w-[90%] cursor-default"
                    style={{ borderTop: `4px solid ${themeColors.primary}` }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
                        >
                            <span className="text-3xl">👇</span>
                        </motion.div>
                        
                        <div className="space-y-1">
                            <h3 className="font-oswald font-black text-2xl italic tracking-tighter text-white leading-tight uppercase">
                                Design Your Schedule
                            </h3>
                            <p className="text-zinc-400 text-sm font-bold leading-relaxed tracking-tight">
                                하단 메뉴에서 응원하는 팀을 골라보세요.<br/>
                                선택한 팀의 일정만 캘린더에 나타납니다.
                            </p>
                        </div>
                    </div>

                    {/* Arrow Pointer */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-zinc-900"></div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
