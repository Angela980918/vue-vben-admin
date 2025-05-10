import type {
  ChatMessage,
  Content,
  MessageItem,
  Status,
  WhatsAppInformationInfo,
} from '@vben/types';

import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { getContactListApi, getMessageList } from '#/api';
import { useCustomerStore } from '#/store/customerStore';
import { handleTemplateMsg } from '#/utils/common';

export interface CurrentCustomerInfo {
  id: string;
  key: string;
  name: string;
  time: string;
  badgeCount: number;
  phoneNumber: string;
  color: string;
  isActive: boolean;
  message: Content;
  nickName?: string;
}

export const useChatStore = defineStore('chatStore', () => {
  const currentChatId = ref('1'); // 当前聊天的 ID
  // const currentIndex = ref(1);

  const currentPhone = ref('');

  const currentCustomerInfo = ref<CurrentCustomerInfo>();

  const chatMessages = ref<ChatMessage[]>([]);

  const page = ref(1);
  const scrollTo = ref(false);
  const customerStore = useCustomerStore();
  const getChatMessages = computed(() => {
    const chatMessage = chatMessages.value.map((chatMessage) => {
      customerStore.assignedCustomers.forEach((customer) => {
        if (
          customer.phoneNumber === chatMessage.from ||
          customer.phoneNumber === chatMessage.to
        ) {
          chatMessage.nickName = customer.nickName;
        }
      });
      return chatMessage;
    });

    return chatMessage;
  });
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
    const res: WhatsAppInformationInfo = await getMessageList(data).then(
      (result) => {
        scrollTo.value = true;
        return result;
      },
    );
    const currentCustomer = currentCustomerInfo.value;
    const messagesListPro: ChatMessage[] = res.messageList
      .reverse()
      .map((item: MessageItem, index) => {
        let fileExtension: string | undefined = '';
        if (item.type === 'template') {
          const name = item.content.name || 'template message';
          const language = item?.content?.language?.code || 'zh-Hk';

          item.content = handleTemplateMsg(name, language);
          if (
            item.content.header !== undefined &&
            item.content.header.format === 'DOCUMENT'
          ) {
            const url = item.content.header.content;
            // console.log("url",url)
            fileExtension = url && url.split('.').pop();
          }
        } else if (item.type === 'document') {
          const url = item.content.link;
          const filename = url && url.split('/').pop();
          const fileExtensions = filename && filename.split('.');
          item.content.filename = filename;
          fileExtension = fileExtensions && fileExtensions[1];
        }
        return {
          name: currentCustomer?.name || '',
          color: currentCustomer?.color || '',
          msgIndex: `${page.value}-${index}` + `-index`,
          fileExtension,
          ...item,
        };
      });

    chatMessages.value =
      chatMessages.value === undefined
        ? [...messagesListPro]
        : [...messagesListPro, ...chatMessages.value];
  }

  function setMessageList(messageList: ChatMessage[]) {
    chatMessages.value = [...messageList];
  }

  function addMessage(message: ChatMessage) {
    // console.log('messagemessagemessage', message);
    if (message.direction === 'inbound') {
      customerStore.assignedCustomers.forEach((customer) => {
        if (customer.phoneNumber === message.name) {
          message.nickName = customer.nickName;
        }
      });
    }

    if (message.direction === 'inbound' && needSendTempFirst.value) {
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

  function updateMessage(id: string, status: Status, message: ChatMessage) {
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

  async function setCurrentUserInfo(user: CurrentCustomerInfo) {
    currentCustomerInfo.value = user;
    //   验证上次联系时间是否超过24小时
    const list = computed(() => useCustomerStore().getContactList);
    list.value.map(async (item: any) => {
      if (item.phoneNumber === user.phoneNumber) {
        await getContactListApi(1, 10, true, {
          phoneNumber: item.phoneNumber,
        }).then((result) => {
          // 更新用户资料
          const newData = result.items[0];
          if (item.lastSeen === undefined) {
            needSendTempFirst.value = true;
          } else {
            const lastSeenDate = new Date(item.lastSeen);
            const timeDiff = Date.now() - lastSeenDate.getTime();
            needSendTempFirst.value = timeDiff > 86_400_000;
          }
          newData && useCustomerStore().updateUser(newData);
        });
      }
    });
  }
  function clearChat() {
    chatMessages.value = [];
  }

  function changeChatByPhone(phone: string) {
    const assignedCustomers = useCustomerStore().getAssignedCustomers;
    assignedCustomers.forEach((item) => {
      if (item.phoneNumber === phone) {
        currentChatId.value = item.id;
        currentCustomerInfo.value = item;
      }
    });
  }

  function $reset() {
    currentChatId.value = '1';
    currentPhone.value = '';
    chatMessages.value = [];
    needSendTempFirst.value = false;
    page.value = 1;
    scrollTo.value = false;
  }

  return {
    $reset,
    currentChatId,
    currentPhone,
    currentCustomerInfo,
    chatMessages,
    page,
    scrollTo,
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
    changeChatByPhone,
  };
});
