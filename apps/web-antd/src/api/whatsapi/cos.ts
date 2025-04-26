import { wcloudRequestClient } from '#/api/wrequest';
import type { LibraryFilesParams } from '@vben/types';

// export async function uploadFile(file: File) {
//   const uploadData = new FormData();
//   uploadData.append('file', file);
//   // return whatsappInstance({
//   //   url: '/cos/upload', method: 'post', data: uploadData,
//   //   headers: {
//   //     'Content-Type': 'multipart/form-data',
//   //   }
//   // })
//   return wcloudRequestClient.post<any>('/cos/upload', uploadData);
// }

/**
 * 上傳素材
 */
export async function uploadMaterialApi(
  file: File,
  uploadType: string,
  category: string,
  options: {
    roomId?: string;
    userId?: string;
    wabaId?: string;
  },
) {
  const materialFile = new FormData();
  materialFile.append('file', file);
  materialFile.append('fileCategory', category);
  materialFile.append('uploadType', uploadType);
  if (uploadType === 'room') {
    materialFile.append('roomId', options.roomId || 'roomId');
  } else {
    const userParams = [options.userId, options.wabaId];
    const hasUserId = userParams[0] !== undefined;
    const hasWabaId = userParams[1] !== undefined;
    if (hasUserId && hasWabaId) {
      throw new Error('非room上傳不能同時包含userId和wabaId');
    }
    if (!hasUserId && !hasWabaId) {
      throw new Error('非room上傳必須包含userId或wabaId');
    }
    // 添加有效参数
    if (hasUserId) materialFile.append('userId', options.userId || 'userId');
    else materialFile.append('wabaId', options.wabaId || 'wabaId');
  }
  return wcloudRequestClient.post<any>('/materials/upload-file', materialFile);
}

/**
 * 删除素材文件
 */
export async function deleteMaterial(data: string) {
  // return whatsappInstance({
  //   url: '/materials/delete-materials', method: 'DELETE', data: data,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  return wcloudRequestClient.delete<any>(`/materials/delete-materials?${data}`);
}

/**
 * 查询素材资料
 */
export async function libraryFiles<T = any>(data: LibraryFilesParams) {
  // return whatsappInstance({
  //   url: `/materials/library-files?${data}`, method: 'GET'
  // })
  return wcloudRequestClient.get<T>(
    `/materials/library-files`,
    {},
    { params: data },
  );
}

/**
 * 查詢快捷用語
 */
export const loadQuickList = (id: string) => {
  let source = '';
  source = id.length > 6 ? `wabaId=${id}` : `userId=${id}`;
  return wcloudRequestClient.get<any>(`/materials/find-quick-reply?${source}`);
};

/**
 * 上传快捷用语
 */
export async function uploadQuickMsgApi(data: object) {
  // return whatsappInstance({
  //   url: `/materials/upload-quick-reply`, method: 'POST', data: data
  // })
  return wcloudRequestClient.post<any>(`/materials/upload-quick-reply`, data);
}
/**
 * 上傳临时文件
 */
export async function uploadTempFileApi(
  file: File,
  category: string,
  userId: string,
) {
  const materialFile = new FormData();
  materialFile.append('file', file);
  materialFile.append('fileCategory', category);
  materialFile.append('userId', userId);
  // return whatsappInstance({
  //   url: '/materials/upload-temp-material', method: 'post', data: materialFile,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  return wcloudRequestClient.post<any>(
    '/materials/upload-temp-material',
    materialFile,
  );
}
