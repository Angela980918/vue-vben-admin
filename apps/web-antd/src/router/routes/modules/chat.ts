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
      title: $t('page.routermenu.chat.title'),
    },
    name: 'Chat',
    path: '/chat',
    redirect: '/chat',
    children: [
      {
        meta: {
          title: $t('page.routermenu.chat.title'),
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
