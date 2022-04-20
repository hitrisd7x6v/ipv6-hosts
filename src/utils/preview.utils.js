export default {
    UmdJs: `
    <script src="https://cdn.jsdelivr.net/npm/vue"><\/script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.24.0/min/moment.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/moment@2.24.0/locale/zh-cn.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/ant-design-vue@1.6.3/dist/antd.min.js"><\/script>`,
    UmdCss: `<link href="https://cdn.jsdelivr.net/npm/ant-design-vue@1.6.3/dist/antd.min.css" rel="stylesheet">`,
    resolverPageConfigTemplate(config) {
        return this.resolverObjectTemplate(config, 5);
    },
    resolverPageMetasTemplate(metas) {
        let metasTemp = "[\r\n";
        metas.forEach(meta => {
            if(meta.type == 'action') return;

            let defaultValue = meta['default'] ? `, default: ${meta.default}` : '';
            let rule = "", dataSource = "", clear = "", view = "", required = '', config = '';
            if(meta['rule']) {
                let value = meta[meta['rule']];
                rule = `, ${meta['rule'] +': ' + (value ? value : '\"\"')}`;
                delete meta['rule'];
            }
            if(meta['isForm'] === false) view += ", isForm: false";
            if(meta['isTable'] === false) view = `, isTable: false`;
            if(meta['isDetail'] === false) view += ", isDetail: false";
            if(meta['required']) required = ', required: true';
            if(meta['clear']) clear = `, clear: true`;
            if(meta['dictType']) {
                dataSource = `, dictType: "${meta['dictType']}"`;
            } else if(meta['url']) {
                dataSource = `, url: "${meta['url']}"`;
            } else if(meta['data']) {
                dataSource = `, data: ${meta['data']}`;
            }
            config = Object.keys(meta.config).length > 0 ? `, config: ` + this.resolverObjectTemplate(meta.config, 7) : "";
            metasTemp += `\t\t\t\t\t\t\t{field: "${meta.field}", title: "${meta.title}", type: '${meta.type}'${defaultValue}${required}${rule}${dataSource}${clear}${view}${config}},\r\n`
        });

        return metasTemp + "\t\t\t\t\t\t]";
    },
    resolverPageSearchMetasTemplate(searchMetas) {
        let searchMetasTemp = "[\r\n";
        searchMetas.forEach(meta => {
            if(meta.type == 'action') return;

            let dataSource = "", clear = "";
            let defaultValue = meta['default'] ? `, default: ${meta.default}` : '';
            if(meta['clear']) {
                clear = `, clear: ${meta.clear}`;
            }
            if(meta['dictType']) {
                dataSource = `, dictType: "${meta['dictType']}"`;
            } else if(meta['url']) {
                dataSource = `, url: "${meta['url']}"`;
            } else if(meta['data']) {
                dataSource = `, data: ${meta['data']}`;
            }
            searchMetasTemp += `\t\t\t\t\t\t\t{field: "${meta.field}", title: "${meta.title}", type: '${meta.type}'${defaultValue}${clear}${dataSource}, config: {}},\r\n`
        });

        return searchMetasTemp + "\t\t\t\t\t\t]";
    },
    resolverPermConfigTemplate(config) {
        let metas = config.metas || [];
        let metasTemp = "";
        metas.forEach(meta => {
            if(meta.type == 'action') return;

            let defaultValue = meta['default'] ? `, default: ${meta.default}` : '';
            metasTemp += `{field: "${meta.field}", title: "${meta.title}", type: '${meta.type}'${defaultValue}, clear: ${meta.clear}, config: {}},\r\n\t\t\t\t\t\t\t`
        });
        let configStr = this.resolverObjectTemplate(config.config, 6);
                    return `{
                        width: ${config.width},
                        title: '${config.title}',
                        metas: [
                            ${metasTemp}
                        ],
                        config:  ${configStr}
                    }`;
    },
    resolverPermCallbackTemplate(permId) {
        return `this.$page.setActionMeta('${permId}', {
                    callBack: function (row) {
                        return new Promise(function (resolve, reject) {
                            vue.$refs['${permId}Ref'].open(row);
                        })
                    }
                });\r\n\t\t\t\t`
    },
    resolverObjectTemplate(obj, space) {
        if(!obj) return '{}';
        let tabs = this.getTabNum(space);
        let template = `{`;
        let _this = this;
        function doResolverObjectTemplate(obj, spaceNum) {

            Object.keys(obj).forEach(key => {
                let keyValue = obj[key];
                if(keyValue && typeof keyValue == 'object') {
                    let tabs1 = _this.getTabNum(spaceNum);
                    template += `\n${tabs1}${key}: {`
                    doResolverObjectTemplate(keyValue, spaceNum + 1);
                    template += `\n${tabs1}},`
                } else {
                    let fieldTabs = _this.getTabNum(spaceNum);
                    let value = typeof keyValue == 'string' ? `"${keyValue}"` : keyValue;
                    template += `\n${fieldTabs}` + `${key}: ${value},`
                }
            })
        }
        doResolverObjectTemplate(obj, space + 1);
        return template + `\n${tabs}}`;
    },
    getTabNum(num) {
        let tab = '';
        for (let i=0; i<num; i++) {
            tab += '\t';
        }
        return tab;
    }
}
