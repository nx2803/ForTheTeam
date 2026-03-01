'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export function useSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // 백엔드 URL 설정 (환경 변수 또는 기본값)
        const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

        if (!socket) {
            socket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true,
            });
        }

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // 실시간 경기 업데이트 수신
        socket.on('matchesUpdated', (data) => {
            console.log('Real-time match update received:', data);

            // 관련 쿼리 무효화하여 데이터 다시 불러오기
            queryClient.invalidateQueries({ queryKey: ['matches'] });

            // 토스트 알림 등을 추가할 수도 있음
        });

        return () => {
            // 컴포넌트 언마운트 시 소켓 연결 해제는 
            // 싱글톤 패턴을 사용할 경우 신중해야 함 (여기서는 전역 유지)
        };
    }, [queryClient]);

    return socket;
}
