// src/lib/authApi.ts
const API_BASE_URL = 'http://localhost:3001/auth';

export interface LoginResponse {
    uid: string;
    email: string;
    nickname: string;
    main_favorite_team_id: string | null;
    joined_at: Date;
}

export interface SignupRequest {
    email: string;
    pass: string;
    nickname: string;
    teamId: string;
}

export interface LoginRequest {
    email: string;
    pass: string;
}

export async function signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '회원가입에 실패했습니다');
    }

    return response.json();
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '로그인에 실패했습니다');
    }

    return response.json();
}
