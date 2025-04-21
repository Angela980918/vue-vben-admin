/**
 * 獲取公司的列表
 */

import { apiClient } from '#/api/myrequest';

export const reqCompanyList = async () => {
  return await apiClient.get<any, any>('/api/company/list');
};
