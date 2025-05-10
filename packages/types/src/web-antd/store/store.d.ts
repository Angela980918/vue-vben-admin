import type { Content } from '../response';

/* 分配的客户 */
export interface AssignedCustomer {
  id: string;
  key: string;
  name: string;
  nickName?: string;
  time: string;
  badgeCount: number;
  phoneNumber: string;
  color: string;
  isActive: boolean;
  message: Partial<Content>;
}
/* 联系人信息 */
export interface ContactInformation {
  id: number;
  nickname: string;
  countryCode: string;
  countryName?: string;
  phoneNumber: string;
  lastSeen?: string;
  tags: string[];
  createTime?: string;
  lastMessageToPhoneNumber?: string;
  key: number;
}
