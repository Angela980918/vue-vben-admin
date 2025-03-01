import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { getContactListApi } from '#/api';

export const useCustomerStore = defineStore('customerStore', () => {
  // 当前沟通用户的 ID
  const currentUserId = ref(1);
  // const currentIndex = ref(1);

  // 當前溝通用戶的信息
  const currentCustomerInfo = ref({});

  // 已分配客户的模拟数据
  const assignedCustomers = ref([]);

  // 未分配客户的模拟数据
  const unassignedCustomers = ref([]);
  const searchWord = ref('');
  // 聯繫人信息
  const contactList = ref([]);
  const page = ref(1);
  const total = ref(0);

  const getAssignedCustomers = computed(() => assignedCustomers.value);
  const getAllUnReadNum = computed(() => {
    const allCustomers = [...assignedCustomers.value];
    return allCustomers.reduce(
      (count, item) => count + (item.badgeCount || 0),
      0,
    );
  });

  function setCurrentUser(id: string) {
    currentUserId.value = id;
  }

  function setAssignedCustomers(customers: Array<object>) {
    assignedCustomers.value = customers.map((customer, index) => ({
      ...customer,
      isActive: index === 0, // 默认第一个客户 isActive 为 true
    }));
  }

  function setCurrentUserInfo(user: object) {
    currentCustomerInfo.value = user;
  }

  function setSearchWord(word: string) {
    searchWord.value = word;
  }

  async function setContactList() {
    const response = await getContactListApi(page.value);
    // console.log("responseresponseresponse",response)
    if (response !== undefined) {
      total.value = response.total;
      response.items.forEach((item) => {
        item.key = item.id;
      });
    }

    contactList.value = response.items;
  }

  async function changeContactList(page) {
    page.value = page;

    const response = await getContactListApi(page, 10);
    if (response !== undefined) {
      response.items.forEach((item) => {
        total.value = response.total;
        item.key = item.id;
      });
    }
    contactList.value = response.items;
  }

  function contactOperate(isCreate, value) {
    if (isCreate) {
      value.key = value.id;
      contactList.value.unshift(value);
    } else {
      const index = contactList.value.findIndex((item) => item.id === value.id);
      if (index !== -1) {
        contactList.value[index] = value; // 直接更新数组中的元素
      }
    }
  }

  function $reset() {
    currentUserId.value = 1;
    currentCustomerInfo.value = {};
    assignedCustomers.value = [];
    unassignedCustomers.value = [];
    contactList.value = [];
    page.value = 1;
    total.value = 1;
  }

  return {
    $reset,
    currentUserId,
    currentCustomerInfo,
    assignedCustomers,
    unassignedCustomers,
    searchWord,
    contactList,
    page,
    total,

    getAssignedCustomers,
    getAllUnReadNum,

    setCurrentUser,
    setAssignedCustomers,
    setCurrentUserInfo,
    setSearchWord,
    setContactList,
    changeContactList,
    contactOperate,
  };
});
