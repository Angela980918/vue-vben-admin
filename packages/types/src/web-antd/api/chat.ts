import type { MessageItemPro } from '../response';

/**
 * Request
 *
 * GetMessageListByPhoneNumberDto
 */
export interface GetMessageListByPhoneNumberBody {
  /**
   * 商業手機號
   */
  businessPhoneNumber: string;
  /**
   * 客戶手機號
   */
  customerPhoneNumber: string;
  /**
   * 当前页码，默认为 1
   */
  pageIndex?: number;
  /**
   * 每页显示的记录数，默认为 20，最大值为 100
   */
  pageSize?: number;
  /**
   * 聊天室ID
   */
  roomId: string;
}

// 总体返回的数据结构
export interface MessageSession {
  _id: string;
  wabaId: number; // 业务账号 ID（WhatsApp Business Account）
  customerId: string; // 客户 WhatsApp 号码
  messageList: MessageItemPro[];
  _v: number;
  id: string;
}
