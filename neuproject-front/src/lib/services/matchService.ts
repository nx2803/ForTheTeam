import apiClient from '../apiClient';

export interface MatchCalendarParams {
    year: number;
    month: number;
    memberUid?: string;
}

export const matchService = {
    getCalendarMatches: async ({ year, month, memberUid }: MatchCalendarParams) => {
        const response = await apiClient.get('/matches/calendar', {
            params: {
                year,
                month,
                memberUid,
            },
        });
        return response.data;
    },
};
