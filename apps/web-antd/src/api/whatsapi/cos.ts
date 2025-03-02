import { wcloudRequestClient } from '#/api/wrequest';

/**
 * 上傳文件
 */
export async function uploadFile(file: File) {
  const uploadData = new FormData();
  uploadData.append('file', file);
  // return whatsappInstance({
  //   url: '/cos/upload', method: 'post', data: uploadData,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  return wcloudRequestClient.post<any>('/cos/upload', uploadData);
}

/**
 * 上傳素材
 */
export async function uploadMaterialApi(
  file: File,
  category: string,
  userId: string,
  uploadType: string,
  wabaId: string,
  roomId: string,
) {
  const materialFile = new FormData();
  materialFile.append('file', file);
  materialFile.append('fileCategory', category);
  materialFile.append('uploadType', uploadType);
  if (uploadType === 'room') {
    materialFile.append('roomId', roomId);
  } else {
    const userParams = [userId, wabaId];
    const hasUserId = userParams[0] !== undefined;
    const hasWabaId = userParams[1] !== undefined;
    if (hasUserId && hasWabaId) {
      throw new Error('非room上传不能同时包含userId和wabaId');
    }
    if (!hasUserId && !hasWabaId) {
      throw new Error('非room上传必须包含userId或wabaId');
    }
    // 添加有效参数
    if (hasUserId) materialFile.append('userId', userId);
    else materialFile.append('wabaId', wabaId);
  }
  return wcloudRequestClient.post<any>('/materials/upload-file', materialFile);
}

/**
 * 删除素材文件
 */
export async function deleteMaterial(data: object) {
  // return whatsappInstance({
  //   url: '/materials/delete-materials', method: 'DELETE', data: data,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  return wcloudRequestClient.delete<any>('/materials/delete-materials', data);
}

/**
 * 查询素材资料
 */
export async function libraryFiles(data: object) {
  // return whatsappInstance({
  //   url: `/materials/library-files?${data}`, method: 'GET'
  // })
  return wcloudRequestClient.get<any>(`/materials/library-files?${data}`);
}

/**
 * 查詢快捷用語
 */
export const loadQuickList = (
  userId: string = '449711484896804',
  userType: string = 'user',
) => {
  // return whatsappInstance({
  //   url: `/materials/find-quick-reply?userId=449711484896804&userId=67890&userType=user`, method: 'GET'
  // })
  return wcloudRequestClient.get<any>(
    `/materials/find-quick-reply?userId=${userId}&userType=${userType}`,
  );
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
