## 描述
这个项目可以让你在NestJS项目中快速使用RocketMQ进行消息消费和生产，它基于[rocketmq-grpc](https://www.npmjs.com/package/rocketmq-grpc)实现。

## 安装

```bash
$ pnpm install nestjs-rocketmq-starter

or

$ npm install nestjs-rocketmq-starter

or

$ yarn add nestjs-rocketmq-starter
```

## 使用

### 构建一个监听器
```ts
@Injectable()
export class MessageListenerImpl {

}
```

### 使用装饰器
```ts
import { MessageResult, MessageView } from 'rocketmq-grpc';
import { Injectable } from '@nestjs/common';
import {
  MessageListenerServer,
  OnError,
  OnMessage,
  OnStart,
  OnStop,
} from '../../lib';
import Logger from 'rocketmq-grpc/lib/logger';

// 标记为消息监听服务
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
```

在对应的方法上使用装饰器，这样就可以监听到对应的事件。

- `@OnMessage()`：监听消息事件
- `@OnStart()`：监听启动事件
- `@OnStop()`：监听停止事件
- `@OnError()`：监听错误事件

> ⚠️ 注意：@MessageListenerServer必须配合@Injecable使用，否则无法正常工作。
> 
> ⚠️ 注意：@OnMessage()方法必须被使用并且返回MessageResult类型，否则无法正常工作。
> 
> ⚠️ 注意：装饰器不可叠加、不可重复使用，一个类中只能使用一次。

### 参数
对于配置参数，可以查阅[rocketmq-grpc](https://www.npmjs.com/package/rocketmq-grpc)。

## 测试

```bash
# 运行项目
$ pnpm run start:dev
```

如果你可以看到以下内容在控制台中，那么说明项目已经正常运行。

```bash
INFO: Begin to startup the rocketmq client {"clientId":"JanYorkMacBook-Pro.local@81207@0@lwlu3gya"}
[Nest] 81207  - 05/25/2024, 4:13:40 PM     LOG [NestApplication] Nest application successfully started +33ms
INFO: Receive settings from remote {"endpoints":{"addressesList":[{"host":"192.168.1.162","port":8081}],"scheme":1,"facade":"192.168.1.162:8081"},"clientId":"JanYorkMacBook-Pro.local@81207@0@lwlu3gya"}
INFO: Sync settings {"settings":{"clientId":"JanYorkMacBook-Pro.local@81207@0@lwlu3gya","clientType":3,"accessPoint":{"addressesList":[{"host":"192.168.1.162","port":8081}],"scheme":1,"facade":"192.168.1.162:8081"},"namespace":"checkout","requestTimeout":3000,"longPollingTimeout":30000,"group":"checkout-fifo-group","subscriptionExpressions":{},"maxMessageNum":1,"isFifo":true,"invisibleDuration":15000}}
INFO: Startup the rocketmq client successfully {"clientId":"JanYorkMacBook-Pro.local@81207@0@lwlu3gya"}
```
然后你可以生产一些消息，如果你不会生产消息，请查阅[rocketmq-grpc](https://www.npmjs.com/package/rocketmq-grpc)。

## 支持
如果发现任何问题，请在[这里](https://github.com/JanYork/nest-rocketmq-starter/issues)提出。

或者你也可以通过邮件联系我：[@JanYork](mailto:747945307@qq.com)。

## License
The project is [Apache licensed](LICENSE).