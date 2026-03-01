// src/hooks/useAuth.ts
'use client';

import { useAuthStore } from '@/store/authStore';
import { LoginResponse } from '@/lib/authApi';

export function useAuth() {
    const { user, isLoggedIn, login, logout } = useAuthStore();

    const handleLoginSuccess = (userData: LoginResponse) => {
        login(userData);
    };

    return {
        user,
        isLoggedIn,
        logout,
        handleLoginSuccess,
    };
}
