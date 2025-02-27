import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const reportRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:file-text-outlined',
      keepAlive: true,
      order: 500,
      title: '報告',
    },
    name: 'Report',
    path: '/report',
    redirect: '/report',
    children: [
      {
        meta: {
          title: $t('報告'),
          hideInMenu: true,
          hideInBreadcrumb: true,
        },
        name: 'ReportPage',
        path: '/report',
        component: () => import('#/views/report/index.vue'),
      },
    ],
  },
];

export default reportRoutes;
