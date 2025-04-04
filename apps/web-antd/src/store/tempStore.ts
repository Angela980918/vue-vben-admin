import { computed, ref, toRaw } from 'vue';

import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getTemplateList, libraryFiles, loadQuickList } from '#/api';

export const useTemplateStore = defineStore('template', () => {
  // const accessStore = useAccessStore();
  // const userStore = useUserStore();
  // const router = useRouter();
  //
  // const loginLoading = ref(false);
  const rawTempData = ref([]);
  const createTempData = ref([]);
  const isTemplatesLoaded = ref(false);
  const tempData = ref([]);
  const createTempAccount = ref(''); // 当前模板对应的公司账号

  // 快捷用语
  const quickMessage = ref([]);

  // 素材库
  const imageList = ref([]);
  const docList = ref([]);
  const videoList = ref([]);

  // 選項
  const userInfo = useUserStore().userInfo;
  const list = [];
  const selectOptions = ref([]);
  const { wabaAccount } = userInfo;
  wabaAccount.forEach((item) => {
    list.push({ value: item.wabaId, label: item.name });
  });
  list.push({ value: userInfo?.id, label: userInfo?.username });
  selectOptions.value = list;
  createTempAccount.value = selectOptions.value[0].value;

  const page = ref(1);
  const size = ref(10);
  const total = ref(0);

  const getRawTemplateList = computed(() => {
    const list = [];
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
    // console.log("listlistlist",list)
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
    page.value = page.value + 1;
    await getTemplateList(page.value).then((result) => {
      result.items.forEach((item, index) => (item.key = index));
      rawTempData.value = [
        ...rawTempData.value.map((item) => toRaw(item)),
        ...result.items,
      ];
      tempData.value = [...rawTempData.value];

      size.value += result.length;
      if (result.total > size.value) {
        'requestIdleCallback' in window &&
          requestIdleCallback(() => startBackLoadTemplate());
      }
    });
  }

  function setRawTempData(data: any) {
    rawTempData.value = data;
  }

  function setTempData(data: any) {
    data.forEach((item: object, index: number) => {
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

  async function setMaterialListData(source) {
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
