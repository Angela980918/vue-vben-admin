import type { LoginParams, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getWhatsAppLogin, getWhatsAppUserInfo, reqCommonLogin } from '#/api';
import { $t } from '#/locales';
import { wsconnect } from '#/utils/wscontect';
import { useGetApiKey } from '#/hooks/useGetApiKey';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

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
    params: LoginParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    const userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      // 嘗試登錄
      const {
        accessToken,
        refreshToken,
        userInfo: userPrefile,
      } = await reqCommonLogin({
        account: params.account,
        password: params.password,
      });

      // console.log("accessTokenaccessTokenaccessToken",accessToken)

      // 如果成功获取到 accessToken
      if (accessToken && refreshToken) {
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        // 获取用户信息并存储到 accessStore 中
        await fetchUserInfo(MockParams);

        const userData = await userStore.getUserInfo();

        // 當前的wabaID
        const wabaId = userData?.waba_account;

        /* // 設置當前的apiKey
        const companyies = await userStore.getUserCompanyies();

        // 找到當前的apiKey
        const currentApiKey = companyies
          ?.flatMap((company) => company.waba_accounts)
          .find((account) => account.waba_id === wabaId)?.api_key;

        // 設置默認的apiKey
        userStore.setYcouldApiKey(currentApiKey || '');
        accessStore.setYCloudApiKey(currentApiKey || ''); */
        await useGetApiKey(wabaId || '');

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(DEFAULT_HOME_PATH);
        }

        if (userPrefile.user_name) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userPrefile.user_name}`,
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
      resetAllStores();
      accessStore.setLoginExpired(false);
      // 回登录页带上当前路由地址
      await router.replace({
        path: LOGIN_PATH,
        query: redirect
          ? {
              redirect: encodeURIComponent(router.currentRoute.value.fullPath),
            }
          : undefined,
      });
    } catch (error) {
      // 不做任何处理
      console.error('logout error', error);
      // window.location.href = LOGIN_PATH;
    }
  }

  async function fetchUserInfo(data?: object) {
    const userInfo = data
      ? await getWhatsAppLogin(data)
      : await getWhatsAppUserInfo();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

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
