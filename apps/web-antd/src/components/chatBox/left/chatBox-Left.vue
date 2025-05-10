<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { LayoutSider as ALayoutSider, message } from 'ant-design-vue';

import ChatBoxLeftList from '#/components/chatBox/left/chatBox-Left-List.vue';
import ChatBoxLeftSearch from '#/components/chatBox/left/chatBox-Left-Search.vue';
import { useChatStore, useCustomerStore } from '#/store';
import ChatBoxLeftSkeleton from './chatBox-Left-Skeleton .vue';
import { handleTemplateMsg } from '#/utils/common';
import { useUserStore } from '@vben/stores';

const { isShow = true } = defineProps<{
  isShow?: Boolean;
}>();

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

const assignedCustomers = computed(() => customerStore.getAssignedCustomers);

// 加载用户列表

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
  // 注释获取聊天室全部消息的函数
  // const data = {
  //   id: currentChatId,
  //   page: 1,
  //   pageSize: 20,
  // };
  // const res: WhatsAppInformationInfo = await getMessageList(data);
  const res = await chatStore.getChatRoomMessages({ page: 1, pageSize: 20 });
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
async function loadChatMessage(guestPhone: string, id: string) {
  if (chatStore.currentPhone !== guestPhone) {
    chatStore.clearChat();
    chatStore.setPage();
    chatStore.setCurrentChatId(id);
    chatStore.setCurrentPhone(guestPhone);
    loadMessageList().then(() => {});
  }
}
// const { getRawTemplateList, loadTemplates } = useTemplateStore();
const userStore = useUserStore();
watch(
  () => userStore.selectPhone,
  () => {
    loadMessageList().then(() => {});
  },
);

function initialGetMessageInfo() {
  setTimeout(() => {
    const AssignedCustomers = customerStore.getAssignedCustomers;
    const initAssignedCustomer = AssignedCustomers[0];
    if (AssignedCustomers.length > 0 && initAssignedCustomer) {
      chatStore.setCurrentUserInfo(initAssignedCustomer);
      loadChatMessage(
        initAssignedCustomer.phoneNumber,
        initAssignedCustomer.id,
      );
    } else {
      message.warn('尚未有客戶信息，請添加聯繫的客戶');
    }
  }, 0);
}
const isMounted = ref(false);
async function initial() {
  if (assignedCustomers.value.length === 0) {
    nextTick(async () => {
      await customerStore.setAssignedCustomers();
      await initialGetMessageInfo();
    });
  } else {
    initialGetMessageInfo();
  }
}

const siderStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  'padding-left': '12px',
  'padding-right': '12px',
  'padding-top': '12px',
  overflowY: 'auto',
  backgroundColor: 'transparent',
};

onMounted(() => {
  isMounted.value = true;
  initial();
});

watch(
  () => isShow,
  async (newVal) => {
    if (newVal) {
      initial();
    }
  },
  {
    deep: true,
  },
);
</script>

<template>
  <ALayoutSider width="300" :collapsed-width="300" :style="siderStyle">
    <!--  搜索框  -->
    <ChatBoxLeftSearch />

    <!--  分配列表 :unassignedCustomersData="unassignedCustomers" -->
    <ChatBoxLeftList
      v-if="isShow"
      :assigned-customers-data="assignedCustomers"
      @load-chat-message="loadChatMessage"
    />
    <!--  骨架屏  -->
    <ChatBoxLeftSkeleton v-else />
  </ALayoutSider>
</template>

<style scoped></style>
