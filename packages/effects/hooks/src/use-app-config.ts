import type { VbenAdminProAppConfigRaw } from '@vben/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): { apiURL: string; wapiURL: any; ycloudURL: any } {
  // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction
    ? window._VBEN_ADMIN_PRO_APP_CONF_
    : (env as VbenAdminProAppConfigRaw);

  const { VITE_GLOB_API_URL, VITE_YCLOUD_API_URL, VITE_WHATS_API_URL } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
    ycloudURL: VITE_YCLOUD_API_URL,
    wapiURL: VITE_WHATS_API_URL,
  };
}
