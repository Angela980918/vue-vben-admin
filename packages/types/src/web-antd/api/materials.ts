import type { FileCategory } from './cos';

export type UploadType = 'material' | 'room' | 'temp';

export type UploadFileResponse = {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
};

export type UploadConfigResponse = {
  fileCategory: FileCategory;
  roomId: string;
  type: UploadType;
};

export type IbraryFiles = {
  file: UploadFileResponse;
  filePath: string;
  message: string;
  UploadConfig: UploadConfigResponse;
};
