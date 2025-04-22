import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
}
interface Permission {
  category: boolean;
  code: string;
  created: string;
  creator: string;
  deleted: boolean;
  edited: string;
  editor: null | string;
  id: number;
  intro: string;
  name: string;
  parent_id: null | number;
  url: string;
  [property: string]: any;
}
interface Role {
  id: number;
  intro: string;
  name: string;
  parent_id: null;
  userId: string;
  [property: string]: any;
}

interface UserData {
  account: string;
  address: null;
  birthday: null;
  company_id: string;
  company_name: string;
  created: string;
  creator: null;
  deleted: number;
  edited: string;
  editor: string;
  email: null;
  gender: string;
  head_img_url: string;
  id: string;
  is_locked: number;
  is_verified: boolean;
  last_login: null;
  login_count: number;
  mobile: null;
  permissions: Permission[];
  role: string;
  role_id: number;
  roles: Role[];
  state: null;
  token: null;
  updated_at: string;
  user_name: string;
}

/**
 * UserProFile
 */
interface UserProFile {
  data: UserData;
  message: string;
  [property: string]: any;
}

export type UserPrefileOmitPerAndRole = Omit<UserData, 'permissions' | 'roles'>;
export type { Permission, Role, UserData, UserInfo, UserProFile };
