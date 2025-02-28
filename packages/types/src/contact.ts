interface AttributesInfo {
  name: string;
  value: object;
}
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
  customAttributes: Array<AttributesInfo>;
  ownerEmail: string;
}

interface ContactListInfo {
  /**
   * 用户描述
   */
  items: Array<ItemInfo>;
  /**
   * 首页地址
   */
  offset: number;

  /**
   * accessToken
   */
  limit: number;
  length: number;
  total: number;
}

interface OptionParams {
  [key: string]: boolean | number | string; // 动态字段，值为基本类型
}

// 联系人信息
interface ContactInfo {
  id: number;
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
