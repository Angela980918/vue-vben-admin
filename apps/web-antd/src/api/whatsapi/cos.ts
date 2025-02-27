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
export async function uploadMaterial(
  file: File,
  category: string,
  userId: string,
) {
  const materialFile = new FormData();
  materialFile.append('file', file);
  materialFile.append('fileCategory', category);
  materialFile.append('userId', userId);
  // return whatsappInstance({
  //   url: '/materials/upload-material', method: 'post', data: materialFile,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  return wcloudRequestClient.post<any>(
    '/materials/upload-material',
    materialFile,
  );
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

// /**
//  * 上传快捷用语
//  */
// export const uploadQuickMsg = (data) => {
//   return whatsappInstance({
//     url: `/materials/upload-quick-reply`, method: 'POST', data: data
//   })
// }
//
// /**
//  * 上傳临时文件
//  */
// export const uploadTempFile = (file, category, userId) => {
//   const materialFile = new FormData();
//   materialFile.append("file", file);
//   materialFile.append("fileCategory", category)
//   materialFile.append("userId", userId)
//   return whatsappInstance({
//     url: '/materials/upload-temp-material', method: 'post', data: materialFile,
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     }
//   })
// }
