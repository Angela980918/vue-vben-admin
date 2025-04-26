export type FileType =
  | 'audio'
  | 'document'
  | 'image'
  | 'template'
  | 'text'
  | 'video';

export interface RawTemplate {
  type: FileType;
  text: string;
}

export interface RawTemplateList {
  key: number;
  name: string;
  language: string;
  components: RawTemplate[];
}

export interface CustomRawTemplateComponent {
  type: string;
  text: string;
}
export interface RawTemplateData {
  officialTemplateId: string;
  wabaId: string;
  name: string;
  language: string;
  messageSendTtlSeconds: number;
  components: CustomRawTemplateComponent[];
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
