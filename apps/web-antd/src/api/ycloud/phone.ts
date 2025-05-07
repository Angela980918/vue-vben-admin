import { ycloudRequestClient } from '#/api/yrequest';
/**
 * 註冊WhatsApp 商业电话号码
 */
export async function createPhoneNumber({
  wabaId,
  phoneNumber,
}: {
  phoneNumber: string;
  wabaId: string;
}) {
  return await ycloudRequestClient.post<any>(
    `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/register`,
  );
}

/**
 * 列出电话号码
 */
export async function getPhoneList(
  page: number = 1,
  limit: number = 10,
  includeTotal: boolean = false,
  filter: { [key: string]: string } = {},
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

/**
 * 更新手機號碼
 */
export async function updatePhoneProfile({
  wabaId,
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

/**
 *检索电话号码
 */
export async function retrievePhoneNumber({
  wabaId,
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

/**
 * 检索 WhatsApp 商业电话号码的商业设置。
 */
export async function retrieveCommerceSetting({
  wabaId,
  phoneNumber,
}: {
  phoneNumber: string;
  wabaId: string;
}) {
  const url = `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/whatsappCommerceSettings`;

  return await ycloudRequestClient.get<any>(url);
}

/**
 * 更新 WhatsApp 商业电话号码的商业设置。
 */
export async function updateCommerceSetting({
  wabaId,
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
