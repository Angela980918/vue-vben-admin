<script lang="ts" setup>
import type { Component } from 'vue';

import { computed, markRaw, ref, watch } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { MdiRoleIcon, MidAvatorIcon, MidRotateIcon } from '@vben/icons';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { storeToRefs, useAccessStore, useUserStore } from '@vben/stores';

import ModifyInformation from '#/components/company/ModifyInformation.vue';
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

const { getDefaultCompanyInfo, userProfile } = storeToRefs(userStore);

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
const modifyInformationRef = ref<InstanceType<typeof ModifyInformation> | null>(
  null,
);

const profileIcon = markRaw(MidAvatorIcon);
const refreshCompnayIcon = markRaw(MidRotateIcon);
interface MenuItem {
  handler?: () => void;
  icon?: Component;
  text: string;
}

const menusList = computed<MenuItem[]>(() => [
  {
    handler: () => {
      userStore.getUserCompanyies();
      modifyInformationRef.value?.showModal();
    },
    icon: refreshCompnayIcon,
    text: getDefaultCompanyInfo.value.name,
  },
  {
    icon: markRaw(MdiRoleIcon),
    text: userProfile?.value?.role || $t('page.layout.unknown-role'),
  },
  {
    icon: profileIcon,
    text: $t('page.layout.person-info'),
    handler: () => {},
  },
]);
</script>

<template>
  <div>
    <BasicLayout @clear-preferences-and-logout="handleLogout">
      <template #user-dropdown>
        <UserDropdown
          :avatar="userProfile?.head_img_url"
          :menus="menusList"
          :text="userProfile?.user_name"
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
    <ModifyInformation ref="modifyInformationRef" />
  </div>
</template>
