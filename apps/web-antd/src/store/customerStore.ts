import type { ContactInfo } from '@vben/types';

import { defineStore } from 'pinia';

import { getContactListApi } from '#/api';
import {reactive, toRaw} from "vue";

interface CustomerState {
  // currentUserId: number;
  // currentIndex: number;
  currentCustomerInfo: Partial<ContactInfo>;
  assignedCustomers: Array<ContactInfo & { isActive: boolean }>;
  searchWord: string;
  contactList: ContactInfo[];
  page: number;
  total: number;
  size: number;
}

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

    setAssignedCustomers(customers: ContactInfo[]): void {
      this.assignedCustomers = customers.map((customer, index) => ({
        ...customer,
        isActive: index === 0,
      }));
    },

    setCurrentUserInfo(user: ContactInfo): void {
      this.currentCustomerInfo = user;
    },

    setSearchWord(word: string): void {
      this.searchWord = word;
    },

    async setContactList(): Promise<void> {
      const response = await getContactListApi(this.page);
      // eslint-disable-next-line no-console
      if (response) {
        this.total = response.total;
        this.contactList = response.items.map((item) => ({
          ...item,
          key: item.id,
        }));
        if(response.total > this.size) {
          this.startBackLoadContact();
        }
      }
    },

    async startBackLoadContact() {
      ++this.page;
      await getContactListApi(this.page).then(result => {
        result.items.forEach((item) => item.key = item.id);
        this.contactList = [
          ...this.contactList.map(item => toRaw(item)), // 转为普通对象
          ...result.items
        ];
        this.size += result.length;
        if(result.total > this.size) {
          'requestIdleCallback' in window && requestIdleCallback(() => this.startBackLoadContact());
        }
      });

    },

    // async changeContactList(page: number): Promise<void> {
    //   this.page = page;
    //   const response = await getContactListApi(page, 10);
    //   if (response) {
    //     this.total = response.total;
    //     this.contactList = response.items.map((item) => ({
    //       ...item,
    //       key: item.id,
    //     }));
    //   }
    // },

    contactOperate(isCreate: boolean, value: ContactInfo): void {
      if (isCreate) {
        this.contactList.unshift({ ...value, key: value.id });
      } else {
        const index = this.contactList.findIndex(
          (item) => item.id === value.id,
        );
        if (index !== -1) {
          this.contactList.splice(index, 1, value);
        }
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
    },
  },

  getters: {
    getAssignedCustomers: (state) => state.assignedCustomers,

    getAllUnReadNum: (state) => {
      return [...state.assignedCustomers].reduce((count, item) => {
        return count + (item.badgeCount || 0);
      }, 0);
    },

    getContactList: (state) => {
      return state.contactList;
    }
  },
});
