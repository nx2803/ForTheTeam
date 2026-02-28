// src/providers/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '@/data/sportsData';

interface ThemeColors {
    primary: string;
    secondary: string;
    primaryText: string;
    secondaryText: string;
}

const DEFAULT_COLORS: ThemeColors = {
    primary: '#ff4655', // sport-red
    secondary: '#000000',
    primaryText: '#FFFFFF',
    secondaryText: '#FFFFFF',
};

interface ThemeContextType {
    mainTeam: Team | null;
    themeColors: ThemeColors;
    setMainTeam: (team: Team | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 색상의 상대 밝기 계산 (WCAG 기준)
function getLuminance(hex: string): number {
    if (!hex || hex.length < 7) return 0;
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// 최적화된 대비 색상 계산 (WCAG 2.0 기준 보정)
function getContrastColor(hexColor: string): string {
    const luminance = getLuminance(hexColor);
    // 0.5 대신 0.6을 사용하여 밝은 색상(ex: 노란색, 밝은 연두색)에서 
    // 검은색 글씨가 더 일찍 나타나도록 조정하여 가독성 강화
    return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

// UI 요소가 배경(#0a0a0a)이나 흰색에 동화되지 않도록 최소/최대 밝기 조정
// 사용자의 요청에 따라 브랜드 컬러를 변조하지 않고 원본 Hex를 그대로 반환함
function ensureVisibility(hex: string): string {
    return hex;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mainTeam, setMainTeamState] = useState<Team | null>(null);
    const [themeColors, setThemeColors] = useState<ThemeColors>(DEFAULT_COLORS);

    // CSS 변수 업데이트 전문 함수
    const updateCSSVariables = (colors: ThemeColors) => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            // 가시성이 보장된 색상 적용
            const safePrimary = ensureVisibility(colors.primary);
            const safeSecondary = ensureVisibility(colors.secondary);

            root.style.setProperty('--color-primary', safePrimary);
            root.style.setProperty('--color-secondary', safeSecondary);
            root.style.setProperty('--color-primary-text', colors.primaryText);
            root.style.setProperty('--color-secondary-text', colors.secondaryText);

            // Neon/Glow 효과를 위한 변수 (더 선명하게 60% 정도의 투명도 적용)
            root.style.setProperty('--color-primary-glow', `${safePrimary}99`);
        }
    };

    // 초기 로드
    useEffect(() => {
        const savedTeam = localStorage.getItem('mainTeam');
        if (savedTeam) {
            try {
                const team: Team = JSON.parse(savedTeam);
                setMainTeamState(team);
                const colors = calculateColors(team);
                setThemeColors(colors);
                updateCSSVariables(colors);
            } catch (e) {
                updateCSSVariables(DEFAULT_COLORS);
            }
        } else {
            updateCSSVariables(DEFAULT_COLORS);
        }
    }, []);

    const calculateColors = (team: Team | null): ThemeColors => {
        if (!team) return DEFAULT_COLORS;

        // 원본 색상을 가져오되 가시성 보정을 거침
        const primary = ensureVisibility(team.mainColor || DEFAULT_COLORS.primary);
        const secondary = ensureVisibility(team.subColor || DEFAULT_COLORS.secondary);

        return {
            primary,
            secondary,
            primaryText: getContrastColor(primary),
            secondaryText: getContrastColor(secondary),
        };
    };

    const setMainTeam = (team: Team | null) => {
        setMainTeamState(team);
        if (team) {
            localStorage.setItem('mainTeam', JSON.stringify(team));
        } else {
            localStorage.removeItem('mainTeam');
        }

        const newColors = calculateColors(team);
        setThemeColors(newColors);
        updateCSSVariables(newColors);
    };

    return (
        <ThemeContext.Provider value={{ mainTeam, themeColors, setMainTeam }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
