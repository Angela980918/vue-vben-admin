import { message } from 'ant-design-vue';
import axios from 'axios';

function createRequestClient(
  baseURL: string,
  customHeaders = {},
  isPlainResponse = false,
) {
  const client = axios.create({
    baseURL: baseURL || 'http://localhost:3000', // 默认地址
    timeout: 10_000, // 超时时间
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      ...customHeaders,
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // TODO: 在这里预留 Token 逻辑
      // const token = localStorage.getItem("accessToken");
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

      return config;
    },
    (err) => {
      // console.log("error", err);
      // 请求发送前出错处理
      message.error(`请求发送失败`);
      return Promise.reject(err);
    },
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      if (isPlainResponse) {
        // 如果是ycloud，直接返回 response.data
        return response.data;
      }
      const { code, result, message: msg } = response.data;
      if (code === 200) {
        return result; // 成功返回数据
      }
      // 抛出业务错误
      throw new Error(msg || '未知错误');
    },
    (err) => {
      // 网络或服务器错误处理
      const { response } = err;
      const errorMessage =
        response?.data?.message || '服务器开小差了，请稍后再试';

      message.error(errorMessage); // 全局错误提示
      return Promise.reject(err);
    },
  );

  return client;
}

const ycloudInstance = createRequestClient(
  'https://api.ycloud.com/v2',
  {
    'X-API-Key': '54016a2cf8aaa449f9c9552669796243',
  },
  true,
);

// 创建 WhatsApp 实例
const whatsappInstance = createRequestClient('https://whatsapi.jackycode.cn');

// 默认导出多个实例
export { whatsappInstance, ycloudInstance };
