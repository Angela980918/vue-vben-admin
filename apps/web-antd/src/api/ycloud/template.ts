import { ycloudRequestClient } from '#/api/yrequest';
import type { YCouldTemplateResponse } from '@vben/types';

interface TemplateInfo {
  wabaId: string;
  name: string;
  language: string;
  category: string;
  subCategory?: string;
  components: object;
  messageSendTtlSeconds?: number;
}

/**
 * 創建模板
 * @param wabaId
 * @param name
 * @param language
 * @param category
 * @param subCategory
 * @param messageSendTtlSeconds
 * @param components
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export async function createTemplateApi({
  wabaId,
  name,
  language = 'zh_HK',
  category,
  subCategory,
  messageSendTtlSeconds,
  components,
}: TemplateInfo) {
  // 动态构建请求数据
  const data: TemplateInfo = {
    wabaId,
    name,
    language,
    category,
    components, // 必填的直接加入
  };

  // 根据是否传入值动态添加可选参数
  if (subCategory !== undefined) data.subCategory = subCategory;
  if (messageSendTtlSeconds !== undefined)
    data.messageSendTtlSeconds = messageSendTtlSeconds;

  // return ycloudInstance({
  //   url: '/whatsapp/templates', method: 'POST', data
  // })
  return await ycloudRequestClient.post<any>('/whatsapp/templates', data);
}

/**
 * 模版列表
 * @param page
 * @param limit
 * @param includeTotal
 * @param filter
 * @param filter.wabaId
 * @param filter.name
 * @param filter.language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export async function getTemplateList(page: number = 1, limit: number = 10) {
  // const acc: Record<string, any> = {};
  // for (const key of Object.keys(filter)) {
  //   acc[`filter.${key}`] = filter[key];
  // }

  return await ycloudRequestClient.get<YCouldTemplateResponse>(
    `/whatsapp/templates?page=${page}&limit=${limit}&includeTotal=true`,
  );
}

/** 刪除模板
 * @param wabaId
 * @param name
 * @param language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export async function deleteTemplateApi({
  wabaId,
  name,
  language,
}: {
  language?: string;
  name: string;
  wabaId: string;
}) {
  let url = `/whatsapp/templates/${wabaId}/${name}`;
  if (language !== undefined) {
    url += `/${language}`; // 如果有 language，就拼接到 URL 中
  }
  // return ycloudInstance({
  //   url,
  //   method: "DELETE"
  // })
  return await ycloudRequestClient.delete<any>(url);
}

/** 編輯模板
 * @param wabaId
 * @param name
 * @param language
 * @param components
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export async function editTemplateApi({
  wabaId,
  name,
  language = 'zh_HK',
  components,
}: {
  components: object;
  language: string;
  name: string;
  wabaId: string;
}) {
  // return ycloudInstance({
  //   url: `/whatsapp/templates/${wabaId}/${name}/${language}`,
  //   method: "PATCH",
  //   data: {components: components}
  // })
  const data = {
    components,
  };
  return await ycloudRequestClient.patch<any>(
    `/whatsapp/templates/${wabaId}/${name}/${language}`,
    data,
  );
}

/** 检索模板
 * @param wabaId
 * @param name
 * @param language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export async function retrieveTemplate({
  wabaId,
  name,
  language = 'zh_HK',
}: {
  language: string;
  name: string;
  wabaId: string;
}) {
  // return ycloudInstance({
  //   url: `/whatsapp/templates/${wabaId}/${name}/${language}`,
  //   method: "GET",
  // })
  return await ycloudRequestClient.get<any>(
    `/whatsapp/templates/${wabaId}/${name}/${language}`,
  );
}
