interface Template {
  name: string;
  language: {
    code: string;
  };
}

interface MessageData {
  from: string;
  to: string;
  type: string;
  message?: string;
  link?: string;
  context?: string;
  externalId?: string;
  filterUnsubscribed?: boolean;
  filterBlocked?: boolean;
  enqueue?: boolean;
  template?: Template; // 使用具体的 Template 类型
}

export type { MessageData };
