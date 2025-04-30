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

import ChatBoxLeft from '#/components/chatBox/left/chatBox-Left.vue';
import ChatBoxRight from '#/components/chatBox/right/chatBox-right.vue';
import { useChatStore } from '#/store';
import ToggleCompanyCarousel from '#/components/company/ToggleCompanyCarousel.vue';
import { useInitCommonDataBeforeEnterRoute } from '#/hooks/useInit';
import { $t } from '@vben/locales';
import ChatRoom from '#/components/chatBox/content/chatRoom.vue';
import ChatroomSkeleton from '#/components/skeleton/chatroomSkeleton.vue';

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
type toggleCompanyCallbackProp =
  MyToggleCompanyCarouselInstance['$props']['onToggleCompany'];

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
 * 是否顯示聊天室
 */
const isShowChatRoom = ref(true);

const toggleCompanyCallback: toggleCompanyCallbackProp = async (
  currentIndex: number,
) => {
  // 獲取當前選擇公司的id
  const wabaInfo = companiesList.value[currentIndex]?.companyWabaInfo;
  // 獲取公司的waba賬號優選選擇第一個
  if (wabaInfo) {
    // 設置新的wabaid和apiKey
    userStore.setCurrentWabaId(wabaInfo.waba_id);
    userStore.setYcouldApiKey(wabaInfo.api_key);
    // 显示加载中提示
    message.loading({
      content: $t('page.chat.tips.3'),
      key: 'switchCompany',
      duration: 0, // 不自动关闭
    });
    isShowChatRoom.value = false; // 切換公司后，隱藏聊天室
    // 重新獲取全部的初始數據
    try {
      await useInitCommonDataBeforeEnterRoute();
      // 成功后更新为成功提示
      message.success({
        content: $t('page.chat.tips.2', {
          name: $t('page.routermenu.company.name'),
        }),
        key: 'switchCompany',
      });

      isShowChatRoom.value = true; // 切換公司后，顯示聊天室
      // 顯示蒙版
    } catch (error) {
      // 出错时关闭提示，并给出错误信息
      message.error({
        content: '公司切換失敗，請重試',
        key: 'switchCompany',
      });
      console.error('切换公司出错：', error);
    }
  }
};

/**
 * 此處調整大小,是否啟用純白色
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
        :on-toggle-company="toggleCompanyCallback"
        :default-company-id="userStore.getCurrentCompanyId"
      />
      <ASpace direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
        <ALayout>
          <ChatBoxLeft :is-show="isShowChatRoom" />
          <ADivider
            type="vertical"
            :style="`height: calc(100vh - 134.1px - ${CompanyCarouselHeight}px); margin: unset`"
          />
          <ALayout>
            <!--            <ALayoutContent style="text-align: center; min-height: 600px; line-height: 120px; color: #000">-->
            <ALayoutContent :style="contentStyle">
              <ChatRoom v-if="isShowChatRoom" @set-show-right="setShowRight" />
              <template v-else>
                <ChatroomSkeleton />
              </template>
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
