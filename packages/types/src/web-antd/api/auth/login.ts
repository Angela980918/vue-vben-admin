/**
 * LoginBodyDto
 */
export interface LoginBodyDtoRequest {
  /**
   * 登入賬號（郵箱或國際手機號）
   */
  account: string;
  /**
   * 密碼
   */
  password: string;
  [property: string]: any;
}

export interface UserInfoResponse {
  address: string;
  birthday: string;
  company_id: string;
  company_name: string;
  created: string;
  creator: string;
  deleted: number;
  edited: string;
  editor?: string;
  email?: string;
  gender?: string;
  head_img_url: string;
  id: string;
  is_locked: number;
  is_verified: boolean;
  last_login: string;
  login_count: number;
  mobile: string;
  role: string;
  role_id: number;
  salt: string;
  state?: undefined;
  token?: string;
  updated_at?: string;
  user_name: string;
  waba_account?: string;
  [property: string]: any;
}

/**
 * LoginResponseDto
 */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfoResponse;
  [property: string]: any;
}
