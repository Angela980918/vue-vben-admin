import type {
  GetMessageListByPhoneNumberBody,
  MessageSession,
} from '@vben/types';
import { apiClient } from '../myrequest';

/**
 * 查詢聊天詳情（商業號碼匹配)
 */
export const reqGetMessageListByPhoneNumber = async (
  data: GetMessageListByPhoneNumberBody,
): Promise<MessageSession> => {
  return await apiClient.post('/chat/get/chat', data);
};
