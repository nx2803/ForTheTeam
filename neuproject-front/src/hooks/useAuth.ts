import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { LoginResponse } from '@/lib/authApi';

export function useAuth() {
    const { user, isLoggedIn, login, logout } = useAuthStore();

    const handleLoginSuccess = useCallback((userData: LoginResponse) => {
        login(userData);
    }, [login]);

    return useMemo(() => ({
        user,
        isLoggedIn,
        logout,
        handleLoginSuccess,
    }), [user, isLoggedIn, logout, handleLoginSuccess]);
}
