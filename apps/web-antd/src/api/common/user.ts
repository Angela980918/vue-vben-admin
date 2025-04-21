import type { UserProFile } from '@vben/types';

import { apiClient } from '../myrequest';

/**
 * 获取用户的个人资料
 */
export const reqUserProfile = async () => {
  return await apiClient.get<any, UserProFile>('/api/user/self/profile');
};
