<script setup>
import { onMounted } from 'vue';

import { getWhatsAppUserInfo } from '#/api';
import { useTemplateStore } from '#/store/tempStore';

const tempStore = useTemplateStore();

onMounted(async () => {
  // await authStore.fetchUserInfo();
  await tempStore.loadTemplates();
  await getWhatsAppUserInfo().then((result) => result);
});
</script>

<template>
  <div>在线聊天</div>
</template>

<style scoped></style>
