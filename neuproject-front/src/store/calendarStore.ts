import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalendarState {
    currentDate: string; // Date 객체는 persist 시 직렬화 문제가 생길 수 있어 문자열로 저장
    viewMode: 'calendar' | 'list';
    
    // Actions
    setCurrentDate: (date: Date) => void;
    setViewMode: (mode: 'calendar' | 'list') => void;
    nextMonth: () => void;
    prevMonth: () => void;
}

export const useCalendarStore = create<CalendarState>()(
    persist(
        (set, get) => ({
            currentDate: new Date().toISOString(),
            viewMode: 'calendar',

            setCurrentDate: (date) => set({ currentDate: date.toISOString() }),
            setViewMode: (mode) => set({ viewMode: mode }),
            
            nextMonth: () => {
                const current = new Date(get().currentDate);
                const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
                set({ currentDate: next.toISOString() });
            },
            
            prevMonth: () => {
                const current = new Date(get().currentDate);
                const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
                set({ currentDate: prev.toISOString() });
            }
        }),
        {
            name: 'calendar-storage',
        }
    )
);
