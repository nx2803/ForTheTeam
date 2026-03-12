import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { LoginResponse } from '@/lib/authApi';

export function useAuth() {
    const { user, isLoggedIn, login, logout: authLogout } = useAuthStore();
    const { clearMyTeams } = useTeamStore();

    const handleLoginSuccess = useCallback((userData: LoginResponse) => {
        login(userData);
    }, [login]);

    const logout = useCallback(() => {
        authLogout();
        clearMyTeams();
    }, [authLogout, clearMyTeams]);

    return useMemo(() => ({
        user,
        isLoggedIn,
        logout,
        handleLoginSuccess,
    }), [user, isLoggedIn, logout, handleLoginSuccess]);
}
