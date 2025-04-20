import type {
  RegisterResponseDto,
  RegisterUserDtoRequest,
} from '#/types/api/auth/register';

import { apiClient } from '../myrequest';
/**
 * 註冊賬號(普通註冊)
 */

export const reqCommonResgister = async (
  registerUserDtoRequest: RegisterUserDtoRequest,
) => {
  return await apiClient.post<RegisterUserDtoRequest, RegisterResponseDto>(
    '/api/auth/register',
    registerUserDtoRequest,
  );
};
