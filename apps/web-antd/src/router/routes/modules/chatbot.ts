import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const chatBotRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:robot-outlined',
      keepAlive: true,
      order: 400,
      title: 'Live Chat',
    },
    name: 'Chatbot',
    path: '/chatbot',
    redirect: '/chatbot',
    children: [
      {
        meta: {
          title: $t('Live Chat'),
          hideInMenu: true,
          hideInBreadcrumb: true,
        },
        name: 'ChatbotPage',
        path: '/chatbot',
        component: () => import('#/views/chatbot/index.vue'),
      },
    ],
  },
];

export default chatBotRoutes;
