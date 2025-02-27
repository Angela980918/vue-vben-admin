import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const chatRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:message-outlined',
      keepAlive: true,
      order: 100,
      title: '在綫聊天',
    },
    name: 'Chat',
    path: '/chat',
    redirect: '/chat',
    children: [
      {
        meta: {
          title: $t('在綫聊天'),
          hideInMenu: true,
          hideInBreadcrumb: true,
        },
        name: 'ChatPage',
        path: '/chat',
        component: () => import('#/views/chat/index.vue'),
      },
    ],
  },
];

export default chatRoutes;
