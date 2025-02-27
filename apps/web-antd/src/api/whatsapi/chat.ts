import { wcloudRequestClient } from '#/api/wrequest';

/**
 * 查詢沟通列表
 */
export async function getAllCustomer(wabaId: string = '449711484896804') {
  // return whatsappInstance({
  //   url: '/chat/getAllCustomerLatestChats?wabaId=449711484896804', method: 'GET'
  // })
  return wcloudRequestClient.get<any>(
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
