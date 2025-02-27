import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/v2': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\//, ''),
            // mock代理目标地址
            target: 'https://api.ycloud.com',
            ws: true,
          },
          '/test': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\//, ''),
            // mock代理目标地址
            target: 'https://api.ycloud.com',
            ws: true,
          },
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },

        },
      },
    },
  };
});
