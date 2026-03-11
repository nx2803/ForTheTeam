'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export function useSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // 백엔드 URL 설정 (환경 변수 사용)
        const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

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

            // 1. 캐시 내의 모든 'matches' 관련 쿼리를 순회하며 해당 경기만 업데이트
            queryClient.setQueriesData({ queryKey: ['matches'] }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                
                return oldData.map((match: any) => {
                    if (match.id === data.matchId) {
                        return {
                            ...match,
                            home_score: data.homeScore,
                            away_score: data.awayScore,
                            score: `${data.homeScore}:${data.awayScore}`,
                            status: data.status,
                        };
                    }
                    return match;
                });
            });

            // 2. 혹시 모를 누락을 위해 비활성 쿼리만 무효화 (선택적)
            // queryClient.invalidateQueries({ queryKey: ['matches'], refetchType: 'none' });
        });

        return () => {
            // 컴포넌트 언마운트 시 소켓 연결 해제는 
            // 싱글톤 패턴을 사용할 경우 신중해야 함 (여기서는 전역 유지)
        };
    }, [queryClient]);

    return socket;
}
