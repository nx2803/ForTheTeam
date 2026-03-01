'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function LoadingSpinner({
    size = 'md',
    text = 'LOADING...'
}: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
}) {
    const { themeColors } = useTheme();

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const ringWidth = {
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className={`relative ${sizes[size]}`}>
                {/* Minimalist Background Track */}
                <div
                    className="absolute inset-0 rounded-full border-zinc-800/30"
                    style={{ borderWidth: ringWidth[size] }}
                />

                {/* Primary Rotating Accent */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: `${ringWidth[size]}px solid transparent`,
                        borderTopColor: themeColors.primary,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {text && (
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="font-oswald font-black text-xl md:text-2xl tracking-tighter text-white uppercase"
                    >
                        {text}
                    </motion.div>
                    {/* Minimal Animated Underline */}
                    <div className="h-0.5 w-16 bg-zinc-800 mt-2 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            style={{ backgroundColor: themeColors.primary }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
