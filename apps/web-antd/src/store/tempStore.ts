import { computed, ref, toRaw } from 'vue';

import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getTemplateList, libraryFiles, loadQuickList } from '#/api';
import type {
  DocTemplate,
  ImageTemplate,
  LibraryFilesParams,
  QuickMessage,
  RawTemplateDataList,
  RawTemplateList,
  TemplateOption,
} from '@vben/types';

export const useTemplateStore = defineStore('template', () => {
  const rawTempData = ref<RawTemplateDataList>([]);

  const createTempData = ref<RawTemplateDataList>([]);
  const isTemplatesLoaded = ref(false);

  const tempData = ref<RawTemplateDataList>([]);

  // 快捷用语
  const quickMessage = ref<QuickMessage[]>([]);

  // 素材库
  const imageList = ref<ImageTemplate[]>([]);
  const docList = ref<DocTemplate[]>([]);
  const videoList = ref([]);

  // 選項
  const userStore = useUserStore();

  const selectOptions = computed<TemplateOption[]>(() => {
    const list: TemplateOption[] = [];
    userStore.wabaAccounts.forEach((item) => {
      list.push({ value: item.waba_id, label: item.name });
    });

    return list;
  });

  const createTempAccount = computed(() => {
    return userStore.currentWabaId;
  }); // 当前模板对应的公司账号

  const page = ref(1);
  const size = ref(10);
  const total = ref(0);

  const getRawTemplateList = computed<RawTemplateList[]>(() => {
    const list: RawTemplateList[] = [];
    rawTempData.value.forEach((item) => {
      if (
        item.status === 'APPROVED' &&
        item.wabaId === createTempAccount.value
      ) {
        const cloumn = {
          key: item.key,
          name: item.name,
          language: item.language,
          components: item.components,
        };
        list.push(cloumn);
      }
    });
    return list;
  });

  const getQuickMsg = computed(() => {
    const list = structuredClone(toRaw(quickMessage.value));
    list.forEach((item) => {
      const time = new Date(item.createTime);
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai',
      });
      // console.log(formatter.format(time));
      item.createTime = formatter.format(time);
    });
    return list;
  });

  // function changeEditRef(value: string) {
  //   editRef.value = value;
  // }

  async function loadTemplates(msg?: string) {
    if (msg) {
      page.value = 1;
      size.value = 10;
    }

    await getTemplateList(page.value).then((result) => {
      // if (
      //   result.items.length > 0 &&
      //   !isEqual(rawTempData.value, result.items)
      // ) {
      if (msg) {
        message.success(msg);
      }
      total.value = result.total;
      setRawTempData(result.items);
      setTempData(result.items);
      isTemplatesLoaded.value = true;
      if (result.total > size.value) {
        startBackLoadTemplate();
      }
      // }
    });
  }

  async function startBackLoadTemplate() {
    try {
      // 简洁地增加页码
      page.value++;

      // 发起请求获取模板列表
      const result = await getTemplateList(page.value);

      // 类型检查，确保 result.items 是数组
      if (Array.isArray(result.items)) {
        // 为新数据添加 key 属性，明确类型
        const newItemsWithKey = result.items.map((item, index) => ({
          ...item,
          key: index,
        }));

        // 合并新旧数据
        const mergedData = [
          ...rawTempData.value.map((item) => toRaw(item)),
          ...newItemsWithKey,
        ];

        // 更新数据
        rawTempData.value = mergedData;
        tempData.value = [...mergedData];

        // 更新已加载数据的数量，使用正确的属性
        size.value += newItemsWithKey.length;

        // 检查是否还有更多数据需要加载，并在浏览器空闲时继续加载
        if (
          result.total > size.value &&
          typeof window !== 'undefined' &&
          'requestIdleCallback' in window
        ) {
          window.requestIdleCallback(() => startBackLoadTemplate());
        }
      }
    } catch (error) {
      // 错误处理，打印错误信息
      console.error('后台加载模板数据时出错:', error);
      message.error('后台加载模板数据失败，请稍后重试');
    }
  }

  function setRawTempData(data: any) {
    rawTempData.value = data;
  }

  function setTempData(data: RawTemplateDataList) {
    data.forEach((item: any, index: number) => {
      item.key = index;
    });
    tempData.value = data;
  }

  function setTemplateData(data: any) {
    createTempData.value = data;
  }

  async function resetCreateTempData() {
    createTempData.value = [];
    // eslint-disable-next-line no-console
    console.log('清空緩存');
  }

  async function loadQuickMsg(id: string) {
    quickMessage.value = await loadQuickList(id);
  }

  async function setMaterialListData(source: LibraryFilesParams) {
    // 素材列表
    await libraryFiles(source)
      .then((result) => {
        if (result !== undefined) {
          const { document, image, video } = result;
          imageList.value = image;
          docList.value = document;
          videoList.value = video;
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error', error);
      });
  }

  function $reset() {
    page.value = 1;
    size.value = 10;
    total.value = 0;
    rawTempData.value = [];
    createTempData.value = [];
    tempData.value = [];
    quickMessage.value = [];
    imageList.value = [];
    docList.value = [];
    videoList.value = [];
    isTemplatesLoaded.value = false;
  }

  return {
    $reset,
    rawTempData,
    createTempData,
    isTemplatesLoaded,
    tempData,
    quickMessage,
    imageList,
    docList,
    videoList,
    selectOptions,
    createTempAccount,

    getRawTemplateList,
    getQuickMsg,

    loadTemplates,
    setTemplateData,
    resetCreateTempData,
    loadQuickMsg,
    setMaterialListData,
  };
});
