<script lang="ts" name="chatroomSkeleton" setup></script>

<template>
  <div class="flex flex-col bg-[#F6F6F6]">
    <!-- Header -->
    <div
      class="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm"
    >
      <div class="ml-[20px] h-6 w-32 animate-pulse rounded bg-gray-300"></div>
      <div class="mr-[50px] flex gap-[18px]">
        <div
          v-for="index in 4"
          :key="index"
          class="h-8 animate-pulse rounded-sm bg-gray-300"
          :class="[index === 3 ? 'w-[110px]' : 'w-8']"
        ></div>
      </div>
    </div>

    <!-- Message Area -->
    <div
      class="flex-1 space-y-6 overflow-y-auto px-4 py-6"
      style="height: 700px"
    >
      <!-- 系統消息（左側） -->
      <div class="flex items-start gap-2">
        <div class="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
        <div class="flex flex-col space-y-1">
          <div class="h-5 w-56 animate-pulse rounded-md bg-gray-300"></div>
          <div class="h-4 w-40 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>

      <!-- 使用者消息（右側） -->
      <div class="flex justify-end gap-2">
        <div class="flex flex-col items-end space-y-1">
          <div class="h-8 w-40 animate-pulse rounded-md bg-gray-300"></div>
          <div class="h-8 w-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>
        <div class="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
      </div>

      <!-- 系統再發一句（左側） -->
      <div v-for="index in 5" :key="index" class="flex items-start gap-2">
        <div class="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
        <div class="flex flex-col space-y-1">
          <div class="h-8 w-64 animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <div class="flex flex-col items-end space-y-1">
          <div class="h-8 w-40 animate-pulse rounded-md bg-gray-300"></div>
          <div class="h-8 w-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>
        <div class="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
      </div>
    </div>

    <!-- Chat Footer -->
    <div class="w-full border-t bg-white px-4 py-3">
      <!-- 中間輸入框（淺灰底 + 圓角） -->
      <div
        class="h-[100px] animate-pulse justify-start rounded-sm bg-gray-100 align-top"
      ></div>
      <div class="flex w-full justify-between gap-2 p-4">
        <!-- 左侧功能图标 -->
        <div class="flex items-center gap-1">
          <div
            v-for="index in 5"
            :key="index"
            class="h-6 w-6 animate-pulse rounded-full bg-gray-300"
          ></div>
        </div>

        <!-- 右侧发送按钮 -->
        <div
          class="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-gray-300"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.chatroom-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
}

.message-skeleton {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-skeleton.left {
  flex-direction: row;
  justify-content: flex-start;
}

.message-skeleton.right {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.avatar-skeleton {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
}

.bubble-skeleton {
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 12px;
}

/* shimmer animation */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  content: '';
  background: linear-gradient(
    to right,
    rgb(255 255 255 / 0%) 0%,
    rgb(255 255 255 / 50%) 50%,
    rgb(255 255 255 / 0%) 100%
  );
  animation: shimmer 1.5s infinite;
}
</style>
