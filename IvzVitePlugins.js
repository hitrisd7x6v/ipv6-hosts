export const vitePluginChunk = {
    name: 'vite-plugin-chunk',
    outputOptions: (options) => {
        options.manualChunks = (id, {getModuleInfo, getModuleIds}) => {
            if(id.includes('node_modules/ant-design-vue')) {
                if(id.includes("dist/antd.css")) {
                    return "antd.min.css";
                }
                return 'antd.min.esm'
            } else if(id.includes('@ant-design/icons-vue')
                || id.includes('@ant-design/icons-svg')) {
                return 'antd.icons.esm'
            } else if(id.includes('node_modules/moment')) {
                return 'moment.min.esm'
            } else if(id.includes('node_modules/@vue/')) {
                return 'vue.runtime.esm'
            } else if(id.includes('node_modules/vue-router/')) {
                return 'vue-router.esm'
            } else if(id.includes('node_modules/vuex/')) {
                return 'vuex.esm'
            } else if(id.includes('node_modules/axios'
                || id.includes('node_modules/qs'))) {
                return 'axios.qs.esm'
            } else if(id.includes('node_modules/mockjs')) {
                return 'mockjs.esm'
            } else if(id.includes('node_modules')) {
                return 'vendor' // 其他第三方库
            }
        }

        options.assetFileNames = (chunk) => {
            if(chunk.name.includes('antd.min.css')) {
                return `lib/antd.min.css`
            }
            return 'assets/[name].[hash].[ext]';
        }

        options.chunkFileNames = (chunk) => {
            if(chunk.name.includes('esm')) {
                return 'lib/[name].js'
            } else if(chunk.name == 'vendor') {
                return 'assets/[name].js'
            }

            return 'assets/[name].[hash].js';
        }

        return options;
    },
}
