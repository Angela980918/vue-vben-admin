<script setup lang="ts">
import { onMounted } from 'vue';

import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

onMounted(() => {
  userStore.getUserInfo().then(() => {
    userStore.getUserCompanyies();
  });
});
</script>

<template>
  <div>
    <div>公司</div>
  </div>
</template>

<style scoped></style>
