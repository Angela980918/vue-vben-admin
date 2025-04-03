import type { ContactInfo, ItemInfo } from '@vben/types';

import type { AssignedCustomer, ContactInformation } from '#/types';

import { toRaw } from 'vue';

import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import { sortBy } from 'lodash';
import { defineStore } from 'pinia';
import stringToColor from 'string-to-color';

import { getAllCustomerApi, getContactListApi } from '#/api';

interface CustomerState {
  // currentUserId: number;
  // currentIndex: number;
  currentCustomerInfo: Partial<ContactInfo>;
  assignedCustomers: AssignedCustomer[];
  searchWord: string;
  contactList: ContactInformation[];
  page: number;
  total: number;
  size: number;
}

// @ts-ignore: 客户Store
export const useCustomerStore = defineStore('customerStore', {
  state: (): CustomerState => ({
    // currentUserId: 1,
    // currentIndex: 1,
    currentCustomerInfo: {},
    assignedCustomers: [],
    searchWord: '',
    contactList: [],
    page: 1,
    total: 0,
    size: 10,
  }),

  actions: {
    // setCurrentUser(id: number): void {
    //   this.currentUserId = id;
    // },

    async setAssignedCustomers(): Promise<AssignedCustomer[]> {
      const customers: AssignedCustomer[] = [];
      const result = await getAllCustomerApi(useUserStore().selectAccount);

      result.forEach((item: any, index: number) => {
        item.key = item.id;
        const color = stringToColor(item.customerId);
        const newCustomer = {
          id: item.id,
          key: item.key,
          name: item.customerId,
          time: item.messageList[0].deliverTime,
          badgeCount: item.messageCount,
          phoneNumber: item.customerId,
          color,
          isActive: index === 0,
          message: '',
        };

        if (item.customerProfile !== undefined) {
          newCustomer.name = item.customerProfile.name;
        }

        newCustomer.message =
          item.messageList[0].type === 'text'
            ? item.messageList[0].content.body
            : `[${item.messageList[0].type} Message]`;

        customers.push(newCustomer);
      });

      this.assignedCustomers = customers;
      return customers;
    },

    setCurrentUserInfo(user: ContactInfo): void {
      this.currentCustomerInfo = user;
    },

    setSearchWord(word: string): void {
      this.searchWord = word;
    },

    async setContactList(msg?: string): Promise<void> {
      try {
        this.page = 1;
        this.size = 10;
        this.total = 0;

        const response = await getContactListApi(this.page);
        if (!response) return;

        this.total = response.total;
        this.contactList = response.items.map((item) => ({
          ...item,
          key: item.id,
        }));

        if (msg) message.success(msg);
        if (response.total > this.size) this.startBackLoadContact();
      } catch (error) {
        console.error('加載聯繫人列表失敗:', error);
        message.error('加載聯繫人列表失敗');
      }
    },

    async startBackLoadContact() {
      ++this.page;
      await getContactListApi(this.page).then((result) => {
        result.items.forEach((item) => (item.key = item.id));
        this.contactList = [
          ...this.contactList.map((item) => toRaw(item)), // 转为普通对象
          ...result.items,
        ];
        this.size += result.length;
        if (result.total > this.size) {
          'requestIdleCallback' in window &&
            requestIdleCallback(() => this.startBackLoadContact());
        }
      });
    },

    contactOperate(isCreate: boolean, value: ContactInfo): void {
      const contactInfo: ContactInformation = { ...value, key: value.id };
      if (isCreate) {
        this.contactList.unshift(contactInfo);
      } else {
        const index = this.contactList.findIndex(
          (item) => item.id === value.id,
        );
        if (index !== -1) {
          this.contactList.splice(index, 1, contactInfo);
        }
      }
    },

    // async getNewUser(phone: number) {
    //   await getContactListApi(1, 10, true, { filter: { phoneNumber: phone } }).then(result => {
    //     let newUser = result.items;
    //     this.contactList = [...newUser, ...this.contactList];
    //   });
    // },
    async updateUser(userData: ItemInfo): Promise<void> {
      const index = this.contactList.findIndex(
        (item) => item.phoneNumber === userData.phoneNumber,
      );

      if (index === -1) {
        // 不存在 添加新聯繫人
        this.contactList.unshift({
          ...userData,
          key: userData.id,
        });
      } else {
        // 存在 更新現有聯繫人
        this.contactList.splice(index, 1, {
          ...this.contactList[index],
          ...userData,
          key: userData.id,
        });
      }
    },

    $reset() {
      // this.currentUserId = 1;
      // this.currentIndex = 1;
      this.currentCustomerInfo = {};
      this.assignedCustomers = [];
      this.searchWord = '';
      this.contactList = [];
      this.page = 1;
      this.total = 0;
      this.size = 10;
    },
  },

  getters: {
    getAssignedCustomers: (state) => {
      return sortBy(state.assignedCustomers, 'time').reverse();
    },

    getAllUnReadNum: (state) => {
      return [...state.assignedCustomers].reduce((count, item) => {
        return count + (item.badgeCount || 0);
      }, 0);
    },

    getContactList: (state) => {
      return state.contactList;
    },

    getUserByPhone: (state) => (phone: string) => {
      let haveUser = false;
      state.assignedCustomers.forEach((item) => {
        if (item.phoneNumber === phone) {
          haveUser = true;
          return haveUser;
        }
      });
      return haveUser;
    },
  },
});
