<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed, onBeforeMount } from 'vue';

import { LayoutSider as ALayoutSider, message } from 'ant-design-vue';

import { getMessageList } from '#/api';
import ChatBoxLeftList from '#/components/chatBox/left/chatBox-Left-List.vue';
import ChatBoxLeftSearch from '#/components/chatBox/left/chatBox-Left-Search.vue';
import { useChatStore, useCustomerStore } from '#/store';
import { handleTemplateMsg } from '#/utils/common';
import type { WhatsAppInformationInfo } from '@vben/types';
import { useUserStore } from '@vben/stores';

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

const assignedCustomers = computed(() => customerStore.getAssignedCustomers);

// 加载用户列表
const loadCustomerList = async () => {
  const customer = await customerStore.setAssignedCustomers();
  if (customer[0] && assignedCustomers?.value[0]?.id) {
    chatStore.setCurrentUserInfo(customer[0]);
    loadChatMessage(customer[0]?.phoneNumber, assignedCustomers?.value[0]?.id);
  } else {
    message.warn('暫無聯繫客戶，請添加');
  }
};

/**
 * 加载聊天消息列表的异步函数
 * 该函数会从 API 获取指定聊天的消息列表，并对消息数据进行处理后存储到聊天状态中
 */
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
  const res: WhatsAppInformationInfo = await getMessageList(data);
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
const userStore = useUserStore();
// 选中的客户
async function loadChatMessage(guestPhone: string, id: string) {
  if (chatStore.currentPhone !== guestPhone) {
    chatStore.clearChat();
    chatStore.setPage();
    chatStore.setCurrentChatId(id);
    chatStore.setCurrentPhone(guestPhone);
    loadMessageList().then(() => {
      // 设置当前账号下对话对应的电话号码
      const currentOwnPhoneNumber = chatStore.chatMessages.find(
        (chatmessage) => {
          return chatmessage.direction === 'outbound';
        },
      )?.from;
      if (currentOwnPhoneNumber) {
        userStore.setSelectPhone(currentOwnPhoneNumber);
      }
    });
  }
}

onBeforeMount(async () => {
  if (assignedCustomers.value.length === 0) {
    await loadCustomerList();
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
