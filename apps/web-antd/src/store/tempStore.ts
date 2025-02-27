import { ref } from 'vue';

import { defineStore } from 'pinia';

import { getContactListApi } from '#/api';

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

  // 快捷用语
  const quickMessage = ref([]);

  // 素材库
  const imageList = ref([]);
  const docList = ref([]);
  const videoList = ref([]);

  async function loadTemplates() {
    if (isTemplatesLoaded.value) return;

    await getContactListApi().then((result) => {
      // console.log("resultresultresult",result)
      return result;
    });

    // await getTemplateList().then(result => {
    //   console.log("resultresultresult",result)
    // });

    // if (response.items.length !== 0) {
    //   if (!isEqual(rawTempData.value, response.items)) {
    //     setRawTempData(response.items);
    //     setTempData(response.items);
    //     isTemplatesLoaded.value = true;
    //   }
    // }
  }

  // function setRawTempData(data: any) {
  //   rawTempData.value = data;
  // }

  // function setTempData(data: any) {
  //   data.map((item: object, index: number) => {
  //     item.key = index;
  //   });
  //   tempData.value = data;
  // }

  function setTemplateData(data: any) {
    createTempData.value = data;
  }

  function resetCreateTempData() {
    createTempData.value = [];
  }

  // async function loadQuickMsg() {
  //   let result = await loadQuickList();
  //   // 增加测试资料
  //   result.push({
  //     _id: '2d6f6ad8-db20-40a1-a595-2f97d85b2f7g',
  //     title: '纯文本消息',
  //     content: '这是只有文本的消息',
  //     owner_type: 'user',
  //     owner_id: '67891',
  //     createTime: '2025-01-14T02:44:06.261Z',
  //     attachments: []
  //   })
  //
  //   result.push({
  //     _id: '2d6f6ad8-db20-40a1-a595-2f97d85b2f7h',
  //     title: '文件和视频消息',
  //     content: '这是有文件和视频的消息',
  //     owner_type: 'user',
  //     owner_id: '67892',
  //     createTime: '2025-01-13T02:44:06.261Z',
  //     attachments: [
  //       {
  //         file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
  //         file_name: 'Sample.pdf',
  //         file_path: '449711484896804/library/document/Sample.pdf',
  //         file_size: 7583,
  //         file_type: 'document'
  //       },
  //       {
  //         file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
  //         file_name: 'sign.mp4',
  //         file_path: '449711484896804/library/videos/sign.mp4',
  //         file_size: 7583,
  //         file_type: 'video'
  //       }
  //     ]
  //   })
  //
  //   result.push({
  //     _id: '2d6f6ad8-db20-40a1-a595-2abcdd85b2f7i',
  //     title: '没有文本的消息，陌生类型',
  //     content: '',
  //     owner_type: 'user',
  //     owner_id: '67892',
  //     createTime: '2025-01-12T02:44:06.261Z',
  //     attachments: [
  //       {
  //         file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
  //         file_name: 'Sample.pdf',
  //         file_path: '449711484896804/library/document/Sample.pdf',
  //         file_size: 7583,
  //         file_type: 'file'
  //       },
  //     ]
  //   })
  //
  //   result.push({
  //     _id: '2d6f6ad8-db20-40a1-a595-2abcdddddbbbbbb',
  //     title: '只有一條文本一個素材',
  //     content: '一文本一素材',
  //     owner_type: 'user',
  //     owner_id: '67892',
  //     createTime: '2025-01-11T02:44:06.261Z',
  //     attachments: [
  //       {
  //         file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
  //         file_name: 'Sample.pdf',
  //         file_path: '449711484896804/library/document/Sample.pdf',
  //         file_size: 7583,
  //         file_type: 'file'
  //       },
  //     ]
  //   })
  //   quickMessage.value = result;
  // }

  function $reset() {
    rawTempData.value = [];
    createTempData.value = [];
    tempData.value = [];
    quickMessage.value = [];
    imageList.value = [];
    docList.value = [];
    videoList.value = [];
    isTemplatesLoaded.value = false;
  }

  // async function setMaterialListData(source) {
  //   let result = await
  // }

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

    loadTemplates,
    setTemplateData,
    resetCreateTempData,
    // loadQuickMsg
  };
});
