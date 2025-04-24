import { useUserStore } from '@vben/stores';

export async function useGetApiKey(wabaId: string) {
  const userStore = useUserStore();
  // 設置當前的apiKey
  // 設置當前的apiKey
  const companyies = await userStore.getUserCompanyies();

  // 找到當前的apiKey
  const currentApiKey = companyies
    ?.flatMap((company) => company.waba_accounts)
    .find((account) => account.waba_id === wabaId)?.api_key;

  // 設置默認的apiKey
  userStore.setYcouldApiKey(currentApiKey || '');
}
