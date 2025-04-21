import type { LoginBodyDtoRequest } from '@vben/types';

import { apiClient } from '../myrequest';

export const reqCommonLogin = async (
  loginBodyDtoRequest: LoginBodyDtoRequest,
) => {
  return await apiClient.post<LoginBodyDtoRequest, LoginBodyDtoRequest>(
    '/api/auth/login',
    loginBodyDtoRequest,
  );
};
