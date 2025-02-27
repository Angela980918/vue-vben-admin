import { ycloudRequestClient } from '#/api/yrequest';

interface BalanceInfo {
  amount: string;
  currency: string;
}

export async function getBalance() {
  return await ycloudRequestClient.get<BalanceInfo>('/balance');
}
