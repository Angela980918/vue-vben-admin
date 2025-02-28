import type { ContactInfo } from '@vben/types';

import { defineStore } from 'pinia';

import { getContactListApi } from '#/api';

interface CustomerState {
  currentUserId: number;
  currentIndex: number;
  currentCustomerInfo: Partial<ContactInfo>;
  assignedCustomers: Array<ContactInfo & { isActive: boolean }>;
  searchWord: string;
  contactList: ContactInfo[];
  page: number;
  total: number;
}

export const useCustomerStore = defineStore('customerStore', {
  state: (): CustomerState => ({
    currentUserId: 1,
    currentIndex: 1,
    currentCustomerInfo: {},
    assignedCustomers: [],
    searchWord: '',
    contactList: [],
    page: 1,
    total: 0,
  }),

  actions: {
    setCurrentUser(id: number): void {
      this.currentUserId = id;
    },

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
      console.log('response', response);
      if (response) {
        this.total = response.total;
        this.contactList = response.items.map((item) => ({
          ...item,
          key: item.id,
        }));
      }
    },

    async changeContactList(page: number): Promise<void> {
      this.page = page;
      const response = await getContactListApi(page, 10);
      if (response) {
        this.total = response.total;
        this.contactList = response.items.map((item) => ({
          ...item,
          key: item.id,
        }));
      }
    },

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
  },

  getters: {
    getAssignedCustomers: (state) => state.assignedCustomers,

    getAllUnReadNum: (state) => {
      return [...state.assignedCustomers].reduce((count, item) => {
        return count + (item.badgeCount || 0);
      }, 0);
    },
  },
});
