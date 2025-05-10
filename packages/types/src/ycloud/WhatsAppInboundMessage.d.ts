/** 支持的消息类型常量 */
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  STICKER: 'sticker',
  LOCATION: 'location',
  CONTACTS: 'contacts',
  REACTION: 'reaction',
  INTERACTIVE: 'interactive',
  UNSUPPORTED: 'unsupported',
  SYSTEM: 'system',
  ORDER: 'order',
  PRODUCT_INQUIRY: 'text', // 产品询价实际上还是 text 类型，但 context.referred_product 有特殊含义
  REQUEST_WELCOME: 'request_welcome',
} as const;
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

/** 消息上下文（用于引用之前的消息或产品） */
export interface MessageContext {
  /** 被引用消息的发送者 WhatsApp ID，示例: "447901614024" */
  from?: string;
  /** 被引用的原始消息 ID，示例: "wamid.HBgNODr..." */
  id?: string;
  /** 产品询价时附带产品信息 */
  referred_product?: {
    /** 示例: "catalog-ID" */ catalog_id: string;
    /** 示例: "product-ID" */ product_retailer_id: string;
  };
}

/** 广告触发时的引用信息 */
export interface Referral {
  /** 示例: "https://fb.me/xxx" */ source_url: string;
  /** 示例: "ad" */ source_type: string;
  /** 示例: "MEDIA-ID" */ source_id: string;
  /** 示例: "Chat with us" */ headline: string;
  /** 示例: "image" */ media_type: string;
  /** 示例: "https://scontent.xx.fbcdn.net/xxx.jpg" */ image_url: string;
}

/** 基础消息字段（各类型通用） */
export interface BaseInboundMessage {
  /** 消息 ID，示例: "63f872f6741c165b4342a751" */
  id: string;
  /** WhatsApp 平台消息 ID，示例: "wamid.HBgNODi..." */
  wamid: string;
  /** 业务账号 ID，示例: "WABA-ID" */
  wabaId: string;
  /** 发送者手机号（带前缀），示例: "CUSTOMER-PHONE-NUMBER" */
  from: string;
  /** 客户资料，可选，示例: { name: "Joe" } */
  customerProfile?: { name: string };
  /** 接收方手机号，示例: "BUSINESS-PHONE-NUMBER" */
  to: string;
  /** 发送时间，RFC 3339 字符串，示例: "2023-02-22T12:00:00.000Z" */
  sendTime: string;
  /** 消息类型 */
  type: MessageType;
  /** 可选的上下文引用 */
  context?: MessageContext;
  /** 点击广告触发时的引用信息 */
  referral?: Referral;
}

/** 交互式消息回复子类型常量 */
export const INTERACTIVE_TYPES = {
  LIST_REPLY: 'list_reply',
  BUTTON_REPLY: 'button_reply',
  NFM_REPLY: 'nfm_reply',
} as const;
export type InteractiveType =
  (typeof INTERACTIVE_TYPES)[keyof typeof INTERACTIVE_TYPES];

/** 交互式消息内容 */
export interface InteractiveMessage {
  type: InteractiveType;
  list_reply?: { description?: string; id: string; title: string };
  button_reply?: { id: string; title: string };
  nfm_reply?: {
    body: string;
    name: string;
    /** JSON 字符串，需要手动 JSON.parse */
    response_json: string;
  };
}
/** 各类型消息的额外字段 */
export interface WhatsAppInboundMessage extends BaseInboundMessage {
  /** 文本消息内容 */
  text?: { /** 示例: "OK" */ body: string };
  /** 图片消息 */
  image?: {
    /** 下载链接，示例见文档 */ caption?: string;
    /** 图片说明，示例: "Go for a walk." */ id: string;
    /** 媒体 ID，示例: "592623615738103" */ link: string;
    /** 内容摘要，示例: "LeRpQJq..." */ mime_type: string;
    /** MIME 类型，示例: "image/jpeg" */ sha256: string;
  };
  /** 视频消息 */
  video?: {
    caption?: string;
    id: string;
    link: string;
    mime_type: string;
    sha256: string;
  };
  /** 语音消息 */
  audio?: {
    id: string;
    link: string;
    mime_type: string;
    sha256: string;
  };
  /** 文档消息 */
  document?: {
    caption?: string;
    filename: string;
    id: string;
    link: string;
    mime_type: string;
    sha256: string;
  };
  /** 贴纸消息 */
  sticker?: {
    id: string;
    link: string;
    mime_type: string;
    sha256: string;
  };
  /** 位置消息 */
  location?: {
    address?: string;
    latitude: number;
    /** 示例: "Singapore Zoo" */ longitude: number;
    /** 示例: "80 Mandai Lake Road..." */ name?: string;
    /** 示例: "https://www.zoo.com.sg" */ url?: string;
  };
  /** 联系人名片消息 */
  contacts?: Array<{
    addresses?: Array<{
      city?: string;
      country?: string;
      country_code?: string;
      state?: string;
      street?: string;
      type?: string;
      zip?: string;
    }>;
    birthday?: string;
    emails?: Array<{ email: string; type?: string }>;
    name?: {
      first_name?: string;
      formatted_name?: string;
      last_name?: string;
      middle_name?: string;
      prefix?: string;
      suffix?: string;
    };
    org?: { company?: string; department?: string; title?: string };
    phones?: Array<{ phone: string; type?: string; wa_id: string }>;
    urls?: Array<{ type?: string; url: string }>;
  }>;
  /** 表情反应消息 */
  reaction?: { emoji: string; message_id: string };
  /** 交互式消息回复 */
  interactive?: InteractiveMessage;
  /** 不支持的消息类型 */
  errors?: Array<{ code: string; title: string }>;
  /** 系统消息（如用户更换号码） */
  system?: { body: string; type: string; wa_id: string };
  /** 订单消息 */
  order?: {
    catalog_id: string;
    product_items: Array<{
      currency: string;
      item_price: string;
      product_retailer_id: string;
      quantity: string;
    }>;
    text?: string;
  };
  /** 询价消息（文本类型，使用 context.referred_product） */
  // 无额外字段
}
/**
 * WhatsApp Inbound Message Webhook 事件主体
 * 示例来自 Inbound Text message、Image、Video 等多个示例
 */
export interface WhatsAppInboundMessageEvent {
  /** 示例: "evt_eEkn26qar3nOB8md" */
  id: string;
  /** 固定为 'whatsapp.inbound_message.received' */
  type: 'whatsapp.inbound_message.received';
  /** 固定为 'v2' */
  apiVersion: 'v2';
  /** RFC 3339 时间字符串，示例: "2023-02-22T12:00:00.000Z" */
  createTime: string;
  /** 实际接收到的消息内容 */
  whatsappInboundMessage: WhatsAppInboundMessage;
}

export interface WhatsAppInboundMessageEventRes {
  /**
   * 聊天室id
   */
  id: string;
  /**
   * ycould响应的接口
   */
  data: WhatsAppInboundMessageEvent;
}
