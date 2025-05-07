import { ycloudRequestClient } from '#/api/yrequest';

interface BalanceInfo {
  amount: string;
  currency: string;
}

/**
 * 獲取賬號餘額
 */
export async function getBalance() {
  return await ycloudRequestClient.get<BalanceInfo>('/balance');
}
