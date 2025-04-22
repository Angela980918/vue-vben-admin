import type {
  SwitchUserCompanyDto,
  UserCompaniesResponse,
  UserProFile,
} from '@vben/types';

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

/**
 * 切换用户所选公司
 */

export const reqUserSelectCompany = async (companyId: string) => {
  return await apiClient.get<any, SwitchUserCompanyDto>(
    '/api/user/switch-company',
    {
      params: { companyId },
    },
  );
};
