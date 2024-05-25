import { MessageResult, MessageView } from 'rocketmq-grpc';
import { Injectable } from '@nestjs/common';
import {
  MessageListenerServer,
  OnError,
  OnMessage,
  OnStart,
  OnStop,
} from '../../lib/decorator';
import Logger from 'rocketmq-grpc/lib/logger';

@MessageListenerServer({
  namespace: 'checkout',
  consumerGroup: 'checkout-fifo-group',
  endpoints: '192.168.1.162:8081',
  subscriptions: new Map().set('checkout-fifo-topic', '*'),
  requestTimeout: 3000,
  awaitDuration: 30000,
  longPollingInterval: 300,
  isFifo: true,
  logger: new Logger(),
})
@Injectable()
export class MessageListenerImpl {
  @OnMessage()
  message(message: MessageView): MessageResult {
    console.log('Received message: %o', message.body.toString());
    return MessageResult.SUCCESS;
  }

  @OnStart()
  start(): void {
    console.log('Listener started.');
  }

  @OnStop()
  stop(): void {
    console.log('Listener stopped.');
  }

  @OnError()
  error(error: Error): void {
    console.error('Listener error:', error);
  }
}
