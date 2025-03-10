import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import {getContactListApi, getMessageList} from '#/api';
import { handleTemplateMsg } from '#/utils/common';
import {useCustomerStore} from "#/store/customerStore";

export const useChatStore = defineStore('chatStore', () => {
  const currentChatId = ref(1); // 当前聊天的 ID
  // const currentIndex = ref(1);

  const currentPhone = ref('');

  const currentCustomerInfo = ref({});

  const chatMessages = ref([]);

  const page = ref(1);

  const getChatMessages = computed(() => chatMessages.value);
  const getCurrentChatId = computed(() => currentChatId.value);

  const needSendTempFirst = ref(false);

  function setCurrentChatId(id: string) {
    currentChatId.value = id;
  }

  function setCurrentPhone(phone: string) {
    currentPhone.value = phone;
  }

  function setPage() {
    page.value = 1;
  }
  // 加载聊天记录的模拟数据
  async function loadMoreMessages() {
    page.value = page.value + 1;
    const data = {
      id: currentChatId.value,
      page: page.value,
      pageSize: 20,
    };
    const res = await getMessageList(data);
    const currentCustomer = currentCustomerInfo.value;
    res.messageList.reverse().forEach((item, index) => {
      let fileExtension = '';
      item.name = currentCustomer.name;
      item.color = currentCustomer.color;
      item.msgIndex = `${page.value}-${index}` + `-index`;
      if (item.type === 'template') {
        const name = item.content.name;
        const language = item.content.language.code;
        item.content = handleTemplateMsg(name, language);
        if (
          item.content.header !== undefined &&
          item.content.header.format === 'DOCUMENT'
        ) {
          const url = item.content.header.content;
          // console.log("url",url)
          fileExtension = url.split('.').pop();
          item.fileExtension = fileExtension;
        }
      } else if (item.type === 'document') {
        const url = item.content.link;
        const filename = url.split('/').pop();
        fileExtension = filename.split('.');
        item.content.filename = filename;
        item.fileExtension = fileExtension[1];
      }
    });
    chatMessages.value = [...res.messageList, ...chatMessages.value];
  }

  function setMessageList(messageList) {
    chatMessages.value = [...messageList];
  }

  function addMessage(message) {
    if(message.direction === 'inbound' && needSendTempFirst.value) {
      needSendTempFirst.value = false;
    }
    chatMessages.value.push(message);
  }

  // async function sendMessage(page) {
  //   page.value = page;
  //
  //   let response = await getContactList(page, 10);
  //   if(response !== undefined) {
  //     response.items.map(item => {
  //       total.value = response.total;
  //       item.key = item.id;
  //     });
  //   }
  //   contactList.value = response.items;
  // }

  function updateMessage(id, status, message = {}) {
    let add = true;
    chatMessages.value.forEach((item) => {
      if (item.direction === 'outbound' && item._id === id) {
        add = false;
        item.status = status;
      }
    });
    if (add && status === 'sent') {
      chatMessages.value.push(message);
    }
  }

  async function setCurrentUserInfo(user) {
    // console.log("usr",user)
    currentCustomerInfo.value = user;
    //   验证上次联系时间是否超过24小时
    const list = computed(() => useCustomerStore().getContactList);
    list.value.map(async item => {
      if(item.phoneNumber === user.phoneNumber) {
        await getContactListApi(1, 10, true, { filter: { phoneNumber: item.phoneNumber } }).then(result => {
          // 更新用户资料
          let newDate = result.items[0];
          const lastSeenDate = new Date(item.lastSeen);
          const timeDiff = new Date().getTime() - lastSeenDate.getTime();
          // 时间差值计算（兼容UTC时区）
          needSendTempFirst.value = timeDiff > 86400000;
          useCustomerStore().updateUser(newDate);
        })
      }
    })
  }

  function clearChat() {
    // console.log("123456798")
    chatMessages.value = [];
  }

  function $reset() {
    currentChatId.value = 1;
    currentPhone.value = '';
    chatMessages.value = [];
    needSendTempFirst.value = false;
    page.value = 1;
  }

  return {
    $reset,
    currentChatId,
    currentPhone,
    currentCustomerInfo,
    chatMessages,
    page,
    needSendTempFirst,

    getChatMessages,
    getCurrentChatId,

    setCurrentChatId,
    setCurrentPhone,
    setPage,
    loadMoreMessages,
    setMessageList,
    addMessage,
    updateMessage,
    setCurrentUserInfo,
    clearChat,
  };
});
