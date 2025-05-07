import { ycloudRequestClient } from '#/api/yrequest';

interface PersonInfo {
  name: string;
  address: string;
}
interface EmailInfo {
  id: string;
  from: PersonInfo;
  to: PersonInfo;
  cc?: PersonInfo;
  bcc?: PersonInfo;
  replyTo?: PersonInfo;
  subject: string;
  summary: string;
  contentType: string;
  externalId: string;
  callbackUrl: string;
  createTime: string;
  totalRecipients: number;
  totalPrice: number;
  currency: string;
}

/**
 * 發送電子郵箱
 * @param from:发件人邮箱
 * @param content content
 * @param subject 主题
 * @param to 预期收件人的电子邮件地址
 *
 */
export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  content: string,
) {
  return await ycloudRequestClient.post<EmailInfo>('/emails', {
    from,
    to,
    subject,
    content,
  });
}
