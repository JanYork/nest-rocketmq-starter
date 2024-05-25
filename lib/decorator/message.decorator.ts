import { PushConsumerOptions } from 'rocketmq-grpc';

export const MESSAGE_LISTENER_SERVER = 'MESSAGE_LISTENER_SERVER';
export const MESSAGE_LISTENER_START = 'MESSAGE_LISTENER_START';
export const MESSAGE_LISTENER_MESSAGE = 'MESSAGE_LISTENER_MESSAGE';
export const MESSAGE_LISTENER_STOP = 'MESSAGE_LISTENER_STOP';
export const MESSAGE_LISTENER_ERROR = 'MESSAGE_LISTENER_ERROR';

export const MessageListenerServer = (
  config: Omit<PushConsumerOptions, 'listener'>,
): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(MESSAGE_LISTENER_SERVER, config, target);
  };
};

export const OnMessage = (): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(MESSAGE_LISTENER_MESSAGE, propertyKey, target);
  };
};

export const OnStart = (): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(MESSAGE_LISTENER_START, propertyKey, target);
  };
};

export const OnStop = (): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(MESSAGE_LISTENER_STOP, propertyKey, target);
  };
};

export const OnError = (): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(MESSAGE_LISTENER_ERROR, propertyKey, target);
  };
};
