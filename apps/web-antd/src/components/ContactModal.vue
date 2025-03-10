<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';

import {nextTick, reactive, ref, toRaw, watch} from 'vue';

import {
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  Modal as AModal,
  Select as ASelect,
  SelectOption as ASelectOption,
} from 'ant-design-vue';

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  isCreate: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(['createContact', 'updateContact']);
const open = ref<boolean>(false);
// 创建 or 更新
const createVal = ref(props.isCreate);
const formRef = ref();

// 表單
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };

const formState = reactive({
  nickname: '',
  countryCode: undefined,
  phoneNumber: '',
  email: '',
});

const rules: Record<string, Rule[]> = {
  nickname: [
    { required: true, message: '請填寫名稱', trigger: 'change' },
    { min: 2, message: '名稱需要大於兩個字', trigger: 'blur' },
  ],
  countryCode: [{ required: true, message: '請選擇地區', trigger: 'change' }],
  phoneNumber: [{ required: true, message: '請填寫電話', trigger: 'change' }],
};

const getPhoneHeader = (region) => {
  const phoneHead = {
    HK: '+852',
    US: '+1',
    CN: '+86',
  };
  return phoneHead[region];
};

// 移除
const resetForm = () => {
  formRef.value.resetFields();
};

// 提交
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      if (createVal.value) {
        emits('createContact', toRaw(formState));
        resetForm();
      } else {
        emits('updateContact', toRaw(formState));
        resetForm();
      }
    })
    .catch((error) => {
      return error;
    });
};

const showModal = (create?: boolean) => {
  nextTick(() => {
    if(create) {
      formRef.value.resetFields();
    }
  });
  open.value = !open.value;
};

watch(
  () => formState.countryCode,
  (newValue) => {
    if (createVal.value) {
      formState.phoneNumber = getPhoneHeader(newValue);
    }
  },
);

watch(
  () => props.formData,
  (newValue) => {
    Object.assign(formState, newValue);
  },
  { deep: true },
);

watch(
  () => props.isCreate,
  (newValue) => {
    createVal.value = newValue;
  },
  { deep: true },
);

defineExpose({
  showModal: (create?: boolean) => {
    showModal(create);
  },
});
</script>
<template>
  <div>
    <AModal
      v-model:open="open"
      title="客戶信息"
      @ok="onSubmit"
      @cancel="resetForm"
    >
      <AForm
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        style="padding: 10px"
      >
        <AFormItem label="名稱" name="nickname">
          <AInput v-model:value="formState.nickname" />
        </AFormItem>
        <AFormItem label="選擇地區" name="countryCode">
          <ASelect v-model:value="formState.countryCode" placeholder="請選擇">
            <ASelectOption value="HK">中國香港</ASelectOption>
            <ASelectOption value="CN">中國內地</ASelectOption>
            <ASelectOption value="US">美國</ASelectOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="电话" name="phoneNumber">
          <AInput v-model:value="formState.phoneNumber" />
        </AFormItem>
        <AFormItem label="電郵" name="email">
          <AInput v-model:value="formState.email" />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>
