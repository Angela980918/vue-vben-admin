<script lang="ts" setup name="wangeditor">
import type { UploadFile } from 'ant-design-vue';

import type { PropType } from 'vue';

import { defineProps, nextTick, onBeforeUnmount, ref, shallowRef } from 'vue';

import { SearchOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {
  Button as AButton,
  Input as AInput,
  Select as ASelect,
  Upload as AUpload,
} from 'ant-design-vue';

import '@wangeditor/editor/dist/css/style.css';

interface EmitChangeEvent {
  (e: 'handleChange', value: string | string[] | UploadFile[]): void;
}

const props = defineProps({
  name: {
    type: String,
    default: 'name',
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  require: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String as PropType<
      | 'editor'
      | 'input-text'
      | 'search'
      | 'select-common'
      | 'select-multiple'
      | 'upload-file'
    >,
    default: 'search',
  },
  selectItem: {
    type: [String, Array] as PropType<any[] | string>,
    default: '',
  },
  fileItem: {
    type: [String, Array] as PropType<string | UploadFile[]>,
    default: () => [],
  },
  searchContents: {
    type: String,
    default: '',
  },
  inputContents: {
    type: String,
    default: '',
  },
  maxTxt: {
    type: Number,
    default: 500,
  },
  uploadType: {
    type: String as PropType<'.pdf' | 'audio/*' | 'image/*' | 'video/*'>,
    default: 'image/*',
  },
  disabled: {
    // 禁用狀態
    type: Boolean,
    default: false,
  },
});

// 事件
const emits = defineEmits<EmitChangeEvent>();

// Refs
const selectItem = ref<string | string[]>(props.selectItem);
const fileItem = ref(props.fileItem);
const selectOptions = ref(props.options);
const searchContents = ref<string>(props.searchContents);
const inputContents = ref<string>(props.inputContents);
const fileList = ref<Array<File | string>>([]);

// 处理文件项初始化
if (typeof fileItem.value === 'string') {
  // console.log('fileItem.value', fileItem.value)
  fileItem.value = [fileItem.value];
}

// 富文本编辑器配置
const editorRef = shallowRef();
const valueHtml =
  inputContents.value === ''
    ? ref('<p>請輸入內容</p>')
    : ref(props.inputContents);
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
};
const editorConfig = {
  placeholder: '请输入内容...',
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
});

const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

const uploadTxt = () => {
  switch (props.uploadType) {
    case '.pdf': {
      return '(請上傳pdf附件)';
    }
    case 'audio/*': {
      return '(請選擇音頻)';
    }
    case 'image/*': {
      return '(請選擇圖片)';
    }
    case 'video/*': {
      return '(請選擇視頻)';
    }
  }
};
const handleChange = (value: any) => {
  switch (props.type) {
    case 'editor': {
      emits('handleChange', valueHtml.value);

      break;
    }
    case 'input-text': {
      emits('handleChange', inputContents.value);

      break;
    }
    case 'search': {
      emits('handleChange', searchContents.value);

      break;
    }
    case 'upload-file': {
      fileList.value = [value as File];
      emits('handleChange', fileList.value);
      return false;
    }
    default: {
      emits('handleChange', selectItem.value);
    }
  }
};

// editorRef.value!.addEventListener('click', () => {
//   // console.log("test")
// });
</script>

<template>
  <div
    :style="{
      'flex-direction': props.direction === 'vertical' ? 'column' : 'row',
      'align-items': props.direction === 'vertical' ? 'flex-start' : 'center',
      width:
        props.type === 'editor' || props.type === 'upload-file' ? '100%' : '',
    }"
    class="selectCard flex w-full"
  >
    <span
      class="selectCardTitle"
      :class="{
        selectTitle: props.require,
      }"
      :style="{
        'margin-bottom': props.direction === 'vertical' ? '12px' : 0,
      }"
      v-if="props.title"
      >{{ props.title }}
    </span>

    <template v-if="props.type === 'search'">
      <AInput
        :name="props.name"
        v-model:value="searchContents"
        allow-clear
        style="flex-grow: 1; width: 100%"
        @change="handleChange"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </AInput>
    </template>

    <template v-else-if="props.type === 'select-common'">
      <ASelect
        class="w-full"
        :name="props.name"
        v-model:value="selectItem"
        @change="handleChange"
        :options="selectOptions"
        :disabled="props.disabled"
      />
    </template>

    <template v-else-if="props.type === 'select-multiple'">
      <ASelect
        :name="props.name"
        v-model:value="selectItem"
        @change="handleChange"
        mode="multiple"
        placeholder="請選擇"
        style="flex-grow: 1; width: 100%"
        :options="selectOptions"
      />
    </template>

    <template v-else-if="props.type === 'input-text'">
      <AInput
        :name="props.name"
        v-model:value="inputContents"
        show-count
        @change="handleChange"
        :disabled="props.disabled"
        :maxlength="props.maxTxt"
      />
    </template>

    <template v-else-if="props.type === 'upload-file'">
      <AUpload
        :max-count="1"
        :name="props.name"
        v-model:file-list="fileItem"
        :before-upload="handleChange"
        :accept="uploadType"
        action="https://whatsapp.jackycode.cn/cos/upload"
      >
        <AButton>
          <UploadOutlined />
          選擇文件
        </AButton>
      </AUpload>
      <span style="font-size: 14px; color: #808695">{{ uploadTxt() }}</span>
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
  </div>
</template>

<style scoped>
.selectCard {
  display: flex;
  max-width: 100%;
  padding: 0 12px;
}

.selectCardTitle {
  flex-grow: 0;
  padding-right: 10px;
  font-size: 16px;
  white-space: nowrap;
}

.selectTitle::before {
  margin-right: 5px;
  color: red;
  content: '*';
}
</style>
