<template>
  <div class="Container">
<!--        快捷回复预览 OR 创建-->
      <QuickMsg :showQuickList="false" ref="quickRef" :fileArray="fileArray" :fileContent="fileContent" :msgName="msgName"/>

      <AButton class="editable-add-btn" style="margin-bottom: 8px" @click="addQuickMsg">Add</AButton>

      <ASelect
        v-model:value="selectValue"
        :size="size"
        style="width: 200px;padding-left: 15px;"
        :options="options"
        @change="loadNewQuickMsg"
      ></ASelect>

      <ATable bordered :data-source="data" :columns="columns">
          <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'operation'">
                  <a @click="checkMsg(record)">查看</a>
              </template>
          </template>
      </ATable>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, computed} from 'vue';
import { useTemplateStore } from '#/store';
// import {useTempStore} from "@/store/useTempStore";
// import QuickMsg from "@/components/contact/QuickMsg.vue";
import QuickMsg from '#/components/contact/QuickMsg.vue';
import {
  Button as AButton,
  Table as ATable,
  Select as ASelect
} from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue';

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
  fileArray.value = data.attachments
  fileContent.value = data.content
  msgName.value = data.title
  checkCos();
  quickRef.value.setOpen(selectValue.value);
}

const addQuickMsg = () => {
  fileContent.value = "";
  fileArray.value = [];
  msgName.value = "";
  checkCos();
  quickRef.value.setOpen(selectValue.value);
}

// 检索素材库
async function checkCos() {
  let source = "";
  if(selectValue.value.length > 6) {
      source = "queryType=material&wabaId=" + selectValue.value;
  }else {
      source = "queryType=material&userId=" + selectValue.value;
  }
  templateStore.setMaterialListData(source);
}

async function loadNewQuickMsg(value: string) {
  templateStore.loadQuickMsg(value);
}

// onMounted(() => {
//   data.value = templateStore.getQuickMsg;
// })

</script>
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
