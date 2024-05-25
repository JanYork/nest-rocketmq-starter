import {
  MessageListener,
  PushConsumer,
  PushConsumerOptions,
} from 'rocketmq-grpc';
import { Injectable, OnApplicationBootstrap, Type } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import {
  MESSAGE_LISTENER_ERROR,
  MESSAGE_LISTENER_MESSAGE,
  MESSAGE_LISTENER_SERVER,
  MESSAGE_LISTENER_START,
  MESSAGE_LISTENER_STOP,
} from './decorator';
import { WarpMessageListener } from './warp.listener';

/**
 * 消费者工厂
 *
 * @author JanYork
 * @email <747945307@qq.com>
 * @date 2024/5/22 下午7:25
 */
@Injectable()
export class ConsumerFactory implements OnApplicationBootstrap {
  /**
   * 服务容器
   * @private
   */
  readonly #SERVER: Map<string, PushConsumer>;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();

    const configs: Array<{
      listener: MessageListener;
      options: Omit<PushConsumerOptions, 'listener'>;
    }> = [...providers]
      .map((provider) => {
        if (!provider.metatype) {
          return;
        }

        const config = Reflect.getMetadata(
          MESSAGE_LISTENER_SERVER,
          provider.metatype,
        );

        if (config) {
          const classType: Type<MessageListener> =
            provider.metatype as Type<MessageListener>;

          const instance = this.moduleRef.get(classType, { strict: false });

          const funcNameWithStart = Reflect.getMetadata(
            MESSAGE_LISTENER_START,
            provider.metatype.prototype,
          );

          const funcNameWithError = Reflect.getMetadata(
            MESSAGE_LISTENER_ERROR,
            provider.metatype.prototype,
          );

          const funcNameWithMessage = Reflect.getMetadata(
            MESSAGE_LISTENER_MESSAGE,
            provider.metatype.prototype,
          );

          if (!funcNameWithMessage) {
            throw new Error('No message hook provided.');
          }

          const funcNameWithStop = Reflect.getMetadata(
            MESSAGE_LISTENER_STOP,
            provider.metatype.prototype,
          );

          const warpListener = new WarpMessageListener(
            instance[funcNameWithMessage],
            instance[funcNameWithStart],
            instance[funcNameWithStop],
            instance[funcNameWithError],
          );

          return {
            listener: warpListener,
            options: config,
          };
        }
      })
      .filter((config) => config !== undefined);

    this.batchProduce(configs);
  }

  /**
   * 批量生产消费监听与消费者
   *
   * @param config 配置
   */
  batchProduce(
    config: Array<{
      listener: MessageListener;
      options: Omit<PushConsumerOptions, 'listener'>;
    }>,
  ): void {
    if (!config || config.length === 0) {
      throw new Error('No listener provided.');
    }

    config.map(async ({ listener, options }) => {
      if (!listener) {
        throw new Error('No listener provided.');
      }

      const consumer = new PushConsumer({
        ...options,
        listener,
      });

      try {
        await consumer.startup().then(() => {
          console.log('Consumer started:', consumer.id);
          this.#SERVER.set(consumer.id, consumer);
        });
      } catch (e) {
        console.error('Consumer startup failed:', e);
      }
    });
  }

  /**
   * 获取服务
   *
   * @param id 服务ID
   */
  get(id: string): PushConsumer {
    return this.#SERVER.get(id);
  }

  /**
   * 移除服务
   */
  remove(id: string): void {
    this.#SERVER
      .get(id)
      ?.shutdown()
      .then(() => {
        console.log('Consumer stopped:', id);
      });

    this.#SERVER.delete(id);
  }

  /**
   * 获取服务列表
   */
  getServerList(): Map<string, PushConsumer> {
    return this.#SERVER;
  }
}
