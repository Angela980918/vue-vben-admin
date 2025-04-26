<script lang="ts" setup>
import { computed, ref } from 'vue';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import {
  Avatar as AAvatar,
  TabPane as ATabPane,
  Tabs as ATabs,
  Tooltip as ATooltip,
} from 'ant-design-vue';

import ChatBoxRightImage from './chatBox-right-image.vue';
import ChatBoxRightPerson from './chatBox-right-person.vue';
import ChatBoxRightStatus from './chatBox-right-status.vue';
import ChatBoxRightTips from './chatBox-right-tips.vue';
import { useChatStore, useCustomerStore } from '#/store';
import type { CurrentCustomerInfo } from '#/store';
import ChatBoxRightFile from './chatBox-right-file.vue';

const activeKey = ref('1');
const customerStore = useCustomerStore();
const chatStore = useChatStore();
const currentCustomerInfo = computed<CurrentCustomerInfo | undefined>(() => {
  // 如果 currentCustomerInfo 是空对象，则返回 customers 中的第一个客户信息
  return chatStore.currentCustomerInfo &&
    Object.keys(chatStore.currentCustomerInfo).length > 0
    ? chatStore.currentCustomerInfo
    : customerStore.assignedCustomers[0] || undefined;
});
const getAvatarText = (name: string) => {
  if (name === undefined) return;
  // 使用正则表达式过滤掉数字，只取字母或汉字
  const filteredName = name.replaceAll(/\d/g, ''); // 移除数字
  return filteredName.charAt(0).toUpperCase(); // 获取第一个非数字字母或汉字
};
</script>

<template>
  <div class="rightTab">
    <div class="headerCard">
      <template v-if="currentCustomerInfo">
        <AAvatar
          size="large"
          :style="{ backgroundColor: currentCustomerInfo.color }"
        >
          {{ getAvatarText(currentCustomerInfo.name) }}
        </AAvatar>
        <div class="sampleInfo">
          <span>{{
            ` ${$t('page.chat.titles.1')}:${currentCustomerInfo.name}`
          }}</span>
          <span>{{ $t('page.chat.titles.2') }}：2024/12/06</span>
        </div>
      </template>
    </div>
    <div class="remarkCard">
      <div class="rmarkMain">
        <span>{{ $t('page.chat.titles.3') }}</span>
        <ATooltip>
          <PlusCircleOutlined
            class="inputText"
            style="margin: 4px; font-size: 16px; color: #535bf2"
          />
        </ATooltip>
      </div>
      <span class="tip">{{ $t('page.chat.tips.1') }}</span>
    </div>

    <ATabs v-model:active-key="activeKey">
      <ATabPane key="1" :tab="$t('page.chat.tabs.1')">
        <ChatBoxRightStatus />
      </ATabPane>
      <ATabPane key="2" :tab="$t('page.chat.tabs.2')" force-render>
        <ChatBoxRightPerson />
      </ATabPane>
      <ATabPane key="3" :tab="$t('page.chat.tabs.3')">
        <ChatBoxRightFile />
      </ATabPane>
      <ATabPane key="4" :tab="$t('page.chat.tabs.4')">
        <ChatBoxRightImage />
      </ATabPane>
      <ATabPane key="5" :tab="$t('page.chat.tabs.5')">
        <ChatBoxRightTips />
      </ATabPane>
    </ATabs>
  </div>
</template>

<style scoped>
.rightTab {
  padding: 16px;

  .headerCard {
    display: flex;
    flex-direction: row;

    .sampleInfo {
      display: flex;
      flex-direction: column;
    }
  }

  .remarkCard {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px;
    margin-top: 16px;
    background-color: #edfafc;
    border-radius: 4px;

    .rmarkMain {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
    }

    .tip {
      margin-top: 8px;
      font-size: 14px;
      color: #b3b3b3;
    }
  }
}
</style>
