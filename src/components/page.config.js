/* 每个子页面都需要用到的对象 */
import '@/utils' // 导入基础类库
import Vue from 'vue'
import VueRouter from 'vue-router'
import Logger from '@/utils/logger.utils'
import Utils from '@/utils/basic.utils'
import Resolver from '@/utils/resolver.utils'
import moment from "moment";

Vue.use(VueRouter);
// 获取父框架的缓存api对象
let cacheApi = window.parent.CacheApi;

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
    let url = location;
    if(location instanceof Object) {
        url = location['path'];
    }
    // 以/IvzSys开头的路径属于页级路由路径, 将使用vue-router的push行为
    if(url.startsWith("/IvzSys")) { // 系统页级路由, 不改变其行为
        return routerPush.call(this, location).catch(error => {
            if(!window.location.href.includes('/IvzSys/void'))
                routerPush.call(this, '/IvzSys/void')
        })
    } else { // 其他路径将会重新打开一个页面
        cacheApi.openMenu(location)
    }
}
const router = new VueRouter(
    {
        routes: [// 每个页面的路由配置
            {path: '/IvzSys/view'}, {path: '/IvzSys/add'}, {path: '/IvzSys/edit'}
            , {path: '/IvzSys/cancel'}, {path: '/IvzSys/submit'}, {path: '/IvzSys/detail'}
            , {path: '/IvzSys/void'}
        ]
    }
)

Vue.prototype.$nav = router.push;
Vue.prototype.$cache = cacheApi; // 父页面缓存
Vue.prototype.formSize = 'default'; // 表单尺寸
Vue.prototype.$resolver = Resolver;
Vue.prototype.izCtx = cacheApi.izCtx;
Vue.prototype.izColon = cacheApi.izColon; // 是否显示冒号
Vue.prototype.$getModalContainer = () => { return cacheApi.modalContainer() }; // 模态框插入的位置

export default {
    metas: {}, // 编辑元数据
    vueRef: {}, // 页级视图vue引用
    oriModel: {}, // 编辑表单初始值
    izField: 'id', // 唯一字段, 默认值
    router: router, // 每個頁面路由
    queryField: 'rows', // 数据列表字段
    formSlotMetas: [], // form slot
    oriSearchModel: {}, // 搜索默认数据
    tableSlotMetas: [], // table slot
    detailSlotMetas: [], // detail slot
    editFieldMetaMap: {}, // 编辑表单：field -> meta
    searchFieldMetaMap: {}, // 搜索表单：field -> meta
    menu: cacheApi.currentMenu, // 每个页面对应的菜单
    getMeta(key) {
        return this.editFieldMetaMap[key];
    },
    getSearchMeta(key) {
        return this.searchFieldMetaMap[key];
    },
    getActionMeta(action, options) {
        return cacheApi.getActionMeta(action, options);
    },
    getActionMetas() {
        return cacheApi.getActionMates();
    },
    addActionMeta(action, options) {
        return cacheApi.addActionMeta(action, options);
    },
    setActionMeta(action, options) {
        return cacheApi.setActionMeta(action, options);
    },
    getQueryParams() {
        return cacheApi.currentMenu['IvzQueryParams'];
    },
    getOriModel(vue) {
        return vue.$utils.assignVueProperty({}, this.oriModel, vue);
    },
    bind(params) {
        if(!params) return;

        if(this.getFormRef()) {
            this.getFormRef().setFieldsValue(params);
        } else {
            console.warn("bind只能在编辑页面使用")
        }
    },
    getViewRef() {
        return this.vueRef['viewRef'];
    },
    getFormRef() {
        return this.vueRef['formRef'];
    },
    getListRef() {
        return this.vueRef['listRef'];
    },
    registerPageRef(viewRef, listRef) {
        if(viewRef) this.vueRef['viewRef'] = viewRef;
        if(listRef) this.vueRef['listRef'] = listRef;
    },
    registerFormRef(formRef) {
        this.vueRef['formRef'] = formRef;
    },
    registerPosition (type, mate, mates, moreMates) {
        if (type === 'table') { // 表格元数据
            switch (mate.position) {
                case 'T': mates.push(mate); break
                case 'TM': moreMates.push(mate); break
                case 'AM': mates.push(mate); break
                default: break
            }
        } else { // 搜索栏元数据
            switch (mate.position) {
                case 'M': mates.push(mate); break
                case 'MM': moreMates.push(mate); break
                case 'AM': mates.push(mate); break
                default: break
            }
        }
        mates.sort((a, b) => {
            return a.sort - b.sort
        })
        moreMates.sort((a, b) => {
            return a.sort - b.sort
        })
    },

    /**
     *  解析复杂结构的元数据, {key: name, children: [{key: name1}]}
     * @param mates 元数据对象
     * @param callBack 元数据项处理回调
     */
    resolverMetas (oriMetas, vue, callBack) {
        Resolver.resolverMetas(oriMetas, vue, callBack);
    },
    /**
     * 解析通用的元数据
     * @param metas
     * @param vue
     */
    resolverCommonMetas (metas, vue) {
        Resolver.resolverCommonMetas(metas, vue)
    },
    /**
     * 解析表格的元数据
     * @param metas
     * @param vue
     * @param callBack
     * @returns {Array}
     */
    resolverTableMetas (oriMetas, config, vue, callBack) {
        return Resolver.resolverTableMetas(oriMetas, config, vue, callBack);
    },
    /**
     * 解析元数据之前的默认数据处理
     * @param metas
     * @param formConfig
     * @param vue
     */
    beforeResolverMetasHandle: function (metas, formConfig, vue) {
        // 表单的源编辑模型
        if (!formConfig['oriModel']) vue.$set(formConfig, 'oriModel', {});
        if (formConfig.formType === 'search') { // 说明是搜索表单元数据的解析
            if (formConfig.viewTop === null) { // 没有指定显示的位置, 则根据表单多少来判断, 小于等于3显示在顶栏
                let length = metas.length
                if (!formConfig['column']) {
                    if (length > 3) {
                        formConfig['column'] = 4;
                        formConfig.viewTop = false
                    } else {
                        formConfig['column'] = 3;
                        formConfig.viewTop = true
                    }
                }
            } else if (formConfig.viewTop === false) { // 不放在顶栏, 如果没有指定列, 默认4
                if (!formConfig['column']) formConfig['column'] = 4
            } else { // 放在搜索顶栏上面 如果没有指定 默认3列
                if (!formConfig['column']) formConfig['column'] = 3
            }
        } else { // 编辑表单的解析
            metas.forEach((meta, index) => {
                if (Utils.isNotBlank(meta['metas'])) { // 属于组元数据
                    if (formConfig.type !== 'group') formConfig.type = 'group'
                }
            });

            if (formConfig.type === 'default') { // 表单默认类型为一列
                if (!formConfig['column']) formConfig['column'] = 1
            } else { // 表单为组类型, 默认为3列
                if (!formConfig['column']) formConfig['column'] = 3
            }
            // 编辑的数据源来自于本地表格列表行
            if (formConfig.editSource === 'local') {
                // 没有指定绑定类型, 则本地的默认绑定类型为不绑定
                if (!formConfig.bindType) formConfig.bindType = 'void'
            } else if (formConfig.editSource === 'remote') { // 编辑的数据来自于远程
                // 没有指定绑定类型, 则远程的默认绑定类型为双向绑定
                if (!formConfig.bindType) formConfig.bindType = 'both'
            } else {
                vue.$log.warningLog('错误的数据来源(editSource)', '可选值：local(本地)、remote(远程)', formConfig.editSource)
            }
        }
    },
    /**
     * 解析表单 元数据
     * @param metas
     * @param vue
     * @param callBack
     * @returns {Array}
     */
    resolverFormMetas (oriMetas, formConfig, vue, callBack) {
        if(Utils.isBlank(oriMetas)) return;
        if(!formConfig) {
            Logger.warningLog("没有指定表单解析配置, 将跳过初始化配置"
                , "请检查配置项：config", formConfig);
            return []
        }
        // 设置编辑表单配置项
        this.beforeResolverMetasHandle(oriMetas, formConfig, vue);
        let queryParams = this.getQueryParams() || {};
        return Resolver.resolverFormMetas(oriMetas, formConfig, vue, (meta) => {
            // 如果是编辑表单
            if(this.isEditForm(formConfig)) {
                this.editFieldMetaMap[meta.field] = meta;
                // 解析此表单字段的默认值
                Resolver.resolverMetaDefaultValue(meta, this.oriModel);
            } else if(this.isSearchForm(formConfig)) {
                let param = queryParams[meta.field];
                if(param) { // 覆写掉初始值, 以页面url的参数为准
                    if(Utils.isDate(meta.type)) {
                        meta['decorate']['initialValue'] = moment(param)
                    } else {
                        meta['decorate']['initialValue'] = param
                    }
                }

                this.searchFieldMetaMap[meta.field] = meta;
                Resolver.resolverMetaDefaultValue(meta, this.oriSearchModel)
            }
        });
    },
    resolverSlots(scopedSlots) {
        let noMatcher = false;
        Object.keys(scopedSlots).forEach(name => {
            if(name.startsWith("$")) return;
            let field = Utils.toHump(name.substring(0, name.length-2));
            let meta = this.editFieldMetaMap[field];
            if(!meta) {
                Logger.warningLog(`slot ${name} 找不到匹配的字段 ${field}`
                    , "slot名称必须遵循：如果是驼峰式的字段则必须用'_'隔开");
                return;
            }
            if(name.endsWith('_t')) {
                meta['tableSlot'] = name;
                this.tableSlotMetas.push(meta);
                if(!meta['formatter']) {
                    meta['formatter'] = (val, row, meta) => val;
                }
                meta['scopedSlots'] = {customRender: name};
            } else if(name.endsWith('_f')) {
                meta['formSlot'] = name;
                this.formSlotMetas.push(meta);
            } else if(name.endsWith('_d')) {
                meta['detailSlot'] = name;
                this.detailSlotMetas.push(meta);
            } else {
                noMatcher = true;
                Logger.warningLog(`slot ${name}名称不规范, 将舍弃`, 'slot名称必须以：_f、_t、_d结尾');
            }
        });
        if(noMatcher) {
            Logger.warningLog(`解析slot时名称不规范：`
                , "slot名称遵循以下规范：\r\n 1. 字段名称+表单(_f)、表格(_t)、详情(_d)结尾\r\n 2.驼峰式的字段名要转成a_b形式" +
                "\r\n 3.如：字段userName分别写成user_name_f、user_name_t、user_name_d")
        }
    },
    resolverGroup (group, vue, callBack) {
        Resolver.resolverGroup(group, vue, callBack);
    },
    resolverTree (children, callBack) {
        Resolver.resolverTree(children, callBack);
    },
    /**
     * 设置页(View)组件的默认配置
     * 此配置只能页级别组件才能调用, 以View结尾的为页级别组件
     * @param config
     * @param vue
     */
    initPageDefaultConfig (config, vue) {
        if (!config.form) vue.$set(config, 'form', {});
        if (!config.table) vue.$set(config, 'table', {});
        if (!config.search) vue.$set(config, 'search', {});
        if (!config.detail) vue.$set(config, 'detail', {});

        // 合并详情页默认配置项
        if (!config.detail.isInit) {
            Resolver.mergeDefaultObject(config.detail, cacheApi.pageDefaultConfig.detail, vue);
        }

        // 合并编辑表单默认配置项
        if (!config.form.isInit) {
            Resolver.mergeDefaultObject(config.form, cacheApi.pageDefaultConfig.form, vue)
        }
        // 合并搜索表单默认配置项
        if (!config.search.isInit) {
            Resolver.mergeDefaultObject(config.search, cacheApi.pageDefaultConfig.search, vue)
        }
        // 合并表格默认配置项
        if (!config.table.isInit) {
            if (Utils.isObject(config.table)) {
                Resolver.mergeDefaultObject(config.table, cacheApi.pageDefaultConfig.table, vue)
                Resolver.mergeDefaultPage(config.table['pagination'], vue)
                Resolver.izDefaultTableSelection(config.table, vue)
            } else {
                vue.$log.errorLog('合并表格配置项失败', '传入的配置必须是对象类型', tableConfig)
            }
        }
    },
    getStore (key) { // 获取存储值
        let storeCache = cacheApi.StoreCache
        return storeCache.getPageStore(this.menu['url'], key)
    },
    putStore (key, value) { // 设置存储值
        let storeCache = cacheApi.StoreCache
        storeCache.putPageStore(this.menu['url'], key, value)
    },
    izOptionType (type) {
        return type === 'select' || type === 'radio' || type === 'checkbox' || type === 'stree'
    },
    initFormMate (mate, config, vue) {
        Resolver.initFormMate(mate, config, vue)
    },
    initCommonMate (mate, vue) {
        Resolver.initCommonMate(mate, vue)
    },
    initTableMate (item, config, vue) {
        Resolver.initTableMate(item, config, vue)
    },
    isSearchForm(formConfig) {
        return formConfig.formType == 'search';
    },
    isEditForm(formConfig) {
        return formConfig.formType == 'edit';
    },
}
