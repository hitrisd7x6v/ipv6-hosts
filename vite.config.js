const path = require('path');
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://github.com/vuejs/jsx-next#syntax
import vueJsx from '@vitejs/plugin-vue-jsx'

import vitePluginVueDoc, { vueDocFiles } from 'vite-plugin-vuedoc'
import styleImport from 'vite-plugin-style-import';
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
      styleImport({
        libs: [{
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style`;
          },
          resolveComponent: (name) => {
            return `ant-design-vue/es/${name}`;
          },
        },{
          libraryName: 'ivz-online',
          esModule: true,
          resolveStyle: (name) => {
            return `ivz-online/dist/index.css`;
          },
        }]
      }),
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
        '^/api/.*': {
          changeOrigin: true,
          target: 'http://192.168.43.197:8085',
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    },
    optimizeDeps: {
      include: ["@ant-design/icons-vue"],
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
    }
  }
})
