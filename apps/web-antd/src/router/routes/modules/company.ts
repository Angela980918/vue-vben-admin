import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const reportRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:rocket-outlined',
      keepAlive: true,
      order: 600,
      title: '公司',
    },
    name: 'Company',
    path: '/company',
    redirect: '/company',
    children: [
      {
        meta: {
          title: $t('公司'),
          hideInMenu: true,
          hideInBreadcrumb: true,
        },
        name: 'CompanyPage',
        path: '/company',
        component: () => import('#/views/company/index.vue'),
      },
    ],
  },
];

export default reportRoutes;
