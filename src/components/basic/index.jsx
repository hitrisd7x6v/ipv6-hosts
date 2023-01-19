import {defineComponent, inject, mergeProps, provide, ref, computed} from "vue";
import {FuncContextKey, RowContextKey} from "@/utils/ProvideKeys";
import {msgError} from "@/utils/message";
import {EditContext, SearchContext, TableContext} from "@/components/view/ViewAction";
import {FuncNameMeta, FunMetaMaps} from "@/utils/MetaUtils";

export const IvzRow = defineComponent({
    name: 'IvzRow',
    props: ['span'],
    setup(props) {
        provide(RowContextKey, {
            span: props.span
        })
    },
    render() {
        return <ARow {...this.$attrs} v-slots={this.$slots} />
    }
})
function funcClickHandle(context, props) {
    if(context != null) {
        let $view = context.get$View();
        let split = props.func.split(':');
        if(split.length == 1) {
            let func = props.func.toUpperCase();
            if(context.isPrimary) { // 主视图操作, 各个组件联动处理
                switch (func) {
                    case FuncNameMeta.ADD:
                        return $view.openForAdd();
                    case FuncNameMeta.DEL:
                        if(context instanceof SearchContext) {
                            return $view.batchDel(props.url)
                        }

                        return $view.del(props.url, props.data).catch(reason => null)
                    case FuncNameMeta.EDIT:
                        return $view.openForEdit(props.url, props.data);
                    case FuncNameMeta.QUERY:
                        return $view.query(props.url);
                    case FuncNameMeta.CANCEL:
                        return $view.cancel();
                    case FuncNameMeta.RESET:
                        if(context instanceof EditContext) {
                            return $view.resetEditModel();
                        } else if(context instanceof SearchContext) {
                            $view.resetSearchModel()
                            return $view.query();
                        } else {
                            return console.error("错误的编辑模型");
                        }
                    case FuncNameMeta.DETAIL:
                        return $view.detail(props.url);
                    case FuncNameMeta.SUBMIT:
                        return $view.submit(props.url).then(() => {
                            $view.query(); // 提交成功后重新搜索列表
                        });
                    case FuncNameMeta.EXPAND: return $view.expanded(); // 展开所有行
                    default: console.error(`不支持功能类型[${props.func}]`)
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
            let id = split[1];
            let func = split[0].toUpperCase();
            if(func == FuncNameMeta.ADD || func == FuncNameMeta.EDIT) {
                let editContext = $view.getEditContext(id);
                if(editContext instanceof EditContext) {
                    if(func == FuncNameMeta.ADD) {
                        editContext.setVisible(true)
                    } else {
                        editContext.asyncVisible().finally(() => null);
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
        data: {type: Object}, // 行数据
        func: {type: String, default: ''}, // add, del, edit, query, import, export, cancel, detail, reset
        disabled: Function, // 是否禁用
        onClick: Function,
    },
    setup(props, {attrs}) {
        let context = inject(FuncContextKey);
        let clickProxy = (e) => {
            if(props.onClick instanceof Function) {
                props.onClick(props.data)
            } else {
                if(context != null) {
                    funcClickHandle(context, props)
                }
            }
        }

        let typeCompute = computed(() => props.func.toUpperCase())

        // 注册功能点
        context.regFunc(typeCompute.value, {
            getUrl: () => props.url,
            clickHandle: clickProxy
        });

        return {clickProxy, context, typeCompute};
    },
    computed: {
        tagColor() {
            return this.color || colorMaps[this.typeCompute]
        },
        tagDisabled() {
            return this.disabled != null ? this.disabled(this.data) : false;
        }
    },
    render() {
        let disabledClass = this.tagDisabled ? 'ivz-func-disabled' : 'ivz-func-tag'
        return <ATag closable={false} visible={true} class={disabledClass} class="ivz-func"
                     color={this.tagColor} onClick={this.clickProxy} v-slots={this.$slots} />
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
        if(context instanceof EditContext && typeCompute.value == FuncNameMeta.SUBMIT) {
            // 设置按钮的加载状态
            let loadingOri = context.setLoading;
            // 代理设置加载状态方法, 新增按钮加载状态
            context.setLoading = (status) => {
                loadingOri(status);
                loading.value = status;
            }
        }
        return {clickProxy, context, loading, typeCompute};
    },
    created() {
        if(this.typeCompute && this.context) {
            this.context.regFunc(this.typeCompute, {
                getUrl: () => this.$props.url,
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
        let type = typeMaps[this.typeCompute], props;
        // 如果自定义单击事件, 不做处理
        if(this.$attrs.onClick instanceof Function) {
            props = mergeProps(type, this.$attrs);
        } else { // 使用代理单击事件
            props = mergeProps(type, this.clickProxy, this.$attrs);
        }

        return <a-button {...props} v-slots={this.$slots} style="margin: 0px 3px" loading={this.loading}/>
    }
})

export const IvzTree = defineComponent({
    name: 'IvzTree',
    props: {
        dataUrl: {type: String}, // 数据地址
        checkedUrl: {type: String}, // 多选框的数据地址
        selectedUrl: {type: String}, // 选中的数据地址
        replaceFields: {type: Object, default: {key: 'id', title: 'name', children:'children'}}
    },
    setup(props) {
        let allKeys = ref([]);
        let treeData = ref([]);
        let checkedKeys = ref([]);
        let expandedKeys = ref([]);
        let selectedKeys = ref([]);
        return {allKeys, treeData, selectedKeys, checkedKeys, expandedKeys}
    },
    watch: {
        dataUrl(newUrl) {
            this.loadingInitData(newUrl)
        },
        checkedUrl(newUrl) {
            this.loadingCheckedData(newUrl)
        },
        selectedUrl(newUrl) {
            this.loadingSelectedData(newUrl)
        }
    },
    created() {
        if(this.dataUrl) {
            this.loadingInitData(this.dataUrl);
        }

        if(this.checkedUrl) {
            this.loadingCheckedData(this.checkedUrl)
        }

        if(this.selectedUrl) {
            this.loadingSelectedData(this.selectedUrl);
        }
    },
    render() {
        return <a-tree {...this.$attrs} v-models={[
                    [this.checkedKeys, 'checkedKeys', ["modifier"]],
                    [this.selectedKeys, 'selectedKeys', ["modifier"]],
                    [this.expandedKeys, 'expandedKeys', ["modifier"]]
                ]} treeData={this.treeData} replaceFields={this.replaceFields}>
            </a-tree>
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

        loadingSelectedData(selectedUrl) {
            this.$http.get(selectedUrl).then(({code, message, data}) => {
                if(code == 200) {
                    this.selectedKeys = data;
                } else {
                    msgError(message)
                }
            }).catch(reason => console.error(reason))
        },
        loadingCheckedData(checkedUrl) {
            this.$http.get(checkedUrl).then(({code, message, data}) => {
                if(code == 200) {
                    this.checkedKeys = data;
                } else {
                    msgError(message)
                }
            }).catch(reason => console.error(reason))
        },
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
