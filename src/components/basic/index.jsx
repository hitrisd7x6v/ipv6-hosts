import {computed, defineComponent, inject, mergeProps, provide, ref, watch} from "vue";
import {FuncContextKey, RowContextKey} from "@/utils/ProvideKeys";
import {msgError, msgSuccess, confirm} from "@/utils/message";
import {EditContext, SearchContext, TableContext} from "@/components/view/Context";
import {FuncNameMeta, TypeMethodMaps} from "@/utils/MetaUtils";
import {mapGetters} from "vuex";
import CoreConsts from "@/components/CoreConsts";
import SysUtils from "@/utils/SysUtils";

export const IvzRow = defineComponent({
    name: 'IvzRow',
    props: ['span'],
    setup(props) {
        provide(RowContextKey, {
            span: props.span
        })
    },
    render() {
        return <ARow style="width: 100%;" {...this.$attrs} v-slots={this.$slots} />
    }
})
function funcClickHandle(context, props) {
    if(context != null) {
        let $view = context.get$View();
        let split = props.func.split(':'); // func:id e.g [edit:modPwd]
        if(split.length == 1) { // 主功能：func e.g [edit]
            let func = props.func.toUpperCase();
            if(context.isPrimary) { // 主视图操作, 各个组件联动处理
                switch (func) {
                    case FuncNameMeta.ADD:
                        return $view.openForAdd(props.data);
                    case FuncNameMeta.DEL:
                        if(context instanceof SearchContext) {
                            return $view.batchDel(props.url)
                        }

                        return $view.del(props.url, props.data)
                    case FuncNameMeta.EDIT:
                        return $view.openForEdit(null, props.data);
                    case FuncNameMeta.QUERY:
                        return $view.query(props.url);
                    case FuncNameMeta.CANCEL:
                        return $view.cancel();
                    case FuncNameMeta.RESET:
                        if(context instanceof EditContext) {
                            return $view.resetEditModel();
                        } else if(context instanceof SearchContext) {
                            return $view.resetSearchModel()
                        } else {
                            return console.error(`错误的编辑上线文[${context}]`);
                        }
                    case FuncNameMeta.DETAIL:
                        return $view.detail(props.url);
                    case FuncNameMeta.SUBMIT:
                        return $view.submit(props.url);
                    case FuncNameMeta.EXPAND: return $view.expanded(); // 展开所有行
                    default: // 其他功能操作
                        if(props.url) {
                            if(context instanceof TableContext) {
                                let submit = (resolve) => {
                                    if(!resolve) context.setLoading(true)
                                    TypeMethodMaps.POST(props.url, props.data).then(({code, message}) => {
                                        if(resolve) resolve();

                                        if(code == CoreConsts.SuccessCode) {
                                            $view.query();
                                            msgSuccess(message || CoreConsts.OtherOperaSuccessMsg)
                                        } else {
                                            msgError(message);
                                        }
                                    }).catch(reason => console.error(reason)).finally(() => {
                                        if(resolve) {
                                            resolve();
                                        } else {
                                            context.setLoading(false)
                                        }
                                    })
                                }
                                if(props.confirm) { // 需要确认
                                    confirm({title: CoreConsts.ConfirmTitle
                                        , content: CoreConsts.ConfirmContent, onOk: () => {
                                            return new Promise((resolve, reject) => submit(resolve))
                                        }
                                    })
                                } else {
                                    submit(null);
                                }
                            }
                        }
                }
            } else { // 各个组件单独操作
                if(context instanceof EditContext) {
                    switch (func) {
                        case FuncNameMeta.RESET: return context.reset();
                        case FuncNameMeta.CANCEL:
                            context.reset();
                            context.setLoading(false)
                            return context.cancel();
                        case FuncNameMeta.SUBMIT: return context.submit(props.url);

                        default: console.error(`编辑组件不支持功能类型[${props.func}]`)
                    }
                } else if(context instanceof SearchContext) {
                    switch (func) {
                        case FuncNameMeta.RESET: return context.reset();
                        default: console.error(`编辑组件不支持功能类型[${props.func}]`)
                    }
                } else if(context instanceof TableContext) {
                    switch (func) {
                        case FuncNameMeta.ADD:
                        // return $view.openForAdd();
                        case FuncNameMeta.DEL:
                            return context.del(props.url)
                        case FuncNameMeta.EDIT:
                        // return $view.openForEdit(props.url, props.data);
                        case FuncNameMeta.DETAIL:
                        // return context.detail(props.url);
                        case FuncNameMeta.EXPAND:
                            return context.expanded(); // 展开所有行
                        default: console.error(`表组件不支持功能类型[${props.func}]`)
                    }
                } else {

                }
            }
        } else {
            let id = split[1]; // 组件的特殊属性
            let func = split[0].toUpperCase(); // func大写
            if(func == FuncNameMeta.ADD || func == FuncNameMeta.EDIT) {
                let rowKey = $view.getRowKey();

                // 增加子记录(只有主视图组件才支持)
                if(id == 'child' && func == FuncNameMeta.ADD) {
                    let editContext = $view.getEditContext();
                    if(editContext.isPrimary) {
                        // 打开编辑框并且是指pid
                        editContext.asyncVisible(props.data, true).then(model => {
                            if(props.data && model) {
                                // 设置pid
                                model[props.pid] = props.data[rowKey];
                            }
                        })
                    }
                } else {
                    let editContext = $view.getEditContext(id);
                    if(editContext instanceof EditContext) {
                        if(func == FuncNameMeta.ADD) {
                            editContext.asyncVisible(props.data).finally(() => null);
                        } else {
                            editContext.asyncVisible(props.data).then(model => {
                                if(props.data) {
                                    // 默认用rowKey作为功能的唯一字段
                                    model[rowKey] = props.data[rowKey];
                                }
                            }).finally(() => null);
                        }
                    }
                }

            }
        }
    }
}
const colorMaps = {
    ADD: '#2db7f5', DEL: '#f50', EDIT: '#3b5999', QUERY: '#108ee9', IMPORT: 'default'
    , EXPORT: 'orange',CANCEL: 'red', DETAIL: '#87d068', RESET: 'warning', DEF: 'default'
    , SUBMIT: 'blue', VIEW: '#108ee9'
}
export const IvzFuncTag = defineComponent({
    name: 'IvzFuncTag',
    props: {
        url: String,
        color: String,
        onClick: Function, // 自定义单击处理
        data: {type: Object}, // 行数据
        disabled: {default: false}, // 是否禁用
        func: {type: String, default: ''}, // add, del, edit, query, import, export, cancel, detail, reset, expand
        confirm: {type: Boolean, default: false}, // 是否需要确认
        pid: {type: String, default: CoreConsts.DefaultPID}, // 父id字段
    },
    setup(props, {attrs}) {
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
                    }
                }
            }
        }

        let typeCompute = computed(() => props.func.toUpperCase())

        // 注册功能点
        context.regFunc(typeCompute.value, {
            getUrl: () => props.url,
            clickHandle: clickProxy
        });

        let viewContext = context.get$View().getViewContext();
        return {clickProxy, context, typeCompute, viewContext, disabled};
    },
    computed: {
        ...mapGetters({
            auth: 'sys/authMenuMap'
        }),
        tagColor() {
            return this.color || colorMaps[this.typeCompute] || 'blue'
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

    }
})
const typeMaps = {
    ADD: {type: 'dashed'},
    DEL: {danger: true},
    EDIT: {type: '#3b5999'},
    QUERY: {type: 'primary'}, // 查询
    VIEW: {type: 'primary'}, // 查询 和query选其一
    IMPORT: {type: 'default'},
    EXPORT: {type: 'orange'},
    EXPAND: {type: 'primary', ghost: true},
    CANCEL: {type: 'default'},
    DETAIL: {type: '#87d068'},
    RESET: {type: 'primary', ghost: true},
    DEFAULT: {type: 'default'},
    SUBMIT: {type: 'primary'}
}

/**
 * 功能按钮, 可以指定url, 功能类型
 * 注：只适用于编辑组件包括不限于(搜索组件, 编辑组件)等编辑组件
 * @type {DefineComponent<{func: {default: string, type: StringConstructor}, meta: {default: (function(): {}), type: ObjectConstructor}, url: {type: StringConstructor}}, unknown, unknown, {typeCompute(): *}, {}, ComponentOptionsMixin, ComponentOptionsMixin, Record<string, any>, string>}
 */
export const IvzFuncBtn = defineComponent({
    name: 'IvzFuncBtn',
    props: {
        url: {type: String}, // 功能地址
        func: {type: String, required: true, default: ''},  // add, del, edit, query, import, export, cancel, detail, reset
    },
    setup(props, attrs) {
        let context = inject(FuncContextKey);
        let clickProxy = {onClick: (e) => {
            if(context != null) {
                funcClickHandle(context, props)
            }
          }
        }

        let loading = ref(false);
        let typeCompute = computed(() => props.func.toUpperCase())

        let viewContext = context.get$View().getViewContext();
        return {clickProxy, context, loading, typeCompute, viewContext};
    },
    computed: {
        ...mapGetters({
            auth: 'sys/authMenuMap'
        })
    },
    created() {
        if(this.typeCompute && this.context) {
            this.context.regFunc(this.typeCompute, {
                getUrl: () => this.$props.url,
                setLoading: (status) => this.loading = status, // 设置按钮的加载状态
                clickHandle: () => {
                    if(this.$attrs.onClick instanceof Function) {
                        this.$attrs.onClick(this.typeCompute);
                    } else {
                        this.clickProxy.onClick(this.typeCompute);
                    }
                }
            });
        }
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
                let props = this.handleProps();
                return <AButton {...props} v-slots={this.$slots} style="margin: 0px 3px" loading={this.loading}/>
            } else {
                return <span></span>
            }
        } else {
            let props = this.handleProps();
            return <AButton {...props} v-slots={this.$slots} style="margin: 0px 3px" loading={this.loading} />
        }
    },
    methods: {
        handleProps() {
            let type = typeMaps[this.typeCompute];
            // 如果自定义单击事件, 不做处理
            if(this.$attrs.onClick instanceof Function) {
                return mergeProps(type, this.$attrs);
            } else { // 使用代理单击事件
                return mergeProps(type, this.clickProxy, this.$attrs);
            }
        }
    }
})

export const IvzTree = defineComponent({
    name: 'IvzTree',
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
            this.loadingCheckedData(this.checkedUrl).finally(() => null)
        }

        if(this.selectedUrl) {
            this.loadingSelectedData(this.selectedUrl).finally(() => null);
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
            });
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
            });
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
        app.component(IvzRow.name, IvzRow)
        app.component(IvzTree.name, IvzTree)
        app.component(IvzFuncBtn.name, IvzFuncBtn)
        app.component(IvzFuncTag.name, IvzFuncTag)
    }
}
