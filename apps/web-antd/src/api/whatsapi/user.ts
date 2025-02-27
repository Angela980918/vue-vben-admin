import type { UserInfo } from '@vben/types';

import { wcloudRequestClient } from '#/api/wrequest';

/**
 * 获取用户信息
 */
export async function getWhatsAppUserInfo() {
  return wcloudRequestClient.post<UserInfo>('/test/login');
}
