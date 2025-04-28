<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { UserOutlined } from '@ant-design/icons-vue';
import { Space as ASpace } from 'ant-design-vue';

import ChatBoxLeftItem from '#/components/chatBox/left/chatBox-Left-Item.vue';
import { useChatStore, useCustomerStore } from '#/store';
import type { AssignedCustomer } from '@vben/types';

interface Props {
  assignedCustomersData: AssignedCustomer[];
}

const props = defineProps<Props>();
const emits = defineEmits(['loadChatMessage']);

const userData = ref(props.assignedCustomersData);

const customerStore = useCustomerStore();
const chatStore = useChatStore();
// const currentCustomerId = computed(()=> customerStore.currentUserId)
const currentChatId = computed(() => chatStore.currentChatId);

const assCount = ref(0);
// const unAssCount = ref(0);

// const activeKey = ref('1');

// 处理点击事件
const handleItemClick = (id: string, phoneNumber: string) => {
  props.assignedCustomersData?.forEach((item) => {
    if (item.id === id) {
      chatStore.setCurrentUserInfo(item);
      return true;
    }
  });
  emits('loadChatMessage', phoneNumber, id);
};

watch(
  () => customerStore.searchWord,
  (newValue) => {
    if (newValue === '') {
      userData.value = props.assignedCustomersData;
    } else {
      const list: AssignedCustomer[] = [];
      props.assignedCustomersData.forEach((item) => {
        if (
          item.name.toLowerCase().includes(newValue.toLowerCase()) ||
          item.phoneNumber.includes(newValue)
        ) {
          list.push(item);
        }
      });
      userData.value = list;
    }
  },
);

watch(
  () => props.assignedCustomersData,
  (newValue) => {
    userData.value = newValue;
  },
  { deep: true },
);

watch(
  () => customerStore.assignedCustomers,
  (newValue) => {
    // console.log("newValuenewValue",newValue)
    let count = 0;
    newValue.forEach((item) => {
      count += item.badgeCount ?? 0;
    });
    assCount.value = count;
  },
);
</script>

<template>
  <!-- 標籤頁頭部 -->
  <ASpace direction="vertical" style="width: 100%">
    <div style="width: 100%; padding: 10px 0; font-size: 16px; color: #1a1a1a">
      <UserOutlined />
      <span>{{ $t('page.chat.customerList') }}</span>
    </div>
    <!--    客户列表    -->
    <ASpace
      v-for="customer in userData"
      @click="handleItemClick(customer.id, customer.phoneNumber)"
      direction="vertical"
      style="width: 100%"
      :key="customer.id"
    >
      <ChatBoxLeftItem
        :color="customer.color"
        :name="customer.name"
        :time="customer.time"
        :message="customer.message"
        :badge-count="customer.badgeCount"
        style="color: #1a1a1a"
        :class="
          currentChatId === customer.id ? 'chat-box-left-item-active' : ''
        "
      />
    </ASpace>
  </ASpace>
</template>

<style scoped>
.chat-box-left-item-active {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 12px;
}
</style>
