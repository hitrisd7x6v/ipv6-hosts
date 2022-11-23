import {defineComponent, mergeProps, provide, ref} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";
import {msgError} from "@/utils/message";

export const IvzRow = defineComponent({
    name: 'IvzRow',
    props: ['span'],
    setup(props) {
        provide(RowContextKey, {
            span: props.span
        })
    },
    render() {
        return <a-row {...this.$attrs} v-slots={this.$slots} />
    }
})

const colorMaps = {
    ADD: '#2db7f5', DEL: '#f50', EDIT: '#3b5999', QUERY: '#108ee9', IMPORT: 'default'
    , EXPORT: 'orange',CANCEL: 'red', DETAIL: '#87d068', RESET: 'warning', DEF: 'default'
    , SUBMIT: 'blue'
}
export const IvzFuncTag = defineComponent({
    name: 'IvzFuncTag',
    props: {
        func: {type: String, default: 'def'}, // add, del, edit, query, import, export, cancel, detail, reset
        color: String,
        data: {type: Object}, // 行数据
        disabled: Function, // 是否禁用
    },
    computed: {
      tagColor() {
          let upperCase = this.func.toUpperCase();
          return this.color || colorMaps[upperCase]
      },
        tagDisabled() {
            return this.disabled != null ? this.disabled(this.data) : false;
        }
    },
    render() {
        let disabledClass = this.tagDisabled ? 'ivz-func-disabled' : 'ivz-func-tag'
        return <a-tag closable={false} visible={true} class={disabledClass} {...this.$attrs}
           class="ivz-func" color={this.tagColor} v-slots={this.$slots} onClick={this.clickHandle} />
    },
    methods: {
        clickHandle() {
            if(!this.tagDisabled) {
                this.$emit('handle', this.data);
            }
        }
    }
})
const typeMaps = {
    ADD: {type: 'dashed'},
    DEL: {danger: true},
    EDIT: {type: '#3b5999'},
    VIEW: {type: 'primary'},
    IMPORT: {type: 'default'},
    EXPORT: 'orange',
    CANCEL: {type: 'default'},
    DETAIL: {type: '#87d068'},
    RESET: {type: 'primary', ghost: true},
    DEFAULT: {type: 'default'},
    SUBMIT: {type: 'primary'}
}

export const IvzFuncBtn = defineComponent({
    name: 'IvzFuncBtn',
    props: {
        meta: {type: Object, default: function () { return {} }},
        func: {type: String, default: 'default'},  // add, del, edit, query, import, export, cancel, detail, reset
    },
    computed: {
        typeCompute() {
            return this.func.toUpperCase();
        }
    },
    render() {
        let type = typeMaps[this.typeCompute];
        let props = mergeProps(type, this.meta.props, this.$attrs);
        return <a-button {...props} v-slots={this.$slots} style="margin: 0px 3px"></a-button>
    },
    methods: {

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
