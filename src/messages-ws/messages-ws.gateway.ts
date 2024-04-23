import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { MessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/auth/interfaces';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const token: string = client.handshake.headers.authentication as string;

    let payload: IJwtPayload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: MessageDto): void {
    //! Emitir al cliente que mando el mensaje (Cliente inicial)
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message,
    // });
    //! Emitir a todos menos al que mando el mensaje (Cliente inicial)
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message,
    // });
    //! Emitir a todos, incluso al que mando el mensaje (Cliente inicial)
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message,
    });
  }
}
