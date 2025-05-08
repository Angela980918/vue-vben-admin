<script lang="ts" setup>
import { ref } from 'vue';
import { InputSearch as AInputSearch, Space as ASpace } from 'ant-design-vue';
import { useCustomerStore } from '#/store';

const value = ref('');
const customerStore = useCustomerStore();

const onInputChange = (newValue: string) => {
  value.value = newValue;
  customerStore.setSearchWord(newValue);
};
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <AInputSearch
      name="customerPhone"
      v-model:value="value"
      :placeholder="$t('page.chat.chatTip')"
      :allow-clear="true"
      @update:value="onInputChange"
    />
  </ASpace>
</template>

<style scoped></style>
