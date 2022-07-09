const path = require('path');
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import';
import {htmlCdnPlugin, replaceImporter} from './IvzVitePlugins'

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
      {
        augmentChunkHash: ({name, modules}) => {
          // console.log(modules)
        },
        generateBundle: (options, bundle, isWrite) => {
          // console.log(`${bundle.fileName} -- ${isWrite}`)
        },
        renderChunk: (code, chunk, options) => {
          // console.log(`${options.assetFileNames} -- ${options.chunkFileNames}`)
          return code;
        },
        outputOptions: (options) => {
          options.manualChunks = (id, {getModuleInfo, getModuleIds}) => {
            if(id.includes('node_modules/ant-design-vue')) {
              return 'antd.min.esm'
            } else if(id.includes('node_modules/moment')) {
              return 'moment.min.esm'
            } else if(id.includes('node_modules/vue/')) {
              return 'vue.runtime.esm'
            } else if(id.includes('node_modules/vue-router/')) {
              return 'vue-router.esm'
            } else if(id.includes('node_modules/vuex/')) {
              return 'vuex.esm'
            } else if(id.includes('node_modules')) {
              return 'vendor'
            }
          }
          options.assetFileNames = (chunk) => {
            if(chunk.name.includes('antd.min')) {
              return `lib/${chunk.name}`
            }
            return 'assets/[name].[hash].[ext]';
          }
          options.chunkFileNames = (chunk) => {
            if(chunk.name.includes('esm')) {
              return 'lib/[name].js'
            }

            return 'assets/[name].[hash].js';
          }

          return options;
        },
      }
      // replaceImporter,
      // htmlCdnPlugin(env)
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
      include: ["@ant-design/icons-vue", '/src/views/**'],
      exclude: ['moment/dist/locale/zh-cn']
    },

    build: {
      cssCodeSplit: true,
      rollupOptions: {
        // 以下库通过cdn提供
        // external: ['vue', 'vuex', 'ant-design-vue', 'vue-router', 'moment'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            vuex: 'Vuex',
            moment: 'moment',
            'ant-design-vue': 'antd',
            'vue-router': 'VueRouter'
          }
        }
      }
    }
  }
})
