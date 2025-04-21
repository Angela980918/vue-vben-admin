/**
 * 性別
 */
export type Gender = 'female' | 'male' | 'Unknown';

/**
 * RegisterUserDto
 */
export interface RegisterUserDtoRequest {
  /**
   * 登入賬號（郵箱或國際手機號）
   */
  account: string;
  /**
   * 確認密碼
   */
  confirmPassword: string;
  /**
   * 性別
   */
  gender?: Gender;
  /**
   * 密碼
   */
  password: string;
  [property: string]: any;
}

export interface User {
  account: string;
  address: null;
  birthday: null;
  company_id: null;
  company_name: null;
  created: string;
  creator: null;
  deleted: number;
  edited: null;
  editor: null;
  email: null;
  gender: string;
  head_img_url: string;
  id: string;
  is_locked: number;
  is_verified: boolean;
  last_login: null;
  login_count: number;
  mobile: null;
  password: null;
  role: null;
  role_id: null;
  salt: null;
  state: null;
  token: null;
  updated_at: null;
  user_name: string;
  [property: string]: any;
}

/**
 * RegisterResponseDto
 */
export interface RegisterResponseDto {
  message: string;
  user: User;
  [property: string]: any;
}
