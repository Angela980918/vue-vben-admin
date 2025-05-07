import type { ContactInfo, ContactListInfo, OptionParams } from '@vben/types';

import { ycloudRequestClient } from '#/api/yrequest';

/**
 * 獲取多個聯繫人
 */
export async function getContactListApi(
  page = 1,
  limit = 10,
  includeTotal = true,
  optionParams: OptionParams = {},
) {
  const requireData = {
    page,
    limit,
    includeTotal,
  };
  const optionData: Record<string, boolean | number | string> =
    Object.fromEntries(
      Object.entries(optionParams).map(([key, value]) => [
        `filter.${key}`,
        value,
      ]),
    );

  const data: Record<string, boolean | number | string> = {
    ...requireData,
    ...optionData,
  };

  const queryString = new URLSearchParams(
    data as Record<string, string>,
  ).toString();

  const url = `/contact/contacts?${queryString}`;
  return await ycloudRequestClient.get<ContactListInfo>(url);
}

/**
 * 創建聯繫人
 */
export async function createContactApi({
  nickname,
  phoneNumber,
  countryCode,
  email,
  tags,
  customAttributes,
  ownerEmail,
}: Record<string, string>) {
  return await ycloudRequestClient.post<ContactInfo>('/contact/contacts', {
    nickname,
    phoneNumber,
    countryCode,
    email,
    tags,
    customAttributes,
    ownerEmail,
  });
}

/**
 * 檢索聯繫人
 */
export async function retrieveContact(id: string) {
  return await ycloudRequestClient.get<ContactInfo>(`/contact/contacts/${id}`);
}

/**
 * 更新聯繫人信息
 */
export async function updateContactApi(data: ContactInfo) {
  const { id } = data;
  // return ycloudInstance({
  //   url: `/contact/contacts/${id}`, method: 'patch', data: data
  // })
  return await ycloudRequestClient.patch<ContactInfo>(
    `/contact/contacts/${id}`,
    data,
  );
}
/**
 * 刪除聯繫人
 */
export async function deleteContactApi(id: number | string) {
  return await ycloudRequestClient.delete<any>(`/contact/contacts/${id}`);
}
