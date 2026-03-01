import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // 프로덕션에서는 특정 도메인으로 제한 권장
    },
})
export class MatchesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(MatchesGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    /**
     * 경기 데이터가 업데이트되었을 때 클라이언트에 알림을 보냅니다.
     */
    emitMatchesUpdated(data: any) {
        this.server.emit('matchesUpdated', data);
    }

    @SubscribeMessage('ping')
    handlePing(client: Socket, data: any) {
        return { event: 'pong', data: 'Server is alive' };
    }
}
