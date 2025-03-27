import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const marketRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:send-outlined', // 建议使用标准图标名称
      keepAlive: true,
      order: 300, // 根据实际菜单顺序调整
      title: $t('page.routermenu.massprogram.title'),
    },
    name: 'MarketManagement',
    path: '/market',
    redirect: '/market/broadcast', // 默认重定向到消息群发
    children: [
      // 消息群发
      // {
      //   meta: {
      //     icon: 'ant-design:cluster-outlined',
      //     title: $t('消息群發'),
      //     keepAlive: true,
      //   },
      //   name: 'MarketBroadcast',
      //   path: 'broadcast',
      //   component: () => import('#/views/market/broadcast/index.vue'),
      // },
      // WhatsApp模板
      {
        meta: {
          icon: 'ant-design:one-to-one-outlined',
          title: $t('page.routermenu.massprogram.whatsapp.whatsappTemple'),
          keepAlive: true,
        },
        name: 'MarketTemplates',
        path: 'templates',
        component: () => import('#/views/market/templates/index.vue'),
      },
      // 创建模板
      {
        meta: {
          icon: 'ant-design:file-add-outlined',
          title: $t('page.routermenu.massprogram.whatsapp.create'),
          keepAlive: true,
        },
        name: 'MarketCreateTemplate',
        path: 'create-template',
        component: () => import('#/views/market/create/index.vue'),
      },
    ],
  },
];

export default marketRoutes;
