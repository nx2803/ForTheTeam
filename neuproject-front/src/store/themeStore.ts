import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team } from '@/types/team';

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

interface ThemeState {
    mainTeam: Team | null;
    themeColors: ThemeColors;
    setMainTeam: (team: Team | null) => void;
    updateCSSVariables: (colors: ThemeColors) => void;
}

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

// 최적화된 대비 색상 계산
function getContrastColor(hexColor: string): string {
    const luminance = getLuminance(hexColor);
    return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

function calculateColors(team: Team | null): ThemeColors {
    if (!team) return DEFAULT_COLORS;

    const primary = team.mainColor || DEFAULT_COLORS.primary;
    const secondary = team.subColor || DEFAULT_COLORS.secondary;

    return {
        primary,
        secondary,
        primaryText: getContrastColor(primary),
        secondaryText: getContrastColor(secondary),
    };
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mainTeam: null,
            themeColors: DEFAULT_COLORS,
            setMainTeam: (team) => {
                const colors = calculateColors(team);
                set({ mainTeam: team, themeColors: colors });
                get().updateCSSVariables(colors);
            },
            updateCSSVariables: (colors) => {
                if (typeof document !== 'undefined') {
                    const root = document.documentElement;
                    root.style.setProperty('--color-primary', colors.primary);
                    root.style.setProperty('--color-secondary', colors.secondary);
                    root.style.setProperty('--color-primary-text', colors.primaryText);
                    root.style.setProperty('--color-secondary-text', colors.secondaryText);
                    root.style.setProperty('--color-primary-glow', `${colors.primary}99`);
                }
            },
        }),
        {
            name: 'mainTeam-storage',
            // 테마 초기화를 위한 커스텀 로직이나 onRehydrate 사용 가능
        }
    )
);
