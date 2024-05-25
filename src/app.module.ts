import { Module } from '@nestjs/common';
import { MessageModule } from '../lib/rocketmq.module';
import { MessageListenerImpl } from './examples/message.listener';

@Module({
  imports: [MessageModule],
  providers: [MessageListenerImpl],
})
export class AppModule {}
