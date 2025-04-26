<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  LayoutSider as ALayoutSider,
  Space as ASpace,
  message,
} from 'ant-design-vue';

import ChatRoom from '#/components/chatBox/content/chatRoom.vue';
import ChatBoxLeft from '#/components/chatBox/left/chatBox-Left.vue';
import ChatBoxRight from '#/components/chatBox/right/chatBox-right.vue';
import { useChatStore } from '#/store';
import ToggleCompanyCarousel from '#/components/company/ToggleCompanyCarousel.vue';

const chatStore = useChatStore();

const showRight = ref(false);
const setShowRight = () => {
  if (chatStore.getCurrentChatId === undefined) {
    message.warn('未選中客戶!');
  } else {
    showRight.value = !showRight.value;
  }
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 600,
  lineHeight: '120px',
  color: '#000',
  height: 'calc(100% - 134.1px - 50px )',
};

type MyToggleCompanyCarouselInstance = InstanceType<
  typeof ToggleCompanyCarousel
>;

type CompanieslistProp =
  MyToggleCompanyCarouselInstance['$props']['companiesList'];

const userStore = useUserStore();
const companiesList = computed<CompanieslistProp>(() => {
  return (
    userStore.companies.map((item) => {
      return {
        companyId: item.id,
        companyName: item.name,
        companyLogo: item.logo,
        companyWabaInfo: item.waba_accounts[0],
      };
    }) || []
  );
});
/**
 * 此處調整大小
 */
const CompanyCarouselHeight = 30;
const isActivatePureWhite = true;
</script>

<template>
  <div class="px-1 py-1">
    <div class="card-box h-full flex-col lg:flex">
      <ToggleCompanyCarousel
        :height="CompanyCarouselHeight"
        :companies-list="companiesList"
        :activate-pure-white="isActivatePureWhite"
      />
      <ASpace direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
        <ALayout>
          <ChatBoxLeft
            :style="`display: flex; flex-direction: column;
          height: calc(100vh - 134.1px - ${CompanyCarouselHeight}px);`"
          />
          <ADivider
            type="vertical"
            :style="`height: calc(100vh - 134.1px - ${CompanyCarouselHeight}px); margin: unset`"
          />
          <ALayout>
            <!--            <ALayoutContent style="text-align: center; min-height: 600px; line-height: 120px; color: #000">-->
            <ALayoutContent :style="contentStyle">
              <ChatRoom @set-show-right="setShowRight" />
            </ALayoutContent>
            <ALayoutSider
              v-if="showRight"
              width="400"
              :style="`background: #fff; border-left: 1px solid #f0f0f0; height: calc(100vh - 134.1px - ${CompanyCarouselHeight}px);`"
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
