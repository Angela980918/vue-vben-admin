<script lang="ts" name="ChatBoxLeftSkeleton" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { $t } from '@vben/locales';

const { isLoading = true } = defineProps<{
  isLoading?: boolean;
}>();
</script>

<template>
  <div v-if="isLoading" class="space-y-4">
    <div style="width: 100%; padding: 10px 0; font-size: 16px; color: #1a1a1a">
      <UserOutlined />
      <span>{{ $t('page.chat.customerList') }}</span>
    </div>
    <!-- 骨架屏占位区域 -->
    <div v-for="index in 5" :key="index" class="flex items-center space-x-4">
      <!-- 左侧圆形占位 -->
      <div class="h-12 w-12 animate-pulse rounded-full bg-gray-300"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
        <div class="h-3 w-1/2 animate-pulse rounded bg-gray-300"></div>
      </div>
    </div>
  </div>
</template>
