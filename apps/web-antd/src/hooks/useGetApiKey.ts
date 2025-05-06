import { useUserStore } from '@vben/stores';

export async function useGetApiKey(wabaId?: string) {
  const userStore = useUserStore();
  // 設置當前的apiKey
  // 設置當前的apiKey
  const companyies = await userStore.getUserCompanyies();
  const wabasAccounts = companyies?.flatMap((company) => company.waba_accounts);
  // 找到當前的apiKey
  const currentApiKey =
    wabasAccounts.find((account) => account.waba_id === wabaId)?.api_key ||
    wabasAccounts[0]?.api_key;
  if (!currentApiKey) {
    return console.error('請先設置API Key');
  }
  // 設置默認的apiKey
  userStore.setYcouldApiKey(currentApiKey);
}
