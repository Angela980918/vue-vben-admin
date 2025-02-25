import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'token:user-manage', // 根据实际图标库调整
      keepAlive: true,
      order: 200,
      title: '客戶管理',
    },
    name: 'CustomerManagement',
    path: '/customer',
    redirect: '/customer/list', // 默认重定向到客戶列表
    children: [
      // 客戶列表
      {
        meta: {
          title: $t('客戶列表'),
          keepAlive: true,
        },
        name: 'CustomerList',
        path: 'list',
        component: () => import('#/views/customer/list/index.vue'),
      },
      // 會話列表
      {
        meta: {
          title: $t('會話列表'),
          keepAlive: true,
        },
        name: 'SessionList',
        path: 'sessions',
        component: () => import('#/views/customer/sessions/index.vue'),
      },
      // 標簽管理
      {
        meta: {
          title: $t('標簽管理'),
          keepAlive: true,
        },
        name: 'TagManagement',
        path: 'tags',
        component: () => import('#/views/customer/tags/index.vue'),
      },
      // 快捷用語
      {
        meta: {
          title: $t('快捷用語'),
          keepAlive: true,
        },
        name: 'QuickPhrase',
        path: 'phrases',
        component: () => import('#/views/customer/phrases/index.vue'),
      },
      // 素材管理
      {
        meta: {
          title: $t('素材管理'),
          keepAlive: true,
        },
        name: 'MaterialManagement',
        path: 'materials',
        component: () => import('#/views/customer/materials/index.vue'),
      },
    ],
  },
];

export default routes;
