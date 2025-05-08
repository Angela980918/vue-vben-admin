import type { AxiosError, AxiosRequestConfig } from 'axios';

import type { CustomRespone } from '@vben/types';

import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import axios from 'axios';

import { useAuthStore } from '#/store';

import { reqRefreshToken } from './auth';

const axiosClientStatus = {
  isRefreshing: false,
  refreshSubscribers: [] as ((token: string) => void)[],
};

/**
 * 所有等待刷新后执行的请求都会订阅这个方法
 */
function onTokenRefreshed(token: string) {
  axiosClientStatus.refreshSubscribers.forEach((callback) => callback(token));
  axiosClientStatus.refreshSubscribers = [];
}

/**
 * 退出登錄
 */

function logout() {
  message.error('登錄已過期，需要重新登錄');
  const authStore = useAuthStore();
  authStore.logout();
}

function addRefreshSubscriber(callback: (token: string) => void) {
  axiosClientStatus.refreshSubscribers.push(callback);
}

function createRequestClient(
  baseURL: string,
  customHeaders = {},
  isPlainResponse = false,
) {
  const client = axios.create({
    baseURL: baseURL || 'http://localhost:3000',
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      ...customHeaders,
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization && !isPlainResponse) {
        const accessStore = useAccessStore();
        const token = accessStore.accessToken?.trim();
        config.headers.Authorization = token && `Bearer ${token}`;
      }
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
    (err) => {
      message.error(`請求發送失敗`);
      return Promise.reject(err);
    },
  );

  // 刷新Token逻辑
  async function refreshToken(): Promise<string> {
    const accessStore = useAccessStore();
    const oldRefreshToken = accessStore.refreshToken;

    if (!oldRefreshToken) throw new Error('无有效refreshToken');
    const { refreshToken, accessToken } = await reqRefreshToken(
      `Bearer ${oldRefreshToken}`,
    );

    if (!accessToken || !refreshToken) {
      throw new Error('刷新token失败');
    }

    accessStore.setAccessToken(accessToken);
    accessStore.setRefreshToken(refreshToken);
    return accessToken;
  }

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      if (isPlainResponse) return response.data;

      const { code, result, message: msg } = response.data;
      if (code === 200) {
        return result;
      }
      throw new Error(msg || '未知错误');
    },
    async (error: AxiosError<CustomRespone<any>>) => {
      const { response, config } = error;
      const accessStore = useAccessStore();
      const originalRequest = config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (config?.url && config.url === 'api/auth/refresh-token') {
        logout();
        throw error;
      }
      const errorMessage =
        response?.data?.message || '服务器开小差了，请稍后再试';
      const code = response?.data?.code || 400;

      if (code === 401 && !originalRequest._retry) {
        if (!accessStore.refreshToken) {
          logout();
        }

        // 标记为已重试，防止死循环
        originalRequest._retry = true;

        if (!axiosClientStatus.isRefreshing) {
          axiosClientStatus.isRefreshing = true;
          try {
            const newToken = await refreshToken();
            onTokenRefreshed(newToken);
            originalRequest.headers = {
              Authorization: `Bearer ${newToken}`,
            };
            return client(originalRequest);
          } catch (refreshError) {
            logout();
            throw refreshError;
          } finally {
            axiosClientStatus.isRefreshing = false;
          }
        }

        // 正在刷新中，将请求加入等待队列
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            resolve(client(originalRequest));
          });
        });
      }

      message.error(errorMessage);
      throw error;
    },
  );

  return client;
}

// 实例化
const ycloudInstance = createRequestClient(
  'https://api.ycloud.com/v2',
  {
    'X-API-Key': '54016a2cf8aaa449f9c9552669796243',
  },
  true,
);

const whatsappInstance = createRequestClient('https://whatsapi.jackycode.cn');
const apiClient = createRequestClient(import.meta.env.VITE_WHATS_APP_API);
// 导出实例
export { apiClient, whatsappInstance, ycloudInstance };
