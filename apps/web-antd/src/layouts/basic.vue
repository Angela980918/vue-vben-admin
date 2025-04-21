<script lang="ts" setup>
import { computed, markRaw, watch } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { MidCompanyChat } from '@vben/icons';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { storeToRefs, useAccessStore, useUserStore } from '@vben/stores';

import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
// const showDot = computed(() =>
//   notifications.value.some((item) => !item.isRead),
// );

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

const { getDefaultCompanyInfo } = storeToRefs(userStore);

async function handleLogout() {
  await authStore.logout(false);
}

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
const iconComponent = markRaw(MidCompanyChat);
const menusList = computed(() => [
  {
    handler: () => {},
    icon: iconComponent,
    text: getDefaultCompanyInfo.value.name,
  },
]);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus="menusList"
        :text="userStore.userInfo?.realName"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <!--    <template #notification>-->
    <!--      <Notification-->
    <!--        :dot="showDot"-->
    <!--        :notifications="notifications"-->
    <!--        @clear="handleNoticeClear"-->
    <!--        @make-all="handleMakeAll"-->
    <!--      />-->
    <!--    </template>-->
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
