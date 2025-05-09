<script lang="ts" setup>
import { ref, watch } from 'vue';
import { InputSearch as AInputSearch, Space as ASpace } from 'ant-design-vue';
import { useCustomerStore } from '#/store';

const value = ref('');
const customerStore = useCustomerStore();

watch(value, (newVal) => {
  customerStore.setSearchWord(newVal);
});
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <AInputSearch
      name="customerPhone"
      v-model:value="value"
      :placeholder="$t('page.chat.chatTip')"
      :allow-clear="true"
    />
  </ASpace>
</template>
