import type { SendMessageResponse } from '#/types';

import { useCustomerStore } from '#/store';

/**
 * 处理发送消息后的逻辑，更新客户消息状态
 * @param result 发送消息的响应结果
 */
export function useHandleSendMessage(result: SendMessageResponse) {
  /* 更新用戶消息 */
  let latestMessage = '';

  // 根据消息类型设置最新消息内容
  switch (result.type) {
    case 'template': {
      latestMessage = '[template Message]'; // 模板消息显示固定内容
      break;
    }
    case 'text': {
      latestMessage = result.text.body || ''; // 文本消息直接显示内容
      break;
    }
    default: {
      latestMessage = ''; // 其他类型消息显示为空
      break;
    }
  }

  // 更新客户存储中的消息状态
  useCustomerStore().updateCustomerNewMessage(result.to, {
    time: result.updateTime, // 更新时间
    message: latestMessage, // 最新消息内容
  });
}
