// src/lib/teamsApi.ts
const API_BASE_URL = 'http://localhost:3001/teams';

export interface TeamResponse {
    id: string;
    name: string;
    logo_url: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    league_id: string;
    leagues?: {
        id: string;
        name: string;
        category: string;
    };
}

export async function getAllTeams(): Promise<TeamResponse[]> {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
        throw new Error('팀 목록을 가져오는데 실패했습니다');
    }

    return response.json();
}

export async function getTeamsByLeague(leagueId: string): Promise<TeamResponse[]> {
    const response = await fetch(`${API_BASE_URL}/league/${leagueId}`);

    if (!response.ok) {
        throw new Error('리그의 팀 목록을 가져오는데 실패했습니다');
    }

    return response.json();
}

export async function getTeamById(id: string): Promise<TeamResponse> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error('팀 정보를 가져오는데 실패했습니다');
    }

    return response.json();
}

export async function toggleTeamFollow(teamId: string, memberUid: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/${teamId}/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberUid }),
    });

    if (!response.ok) {
        throw new Error('팀 팔로우 상태 변경에 실패했습니다');
    }

    return response.json();
}

export async function getFollowedTeams(memberUid: string): Promise<TeamResponse[]> {
    const response = await fetch(`${API_BASE_URL}/followed?memberUid=${memberUid}`);

    if (!response.ok) {
        throw new Error('팔로우한 팀 목록을 가져오는데 실패했습니다');
    }

    return response.json();
}
