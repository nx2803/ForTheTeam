'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown, X } from 'lucide-react';

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
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-end pb-12 md:pb-16 cursor-pointer"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-zinc-900 border border-zinc-700 shadow-2xl p-6 pt-8 rounded-none relative max-w-sm w-[90%] cursor-default"
                    style={{ borderTop: `4px solid ${themeColors.primary}` }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-oswald font-black text-2xl italic tracking-tighter text-white leading-tight uppercase">
                                Design Your Schedule
                            </h3>
                            <p className="text-zinc-400 text-sm font-bold leading-relaxed tracking-tight">
                                하단 메뉴에서 응원하는 팀을 골라보세요.<br/>
                                선택한 팀의 일정만 캘린더에 나타납니다.
                            </p>
                        </div>

                        <motion.div 
                            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="flex items-center justify-center pt-2"
                            style={{ color: themeColors.primary }}
                        >
                            <ChevronDown size={40} strokeWidth={3} />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
