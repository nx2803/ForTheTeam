// src/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { LoginResponse } from '@/lib/authApi';

export function useAuth() {
    const [user, setUser] = useState<LoginResponse | null>(null);

    useEffect(() => {
        // localStorage에서 사용자 정보 불러오기
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleLoginSuccess = (userData: LoginResponse) => {
        setUser(userData);
    };

    return {
        user,
        isLoggedIn: !!user,
        logout,
        handleLoginSuccess,
    };
}
