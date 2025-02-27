import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '测试',
    },
    name: 'Test',
    path: '/test',
    children: [
      {
        path: 'test1',
        name: 'AboutPage1',
        component: () =>
          import('#/views/myComponents/firstPageForRouterTest1.vue'),
        meta: {
          title: '测试1',
          icon: 'simple-icons:about-dot-me',
        },
      },
      {
        path: 'test2',
        name: 'AboutPage2',
        component: () =>
          import('#/views/myComponents/firstPageForRouterTest2.vue'),
        meta: {
          title: '测试2',
          icon: 'simple-icons:about-dot-me',
        },
      },
      {
        path: 'test3',
        name: 'AboutPage3',
        component: () =>
          import('#/views/myComponents/firstPageForRouterTest3.vue'),
        meta: {
          title: '测试3',
          icon: 'simple-icons:about-dot-me',
        },
      },
    ],
  },
];

export default routes;
