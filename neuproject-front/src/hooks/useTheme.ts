// src/hooks/useTheme.ts
'use client';

import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
    const { mainTeam, themeColors, setMainTeam } = useThemeStore();

    return {
        mainTeam,
        themeColors,
        setMainTeam,
    };
}
