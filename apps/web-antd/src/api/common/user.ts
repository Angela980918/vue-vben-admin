import type { UserProFile } from '@vben/types';

import { apiClient } from '../myrequest';

export const reqUserProfile = async () => {
  return await apiClient.get<any, UserProFile>('/api/user/self/profile');
};
