<script lang="ts" name="ModifyInformation" setup>
import type { CompanyInfo } from '@vben/types';

import { computed, onMounted, ref } from 'vue';

import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { reqUserSelectCompany } from '#/api/common';

import ToggleUserCompany from './ToggleUserCompany.vue';

const open = ref(false);
const showModal = () => {
  open.value = true;
};

defineExpose({
  showModal,
});

const userStore = useUserStore();
const { userProfile, companies } = storeToRefs(userStore);
const companiesList = computed<CompanyInfo[]>(() => {
  return companies.value.map((company) => {
    return {
      companyId: company.id,
      companyName: company.name,
    };
  });
});

const currentSelectCompanyId = ref<null | string>(null);
const handleOk = async () => {
  open.value = false;
  if (currentSelectCompanyId.value) {
    reqUserSelectCompany(currentSelectCompanyId.value).then(
      ({ user, message: SuccessMessage }) => {
        userStore.$patch({
          userProfile: {
            company_id: user.company_id,
            company_name: user.company_name,
          },
        });
        message.success(SuccessMessage);
      },
    );
  }
};
const defaultCompany = computed<CompanyInfo>(() => {
  return {
    companyId: userProfile?.value?.company_id || '',
    companyName: userProfile?.value?.company_name || '',
  };
});

function handleChangeCompnayId(value: string) {
  currentSelectCompanyId.value = value;
}
onMounted(() => {
  userStore.getUserCompanyies();
});
</script>

<template>
  <a-modal
    v-model:open="open"
    width="400px"
    :title="$t('page.layout.toggle-company')"
    @ok="handleOk"
    class="[&_.ant-modal-body]:flex [&_.ant-modal-body]:justify-center"
  >
    <ToggleUserCompany
      @update:company-id="handleChangeCompnayId"
      :companies-list="companiesList"
      :default-comapny="defaultCompany"
      :user-id="userProfile?.id"
    />
  </a-modal>
</template>
