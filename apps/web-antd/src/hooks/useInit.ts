/**
 * 登錄或者路由加載錢后初始常用數據
 */

import { useCustomerStore, useTemplateStore } from '#/store';
import { wsconnect } from '#/utils/wscontect';
import { useUserStore } from '@vben/stores';
import { message } from 'ant-design-vue';

export async function useInitCommonDataBeforeEnterRoute() {
  const tempStore = useTemplateStore();
  const customerStore = useCustomerStore();
  await tempStore.loadTemplates();
  await customerStore.setContactList();
  await customerStore.setAssignedCustomers();
  const userStore = useUserStore();
  const currentWabaId = userStore.currentWabaId;
  if (currentWabaId) {
    await wsconnect.createConnect(currentWabaId);
  } else {
    message.warning('请先选择一个waba账户');
  }
}
