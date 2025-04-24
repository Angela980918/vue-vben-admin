<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';

import { computed, ref, watchEffect } from 'vue';

import {
  Button as AButton,
  Select as ASelect,
  Table as ATable,
} from 'ant-design-vue';

// import {useTempStore} from "@/store/useTempStore";
// import QuickMsg from "@/components/contact/QuickMsg.vue";
import QuickMsg from '#/components/contact/QuickMsg.vue';
import { useTemplateStore } from '#/store';
import { storeToRefs, useUserStore } from '@vben/stores';
import type { LibraryFilesParams } from '@vben/types';

// 弹窗信息&控制
const quickRef = ref(null);
const fileArray = ref([]);
const fileContent = ref(null);
const msgName = ref(null);

const templateStore = useTemplateStore();

const size = ref<SelectProps['size']>('middle');
const options = computed(() => templateStore.selectOptions);
const selectValue = ref(options.value[0].value);

// table
interface DataItem {
  _id: string;
  title: string;
  content: string;
  owner_type: string;
  owner_id: string;
  createTime: string;
  attachments: object[];
}

const columns = [
  {
    title: '快捷消息',
    dataIndex: 'title',
    width: '30%',
  },
  {
    title: '消息內容',
    dataIndex: 'content',
  },
  {
    title: '創建時間',
    dataIndex: 'createTime',
  },
  {
    title: '預覽',
    dataIndex: 'operation',
  },
];
// const data = ref<DataItem[]>([]);
const data = computed<DataItem[]>(() => templateStore.getQuickMsg);

// 预览 & 新增 方法
const checkMsg = (data) => {
  fileArray.value = data.attachments;
  fileContent.value = data.content;
  msgName.value = data.title;
  checkCos();
  quickRef.value.setOpen(selectValue.value, true);
};

const addQuickMsg = () => {
  fileContent.value = '';
  fileArray.value = [];
  msgName.value = '';
  checkCos();
  quickRef.value.setOpen(selectValue.value, false);
};

// 检索素材库
async function checkCos() {
  /* 
  let source = '';
  source =
    selectValue.value.length > 6
      ? `queryType=material&wabaId=${selectValue.value}`
      : `queryType=material&userId=${selectValue.value}`; 
  */

  const sourceParams: LibraryFilesParams =
    selectValue.value.length > 6
      ? {
          queryType: 'material',
          wabaId: selectValue.value,
        }
      : {
          queryType: 'material',
          userId: selectValue.value,
        };
  templateStore.setMaterialListData(sourceParams);
}

async function loadNewQuickMsg(value: string) {
  templateStore.loadQuickMsg(value);
}
const { currentWabaId } = storeToRefs(useUserStore());
watchEffect(() => {
  if (currentWabaId?.value) {
    loadNewQuickMsg(currentWabaId.value);
  }
});

// onMounted(() => {
//   data.value = templateStore.getQuickMsg;
// })
</script>
<template>
  <div class="Container">
    <!--        快捷回复预览 OR 创建-->
    <QuickMsg
      :show-quick-list="false"
      ref="quickRef"
      :file-array="fileArray"
      :file-content="fileContent"
      :msg-name="msgName"
    />

    <AButton
      class="editable-add-btn"
      style="margin-bottom: 8px"
      @click="addQuickMsg"
    >
      Add
    </AButton>

    <ASelect
      v-model:value="selectValue"
      :size="size"
      style="width: 200px; padding-left: 15px"
      :options="options"
      @change="loadNewQuickMsg"
    />

    <ATable bordered :data-source="data" :columns="columns">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a @click="checkMsg(record)">查看</a>
        </template>
      </template>
    </ATable>
  </div>
</template>
<style lang="less" scoped>
.Container {
  padding: 20px;
}

.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
