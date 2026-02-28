'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function Ticker() {
    const { themeColors } = useTheme();

    // 대비 색상에 따른 텍스트 컬러 결정
    const isDarkText = themeColors.primaryText === '#000000';
    const accentTextClass = isDarkText ? "text-white/70" : "text-white/80";
    const subTextClass = isDarkText ? "text-black/30" : "text-white/30";
    const contrastTextClass = isDarkText ? "text-white" : "text-white";

    const tickerContent = (
        <React.Fragment>
            <span className={contrastTextClass}>BAY <span className={accentTextClass}>2 - 1</span> CHE</span>
            <span className={`${subTextClass} mx-4`}>///</span>
            <span className={contrastTextClass}>RMA <span className={accentTextClass}>3 - 0</span> BAR</span>
            <span className={`${subTextClass} mx-4`}>///</span>
            <span className={contrastTextClass}>LIV <span className={accentTextClass}>1 - 1</span> MCI</span>
            <span className={`${subTextClass} mx-4`}>///</span>
            <span className={contrastTextClass}>PSG <span className={accentTextClass}>4 - 0</span> MAR</span>
            <span className={`${subTextClass} mx-4`}>///</span>
            <span className={contrastTextClass}>NAP <span className={accentTextClass}>2 - 2</span> MIL</span>
            <span className={`${subTextClass} mx-4`}>///</span>
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
                className="flex whitespace-nowrap font-oswald font-bold text-sm tracking-widest uppercase items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
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
