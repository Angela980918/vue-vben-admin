<script lang="ts" setup>
import { ref } from 'vue';

import { InputSearch as AInputSearch, Space as ASpace } from 'ant-design-vue';

import { useCustomerStore } from '#/store';

const value = ref<string>('');
const customerStore = useCustomerStore();
const onSearch = (searchValue: string) => {
  // console.log("searchValue", searchValue.target.value)
  customerStore.setSearchWord(searchValue.target.value);
};
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <AInputSearch
      name="customerPhone"
      v-model:value="value"
      :placeholder="$t('page.chat.chatTip')"
      @change="onSearch"
      :allow-clear="true"
    />
  </ASpace>
</template>

<style scoped></style>
