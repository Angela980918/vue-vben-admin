import type { ContactInfo, ContactListInfo, OptionParams } from '@vben/types';

import { ycloudRequestClient } from '#/api/yrequest';

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

export async function createContact({
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

export async function retrieveContact(id: string) {
  return await ycloudRequestClient.get<ContactInfo>(`/contact/contacts/${id}`);
}

export async function updateContact(data: ContactInfo) {
  const { id } = data;
  // return ycloudInstance({
  //   url: `/contact/contacts/${id}`, method: 'patch', data: data
  // })
  return await ycloudRequestClient.patch<ContactInfo>(
    `/contact/contacts/${id}`,
    data,
  );
}

export async function deleteContact(id: string) {
  return await ycloudRequestClient.delete<ContactInfo>(
    `/contact/contacts/${id}`,
  );
}
