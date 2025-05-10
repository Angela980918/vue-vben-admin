interface ItemInfo {
  id: number;
  nickname: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string;
  email: string;
  lastSeen: string;
  lastMessageToPhoneNumber: string;
  tags: Array<string>;
  createTime: string;
  ownerEmail: string;
}

interface ContactListInfo {
  items: Array<ItemInfo>;
  offset: number;
  limit: number;
  length: number;
  total: number;
}

interface OptionParams {
  [key: string]: boolean | number | string; // 动态字段，值为基本类型
}

// 联系人信息
interface ContactInfo {
  id: string;
  nickname: string;
  countryCode: string;
  countryName?: string;
  phoneNumber: string;
  email: string;
  lastSeen?: string;
  lastMessageToPhoneNumber?: string; //
  tags: Array<string>; // 标签
  createTime?: string; // 创建时间
  customAttributes?: Array<{ name: string; value: object | string }>; // 自定义属性
  ownerEmail: string; // 联系人所属用户
  badgeCount: number; // 未读消息数
}

export type { ContactInfo, ContactListInfo, ItemInfo, OptionParams };
