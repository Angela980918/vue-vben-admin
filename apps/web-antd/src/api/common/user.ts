import type { UserCompaniesResponse, UserProFile } from '@vben/types';

import { apiClient } from '../myrequest';

/**
 * 获取用户的个人资料
 */
export const reqUserProfile = async () => {
  return await apiClient.get<any, UserProFile>('/api/user/self/profile');
};

/**
 * 获取用户的公司列表
 */
export const reqUserCompanies = async (userId: string) => {
  return await apiClient.post<any, UserCompaniesResponse>(
    `/api/user/companys/${userId}`,
  );
};
