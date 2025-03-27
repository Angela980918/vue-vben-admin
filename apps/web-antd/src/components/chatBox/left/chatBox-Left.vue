<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed, onBeforeMount } from 'vue';

import { useUserStore } from '@vben/stores';

import { LayoutSider as ALayoutSider } from 'ant-design-vue';

import { getMessageList } from '#/api';
import ChatBoxLeftList from '#/components/chatBox/left/chatBox-Left-List.vue';
import ChatBoxLeftSearch from '#/components/chatBox/left/chatBox-Left-Search.vue';
import { useChatStore, useCustomerStore } from '#/store';
import { handleTemplateMsg } from '#/utils/common';

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

const assignedCustomers = computed(() => customerStore.getAssignedCustomers);
// const unassignedCustomers = computed(() => customerStore.getUnassignedCustomers);

// const generateRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// 加载用户列表
const loadCustomerList = async () => {
  const customer = await customerStore.setAssignedCustomers();
  // await getAllCustomerApi(wabaId).then((result) => {
  //   result.forEach((item) => {
  //     item.key = item.id;
  //     const color = generateRandomColor();
  //     const newCustomer = {
  //       id: item.id,
  //       key: item.key,
  //       name: item.customerId,
  //       time: item.messageList[0].deliverTime,
  //       badgeCount: item.messageCount,
  //       phoneNumber: item.customerId,
  //       color,
  //     };
  //
  //     if (item.customerProfile !== undefined) {
  //       newCustomer.name = item.customerProfile.name;
  //     }
  //
  //     newCustomer.message =
  //       item.messageList[0].type === 'text'
  //         ? item.messageList[0].content.body
  //         : `[${item.messageList[0].type} Message]`;
  //
  //     customer.push(newCustomer);
  //   });
  //   // console.log("customer",customer)
  //   customerStore.setAssignedCustomers(customer);
  //   // chatStore.setCurrentPhone(customer[0].phoneNumber);
  //   chatStore.setCurrentUserInfo(customer[0]);
  //   // chatStore.setCurrentChatId()
  // });
  chatStore.setCurrentUserInfo(customer[0]);
  loadChatMessage(customer[0]?.phoneNumber, assignedCustomers?.value[0]?.id);
};

// 加载消息列表
const loadMessageList = async () => {
  const currentChatId = chatStore.getCurrentChatId;
  const currentCustomerInfo = chatStore.currentCustomerInfo;

  if (currentChatId === undefined || currentCustomerInfo === undefined) {
    return;
  }
  chatStore.setPage();
  const data = {
    id: currentChatId,
    page: 1,
    pageSize: 20,
  };
  const res = await getMessageList(data);

  res.messageList.reverse().forEach((item, index) => {
    let fileExtension = '';
    item.name = currentCustomerInfo.name;
    item.color = currentCustomerInfo.color;
    item.msgIndex = '1' + `-${index}` + '-index';
    if (item.type === 'template') {
      const name = item.content.name;
      const language = item.content.language.code;
      item.content = handleTemplateMsg(name, language);
      if (
        item.content.header !== undefined &&
        item.content.header.format === 'DOCUMENT'
      ) {
        const url = item.content.header.content;
        fileExtension = url.split('.').pop();
        item.fileExtension = fileExtension;
      }
    } else if (item.type === 'document') {
      const url = item.content.link;
      const filename = url.split('/').pop();
      fileExtension = filename.split('.');
      item.content.filename = filename;
      item.fileExtension = fileExtension[1];
    }
  });

  chatStore.setMessageList(res.messageList);
};

// 选中的客户
async function loadChatMessage(guestPhone, id) {
  if (chatStore.currentPhone !== guestPhone) {
    chatStore.clearChat();
    chatStore.setPage();
    chatStore.setCurrentChatId(id);
    chatStore.setCurrentPhone(guestPhone);
    loadMessageList();
  }
}

onBeforeMount(async () => {
  if (assignedCustomers.value.length === 0) {
    await loadCustomerList(useUserStore().selectAccount);
  } else {
    chatStore.setCurrentUserInfo(assignedCustomers.value[0]);
    loadChatMessage(
      assignedCustomers.value[0].phoneNumber,
      assignedCustomers.value[0].id,
    );
  }
});

const siderStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  'padding-left': '12px',
  'padding-right': '12px',
  'padding-top': '12px',
  overflowY: 'auto',
  backgroundColor: 'transparent',
};
</script>

<template>
  <ALayoutSider width="300" :collapsed-width="300" :style="siderStyle">
    <!--  搜索框  -->
    <ChatBoxLeftSearch />

    <!--  分配列表 :unassignedCustomersData="unassignedCustomers" -->
    <ChatBoxLeftList
      :assigned-customers-data="assignedCustomers"
      @load-chat-message="loadChatMessage"
    />
  </ALayoutSider>
</template>

<style scoped></style>
