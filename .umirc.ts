import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/index', component: '@/pages/index' },
    { path: '/', component: '@/pages/home' },
  ],
  fastRefresh: {},
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
});
