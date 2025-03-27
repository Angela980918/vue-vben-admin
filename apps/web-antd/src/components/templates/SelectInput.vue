<script setup>
import {
  defineEmits,
  defineProps,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

import { useTabs } from '@vben/hooks';

import { UploadOutlined } from '@ant-design/icons-vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
// import TurndownService from "turndown";
// let turndownService = new TurndownService()
import {
  Button as AButton,
  Input as AInput,
  Select as ASelect,
  Upload as AUpload,
  message,
} from 'ant-design-vue';

import { uploadMaterialApi } from '#/api';
import { useTemplateStore } from '#/store';

import '@wangeditor/editor/dist/css/style.css';

const props = defineProps({
  // 名稱
  name: {
    type: String,
    default: '',
  },
  // 類型
  type: {
    type: String,
    default: '',
  },
  // 輸入字數限制
  maxTxt: {
    type: Number,
    default: 512,
  },
  value: {
    type: [String, Number],
    default: '',
  },
  // 可選項
  selectOptions: {
    type: Array,
    default: () => [],
  },
  // 上傳限制
  uploadMaxCount: {
    type: Number,
    default: 1,
  },
  // 上傳檔案類型
  uploadType: {
    type: String,
    default: 'image/*',
  },
  // 上傳檔案
  fileList: {
    type: Array,
    default: () => [],
  },
  // 文件地址
  fileUrl: {
    type: String,
    default: '',
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  inputContents: {
    type: String,
    default: '',
  },
  modelValue: { type: [String, Number, Array, Object], default: '' },
});

const emits = defineEmits(['update:modelValue']);

const tabs = useTabs();

const editorReady = ref(true);

// 上傳的文件
const fileListUrl = ref([]);
const fileUrl = ref(props.fileUrl); // 上傳文件返回地址
const key = 'uploadFile';
const uploadContent = ref('文件上傳中');
const inputContents = ref(props.inputContents);
const TempStore = useTemplateStore();
const route = useRoute();

// 富文本编辑器配置
const editorRef = ref(null);
const valueHtml =
  inputContents.value === ''
    ? ref('<p>請輸入內容</p>')
    : ref(props.inputContents);

watch(
  () => route.path,
  (to, from) => {
    if (from === '/market/create-template') {
      // console.log("fromfromfrom",from)
      tabs.closeTabByKey(from);
    }
  },
);
watch(
  () => inputContents.value,
  (newValue) => {
    // eslint-disable-next-line no-console
    console.log('inputContents', newValue);
  },
);

watch(
  () => props.inputContents,
  (newVal) => {
    // console.log(newVal)
    valueHtml.value = newVal || '<p>請輸入內容</p>';
  },
);
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
};
const editorConfig = {
  placeholder: '请输入内容...',
};

// 事件觸發
const handleChange = (value) => {
  const changeHandlers = {
    'input-text': () => emits('update:modelValue', value.target.value),
    'select-common': () => emits('update:modelValue', value),
    'upload-file': () => {
      emits('update:modelValue', fileUrl.value);
    },
    editor: () => {
      // console.log('handleChange - editor', valueHtml.value
      emits('update:modelValue', valueHtml.value);
    },
  };
  changeHandlers[props.type]?.();
};

const handleCreated = (editor) => {
  editorRef.value = editor;
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  nextTick(() => {
    const editor = editorRef.value;
    // eslint-disable-next-line no-console
    console.log('editor', editor);
    if (editor) {
      editor.destroy();
    }
  });
  // const editor = editorRef.value;
  // if (editor === undefined) return;
  // editor.destroy();
});

// 文檔類型限制
const fileType = ref('');
const uploadTxt = (uploadType) => {
  switch (uploadType) {
    case 'DOCUMENT': {
      fileType.value = '.pdf';
      return '(請上傳pdf附件)';
    }
    case 'IMAGE': {
      fileType.value = 'image/*';
      return '(請選擇圖片)';
    }
    case 'VIDEO': {
      fileType.value = 'video/*';
      return '(請選擇視頻)';
    }
    // No default
  }
};

// 文件上传
const customUpload = async (options) => {
  const { file, onSuccess } = options;
  // console.log('customUpload', file);
  message.loading({ content: () => uploadContent.value, key }); // 显示加载中的消息

  await uploadMaterialApi(file, 'temp', props.uploadType.toLowerCase(), {
    wabaId: TempStore.createTempAccount,
  }).then((response) => {
    fileUrl.value = `https://cos.jackycode.cn/${response.file_path}`;
    onSuccess(file);
    message.success({
      content: '文件上傳成功',
      key: 'upload-key',
      duration: 2,
    });
  });
};

// 清空上傳
const handleRemove = () => {
  fileUrl.value = '';
};
onBeforeMount(() => {
  if (TempStore.createTempData && TempStore.createTempData.components) {
    const bodyComponent = TempStore.createTempData.components.find(
      (component) => component.type === 'BODY',
    );
    if (bodyComponent) {
      valueHtml.value = bodyComponent.text;
    }
  }
});
</script>

<template>
  <template v-if="props.type === 'input-text'">
    <AInput
      :disabled="props.disabled"
      :maxlength="props.maxTxt"
      show-count
      :value="modelValue"
      @change="handleChange"
    />
  </template>

  <template v-else-if="props.type === 'select-common'">
    <ASelect
      :name="props.name"
      :value="modelValue"
      :options="props.selectOptions"
      :disabled="props.disabled"
      @change="handleChange"
    />
  </template>

  <template v-else-if="props.type === 'upload-file'">
    <AUpload
      v-model:file-list="fileListUrl"
      list-type="picture"
      :max-count="props.uploadMaxCount"
      :accept="fileType"
      :custom-request="customUpload"
      :on-remove="handleRemove"
      @change="handleChange"
    >
      <AButton>
        <UploadOutlined />
        {{ uploadTxt(props.uploadType) }}
      </AButton>
    </AUpload>
  </template>

  <template v-else-if="props.type === 'editor'">
    <div
      style="
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        border: 1px solid #ccc;
      "
    >
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :default-config="toolbarConfig"
        mode="default"
      />
      <Editor
        v-if="editorReady"
        style="
          box-sizing: border-box;
          width: 100%;
          height: 300px;
          overflow-y: hidden;
          word-break: break-word;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        "
        v-model="valueHtml"
        :default-config="editorConfig"
        @on-change="handleChange"
        @on-created="handleCreated"
      />
    </div>
  </template>
</template>

<style scoped></style>
