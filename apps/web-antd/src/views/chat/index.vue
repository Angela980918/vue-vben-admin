<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import {
  Divider as ADivider,
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  Space as ASpace,
} from 'ant-design-vue';

import ChatBoxLeft from '#/components/chatBox/left/chatBox-Left.vue';
// import { getWhatsAppUserInfo } from '#/api';
// const tempStore = useTemplateStore();
// const chatStore = useChatStore();
// const custmerStore = useCustomerStore();

// onMounted(async () => {
//   // await authStore.fetchUserInfo();
//   await tempStore.loadTemplates();
//   // await getWhatsAppUserInfo().then((result) => result);
//   // await tempStore.loadQuickMsg();
//   // await tempStore.setMaterialListData('wabaId=449711484896804');
//   await custmerStore.setContactList();
// });
const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: '600px',
  lineHeight: '120px',
  color: '#000',
};
</script>

<template>
  <div class="p-5">
    <div class="card-box p-4 py-6 lg:flex">
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
              <!--              <chat-room @setShowRight="setShowRight">-->
              <!--              </chat-room>-->
            </ALayoutContent>
            <!--            <ALayoutSider v-if="showRight" width="400" style="background: #fff; border-left: 1px solid #f0f0f0">-->
            <!--&lt;!&ndash;              <chat-box-right  />&ndash;&gt;-->
            <!--            </ALayoutSider>-->
          </ALayout>
        </ALayout>
      </ASpace>
    </div>
  </div>
</template>

<style scoped></style>
