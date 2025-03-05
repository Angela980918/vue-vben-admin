<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';

import type { TemplateData } from '@vben/types';

import type { MapValue } from '#/map';

import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@vben/stores';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import {
  Button as AButton,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
  Space as ASpace,
  Table as ATable,
  Tag as ATag,
  Tooltip as ATooltip,
} from 'ant-design-vue';

import WASelect from '#/components/templates/WASelect.vue';
import { categoryMap, errorMap, languageMap, statusMap } from '#/map';
import { useTemplateStore } from '#/store';
import { formatDate } from '#/tools/time';
import { getLabel } from '#/utils/common';

type Key = number | string;

// 模板状态类型
type Status = 'APPROVED' | 'IN_PROGRESS' | 'PENDING' | 'REJECTED' | 'WAITING';

const router = useRouter();

// icon、顔色變化
const getTagIcon = (status: Status) => {
  const icons = {
    APPROVED: CheckCircleOutlined,
    REJECTED: CloseCircleOutlined,
    PENDING: ExclamationCircleOutlined,
    IN_PROGRESS: SyncOutlined,
    WAITING: ClockCircleOutlined,
  };
  return icons[status] || MinusCircleOutlined;
};

const columns = [
  {
    key: 1,
    title: '模板名稱',
    dataIndex: 'name',
    fixed: 'left',
    width: '25%',
    ellipsis: true,
  },
  {
    key: 2,
    title: '類別',
    dataIndex: 'category',
    width: '15%',
  },
  {
    key: 3,
    title: '語言',
    dataIndex: 'language',
    width: '20%',
  },
  {
    key: 4,
    title: '狀態',
    dataIndex: 'status',
    width: '15%',
  },
  {
    key: 5,
    title: '最近更新',
    dataIndex: 'updateTime',
    width: '20%',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: '15%',
  },
];

// 模板数据
const TempStore = useTemplateStore();
const UserStore = useUserStore();
// 原始数据
const data = computed(() => {
  return TempStore.tempData as TemplateData[];
});

// 表格显示数据
const filterData = ref<TemplateData[]>([]);

// 賬號選擇
const allAccounts = ref(
  TempStore.selectOptions.filter(
    (item) => item.value !== UserStore.userInfo.id,
  ),
);
const selectAccount = ref(TempStore.createTempAccount);

// 搜索欄
const searchContents = ref('');

// 種類
const selectCategory = ref([]);
const allCategory = ref<SelectProps['options']>(categoryMap);

// 語言
const selectLanguage = ref([]);
const allLanguage = ref<SelectProps['options']>(languageMap);

// 狀態
const selectStatus = ref([]);
const tempStatus = ref<SelectProps['options']>(statusMap);

// 新建模板
const createTemplate = async () => {
  await TempStore.resetCreateTempData();
  router.push({
    name: 'MarketCreateTemplate',
  });
};

const state = reactive<{
  loading: boolean;
  selectedRowKeys: Key[];
}>({
  selectedRowKeys: [],
  loading: false,
});
// 按钮可选状态
const isButtonDisabled = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

// label映射
const getStatusLabel = (status: MapValue<typeof statusMap>) =>
  getLabel(statusMap, status);
const getCategoryLabel = (category: MapValue<typeof categoryMap>) =>
  getLabel(categoryMap, category);
const getLangLabel = (lang: MapValue<typeof languageMap>) =>
  getLabel(languageMap, lang);
const getErrorLabel = (error: MapValue<typeof errorMap>) =>
  getLabel(errorMap, error);

// 預覽模板 | 路由跳转
const onPreview = (index: number) => {
  TempStore.setTemplateData(data.value[index]);
  router.push({
    name: 'MarketCreateTemplate',
  });
};
// 编辑模板 | 路由跳转
const onEdit = (index: number) => {
  TempStore.setTemplateData(data.value[index]);
  router.push({
    name: 'MarketCreateTemplate',
  });
};
// 删除模板 | 路由跳转
const onDelete = () => {};

// 数据过滤
const dataFilter = () => {
  const { value: searchValue } = searchContents;
  const { value: categoryValues } = selectCategory;
  const { value: languageValues } = selectLanguage;
  const { value: statusValues } = selectStatus;
  filterData.value = data.value.filter((item) => {
    return (
      (!searchValue || item.name.includes(searchValue)) &&
      (categoryValues.length === 0 ||
        categoryValues.some((c) => c.value === item.category)) &&
      (languageValues.length === 0 ||
        languageValues.some((l) => l.value === item.language)) &&
      (statusValues.length === 0 ||
        statusValues.some((s) => s.value === item.status))
    );
  });
};

// 更新筛选
const updateSelection = (value, allItems, selectArray) => {
  selectArray.value = allItems.filter((item) => value.includes(item.value));
  dataFilter();
};

// 筛选
const accountChange = (value: string) => {
  // eslint-disable-next-line no-console
  console.log('accountChange', value);
  TempStore.createTempAccount = value;
  // updateSelection(value, allAccounts.value, selectAccount);
};
const nameChange = (value: string) => {
  searchContents.value = value;
  dataFilter();
};
const categoryChange = (value: MapValue<typeof categoryMap>) => {
  updateSelection(value, allCategory.value, selectCategory);
};
const langChange = (value: MapValue<typeof languageMap>) => {
  updateSelection(value, allLanguage.value, selectLanguage);
};
const statusChange = (value: MapValue<typeof statusMap>): void => {
  updateSelection(value, tempStatus.value, selectStatus);
};

onBeforeMount(async () => {
  await TempStore.loadTemplates();
  dataFilter();
});
</script>

<template>
  <div class="h-full p-3">
    <div
      class="card-box h-full flex-col lg:flex"
      style="width: 100%; overflow-x: auto"
    >
      <div class="mt-3 flex px-3 lg:flex">
        <WASelect
          name="selectAccount"
          direction="vertical"
          title="賬號"
          type="select-common"
          :select-item="selectAccount"
          :options="allAccounts"
          @handle-change="accountChange"
        />

        <WASelect
          name="searchContents"
          direction="vertical"
          title="搜索"
          type="search"
          :search-contents="searchContents"
          @handle-change="nameChange"
        />

        <WASelect
          name="selectCategory"
          direction="vertical"
          title="類別"
          type="select-multiple"
          :select-item="selectCategory"
          :options="allCategory"
          @handle-change="categoryChange"
        />

        <WASelect
          name="selectLanguage"
          direction="vertical"
          title="語言"
          type="select-multiple"
          :select-item="selectLanguage"
          :options="allLanguage"
          @handle-change="langChange"
        />

        <WASelect
          name="selectStatus"
          direction="vertical"
          title="狀態"
          type="select-multiple"
          :select-item="selectStatus"
          :options="tempStatus"
          @handle-change="statusChange"
        />
      </div>

      <div class="h-full">
        <div class="my-3 px-5">
          <ASpace>
            <AButton
              type="primary"
              @click="createTemplate"
              :disabled="isButtonDisabled"
            >
              創建模板
            </AButton>

            <AButton type="primary" danger @click="createTemplate">
              刪除
            </AButton>
          </ASpace>
        </div>
        <ATable
          :row-selection="{
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: (record) => ({
              id: `checkbox-${record.key}`,
              name: `checkbox-${record.key}`,
            }),
          }"
          bordered
          :columns="columns"
          :data-source="filterData"
          class="px-5"
          :pagination="{ pageSize: 8, showSizeChanger: false }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 2">
              {{ getCategoryLabel(record.category) }}
            </template>
            <template v-if="column.key === 3">
              {{ getLangLabel(record.language) }}
            </template>
            <template v-if="column.key === 4">
              <ATooltip
                :title="
                  record.status === 'REJECTED'
                    ? getErrorLabel(record.reason)
                    : ''
                "
                color="red"
              >
                <ATag
                  :color="
                    record.status === 'APPROVED'
                      ? 'success'
                      : record.status === 'REJECTED'
                        ? 'error'
                        : 'default'
                  "
                >
                  <template #icon>
                    <component :is="getTagIcon(record.status)" />
                  </template>
                  {{ getStatusLabel(record.status) }}
                </ATag>
              </ATooltip>
            </template>
            <template v-if="column.key === 5">
              <span>{{ formatDate(record.updateTime) }}</span>
            </template>

            <template v-if="column.key === 'operation'">
              <ADropdown>
                <AButton>
                  操作
                  <DownOutlined />
                </AButton>
                <template #overlay>
                  <AMenu>
                    <AMenuItem>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        @click="onPreview(record.key)"
                      >
                        預覽
                      </a>
                    </AMenuItem>
                    <AMenuItem>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        @click="onEdit(record.key)"
                      >
                        編輯
                      </a>
                    </AMenuItem>
                    <AMenuItem>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        @click="onDelete(record.key)"
                      >
                        刪除
                      </a>
                    </AMenuItem>
                  </AMenu>
                </template>
              </ADropdown>
            </template>
          </template>
        </ATable>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
