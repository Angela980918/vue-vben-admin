/**
 * 登錄或者路由加載錢后初始常用數據
 */

import { useCustomerStore, useTemplateStore } from '#/store';
import { wsconnect } from '#/utils/wscontect';

export async function useInitCommonDataBeforeEnterRoute() {
  const tempStore = useTemplateStore();
  const customerStore = useCustomerStore();
  await tempStore.loadTemplates();
  await customerStore.setContactList();
  await customerStore.setAssignedCustomers();
  await wsconnect.createConnect();
}
