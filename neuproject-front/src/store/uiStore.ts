import { create } from 'zustand';

interface UIState {
    globalLoading: boolean;
    error: string | null;
    toast: {
        message: string;
        type: 'success' | 'error' | 'info';
        isVisible: boolean;
    } | null;
    
    // Actions
    setGlobalLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    globalLoading: false,
    error: null,
    toast: null,

    setGlobalLoading: (loading) => set({ globalLoading: loading }),
    setError: (error) => set({ error }),
    showToast: (message, type = 'info') => {
        set({ toast: { message, type, isVisible: true } });
        // 3초 후 자동으로 토스트 숨김
        setTimeout(() => {
            set({ toast: null });
        }, 3000);
    },
    hideToast: () => set({ toast: null }),
}));
