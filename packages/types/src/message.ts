import type { LowercaseComponentType } from './web-antd';
import type { Parameter } from './ycloud';

export type ComponentObject = {
  parameters: Partial<Parameter>[];
  type: LowercaseComponentType;
};
interface Template {
  name: string;
  language: {
    code: string;
  };
  components?: ComponentObject[];
}

interface MessageText {
  body: string;
  preview_url: string;
}

interface MessageExtraFile {
  link: string;
  caption?: string;
  filename?: string;
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
  parameters?: Parameter[];
  text?: MessageText;
  image?: MessageExtraFile;
  video?: MessageExtraFile;
  document?: MessageExtraFile;
  sticker?: MessageExtraFile;
}

export type { MessageData };
