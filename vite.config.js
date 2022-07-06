import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig((env)=>{
  return {
    plugins: [
      vue(),
      styleImport({
        libs: [{
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/css`;
          },
        }]
      })
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
      // lib: {
      //   entry: path.resolve(__dirname, 'src'),
      //   name: 'ivz',
      //   formats: ['umd']
      // },
      rollupOptions: {
        // 请确保外部化那些你的库中不需要的依赖
        // external: ['vue', 'ant-design-vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            // vue: 'Vue',
            // 'ant-design-vue': 'Antd'
          }
        }
      }
    }
  }
})
