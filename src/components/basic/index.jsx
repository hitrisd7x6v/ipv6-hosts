import {computed, defineComponent, inject, mergeProps, provide, ref} from "vue";
import {FuncContextKey, RowContextKey} from "@/utils/ProvideKeys";
import {msgError} from "@/utils/message";
import {EditContext, SearchContext, TableContext, DetailContext, Config, ChildConfig} from "@/components/view/Context";
import {FuncNameMeta} from "@/utils/MetaUtils";
import {mapGetters} from "vuex";
import CoreConsts from "@/components/CoreConsts";
import SysUtils from "@/utils/SysUtils";

export const URow = defineComponent({
    name: 'URow',
    props: ['col'],
    setup({col}) {
        let colConfig = col
        if(typeof col == 'string') {
            colConfig = {...CoreConsts.TypeColConfig[col]};
        }

        provide(RowContextKey, colConfig || {});
    },
    render() {
        return <ARow {...this.$attrs} v-slots={this.$slots} class="u-row" />
    }
})

/**
 * 比如提交的按钮一般放在对应的编辑组件下面
 * @param config {Config}
 * @param context {EditContext | TableContext | SearchContext | DetailContext}
 * @return {*}
 */
function syncToUidToConfig(config, context) {
    let {eid, tid, sid, did} = config;
    let func = config.func.toUpperCase();
    // 如果未指定操作的组件, 则默认都是Primary组件
    if(eid == null) {
        switch (func) {
            case FuncNameMeta.RESET:
            case FuncNameMeta.CANCEL:
            case FuncNameMeta.SUBMIT:
                config.eid = context.uid; break;
            default:
                config.eid = CoreConsts.DefaultEditUid; break;
        }
    }
    if(tid == null) {
        config.tid = CoreConsts.DefaultTableUid;
    }
    if(sid == null) {
        config.sid = CoreConsts.DefaultSearchUid;
    }
    if(did == null) {
        config.did = CoreConsts.DefaultDetailUid;
    }

    config.context = context;
    return config;
}
function funcClickHandle(context, props) {
    if(context != null) {
        let $view = context.get$View();
        let split = props.func.split(':'); // func:id e.g [edit:modPwd]
        let config = {...props}
        syncToUidToConfig(config, context);
        if(split.length == 1) { // 主功能：func e.g [edit]
            let func = props.func.toUpperCase();
            switch (func) {
                case CoreConsts.FuncNameMeta.ADD:
                    return $view.openForAdd(config);
                case CoreConsts.FuncNameMeta.DEL:
                    return $view.del(config);
                case CoreConsts.FuncNameMeta.EDIT:
                    return $view.openForEdit(config);
                case CoreConsts.FuncNameMeta.DETAIL:
                    return $view.detail(config);
                case CoreConsts.FuncNameMeta.QUERY:
                    return $view.query(config);
                case CoreConsts.FuncNameMeta.CANCEL:
                    return $view.cancel(config);
                case CoreConsts.FuncNameMeta.RESET:
                    if(context instanceof EditContext) {
                        return $view.resetEditModel(config);
                    } else if(context instanceof SearchContext) {
                        return $view.resetSearchModel(config)
                    } else {
                        return console.error(`[reset]功能不支持上下文[${context}]只支持[EditContext、SearchContext]`);
                    }
                case CoreConsts.FuncNameMeta.SUBMIT:
                    return $view.submit(config);
                case CoreConsts.FuncNameMeta.EXPAND:
                    return $view.expanded(config); // 展开所有行
                case CoreConsts.FuncNameMeta.IMPORT:
                    return $view.excelImport(config);
                case CoreConsts.FuncNameMeta.EXPAND:
                    return $view.excelExport(config);
                case CoreConsts.FuncNameMeta.CONFIRM:
                    return $view.confirm(config);
                case CoreConsts.FuncNameMeta.EXEC:
                    return $view.otherFuncExec(config);
                default: // 其他功能操作
                    return console.warn(`不支持的功能[${props.func}]`)
            }
        } else {
            let child = split[1]; // 子功能
            let func = split[0].toUpperCase(); // func大写
            if(func == FuncNameMeta.ADD || func == FuncNameMeta.EDIT) {
                // 增加子记录(只有主视图组件才支持)
                if(child == 'child') {
                    $view.openForChild(config);
                } else if(child == 'set') {
                    $view.openForSet(config);
                } else {
                    console.warn(`未定义的子功能[${props.func}]`)
                }
            } else {
                console.warn(`未定义的功能[${props.func}]`)
            }
        }
    }
}

export const UFuncTag = defineComponent({
    name: 'UFuncTag',
    props: {
        url: String,
        color: String,
        eid: String,
        tid: String,
        sid: String,
        did: String,
        onClick: Function, // 自定义单击处理
        data: {type: Object}, // 行数据
        disabled: {default: false}, // 是否禁用
        config: {type: Object, default: () => { return {}}}, // 配置
        func: {type: String, required: true}, // add, del, edit, query, import, export, cancel, detail, reset, expand, ...
    },
    setup(props) {
        /**
         * @type {DetailContext | EditContext | TableContext | SearchContext}
         */
        let context = inject(FuncContextKey);

        let disabled = computed(() => {
            if(typeof props.disabled == 'function') {
                return props.disabled(props.data);
            } else {
                return props.disabled === true;
            }
        });

        let clickProxy = (e) => {
            if(!disabled.value) {
                if(props.onClick instanceof Function) {
                    props.onClick(props.data)
                } else {
                    if(context != null) {
                        funcClickHandle(context, props)
                    } else {
                        console.warn("无效的操作(需要自定义事件或者在指定的组件下面)")
                    }
                }
            }
        }

        let typeCompute = computed(() => props.func.toUpperCase())

        // 注册功能点
        context.getLinkContext().registerFunc({
            trigger: clickProxy,
            getUrl: () => props.url,
            getContext: () => context,
            setLoading: status => null,
            getProp: (key) => props[key],
            getFunc: () => typeCompute.value,
            getMethod: () => props.config.method
        })

        let viewContext = context.get$View().getViewContext();
        return {clickProxy, context, typeCompute, viewContext, disabled};
    },
    computed: {
        ...mapGetters({
            auth: 'sys/authMenuMap'
        }),
        tagColor() {
            return this.color || CoreConsts.FuncTagColorMaps[this.typeCompute] || 'blue'
        }
    },
    render() {
        /**
         * 1. 有传入url的才需要校验功能权限
         * 2. 在视图组件声明 auth
         * 3. 返回的权限列表里包含传入的 url
         */
        if(this.url && this.viewContext.isAuth()) {// 需要权限验证, 并且存在权限
            // 去除url的参数, 后台返回的url不能包含参数
            let uri = SysUtils.cutUrlToUri(this.url);
            if(this.auth[uri]) { // 有权限
                let tagColor = this.disabled ? '#d8d8d8' : this.tagColor;
                let disabledClass = this.disabled ? 'ivz-func-disabled' : 'ivz-func-tag'
                return <ATag closable={false} visible={true} class={disabledClass} class="ivz-func"
                             color={tagColor} onClick={this.clickProxy} v-slots={this.$slots} />
            } else {
                return <span></span>
            }
        } else {
            let tagColor = this.disabled ? '#d8d8d8' : this.tagColor;
            let disabledClass = this.disabled ? 'ivz-func-disabled' : 'ivz-func-tag'
            return <ATag closable={false} visible={true} class={disabledClass} class="ivz-func"
                         color={tagColor} onClick={this.clickProxy} v-slots={this.$slots} />
        }
    },
    methods: {
        trigger() {
            this.clickProxy();
        },
    }
})

/**
 * 功能按钮, 可以指定url, 功能类型
 * 注：只适用于编辑组件包括不限于(搜索组件, 编辑组件)等编辑组件
 * @type {DefineComponent<{func: {default: string, type: StringConstructor}, meta: {default: (function(): {}), type: ObjectConstructor}, url: {type: StringConstructor}}, unknown, unknown, {typeCompute(): *}, {}, ComponentOptionsMixin, ComponentOptionsMixin, Record<string, any>, string>}
 */
export const UFuncBtn = defineComponent({
    name: 'UFuncBtn',
    props: {
        eid: String,
        tid: String,
        sid: String,
        did: String,
        onClick: Function,
        url: {type: String}, // 功能地址
        data: {type: Object},
        method: {type: String, default: null}, // 请求方法
        config: {type: Object, default: () => { return {}}}, // 配置
        func: {type: String, required: true, default: ''},  // add, del, edit, query, import, export, cancel, detail, reset
    },
    setup(props, {attrs}) {
        /**
         * @type {EditContext | SearchContext | DetailContext | SearchContext}
         */
        let context = inject(FuncContextKey);
        let clickProxy = {onClick: (e) => {
                if(props.onClick instanceof Function) {
                    props.onClick(e);
                } else if(context != null) {
                    funcClickHandle(context, props)
                }else {
                    console.warn(`无效的操作(需要自定义事件或者在指定的组件下面)`)
                }
            }
        }

        let loading = ref(false);
        let typeCompute = computed(() => props.func.toUpperCase())
        context.getLinkContext().registerFunc({
            getUrl: () => props.url,
            getContext: () => context,
            trigger: clickProxy.onClick,
            getProp: (key) => props[key],
            getFunc: () => typeCompute.value,
            getMethod: () => props.config.method,
            setLoading: (status) => loading.value = status // 设置按钮的加载状态
        })

        let viewContext = context.get$View().getViewContext();
        return {clickProxy, context, loading, typeCompute, viewContext};
    },
    computed: {
        ...mapGetters({
            auth: 'sys/authMenuMap'
        })
    },
    render() {
        /**
         * 1. 有传入url的才需要校验功能权限
         * 2. 在视图组件声明 auth
         * 3. 返回的权限列表里包含传入的 url
         */
        if(this.url && this.viewContext.isAuth()) {// 需要权限验证, 并且存在权限
            let uri = SysUtils.cutUrlToUri(this.url);
            if(this.auth[uri]) { // 有权限
                return <AButton {...this.handleProps()} v-slots={this.$slots} style="margin: 0px 3px" loading={this.loading} />
            } else {
                return <span></span>
            }
        } else {
            return <AButton {...this.handleProps()} v-slots={this.$slots} style="margin: 0px 3px" loading={this.loading} />
        }
    },
    methods: {
        trigger() {
            this.clickProxy.onClick();
        },
        handleProps() {
            let type = CoreConsts.FuncBtnTypeMaps[this.typeCompute];
            return mergeProps(type, this.clickProxy, this.$attrs);
        }
    }
})

export const UTree = defineComponent({
    name: 'UTree',
    props: {
        url: {type: String}, // 数据地址
        onCheck: {type: Function},
        checkedUrl: {type: String}, // 多选框的数据地址
        selectedUrl: {type: String}, // 选中的数据地址
        replaceFields: {type: Object, default: {key: CoreConsts.DefaultRowKey, title: 'name', children:'children'}}
    },
    setup(props, {emit}) {
        let allKeys = ref([]);
        let treeData = ref([]);
        let checkedKeys = ref([]);
        let expandedKeys = ref([]);
        let selectedKeys = ref([]);

        return {allKeys, treeData, selectedKeys, checkedKeys, expandedKeys}
    },
    watch: {
        url(newUrl) {
            this.loadingInitData(newUrl)
        },
        checkedUrl(newUrl) {
            this.loadingCheckedData(newUrl).finally(() => null)
        },
        selectedUrl(newUrl) {
            this.loadingSelectedData(newUrl).finally(() => null)
        }
    },
    created() {
        if(this.url) {
            this.loadingInitData(this.url);
        }

        if(this.checkedUrl) {
            this.loadingCheckedData(this.checkedUrl).finally(() => {})
        }

        if(this.selectedUrl) {
            this.loadingSelectedData(this.selectedUrl).finally(() => {})
        }
    },
    render() {
        return <ATree {...this.$attrs} v-models={[
            [this.checkedKeys, 'checkedKeys', ["modifier"]],
            [this.selectedKeys, 'selectedKeys', ["modifier"]],
            [this.expandedKeys, 'expandedKeys', ["modifier"]]
        ]} treeData={this.treeData} replaceFields={this.replaceFields}>
        </ATree>
    },
    methods: {
        loadingInitData(dataUrl) {
            this.$http.get(dataUrl).then(({code, message, data}) => {
                if(code == 200) {
                    this.treeData = data;
                    this.initAllKeys(data);
                } else {
                    msgError(message);
                }
            }).catch(reason => console.error(reason));
        },
        /**
         * @param selectedUrl
         * @returns {Promise<AxiosResponse<any>>}
         */
        loadingSelectedData(selectedUrl) {
            return this.$http.get(selectedUrl).then((resp) => {
                let {code, message, data} = resp;
                if(code == 200) {
                    this.selectedKeys = data;
                } else {
                    msgError(message)
                }
                return resp;
            }).catch(reason => console.error(reason));
        },
        /**
         * @param checkedUrl
         * @returns {Promise<AxiosResponse<any>>}
         */
        loadingCheckedData(checkedUrl) {
            return this.$http.get(checkedUrl).then((resp) => {
                let {code, message, data} = resp;
                if(code == 200) {
                    this.checkedKeys = data;
                } else {
                    msgError(message)
                }
                return resp;
            }).catch(reason => console.error(reason));
        },
        /**
         * @returns {Array}
         */
        getSelectedKeys() {
            return this.selectedKeys;
        },
        setSelectedKeys(selectedKeys) {
            if(selectedKeys instanceof Array) {
                this.selectedKeys = selectedKeys;
            } else {
                this.selectedKeys = this.allKeys;
            }
        },
        /**
         * @returns {Array}
         */
        getCheckedKeys() {
            return this.checkedKeys;
        },

        setCheckedKeys(checkedKeys) {
            if(checkedKeys instanceof Array) {
                this.checkedKeys = checkedKeys
            } else if(checkedKeys == null) {
                this.checkedKeys = [];
            } else {
                this.checkedKeys = this.allKeys;
            }
        },

        getExpandedKeys() {
            return this.expandedKeys;
        },

        /**
         * 设置展开的行的key
         * @param expandedKeys 如果不指定则展开所有
         */
        setExpandedKeys(expandedKeys) {
            if(expandedKeys instanceof Array) {
                this.expandedKeys = expandedKeys;
            } else {
                this.expandedKeys = this.allKeys;
            }
        },

        initAllKeys(data) {
            if(data instanceof Array) {
                data.forEach(item => {
                    this.allKeys.push(item[this.replaceFields.key]);

                    let children = item[this.replaceFields.children];
                    if(children instanceof Array) {
                        this.initAllKeys(children);
                    }
                })
            }
        }
    }
})

export default {
    install(app) {
        app.component(URow.name, URow)
        app.component(UTree.name, UTree)
        app.component(UFuncBtn.name, UFuncBtn)
        app.component(UFuncTag.name, UFuncTag)
    }
}
