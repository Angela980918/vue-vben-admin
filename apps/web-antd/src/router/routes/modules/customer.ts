import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const customerRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:usergroup-add-outlined',
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
          icon: 'ant-design:team-outlined',
          title: $t('客戶列表'),
          keepAlive: true,
        },
        name: 'CustomerList',
        path: 'list',
        component: () => import('#/views/customer/list/index.vue'),
      },
      // 會話列表
      // {
      //   meta: {
      //     icon: 'ant-design:comment-outlined',
      //     title: $t('會話列表'),
      //     keepAlive: true,
      //   },
      //   name: 'SessionList',
      //   path: 'sessions',
      //   component: () => import('#/views/customer/sessions/index.vue'),
      // },
      // 標簽管理
      // {
      //   meta: {
      //     icon: 'ant-design:tags-outlined',
      //     title: $t('標簽管理'),
      //     keepAlive: true,
      //   },
      //   name: 'TagManagement',
      //   path: 'tags',
      //   component: () => import('#/views/customer/tags/index.vue'),
      // },
      // 快捷用語
      {
        meta: {
          icon: 'ant-design:file-text-outlined',
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
          icon: 'ant-design:file-add-outlined',
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

export default customerRoutes;
