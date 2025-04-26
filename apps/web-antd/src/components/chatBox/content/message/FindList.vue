<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';

import { FileOutlined } from '@ant-design/icons-vue';
import {
  Image as AImage,
  List as AList,
  ListItem as AListItem,
} from 'ant-design-vue';

import { useChatStore } from '#/store';
import { libraryFiles } from '#/api';
import type {
  FileCategory,
  FileTemplateInfo,
  LibraryFilesParams,
} from '@vben/types';
import { useAppConfig } from '@vben/hooks';

interface Props {
  type: FileCategory;
}
const props = defineProps<Props>();
const chatStore = useChatStore();

type DataType = { file_name: string; link: string };
const data = reactive<{ list: DataType[] }>({
  list: [],
});

// 分页配置
const paginationConfig = ref({
  current: 1,
  pageSize: 9,
  total: data.list.length,
  showSizeChanger: false,
  showQuickJumper: true,
  onChange: (page: number) => {
    paginationConfig.value.current = page;
  },
});

// 计算当前分页数据
const paginatedData = computed(() => {
  const { current, pageSize } = paginationConfig.value;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return data.list.slice(start, end);
});
const loading = ref(false);
const { cosURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
watch(
  () => chatStore.currentChatId,
  () => {
    data.list = [];
    const params: LibraryFilesParams = {
      queryType: 'room',
      roomId: chatStore.currentChatId,
      fileCategory: props.type,
    };
    libraryFiles<FileTemplateInfo[]>(params).then((res) => {
      res.forEach((item) => {
        data.list.push({
          link: `${cosURL}${item.file_path}`,
          file_name: item.file_name,
        });
      });
    });

    // 更新分页总数
    paginationConfig.value.total = data.list.length;
  },
  { immediate: true },
);

const getFileName = ({ link, file_name }: DataType) => {
  const filename = link.split('/').pop();
  const fileExtension = filename ? filename.split('.') : [file_name];
  return file_name || fileExtension[0];
};
</script>

<template>
  <div class="fixed-list-container">
    <AList
      :grid="{ gutter: 5, column: 3 }"
      :data-source="paginatedData"
      :pagination="paginationConfig"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <AListItem style="display: flex; flex-direction: column" :key="item.id">
          <AImage v-if="props.type === 'image'" :src="item.link" />

          <a
            :href="item.link"
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

          <span class="item-title">{{ getFileName(item) }}</span>
        </AListItem>
      </template>
    </AList>
  </div>
</template>

<style scoped>
.item-title {
  display: block;
  width: 100%; /* 使标题适应父容器宽度 */
  overflow: hidden; /* 隐藏溢出部分 */
  font-size: 14px; /* 根据需求设置字体大小 */
  text-align: center; /* 可选，确保居中显示 */
  text-overflow: ellipsis; /* 超过宽度显示省略号 */
  white-space: nowrap; /* 防止换行 */
}

/* 分页定位 */
.fixed-list-container {
  height: 500px;
}

:deep(.ant-spin-container) {
  height: 350px;
}
</style>
