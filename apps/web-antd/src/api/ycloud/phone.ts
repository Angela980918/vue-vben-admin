import { ycloudRequestClient } from '#/api/yrequest';

export async function createPhoneNumber({
  wabaId = '449711484896804',
  phoneNumber,
}: {
  phoneNumber: string;
  wabaId: string;
}) {
  return await ycloudRequestClient.post<any>(
    `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/register`,
  );
}

export async function getPhoneList(
  page: number = 1,
  limit: number = 10,
  includeTotal: boolean = false,
  filter: object = {},
) {
  const acc: Record<string, any> = {};
  for (const key of Object.keys(filter)) {
    acc[`filter.${key}`] = filter[key];
  }

  const data = {
    page,
    limit,
    includeTotal,
    ...acc,
  };

  return await ycloudRequestClient.get<any>(`/whatsapp/phoneNumbers`, data);
}

export async function updatePhoneProfile({
  wabaId = '449711484896804',
  phoneNumber,
  data,
}: {
  data: object;
  phoneNumber: string;
  wabaId: string;
}) {
  // return ycloudInstance({
  //   url: `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/profile`,
  //   method: "PATCH",
  //   data
  // })
  return await ycloudRequestClient.patch<any>(
    `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/profile`,
    data,
  );
}

export async function retrievePhoneNumber({
  wabaId = '449711484896804',
  phoneNumber,
  profile = false,
}: {
  phoneNumber: string;
  profile: boolean;
  wabaId: string;
}) {
  let url = `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}`;
  if (profile) {
    url += `/profile`;
  }

  // return ycloudInstance({
  //   url,
  //   method: "GET",
  // })
  return await ycloudRequestClient.get<any>(url);
}

export async function retrieveCommerceSetting({
  wabaId = '449711484896804',
  phoneNumber,
}: {
  phoneNumber: string;
  wabaId: string;
}) {
  const url = `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/whatsappCommerceSettings`;

  return await ycloudRequestClient.get<any>(url);
}

export async function updateCommerceSetting({
  wabaId = '449711484896804',
  phoneNumber,
  data,
}: {
  data: object;
  phoneNumber: string;
  wabaId: string;
}) {
  // return ycloudInstance({
  //   url: `/whatsapp/templates/${wabaId}/${phoneNumber}/whatsappCommerceSettings`,
  //   method: "PATCH",
  //   data
  // })
  return await ycloudRequestClient.patch<any>(
    `/whatsapp/templates/${wabaId}/${phoneNumber}/whatsappCommerceSettings`,
    data,
  );
}
