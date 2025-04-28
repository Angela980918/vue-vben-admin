import type {
  Permission,
  Role,
  UserPrefileOmitPerAndRole,
} from '../../../types/src/user';
import type {
  TemUserInfo,
  UserCompanyResponse,
  WabaAccount,
} from '../../../types/src/web-antd';

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
  roles: string[];
  /**
   * 用户名
   */
  username: string;
  /**
   * waba賬號
   */
  wabaAccount: {
    account_review_status: string;
    apikey: string;
    business_verification_status: string;
    name: string;
    phoneNumber: string;
    wabaId: string;
  }[];
}
type StatusType = 'error' | 'idle' | 'loading' | 'success';
interface UserState {
  /**
   * 用户公司列表
   */
  companies: UserCompanyResponse[];
  currentApiKey: string;
  /**
   * 当前用户选择的公司ID
   */
  currentCompanyId?: string;
  /**
   * 当前用户选择的waba账户ID
   */
  currentWabaId?: string;
  permissions: Permission[];
  roles: Role[];
  selectAccount: string;
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
  /**
   * 所有的waba账户
   */
  wabaAccounts: WabaAccount[];
  /**
   * 用户的yCouldAPIkey
   */
  yCloudAPIKey?: string;
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
      if (this.userProfile?.id) {
        const { companys } = await reqUserCompanies(this.userProfile?.id);
        this.companies = companys;
        this.wabaAccounts = companys.flatMap(
          (company) => company.waba_accounts,
        );
        return companys;
      }
      return [];
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
        this.currentCompanyId = userInfo.company_id;
        this.currentWabaId = userInfo.waba_account;
        return data;
      } catch {
        this.status = 'error';
      }
    },
    setCompanies(companies: UserCompanyResponse[]) {
      this.companies = companies;
    },
    setCurrentWabaId(wabaId: string) {
      this.currentWabaId = wabaId;
    },
    setSelectAccount(wabaId: string) {
      this.selectAccount = wabaId;
    },

    setUserInfo(userInfo: TemUserInfo) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
      this.currentApiKey = userInfo?.currentApiKey ?? '';
      const { wabaAccount } = userInfo;
      if (wabaAccount[0]) {
        this.selectAccount = wabaAccount[0].wabaId;
      }
    },

    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setYcouldApiKey(apiKey: string) {
      this.yCloudAPIKey = apiKey;
    },
  },
  getters: {
    /**
     * 获取当前用户选择的waba账户信息
     */
    getCurrentWabaInfo: (state) => {
      const wabaID: string | undefined =
        state.currentWabaId || state.userProfile?.waba_account;

      const waba = state.wabaAccounts.find((waba) => waba.waba_id === wabaID);
      state.yCloudAPIKey = waba?.api_key;
      return waba;
    },

    getDefaultCompanyInfo: (state) => {
      return {
        companyId: state.userProfile?.company_id,
        name: state.userProfile?.company_name || '尚未綁定公司',
      };
    },
    selectPhone: (state) => {
      // 获取当前用户选择的电话号码
      const wabaId = state.currentWabaId || state.userProfile?.waba_account;
      const phoneNumber = state.wabaAccounts.find(
        (waba) => waba.waba_id === wabaId,
      )?.phone_number;
      return phoneNumber;
    },
  },
  state: (): UserState => ({
    companies: [],
    currentApiKey: '',
    currentCompanyId: '',
    currentWabaId: '',
    permissions: [],
    roles: [],
    selectAccount: '',
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
    wabaAccounts: [],
    yCloudAPIKey: '',
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
