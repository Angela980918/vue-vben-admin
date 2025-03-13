<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import {ref, watch} from 'vue';

import {
  Divider as ADivider,
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  LayoutSider as ALayoutSider,
  Space as ASpace,
} from 'ant-design-vue';

import ChatRoom from '#/components/chatBox/content/chatRoom.vue';
import ChatBoxLeft from '#/components/chatBox/left/chatBox-Left.vue';
import ChatBoxRight from '#/components/chatBox/right/chatBox-right.vue';

const showRight = ref(false);
function setShowRight() {
  showRight.value = !showRight.value;
}

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 600,
  lineHeight: '120px',
  color: '#000',
};
</script>

<template>
  <div class="px-3; pt-3">
    <div class="card-box h-full flex-col lg:flex">
      <ASpace direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
        <ALayout>
          <ChatBoxLeft
            style="
              display: flex;
              flex-direction: column;
              height: calc(100vh - 134.1px);
            "
          />
          <ADivider
            type="vertical"
            style="height: calc(100vh - 134.1px); margin: unset"
          />
          <ALayout>
            <!--            <ALayoutContent style="text-align: center; min-height: 600px; line-height: 120px; color: #000">-->
            <ALayoutContent :style="contentStyle">
              <ChatRoom @set-show-right="setShowRight" />
            </ALayoutContent>
            <ALayoutSider
              v-if="showRight"
              width="400"
              style="background: #fff; border-left: 1px solid #f0f0f0"
            >
              <ChatBoxRight />
            </ALayoutSider>
          </ALayout>
        </ALayout>
      </ASpace>
    </div>
  </div>
</template>

<style scoped></style>
