<script lang="ts" setup>
import type { ColumnType } from 'ant-design-vue/es/table';

import type { ContactInfo } from '@vben/types';

import {computed, nextTick, reactive, ref, watch} from 'vue';
import { SyncOutlined } from "@ant-design/icons-vue";
import {
  Button as AButton, message,
  Modal as AModal,
  Table as ATable,
  Tag as ATag,
  Tooltip as ATooltip,
} from 'ant-design-vue';

import { createContactApi, deleteContactApi, updateContactApi } from '#/api';
import ContactModal from '#/components/ContactModal.vue';
import { countryNameMap } from '#/map';
import { useCustomerStore } from '#/store/customerStore';
import { formatDate } from '#/tools';
import { getLabel } from '#/utils/common';

// 表格欄位定義
interface TableItem {
  createTime: string;
}

interface ContactModalInstance {
  showModal: () => void;
}

type Key = number | string;
const formData = ref({});
const customerStore = useCustomerStore();

const data = computed(() => customerStore.contactList);

// 選擇item
const state = reactive<{
  loading: boolean;
  selectedRowKeys: Key[];
}>({
  selectedRowKeys: [],
  loading: false,
});

// 按鈕狀態
const isCreate = ref(true);
const isDelete = ref(false);
const showDelete = ref(false);
const deleteData = ref<string[]>([]);
const showContact = ref<ContactModalInstance | null>(null);
const hasSelected = computed(() => state.selectedRowKeys.length > 0);

// 表格參數
const pagination = computed(() => {
  return {
    current: 1,
    pageSize: 10,
    total: customerStore.total,
    onChange: (page: number) => {
      showDelete.value = false;
      isDelete.value = false;
      state.selectedRowKeys = [];
      pagination.value.current = page;
      // customerStore.changeContactList(page);
    },
  };
});

const columns: ColumnType<TableItem>[] = [
  {
    key: 1,
    title: '客户名稱',
    dataIndex: 'nickname',
    fixed: 'left' as const,
  },
  {
    key: 2,
    title: '聯繫客服邮箱',
    dataIndex: 'ownerEmail',
  },
  {
    key: 3,
    title: '標籤',
    dataIndex: 'tags',
  },
  {
    key: 4,
    title: '地區',
    dataIndex: 'countryName',
  },
  {
    key: 5,
    title: '電郵',
    dataIndex: 'email',
    width: '10%',
  },
  {
    key: 6,
    title: '手機號碼',
    dataIndex: 'phoneNumber',
  },
  {
    key: 7,
    title: '最近聯繫客服',
    dataIndex: 'lastMessageToPhoneNumber',
    width: '10%',
  },
  {
    key: 8,
    title: '建立時間',
    dataIndex: 'createTime',
    sorter: (a: TableItem, b: TableItem) => {
      const timeA = a.createTime ? new Date(a.createTime).getTime() : 0;
      const timeB = b.createTime ? new Date(b.createTime).getTime() : 0;
      return timeA - timeB;
    },
  },
  {
    key: 9,
    title: '最近聯繫時間',
    dataIndex: 'lastSeen',
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
  },
];

// 更新筛选方法
// const dataFilter = () => {
//   filterData.value = data.value.filter((item) => {
//     return (
//       // ... 其他筛选条件
//       selectCountry.value.length === 0 ||
//       selectCountry.value.some((c) => c.value === item.countryCode)
//     );
//   });
// };

// 国家地区
// const selectCountry = ref([]);
// const allCountry = ref<SelectProps['options']>(countryNameMap);
const getCountryLabel = (countryCode: string) =>
  getLabel(countryNameMap, countryCode);

// CheckBox選擇狀態改變
const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

// 聯繫人操作(增、更新、刪)
const startCreate = () => {
  state.loading = true;
  isCreate.value = true;
  if (!showContact.value) return;
  showContact.value.showModal(true);

  setTimeout(() => {
    state.loading = false;
    state.selectedRowKeys = [];
  }, 1000);
};

const createContact = async (value: any) => {
  createContactApi(value).then((result: ContactInfo) => {
    setTimeout(() => {
      customerStore.contactOperate(isCreate.value, result);
    }, 1000);
    showContact.value!.showModal();
    message.success('新增聯繫人成功')
  });
};

const updateContact = async (value: any) => {
  await updateContactApi(value).then((result: ContactInfo) => {
    customerStore.contactOperate(isCreate.value, result);
    isCreate.value = false;
    showContact.value!.showModal();
    message.success('修改聯繫人成功')
  });
};

const setShowDelete = () => {
  deleteData.value = [];
  state.selectedRowKeys.forEach((item: Key) => {
    const index = data.value.findIndex((value) => value.id === item);
    const nickname = data.value?.[index]?.nickname;
    if (index !== -1 && nickname) {
      deleteData.value.push(nickname);
    }
  });

  nextTick(() => {
    showDelete.value = true;
  });
};

const deleteContact = () => {
  state.selectedRowKeys.map(async (item: Key) => {
    await deleteContactApi(item).then(() => {
      let index = data.value.findIndex(value => value.id === item);
      if(index !== -1) {
        data.value = data.value.splice(index, 1);
      }
    });
  });
  nextTick(() => {
    showDelete.value = false;
    isDelete.value = false;
    state.selectedRowKeys = [];
    // customerStore.setContactList();
  });
};

// item點擊事件
const checkInfo = (data: TableItem) => {
  isCreate.value = false;
  formData.value = { ...data };
  state.loading = true;
  nextTick(() => {
    showContact.value!.showModal();
    state.loading = false;
  });
};

watch(
  () => state.selectedRowKeys,
  (newValue) => {
    isDelete.value = newValue.length > 0;
  },
);

</script>

<template>
  <div class="h-full p-3">
    <div
      class="card-box h-full flex-col lg:flex"
      style="width: 100%; overflow-x: auto"
    >
      <!--   創建/編輯 彈窗   -->
      <ContactModal
        ref="showContact"
        :is-delete="isDelete"
        :is-create="isCreate"
        @create-contact="createContact"
        @update-contact="updateContact"
        :form-data="formData"
      />
      <!--   刪除 彈窗   -->
      <AModal
        v-model:open="showDelete"
        title="是否刪除以下用戶"
        @ok="deleteContact"
      >
        <div v-for="item in deleteData" :key="item">
          <p>
            {{ item }}
          </p>
        </div>
      </AModal>

      <!--   創建/刪除   -->
      <div class="m-5">
        <AButton type="primary" :loading="state.loading" @click="startCreate">
          創建聯繫人
        </AButton>

        <ATooltip title="刷新">
          <AButton @click="customerStore.setContactList('刷新成功')" type="primary" shape="round" size="middle" style="margin-left: 20px">
            <template #icon>
              <SyncOutlined />
            </template>
          </AButton>
        </ATooltip>

        <AButton
          v-if="isDelete"
          danger
          :loading="state.loading"
          style="margin-left: 20px"
          @click="setShowDelete"
        >
          刪除聯繫人
        </AButton>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `選擇了 ${state.selectedRowKeys.length} 個數據` }}
          </template>
        </span>
      </div>

      <!--   數據展示   -->
      <ATable
        class="h-full px-5"
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: (record) => ({
            id: `checkbox-${record.key}`,
            name: `checkbox-${record.key}`,
          }),
        }"
        style="width: 100%"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: true }"
        bordered
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'tags'">
            <span>
              <ATag
                v-for="tag in record.tags"
                :key="tag"
                :color="
                  tag === 'loser'
                    ? 'volcano'
                    : tag.length > 5
                      ? 'geekblue'
                      : 'green'
                "
              >
                {{ tag.toUpperCase() }}
              </ATag>
            </span>
          </template>

          <template v-if="column.dataIndex === 'countryName'">
            {{ getCountryLabel(record.countryName) }}
          </template>

          <template v-if="column.dataIndex === 'createTime'">
            <span>
              {{ formatDate(record.createTime) }}
            </span>
          </template>

          <template v-if="column.dataIndex === 'lastSeen'">
            <span>
              {{
                record.lastSeen !== undefined ? formatDate(record.lastSeen) : ''
              }}
            </span>
          </template>

          <template v-if="column.key === 'operation'">
            <AButton
              size="small"
              type="primary"
              @click="checkInfo(record as TableItem)"
            >
              編輯
            </AButton>
          </template>
        </template>
      </ATable>
    </div>
  </div>
</template>
