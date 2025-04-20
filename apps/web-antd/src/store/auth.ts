import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { message, notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getWhatsAppLogin, getWhatsAppUserInfo, reqCommonLogin } from '#/api';
import { $t } from '#/locales';
import { wsconnect } from '#/utils/wscontect';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);
  interface LoginParams extends Recordable<boolean | string> {
    account: string;
    password: string;
    selectAccount: string;
    captcha: boolean;
  }

  const MockParams = {
    account: 'admin',
    password: 'admin168',
    role: 'super',
  };

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   * @param onSuccess
   */
  async function authLogin(
    params: LoginParams & Recordable<string>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    const userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      // 嘗試登錄
      const { accessToken, refreshToken } = await reqCommonLogin({
        account: params.account,
        password: params.password,
      });

      // console.log("accessTokenaccessTokenaccessToken",accessToken)

      // 如果成功获取到 accessToken
      if (accessToken && refreshToken) {
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        // 获取用户信息并存储到 accessStore 中
        const fetchUserInfoResult = await fetchUserInfo(MockParams);

        // console.log("fetchUserInfoResultfetchUserInfoResultfetchUserInfoResult",fetchUserInfoResult)
        const userInfo = fetchUserInfoResult;
        // console.log("userInfouserInfouserInfo", userInfo)
        userStore.setUserInfo(userInfo);
        void userStore
          .getUserInfo()
          .then((data) => {
            if (data) {
              const { permissions } = data;
              accessStore.setAccessCodes(
                permissions.map((permission) => permission.code),
              );
            }
          })
          .catch((error) => {
            message.error('獲取用戶信息失敗');
            console.error('err', error);
          });

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                (userInfo && userInfo.homePath) || DEFAULT_HOME_PATH,
              );
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }
  // function setCurrentApiKey(key: string) {
  //   currentApiKey.value = key;
  // }
  async function logout(redirect: boolean = true) {
    try {
      // await logoutApi();
      wsconnect.allDisContect();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo(data?: object) {
    let userInfo: null | UserInfo = null;
    userInfo = data
      ? await getWhatsAppLogin(data)
      : await getWhatsAppUserInfo();
    // console.log("userInfouserInfouserInfo",userInfo)
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  // async function getUserInfo() {
  //   let userInfo: null | UserInfo = null;
  //   userInfo =
  //   // console.log("userInfouserInfouserInfo",userInfo)
  //   userStore.setUserInfo(userInfo);
  //   return userInfo;
  // }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
