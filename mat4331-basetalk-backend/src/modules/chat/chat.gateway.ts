import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('chat')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
