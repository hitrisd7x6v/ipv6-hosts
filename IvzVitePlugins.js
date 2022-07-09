const htmlCdnPlugin = (env) => {
    let cdnLib =
        `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ant-design-vue@2.1.6/dist/antd.min.css">
    
    <script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@3.0.11/dist/vue.runtime.global.prod.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuex@4.0.0/dist/vuex.global.prod.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-router@4.0.8/dist/vue-router.global.prod.js"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/locale/zh-cn.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ant-design-vue@2.1.6/dist/antd.min.js"></script>
    `
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            // 如果是生产环境使用cdn或者本地库
            if(env.mode == 'production') {
                return html.replace('<meta cdn/>', cdnLib);
            } else {
                return html;
            }
        }
    }
}

const replaceImporter = {
    name: 'replace-importer',
    augmentChunkHash: (a, b) => {
        // console.log(a);
      return ""
    },
    renderDynamicImport: (a, b) => {
        console.log(a);
    },
    outputOptions: (options) => {
        Object.assign(options, {format: 'amd'
        })
        return options
    },
    renderChunk(code) {
        return { code, map: null }
    }
}

export {htmlCdnPlugin, replaceImporter}
