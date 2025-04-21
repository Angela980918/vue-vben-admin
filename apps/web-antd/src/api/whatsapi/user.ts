import type { UserInfo } from '@vben/types';

import { wcloudRequestClient } from '#/api/wrequest';

/**
 * 获取用户信息
 */
export async function getWhatsAppLogin(data: any) {
  return wcloudRequestClient.post<UserInfo>('/test/login', data);
}

export async function getWhatsAppUserToken(data: any) {
  return wcloudRequestClient.post<any>('/test/token', data);
}

export async function getWhatsAppUserInfo() {
  return wcloudRequestClient.get<any>('/test/user-info');
}

export async function refreshToken() {
  return wcloudRequestClient.post<any>('/test/refresh-token');
}
