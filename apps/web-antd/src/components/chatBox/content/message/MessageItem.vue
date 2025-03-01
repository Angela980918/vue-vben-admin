<script setup>
import { defineProps } from 'vue';

import {
  Avatar as AAvatar,
  ListItem as AListItem,
  ListItemMeta as AListItemMeta,
  Space as ASpace,
} from 'ant-design-vue';

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <AListItem v-if="props.item.position === 'inbound'">
    <ASpace size="middle" align="end">
      <AAvatar
        size="large"
        src="https://randomuser.me/api/portraits/women/7.jpg"
      />
      <AListItemMeta class="list-item-content" :description="props.item.time">
        <template #title>
          <span>{{ props.item.title }}</span>
        </template>
      </AListItemMeta>
    </ASpace>
  </AListItem>
</template>

<style scoped>
.list-item-left {
  justify-self: start;
  text-align: start;
}

.list-item-content {
  flex: unset;
  width: unset;
  min-width: 200px;
  padding: 8px;
  text-align: start;
  background: #fff;
  border-radius: 8px;
}
</style>
