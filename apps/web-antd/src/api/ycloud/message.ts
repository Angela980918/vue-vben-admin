import { ycloudRequestClient } from '#/api/yrequest';

interface MessageData {
  from: string;
  to: string;
  type: 'document' | 'image' | 'template' | 'text' | 'video';
  message?: string;
  link?: string;
  context?: string;
  externalId?: string;
  filterUnsubscribed?: boolean;
  filterBlocked?: boolean;
  enqueue?: boolean;
  template?: object;
}

export async function sendMessage({
  from,
  to,
  type,
  message,
  link,
  context,
  externalId,
  filterUnsubscribed,
  filterBlocked,
  enqueue = false,
  template,
}: MessageData) {
  const data: any = {
    from,
    to,
    type,
  };

  if (type === 'template') {
    const dynamicKey = `${type}`;
    // data.name = name,
    // data.language = language
    data[dynamicKey] = template;
  } else if (type !== 'text' && message !== undefined) {
    const dynamicKey = `${type}`; // 动态变量名，例如 "text_message"
    data[dynamicKey] = { link, caption: message }; // 动态赋值
  } else {
    const dynamicKey = `${type}`; // 动态变量名，例如 "text_message"
    data[dynamicKey] = { body: message }; // 动态赋值
  }

  if (context !== undefined) data.context = context;
  if (externalId !== undefined) data.externalId = externalId;
  if (filterUnsubscribed !== undefined)
    data.filterUnsubscribed = filterUnsubscribed;
  if (filterBlocked !== undefined) data.filterBlocked = filterBlocked;

  let url = '/whatsapp/messages';

  if (!enqueue) {
    url += '/sendDirectly';
  }
  //
  // return ycloudInstance({
  //   url: url, method: 'POST', data
  // })

  return await ycloudRequestClient.post<any>(url, data);
}

export async function retrieveMessage({ id }: { id: string }) {
  // return ycloudInstance({
  //   url: `/whatsapp/messages/${id}`,
  //   method: "GET",
  // })
  return await ycloudRequestClient.get<any>(`/whatsapp/messages/${id}`);
}

export async function markAsReadMessage({ id }: { id: string }) {
  // return ycloudInstance({
  //   url: `/whatsapp/inboundMessages/${id}/markAsRead`,
  //   method: "POST"
  // })

  return await ycloudRequestClient.post<any>(
    `/whatsapp/inboundMessages/${id}/markAsRead`,
  );
}
