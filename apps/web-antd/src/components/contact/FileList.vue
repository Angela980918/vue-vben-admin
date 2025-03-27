<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';

import { FileOutlined } from '@ant-design/icons-vue';
import {
  Checkbox as ACheckbox,
  Image as AImage,
  List as AList,
  ListItem as AListItem,
  Tooltip as ATooltip,
} from 'ant-design-vue';

const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: '',
  },
  selectAble: {
    type: Boolean,
    default: false,
  },
});

const data = reactive({
  list: [],
});

const isSelect = ref(false);
const videoPlayer = ref(null);

// 处理文件列表
const handleFileList = (list) => {
  data.list = list.map((item) =>
    reactive({
      id: item.id,
      title: item.file_name,
      imageSrc: `https://cos.jackycode.cn/${item.file_path}`,
      selected: false,
    }),
  );
};

watch(
  () => props.fileList,
  (newValue) => {
    handleFileList(newValue);
  },
  { immediate: true },
);

watch(
  () => props.selectAble,
  (newValue) => {
    isSelect.value = newValue;
  },
  { deep: true },
);

// 勾选 / 取消勾选
const getRemoveItem = () => {
  // let result = data.list.filter(item => item.selected);
  return data.list.filter((item) => item.selected);
};

// 分页配置
const paginationConfig = ref({
  current: 1,
  pageSize: 50, // 每页显示50张图片 (10列 * 5行)
  total: data.list.length,
  showSizeChanger: false,
  showQuickJumper: true,
  onChange: (page) => {
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

defineExpose({
  getRemoveItem: () => getRemoveItem(),
});
</script>

<template>
  <div>
    <AList
      :grid="{ gutter: 16, column: 10 }"
      :data-source="paginatedData"
      :pagination="paginationConfig"
      :loading="loading"
    >
      <template #renderItem="{ item }">
        <AListItem style="display: flex; flex-direction: column" :key="item.id">
          <!-- 复选框 -->
          <ACheckbox v-if="isSelect" v-model:checked="item.selected" />

          <AImage v-if="props.type === 'image'" :src="item.imageSrc" />

          <a
            :href="item.imageSrc"
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

          <!-- eslint-disable-next-line vue/no-unused-refs -->
          <video
            v-else-if="props.type === 'video'"
            :key="item.imageSrc"
            ref="videoPlayer"
            width="100%"
            controls
            class="mt-2"
          >
            <source :src="item.imageSrc" type="video/mp4" />
          </video>

          <ATooltip>
            <template #title>{{ item.title }}</template>
            <span class="item-title">{{ item.title }}</span>
          </ATooltip>
        </AListItem>
      </template>
    </AList>
  </div>
</template>

<style scoped>
/* 适当调整图片尺寸，确保展示美观 */
.a-list-item img {
  width: 100%;
  height: auto;
}

.item-title {
  display: block;
  width: 100%; /* 使标题适应父容器宽度 */
  overflow: hidden; /* 隐藏溢出部分 */
  font-size: 14px; /* 根据需求设置字体大小 */
  text-align: center; /* 可选，确保居中显示 */
  text-overflow: ellipsis; /* 超过宽度显示省略号 */
  white-space: nowrap; /* 防止换行 */
}
</style>
