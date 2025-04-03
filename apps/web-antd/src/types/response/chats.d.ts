import type MessageItem from '#/components/chatBox/content/message/MessageItem.vue';

export interface Language {
  code: string;
}
export type Direction = 'inbound' | 'outbound';
export type Status = 'failed' | 'read' | 'sent';

export type Type = 'audio' | 'document' | 'template' | 'text' | 'video';
export interface Content {
  body?: string;
  header?: {
    content?: string;
    format?: string;
  };
  name?: string;
  language?: Language;
  link?: string;
  id?: string;
  sha256?: string;
  mime_type?: string;
  caption?: string;
  filename?: string;
}

export interface MessageItem {
  _id: string;
  from: string;
  wamid: string;
  to: string;
  type: Type;
  content: Content;
  direction: Direction;
  deliverTime: Date;
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
  wabaId: number;
  customerId: string;
  messageList: MessageItem[];
  isProcessed: boolean;
  messageCount: number;
  id: string;
  roomId: string;
}
