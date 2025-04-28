export type FileType =
  | 'audio'
  | 'document'
  | 'image'
  | 'template'
  | 'text'
  | 'video';

// 组件类型枚举
export type ComponentType = 'BODY' | 'DOCUMENT' | 'FOOTER' | 'HEADER' | 'TEXT';
export type LowercaseComponentType = Lowercase<ComponentType>;

// HEADER 格式
export interface HeaderComponent {
  type: 'HEADER';
  format: 'TEXT'; // 如果未来有其他格式可以用联合类型扩展
  text: string;
  example: {
    header_url: string | string[];
  };
  url?: string;
}

// FOOTER 组件
export interface FooterComponent {
  type: 'FOOTER';
  text: string;
}

// BODY 组件
export interface BodyComponent {
  type: 'BODY';
  text: string; // 可包含 HTML 标签
}

// 所有组件的联合类型
export type Component = BodyComponent | FooterComponent | HeaderComponent;
export type LowercaseComponent = {
  [T in Component['type']]: T extends Component['type']
    ? Omit<Extract<Component, { type: T }>, 'type'> & { type: Lowercase<T> }
    : never;
}[Component['type']];

export interface RawTemplateList {
  key: number;
  name: string;
  language: string;
  components: Component[];
}

export interface RawTemplateData {
  officialTemplateId: string;
  wabaId: string;
  name: string;
  language: string;
  messageSendTtlSeconds: number;
  components: Component[];
  category: string;
  status: string;
  qualityRating: string;
  reason: string;
  createTime: Date;
  updateTime: Date;
  statusUpdateEvent: string;
  key: number;
}

export type RawTemplateDataList = RawTemplateData[];

export interface Attachment {
  file_id: string;
  file_path: string;
  file_name: string;
  file_type: FileType;
  file_size: number;
}

export interface QuickMessage {
  _id: string;
  title: string;
  content: string;
  owner_type: string;
  owner_id: string;
  createTime: string;
  attachments: Attachment[];
}
export type TemplateOption = {
  label: string;
  value: string;
};

export type ImageTemplate = {
  createTime: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: FileType;
  id: string;
  is_deleted: boolean;
  owner_id: string;
  owner_type: string;
  storageType: string;
};

export type DocTemplate = {
  createTime: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: FileType;
  id: string;
  is_deleted: boolean;
  owner_id: string;
  owner_type: string;
  storageType: string;
};
export type FileTemplateInfo<T extends FileType = 'document'> = {
  createTime: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: T;
  id: string;
  is_deleted: boolean;
  owner_id: string;
  owner_type: string;
  storageType: string;
};

export type IbraryFilesResponse = {
  audio: FileTemplateInfo<'audio'>[];
  document: FileTemplateInfo<'document'>[];
  image: FileTemplateInfo<'image'>[];
  video: FileTemplateInfo<'video'>[];
};
