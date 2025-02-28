<script lang="ts" setup>
import { computed } from 'vue';

import {
  Avatar as AAvatar,
  Badge as ABadge,
  Collapse as ACol,
  Flex as AFlex,
  Row as ARow,
} from 'ant-design-vue';

import { formatTime } from '#/utils/common';
// 传参
const props = defineProps({
  name: {
    type: String,
    default: 'Jacky',
    require: true,
  },
  time: {
    type: String,
    default: '',
    require: true,
  },
  message: {
    type: String,
    default: '',
  },
  badgeCount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#000',
  },
});

// 随机颜色
// const generateRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// const avatarColor = generateRandomColor();
// 时间处理格式
const formattedTime = computed(() => {
  return formatTime(props.time);
});

// 当前时间
const currentTime = computed(() => {
  return new Date().toISOString();
});

// 获取用户头像的首位字母或字
const getAvatarText = (name: string) => {
  // 使用正则表达式过滤掉数字，只取字母或汉字
  const filteredName = name.replaceAll(/\d/g, ''); // 移除数字
  return filteredName.charAt(0).toUpperCase(); // 获取第一个非数字字母或汉字
};
const avatarText = computed(() => getAvatarText(props.name));
</script>

<template>
  <ARow style="width: 100%">
    <ACol style="align-self: center; padding: 10px 0" :span="5">
      <AFlex align="center" justify="center">
        <AAvatar size="large" :style="{ backgroundColor: props.color }">
          {{ avatarText }}
        </AAvatar>
      </AFlex>
    </ACol>
    <ACol :span="18" style="align-self: center">
      <ARow style="width: 100%">
        <ACol :span="12">
          <AFlex justify="flex-star">{{ props.name }}</AFlex>
        </ACol>
        <ACol :span="12">
          <AFlex justify="flex-end">{{ formattedTime || currentTime }}</AFlex>
        </ACol>
        <ACol :span="24" style="padding-top: 3px">
          <AFlex justify="space-between">
            <span class="single-line-text">{{ props.message }}</span>
            <ABadge :count="props.badgeCount" />
          </AFlex>
        </ACol>
      </ARow>
    </ACol>
  </ARow>
</template>

<style scoped>
.single-line-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
