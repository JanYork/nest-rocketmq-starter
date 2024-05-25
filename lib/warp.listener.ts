import { MessageListener, MessageResult, MessageView } from 'rocketmq-grpc';

/**
 * (包装)消息监听器
 *
 * @author JanYork
 * @email <747945307@qq.com>
 * @date 2024/5/24 下午7:35
 */
export class WarpMessageListener implements MessageListener {
  /**
   * 消息监听器错误钩子
   * @private
   */
  readonly #errorHook: (error: Error) => void;

  /**
   * 消息监听器启动钩子
   * @private
   */
  readonly #startHook: () => void;

  /**
   * 消息监听器
   * @private
   */
  readonly #messageHook: (message: MessageView) => MessageResult;

  /**
   * 消息监听器停止钩子
   * @private
   */
  readonly #stopHook: () => void;

  constructor(
    messageHook: (message: MessageView) => MessageResult,
    startHook?: () => void,
    stopHook?: () => void,
    errorHook?: (error: Error) => void,
  ) {
    this.#messageHook = messageHook;
    this.#startHook = startHook;
    this.#stopHook = stopHook;
    this.#errorHook = errorHook;
  }

  onMessage(message: MessageView): Promise<MessageResult> {
    try {
      return Promise.resolve(this.#messageHook(message));
    } catch (e) {
      return Promise.resolve(MessageResult.FAILURE);
    }
  }

  onStart() {
    this.#startHook();
  }

  onStop() {
    this.#stopHook();
  }

  onError(error: Error) {
    this.#errorHook(error);
  }
}
