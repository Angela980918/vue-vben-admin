import { defineConfig } from '@vben/vite-config';

import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        Components({
          resolvers: [
            AntDesignVueResolver({
              importStyle: false,
            }),
          ],
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
          '/test': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\//, ''),
            // mock代理目标地址
            target: 'https://api.ycloud.com',
            ws: true,
          },
          '/v2': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/v2/, ''),
            // mock代理目标地址
            target: 'https://api.ycloud.com/v2',
            ws: true,
          },
        },
      },
    },
  };
});
