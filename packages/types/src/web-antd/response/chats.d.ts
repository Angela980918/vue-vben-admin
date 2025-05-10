import type { ComponentType } from '../store';

import type MessageItem from '#/components/chatBox/content/message/MessageItem.vue';

export interface Language {
  code: string;
}
export type Direction = 'inbound' | 'outbound';
export type Status = 'failed' | 'read' | 'sent';

export type Type = 'audio' | 'document' | 'template' | 'text' | 'video';
export interface Content {
  body?: {
    content?: string;
    format?: ComponentType;
  };
  footer?: {
    content?: string;
    format?: ComponentType;
  };
  header?: {
    content?: string;
    format: ComponentType;
  };
  name?: string;
  language?: Language;
  link?: string;
  id?: string;
  sha256?: string;
  mime_type?: string;
  caption?: string;
  filename?: string;
  text?: string;
}

export interface MessageItem {
  _id: string;
  from: string;
  wamid: string;
  to: string;
  type: Type;
  content: Content;
  direction: Direction;
  deliverTime: string;
  status: Status;
  __v: number;
}

export interface MessageItemPro extends MessageItem {
  name: string;
  color: string;
  msgIndex: number;
}

/**
 * @description:服務器查詢返回的數據
 */
export interface WhatsAppInformationInfo {
  _id: string;
  wabaId: number;
  customerId: string;
  messageList: MessageItem[];
  isProcessed: boolean;
  messageCount: number;
  id: string;
}

export interface MessageTemplate {
  name: string;
  language: Language;
}

export interface SendMessageResponse {
  id: string;
  wamid: string;
  status: Status;
  from: string;
  to: string;
  wabaId: string;
  type: Type;
  text: Content;
  createTime: string;
  updateTime: string;
  totalPrice: number;
  pricingCategory: string;
  currency: string;
  regionCode: string;
  bizType: string;
  template: MessageTemplate;
}
