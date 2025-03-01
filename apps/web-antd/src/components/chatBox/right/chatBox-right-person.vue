<script lang="ts" setup>
import { computed } from 'vue';

import { EditOutlined } from '@ant-design/icons-vue';
import { Tooltip as ATooltip } from 'ant-design-vue';

import { useChatStore } from '#/store';

const chatStore = useChatStore();

const customerInfo = computed(() => chatStore.currentCustomerInfo);
</script>

<template>
  <div style="padding: 12px">
    <div class="container">
      <div class="info">
        <div class="info-item">
          <span>電話號碼</span>
          <span>{{ customerInfo.phoneNumber }}</span>
        </div>
        <div class="info-item">
          <span>電郵</span>
          <span>N/A</span>
        </div>
      </div>
      <div>
        <ATooltip>
          <EditOutlined />
        </ATooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
}

.info {
  flex-direction: row;
  min-width: 80%;

  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
</style>
