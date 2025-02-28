<script setup>
import { onMounted } from 'vue';

// import { getWhatsAppUserInfo } from '#/api';
import {useTemplateStore, useCustomerStore} from "#/store";

const tempStore = useTemplateStore();
// const chatStore = useChatStore();
const custmerStore = useCustomerStore();

onMounted(async () => {
  // await authStore.fetchUserInfo();
  await tempStore.loadTemplates();
  // await getWhatsAppUserInfo().then((result) => result);
  // await tempStore.loadQuickMsg();
  // await tempStore.setMaterialListData('wabaId=449711484896804');
  await custmerStore.setContactList();
});
</script>

<template>
  <div>在线聊天</div>
</template>

<style scoped></style>
