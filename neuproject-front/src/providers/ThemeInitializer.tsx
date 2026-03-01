'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeInitializer() {
    const { themeColors, updateCSSVariables } = useThemeStore();

    useEffect(() => {
        // 브라우저 환경에서 저장된 테마 색상을 CSS 변수에 적용
        updateCSSVariables(themeColors);
    }, [themeColors, updateCSSVariables]);

    return null;
}
