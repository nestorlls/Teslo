import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [JwtModule, ConfigModule, AuthModule],
})
export class MessagesWsModule {}
