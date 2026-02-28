// src/hooks/useTheme.ts
'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/data/sportsData';

interface ThemeColors {
    primary: string;
    secondary: string;
    primaryText: string; // 자동 계산된 대비 텍스트 색상 (Primary용)
    secondaryText: string; // 자동 계산된 대비 텍스트 색상 (Secondary용)
}

const DEFAULT_COLORS: ThemeColors = {
    primary: '#ff4655', // sport-red
    secondary: '#000000',
    primaryText: '#FFFFFF',
    secondaryText: '#FFFFFF',
};

// 색상의 상대 밝기 계산 (WCAG 기준)
function getLuminance(hex: string): number {
    // hex를 RGB로 변환
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // 상대 밝기 계산
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// 배경 색상에 대한 적절한 텍스트 색상 반환
function getContrastColor(hexColor: string): string {
    const luminance = getLuminance(hexColor);
    // 밝기가 0.5 이상이면 검은색, 아니면 흰색
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// CSS 변수 업데이트
function updateCSSVariables(colors: ThemeColors) {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-primary-text', colors.primaryText);
        root.style.setProperty('--color-secondary-text', colors.secondaryText);
    }
}

import { useThemeContext } from '@/providers/ThemeContext';

export function useTheme() {
    return useThemeContext();
}
