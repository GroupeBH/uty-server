import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
  namespace: '/ws',
})
export class RealtimeGateway implements OnModuleInit {
  @WebSocketServer()
  server?: Server;

  onModuleInit(): void {
    // Placeholder for namespace/channel setup
  }

  broadcast<TPayload = unknown>(event: string, payload: TPayload): void {
    this.server?.emit(event, payload);
  }
}

