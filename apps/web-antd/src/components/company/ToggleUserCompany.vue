<!-- eslint-disable vue/no-mutating-props -->
<script lang="ts" name="ToggleUserCompany" setup>
import type { CompanyInfo } from '@vben/types';

import { ref } from 'vue';

interface Props {
  userId?: string;
  companiesList?: Array<CompanyInfo>;
  defaultComapny: CompanyInfo;
}

const { companiesList, defaultComapny } = defineProps<Props>();

const emits = defineEmits<{
  (e: 'update:companyId', payload: string): void;
}>();

const value = ref(defaultComapny.companyName);

function handleChange(value: string) {
  emits('update:companyId', value);
}
</script>

<template>
  <div class="ToggleUserCompany-container">
    <a-space direction="vertical">
      <a-select
        style="width: 300px"
        :field-names="{ label: 'companyName', value: 'companyId' }"
        v-model:value="value"
        :options="companiesList"
        @change="handleChange"
      />
    </a-space>
  </div>
</template>

<style scoped lang="scss"></style>
