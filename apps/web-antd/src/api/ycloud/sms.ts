import { ycloudRequestClient } from '#/api/yrequest';

/**
 *  发送短信
 */
export async function sendSMS(to: string, text: string, signature: string) {
  // return ycloudInstance({
  //   url: '/sms', method: 'post', data: {
  //     to, text, signature
  //   }
  // })
  const data = {
    to,
    text,
    signature,
  };
  return await ycloudRequestClient.post<any>('/sms', data);
}

/**
 * 列出短信记录
 */
export async function getSMSList(
  page: number = 1,
  limit: number = 10,
  includeTotal: boolean = true,
  optionPrams: object,
) {
  const requireData = {
    page,
    limit,
    includeTotal,
  };
  const optionData = Object.fromEntries(
    Object.entries(optionPrams).map(([key, value]) => [`filter.${key}`, value]),
  );
  const data = {
    ...requireData,
    ...optionData,
  };
  // return ycloudInstance({
  //   url: '/sms', method: 'post', data
  // })
  return await ycloudRequestClient.post<any>('/sms', data);
}
