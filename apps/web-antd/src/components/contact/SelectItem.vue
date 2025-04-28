<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import { ref } from 'vue';

import { FileOutlined } from '@ant-design/icons-vue';
import {
  Button as AButton,
  Image as AImage,
  Modal as AModal,
  Table as ATable,
} from 'ant-design-vue';

import { uploadMaterialApi } from '#/api';
import { useTemplateStore } from '#/store';

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  account: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['getSelected']);

const open = ref<boolean>(false);

const videoPlayer = ref(null);
const tempStore = useTemplateStore();
const type = ref(props.type);
const fileList = ref([]);
const startSelect = ref(null);
const selectType = ref('*/*');
const account = ref(props.account);

function getFileName(data) {
  return data.file_name;
}

function loadNewData() {
  switch (props.type) {
    case 'document': {
      fileList.value = tempStore.docList;
      selectType.value = '.pdf';
      break;
    }
    case 'image': {
      fileList.value = tempStore.imageList;
      selectType.value = 'image/*';
      break;
    }
    case 'video': {
      fileList.value = tempStore.videoList;
      selectType.value = 'video/*';
      break;
    }
  }
  // console.log("fileListfileList", fileList.value)
  type.value = props.type;
}

const columns: TableColumnsType = [
  { title: '素材', width: 100, dataIndex: 'path', key: 'path', fixed: 'left' },
  {
    title: '名稱',
    width: 100,
    dataIndex: 'fileName',
    key: 'fileName',
    fixed: 'left',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];

const selectOthers = () => {
  startSelect.value?.click();
};

// const data: DataItem[] = [];
// for (let i = 0; i < 100; i++) {
//     data.push({
//         key: i,
//         name: `Edrward ${i}`,
//         age: 32,
//         address: `London Park no. ${i}`,
//     });
// }videoPlayer

const showModal = (value?: string) => {
  open.value = !open.value;
  if (value) {
    account.value = value;
    loadNewData();
  }
};

// 選中已有素材
const clickFile = (value) => {
  emits('getSelected', value);
  showModal();
};

// 選中電腦其他文件
const selectOtherFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  const fileContent = files![0];

  //     上傳到臨時文件夾
  try {
    await uploadMaterialApi(
      fileContent!,
      'temp',
      props.type,
      account.value.length > 6
        ? { wabaId: account.value }
        : { userId: account.value },
    ).then((result) => {
      const newFile = {
        key: result?.id || '1',
        id: result?.id || '1',
        fileName: result?.file_name || fileContent.name,
        file_path: result?.file_path || '',
        file_type: props.type,
      };

      emits('getSelected', newFile);
    });
  } catch (error) {
    console.error('上傳過程中發生錯誤:', error);
  }
};

defineExpose({
  showModal: (value: string) => {
    showModal(value);
  },
});

const handleOk = () => {
  open.value = false;
};
</script>
<template>
  <div>
    <AModal
      v-model:open="open"
      width="600px"
      centered
      title="选择素材"
      @ok="handleOk"
      :footer="false"
    >
      <ATable
        :columns="columns"
        :data-source="fileList"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'path'">
            <!--                        {{ 'https://cos.jackycode.cn/'+ record.file_path}}-->
            <AImage
              v-if="type === 'image'"
              :src="`https://cos.jackycode.cn/${record.file_path}`"
            />

            <a
              :href="`https://cos.jackycode.cn/${record.file_path}`"
              v-else-if="props.type === 'document'"
              download
              target="_blank"
              style="
                display: flex;
                justify-content: center;
                width: 100px;
                padding: 15px;
                font-size: 50px;
                border-color: #0e0e0e0e;
                border-style: solid;
                border-width: 1px;
                border-radius: 10px;
              "
            >
              <FileOutlined style="color: #dcdcdc; cursor: pointer" />
            </a>

            <video
              v-else-if="type === 'video'"
              ref="videoPlayer"
              width="100%"
              controls
              class="mt-2"
            >
              <source
                :src="`https://cos.jackycode.cn/${record.file_path}`"
                type="video/mp4"
              />
            </video>
          </template>

          <template v-if="column.key === 'fileName'">
            <!--                        {{ 'https://cos.jackycode.cn/'+ record.file_path}}-->
            <span>
              {{ getFileName(record) }}
            </span>
          </template>

          <template v-if="column.key === 'operation'">
            <a @click="clickFile(record)">选择</a>
          </template>
        </template>
      </ATable>
      <AButton @click="selectOthers" type="primary"> 选择电脑文件 </AButton>
      <input
        :accept="selectType"
        type="file"
        style="display: none"
        ref="startSelect"
        @change="selectOtherFile"
      />
    </AModal>
  </div>
</template>
