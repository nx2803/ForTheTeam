import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/lib/authApi';

interface AuthState {
    user: LoginResponse | null;
    isLoggedIn: boolean;
    login: (userData: LoginResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,
            login: (userData) => set({ user: userData, isLoggedIn: true }),
            logout: () => set({ user: null, isLoggedIn: false }),
        }),
        {
            name: 'user-storage', // localStorage key
        }
    )
);
