import { wcloudRequestClient } from '#/api/wrequest';
import type { WhatsAppInformationInfo } from '@vben/types';

/**
 * 查詢沟通列表
 */
export async function getAllCustomerApi(wabaId: string) {
  // return whatsappInstance({
  //   url: '/chat/getAllCustomerLatestChats?wabaId=449711484896804', method: 'GET'
  // })
  return wcloudRequestClient.get<WhatsAppInformationInfo[]>(
    `/chat/getAllCustomerLatestChats?wabaId=${wabaId}`,
  );
}

/**
 * 查詢消息列表
 */
export const getMessageList = ({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: number;
  pageSize: number;
}) => {
  // return whatsappInstance({
  //   url: `/chat?roomId=${id}&pageIndex=${page}&pageSize=${pageSize}`, method: 'GET'
  // })
  return wcloudRequestClient.get<any>(
    `/chat?roomId=${id}&pageIndex=${page}&pageSize=${pageSize}`,
  );
};

// 查询新客聊天室ID
export const getNewRoomId = (phone: string) => {
  console.warn('phonephonephone', phone);
  const data = {
    customerId: phone,
  };
  console.warn('datadatadata', data);
  return wcloudRequestClient.post<any>(`/chat/conversation`, data);
};
