import { acceptHMRUpdate, defineStore } from 'pinia';

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

interface AccessState {
  currentApiKey: string;
  selectAccount: string;
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
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
    setSelectAccount(wabaId: string) {
      this.selectAccount = wabaId;
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
  },
  state: (): AccessState => ({
    currentApiKey: '',
    selectAccount: '',
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
