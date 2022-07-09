const path = require('path');
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import';
import {vitePluginChunk} from './IvzVitePlugins'
// https://vitejs.dev/config/
export default defineConfig((env)=>{
  return {
    plugins: [
      vue(),
      vueJsx(),
      styleImport({
        libs: [{
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/css`;
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
          target: 'http://www.iteaj.com',
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    },
    optimizeDeps: {
      include: ["@ant-design/icons-vue"],
    },

    build: {
      cssCodeSplit: true,
    }
  }
})
