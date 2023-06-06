const path = require('path');
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// https://github.com/vuejs/jsx-next#syntax
import vueJsx from '@vitejs/plugin-vue-jsx'

import vitePluginVueDoc, {vueDocFiles} from 'vite-plugin-vuedoc'
import {vitePluginChunk} from './IvzVitePlugins'
// https://vitejs.dev/config/
export default defineConfig((env)=>{
  return {
    plugins: [
      vitePluginVueDoc({}), // 必须放在plugin-vue插件之前
      vue({
        include: [...vueDocFiles]
      }),
      vueJsx(),
      vitePluginChunk
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@msn': path.resolve(__dirname, './src/views')
      }
    },
    server: {
      proxy: {
        '^/api/*': {
          changeOrigin: true,
          // 线上测试地址, 只支持浏览数据
          target: 'http://demo.iteaj.com',
          // 本地开发地址, 需要运行对应的java后端[https://gitee.com/iteaj/izone-sboot]
          // target: 'http://127.0.0.1:8085',
          // rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    },
    optimizeDeps: {
      include: [],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: {
      cssCodeSplit: true,
      polyfillModulePreload: false
    }
  }
})
