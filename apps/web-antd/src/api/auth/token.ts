import type { RefreshDto } from '@vben/types';

import { apiClient } from '../myrequest';

/**
 * 获取刷新token的请求
 */
export const reqRefreshToken = async (refreshToken: string) => {
  return await apiClient.post<any, RefreshDto>(
    'api/auth/refresh-token',
    {},
    { headers: { Authorization: refreshToken } },
  );
};
