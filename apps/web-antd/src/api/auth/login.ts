import type { LoginBodyDtoRequest, LoginResponseDto } from '#/types';

import { apiClient } from '../myrequest';

export const reqCommonLogin = async (
  loginBodyDtoRequest: LoginBodyDtoRequest,
) => {
  return await apiClient.post<LoginBodyDtoRequest, LoginResponseDto>(
    '/api/auth/login',
    loginBodyDtoRequest,
  );
};
