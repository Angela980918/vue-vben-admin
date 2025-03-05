<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

import type { UnwrapRef } from 'vue';

import {
  nextTick,
  onBeforeMount,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';

import { useUserStore } from '@vben/stores';

import {
  FileImageOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue';
import {
  Button as AButton,
  Col as ACol,
  Flex as AFlex,
  Form as AForm,
  FormItem as AFormItem,
  Image as AImage,
  Tooltip as ATooltip,
  message,
} from 'ant-design-vue';

import { createTemplateApi, editTemplateApi } from '#/api';
import SelectInput from '#/components/templates/SelectInput.vue';
import { categoryMap, headerMap, languageMap, mediaMap } from '#/map';
import { useTemplateStore } from '#/store';

interface FormState {
  selectAccount: string;
  tempName: string;
  selectCategory: string;
  selectLanguage: string;
  selectHeader: string;
  titleContents: string;
  selectMedia: string;
  selectFile: string;
  editor: string;
  footer: string;
}

const formState: UnwrapRef<FormState> = reactive({
  selectAccount: '',
  tempName: '',
  selectCategory: '',
  selectLanguage: '',
  selectHeader: '',
  titleContents: '',
  selectMedia: '',
  selectFile: '',
  editor: '',
  footer: '',
});

const labelCol = { style: { width: '100px' } };

// 模板編輯原数据
const isUpdated = ref(false); // 可更新状态
const isPending = ref(false); // 审核状态
const isDisable = ref(false);
const TempStore = useTemplateStore();
const UserStore = useUserStore();

// 所有賬號
const allAccounts = ref(
  TempStore.selectOptions.filter(
    (item) => item.value !== UserStore.userInfo.id,
  ),
);

// 分類
const allCategory = ref<SelectProps['options']>(categoryMap);
// console.log('allCategory', allCategory.value);

// 語言
const allLanguage = ref<SelectProps['options']>(languageMap);

// 頂部類型
const allHeader = ref<SelectProps['options']>(headerMap);

// 媒體類型
const allMedia = ref<SelectProps['options']>(mediaMap);

// 上傳的文件
// const key = 'uploadFile';
// const uploadContent = ref('文件上传中');

// 表單
const formRef = ref();

watch(
  () => formState,
  (newValue, oldValue) => {
    // eslint-disable-next-line no-console
    console.log('formState newValue', newValue);
    // eslint-disable-next-line no-console
    console.log('formState oldValue', oldValue);
  },
  {
    deep: true,
  },
);
const rules: Record<string, Rule[]> = {
  selectAccount: [
    { required: true, message: '当前公司不能為空', trigger: 'blur' },
  ],
  tempName: [
    { required: true, message: '模板名稱不能為空', trigger: 'blur' },
    {
      pattern: /^[a-z0-9_]{1,512}$/,
      message: '模板名稱只能包含小寫字母和數字，且長度為1到512位',
      trigger: 'blur',
    },
  ],
  selectCategory: [
    { required: true, message: '分類不能為空', trigger: 'blur' },
  ],
  selectLanguage: [
    { required: true, message: '語言不能為空', trigger: 'blur' },
  ],
  selectHeader: [
    {
      required: true,
      message: '頂部類型必選，如果無頂部請選擇無',
      trigger: 'blur',
    },
  ],
  titleContents: [
    {
      required: true,
      message: '頂部為文本類型時，標題不能為空',
      trigger: 'blur',
    },
  ],
  selectMedia: [
    {
      required: true,
      message: '頂部為媒體類型時，附件類型必選',
      trigger: 'blur',
    },
  ],
  selectFile: [{ required: true, message: '請上傳文件', trigger: 'blur' }],
  editor: [{ required: true, message: '請輸入内容', trigger: 'blur' }],
  footer: [{ required: false, message: '請輸入底部', trigger: 'blur' }],
};

// 表單請求體轉換
const processFormData = (rwaData) => {
  const components = [];
  if (rwaData.selectHeader) {
    if (rwaData.selectHeader === 'TEXT') {
      components.push({
        text: rwaData.titleContents,
        format: 'TEXT',
        type: 'HEADER',
      });
    } else if (rwaData.selectHeader === 'MEDIA') {
      components.push({
        format: rwaData.selectMedia,
        type: 'HEADER',
        example: {
          header_url: [rwaData.selectFile],
        },
      });
    }
  }

  if (rwaData.footer) {
    components.push({
      text: rwaData.footer,
      type: 'FOOTER',
    });
  }

  components.push({
    type: 'BODY',
    text: rwaData.editor,
  });

  return {
    category: rwaData.selectCategory, // 类别
    name: rwaData.tempName, // 模板名称
    language: rwaData.selectLanguage, // 语言
    components, // 动态组件数组
  };
};

// 提交
const submitKey = 'submit';
const submitContent = ref('模板數據校驗中');
const onSubmit = async () => {
  message.loading({
    content: submitContent.value,
    key: submitKey,
    duration: 1,
  }); // 显示加载中的消息

  formRef.value
    .validate()
    .then(async () => {
      submitContent.value = '模板數據提交中';
      message.loading({
        content: submitContent.value,
        key: submitKey,
        duration: 2,
      }); // 显示加载中的消息
      // console.log('values', formState, toRaw(formState));
      const rawFormState = toRaw(formState);
      // console.log('rawFormState', rawFormState);

      const reqData = processFormData(rawFormState);
      try {
        await (isUpdated.value
          ? editTemplateApi(reqData)
          : createTemplateApi(reqData));
        message.success({
          content: '模板數據提交成功',
          key: submitKey,
          duration: 2,
        });
      } catch (apiError) {
        // console.log('error', error);
        message.error({
          content: apiError?.message?.trim() || '模板數據提交失敗',
          key: submitKey,
          duration: 2,
        });
      }
    })
    .catch((validationError) => {
      // eslint-disable-next-line no-console
      console.log('validationError', validationError);
      validationError.errorFields.forEach((item, index) => {
        message.error({ content: item.errors[0], duration: index + 1 });
      });
    });
};

// 重置表單的邏輯
const resetFields = () => {
  // 清空表單或重置數據邏輯
  if (isUpdated.value) {
    formState.selectHeader = '';
    formState.titleContents = '';
    formState.selectMedia = '';
    formState.selectFile = '';
    formState.editor = '';
    formState.footer = '';
  } else {
    nextTick(() => {
      formRef.value.resetFields();
    });
  }
};

const updateCreateTempData = async () => {
  const createTempData = TempStore.createTempData;
  formState.selectAccount = TempStore.createTempAccount;
  if (createTempData && Object.keys(createTempData).length > 0) {
    isUpdated.value = true;
    isDisable.value = true;
    formState.tempName = createTempData.name;
    formState.selectCategory = createTempData.category;
    formState.selectLanguage = createTempData.language;

    // 處理模板内容部分
    createTempData.components.forEach((component) => {
      switch (component.type) {
        case 'FOOTER': {
          formState.footer = component.text;
          break;
        }
        case 'HEADER': {
          if (component.format === 'TEXT') {
            formState.selectHeader = component.format;
            formState.titleContents = component.text;
          } else {
            formState.selectHeader = 'MEDIA';
            formState.selectMedia = component.format;
            formState.selectFile = component.example.header_url[0];
          }
          break;
        }
        default: {
          // console.warn(`Unhandled component type: ${component.type}`);
          break;
        }
      }
    });

    // 判斷是否為审核中
    if (createTempData.status === 'PENDING') {
      isPending.value = true;
      // console.log('isPending.value', isPending.value)
    }
  } else {
    isUpdated.value = false;
    isDisable.value = false;
    resetFields();
  }
};

watch(
  () => TempStore.createTempData,
  async () => {
    // eslint-disable-next-line no-console
    console.log('TempStore.createTempData', TempStore.createTempData);
    await updateCreateTempData();
  },
);

onBeforeMount(async () => {
  await updateCreateTempData();
});

onUnmounted(() => {
  TempStore.resetCreateTempData();
});
</script>
<template>
  <div class="h-full p-3">
    <div class="card-box h-full flex-col lg:flex">
      <AFlex justify="space-between" align="center">
        <div class="mt-5 px-3 lg:flex">
          <AForm
            :label-col="labelCol"
            layout="horizontal"
            style="min-width: 600px; max-width: 800px"
            ref="formRef"
            :rules="rules"
            :model="formState"
            :disabled="isPending"
          >
            <ACol span="10">
              <AFormItem label="当前公司" name="selectAccount">
                <SelectInput
                  type="select-common"
                  :select-options="allAccounts"
                  v-model="formState.selectAccount"
                  :disabled="isDisable || isPending"
                />
              </AFormItem>
            </ACol>

            <ACol span="16" class="align-middle">
              <AFormItem label="模板名稱" name="tempName">
                <SelectInput
                  class="w-full"
                  v-model="formState.tempName"
                  type="input-text"
                  :max-txt="512"
                  :disabled="isDisable || isPending"
                />
              </AFormItem>
            </ACol>

            <ACol span="10">
              <AFormItem label="分類" name="selectCategory">
                <SelectInput
                  type="select-common"
                  :select-options="allCategory"
                  v-model="formState.selectCategory"
                  :disabled="isDisable || isPending"
                />
              </AFormItem>
            </ACol>

            <ACol span="10">
              <AFormItem label="語言" name="selectLanguage">
                <SelectInput
                  type="select-common"
                  v-model="formState.selectLanguage"
                  :disabled="isDisable || isPending"
                  :select-options="allLanguage"
                />
              </AFormItem>
            </ACol>

            <ACol span="10">
              <AFormItem label="頂部" name="selectHeader">
                <SelectInput
                  type="select-common"
                  v-model="formState.selectHeader"
                  :disabled="isPending"
                  :select-options="allHeader"
                />
              </AFormItem>
            </ACol>

            <ACol span="12" v-if="formState.selectHeader !== 'NONE'">
              <ACol span="24" v-if="formState.selectHeader === 'TEXT'">
                <AFormItem label="文本標題" name="selectTitle">
                  <SelectInput
                    v-model="formState.titleContents"
                    :disabled="isPending"
                    type="input-text"
                    :max-txt="60"
                  />
                </AFormItem>
              </ACol>

              <ACol span="16" v-else-if="formState.selectHeader === 'MEDIA'">
                <AFormItem label="附件類型" name="selectMedia">
                  <SelectInput
                    v-model="formState.selectMedia"
                    type="select-common"
                    :select-options="allMedia"
                    :disabled="isPending"
                  />
                </AFormItem>
              </ACol>
            </ACol>

            <ACol span="24" v-if="formState.selectMedia">
              <AFormItem label="上傳" name="selectFile">
                <SelectInput
                  :upload-type="formState.selectMedia"
                  type="upload-file"
                  :disabled="isPending"
                  v-model="formState.selectFile"
                />
              </AFormItem>
            </ACol>

            <ACol span="24">
              <AFormItem label="内容" name="editor">
                <SelectInput
                  :input-contents="formState.editor"
                  v-model="formState.editor"
                  :disabled="isPending"
                  type="editor"
                />
              </AFormItem>
            </ACol>

            <ACol span="14">
              <AFormItem label="底部" name="footer">
                <SelectInput
                  v-model="formState.footer"
                  :select-value="formState.footer"
                  :disabled="isPending"
                  name="footer"
                  type="input-text"
                  :max-txt="60"
                />
              </AFormItem>
            </ACol>

            <ACol span="14">
              <AFormItem>
                <AFlex justify="center">
                  <ATooltip
                    :title="isPending ? '审核中禁止重复修改' : ''"
                    color="red"
                  >
                    <AButton type="primary" @click.prevent="onSubmit">
                      提交
                    </AButton>
                  </ATooltip>
                  <AButton style="margin-left: 10px" @click="resetFields">
                    清空
                  </AButton>
                </AFlex>
              </AFormItem>
            </ACol>
          </AForm>
        </div>

        <div class="phoneBox">
          <!-- 确保居中 -->
          <div class="phone">
            <div class="phoneTop"></div>
            <div class="phoneCenter">
              <div class="arrow"></div>
              <div class="content">
                <h6
                  class="contentHeader"
                  v-if="formState.selectHeader === 'TEXT'"
                >
                  {{ formState.titleContents }}
                </h6>
                <div
                  class="mediaCenter"
                  v-else-if="formState.selectHeader === 'MEDIA'"
                >
                  <div v-if="formState.selectMedia === 'IMAGE'">
                    <AFlex
                      v-if="formState.selectFile !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <AImage
                        height="100%"
                        width="100%"
                        :src="formState.selectFile"
                      />
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <FileImageOutlined style="font-size: 50px; color: #fff" />
                    </AFlex>
                  </div>
                  <div v-else-if="formState.selectMedia === 'VIDEO'">
                    <AFlex
                      v-if="formState.selectFile !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <iframe
                        :src="formState.selectFile"
                        style="width: 100%; height: 100%"
                      >
                      </iframe>
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <VideoCameraOutlined
                        style="font-size: 50px; color: #fff"
                      />
                    </AFlex>
                  </div>
                  <div v-else-if="formState.selectMedia === 'DOCUMENT'">
                    <AFlex
                      v-if="formState.selectFile !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <iframe
                        :src="formState.selectFile"
                        style="width: 100%; height: 130px"
                      >
                      </iframe>
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <FilePdfOutlined style="font-size: 50px; color: #fff" />
                    </AFlex>
                  </div>
                </div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="contentBody" v-html="formState.editor"></p>
                <p class="contentFooter">{{ formState.footer }}</p>
              </div>
            </div>
            <div class="phoneBottom"></div>
          </div>
        </div>
      </AFlex>
    </div>
  </div>
</template>

<style scoped>
.phoneBox {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: calc(100% - 616px);
  min-width: 320px;
  height: calc(100% - 120px);
  -webkit-box-pack: center;

  .phone {
    top: 74px;
    right: 92px;
    display: flex;
    flex-direction: column;
    min-height: 595px;
    max-height: 100%;

    .phoneTop {
      position: relative;
      bottom: -1px;
      flex-shrink: 0;
      width: 320px;
      height: 83px;
      background-image: url('https://app.salesmartly.com/img/phoneheader.4b8c90cf.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .phoneCenter {
      position: relative;
      box-sizing: border-box;
      width: 320px;
      height: calc(100% - 146px);
      min-height: 445px;
      padding: 18px 13px 9px;
      overflow-y: auto;
      background-color: rgb(232 224 213);
      border-right: 5.5px solid rgb(26 30 34);
      border-left: 5.5px solid rgb(26 30 34);

      .arrow {
        position: absolute;
        left: 7px;
        width: 0;
        height: 0;
        border-color: rgb(255 255 255) rgb(255 255 255) transparent transparent;
        border-style: solid;
        border-width: 3.5px;
        border-image: initial;
      }

      .content {
        padding: 8px;
        background-color: rgb(255 255 255);
        border-radius: 0 8px 8px;

        .contentHeader {
          margin: 0 0 4px;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0.0094em;
          word-break: break-word;
          white-space: break-spaces;
        }

        .contentBody {
          margin: 0;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: 0.0107em;
          word-break: break-word;
          white-space: break-spaces;
        }

        .contentFooter {
          margin: 4px 0 0;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: rgb(162 157 174);
          letter-spacing: 0.0094em;
          overflow-wrap: break-word;
        }
      }
    }

    .phoneBottom {
      position: relative;
      top: -1px;
      flex-shrink: 0;
      width: 320px;
      height: 63px;
      background-image: url('https://app.salesmartly.com/img/phonebottom.a32a8d85.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
