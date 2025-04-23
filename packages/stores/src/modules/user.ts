import type {
  Permission,
  Role,
  UserPrefileOmitPerAndRole,
} from '../../../types/src/user';
import type { UserCompanyResponse } from '../../../types/src/web-antd';

import { acceptHMRUpdate, defineStore } from 'pinia';

import {
  reqUserCompanies,
  reqUserProfile,
} from './../../../../apps/web-antd/src/api/common/user';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}
type StatusType = 'error' | 'idle' | 'loading' | 'success';
interface UserState {
  /**
   * 用户公司列表
   */
  companies: UserCompanyResponse[];
  currentApiKey: string;
  permissions: Permission[];
  roles: Role[];
  selectAccount: string;
  selectPhone: string;
  status: StatusType;
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  userProfile?: UserPrefileOmitPerAndRole;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    /**
     * 获取用户的公司列表
     */
    async getUserCompanyies() {
      if (this.status === 'success' && this.userProfile?.id) {
        const { companys } = await reqUserCompanies(this.userProfile?.id);
        this.companies = companys;
        return companys;
      }
    },
    /**
     * 获取用户资料
     */
    async getUserInfo() {
      try {
        this.status = 'loading';
        const { data } = await reqUserProfile();

        this.status = 'success';
        const { permissions, roles, ...userInfo } = data;
        this.userProfile = userInfo;
        this.permissions = permissions;
        this.roles = roles;
        return data;
      } catch {
        this.status = 'error';
      }
    },
    setCompanies(companies: UserCompanyResponse[]) {
      this.companies = companies;
    },
    setSelectAccount(wabaId: string) {
      this.selectAccount = wabaId;
    },
    setSelectPhone(phone: string) {
      this.selectPhone = phone;
    },

    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
      this.currentApiKey = userInfo?.currentApiKey ?? '';
      const { wabaAccount } = userInfo;
      this.selectAccount = wabaAccount[0].wabaId;
      this.selectPhone = wabaAccount[0].phoneNumber;
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  getters: {
    getApiKey: (state) => {
      const { wabaAccount } = state.userInfo;
      const index = wabaAccount.findIndex(
        (item) => item.wabaId === state.selectAccount,
      );
      if (index !== -1) {
        return wabaAccount[index].apikey;
      }
      return null;
    },
    getDefaultCompanyInfo: (state) => {
      return {
        companyId: state.userProfile?.company_id,
        name: state.userProfile?.company_name || '尚未綁定公司',
      };
    },
  },
  state: (): UserState => ({
    companies: [],
    currentApiKey: '',
    permissions: [],
    roles: [],
    selectAccount: '',
    selectPhone: '',
    status: 'idle', // 默认状态是'idle'
    userInfo: null,
    userProfile: {
      account: '',
      address: null,
      birthday: null,
      company_id: '',
      company_name: '',
      created: '',
      creator: null,
      deleted: 0,
      edited: '',
      editor: '',
      email: null,
      gender: '',
      head_img_url: '',
      id: '',
      is_locked: 0,
      is_verified: false,
      last_login: null,
      login_count: 0,
      mobile: null,
      role: '',
      role_id: 0,
      state: null,
      token: null,
      updated_at: '',
      user_name: '',
    },
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
