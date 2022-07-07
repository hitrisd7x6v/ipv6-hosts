import {defineComponent, h, inject, mergeProps, ref} from "vue";
import IvzEditModal from "@/components/edit/IvzEditModal.jsx";
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {mapGetters, useStore} from "vuex";
import {FunMetaMaps, TypeMethodMaps} from "@/utils/SysUtils";
import {IvzBasicTable} from "@/components";
let callbackMaps = {
    Default: () => {

    }
}
callbackMaps[FunMetaMaps.View] = (model, meta) => {
    TypeMethodMaps.View(meta.url, model, meta.http).then()
}

callbackMaps[FunMetaMaps.Submit] = (model, meta) => {
    let url = meta.isEdit(model) ? meta['editUrl'] : meta['addUrl'];
    TypeMethodMaps.Submit(url, model, meta.http).then(({data}) => {})
}

callbackMaps[FunMetaMaps.Reset] = (model, meta, {resetFields}) => {
    resetFields();
}

const getDefaultCallback = function (field) {
    let callback = callbackMaps[field];
    return callback ? callback : callbackMaps["Default"];
}
const IvzViewSearch = defineComponent({
    name: 'IvzViewSearch',
    setup() {
        let formRef = ref();
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewSearch只能在IvzMenuView等视图组件中使用`);
        }

        let {searchFunMetas, config, viewMenu, editSwitchActive} = viewInfo;

        // 设置搜索视图的信息
        useStore().commit('view/setSearchViewContext', {
            url: viewMenu.url,
            model: () => formRef.value.getSearchModel(),
            formContext: () => formRef.value.getSearchContext()
        })

        if(config.reset) { // 需要显示重置按钮
            searchFunMetas.push({field: FunMetaMaps.Reset, name: '重置'})
        }

        searchFunMetas.forEach(meta => {
            if(meta.callback) {
                return;
            }

            // 点击新增和编辑按钮回调
            if(meta.field == FunMetaMaps.Add ||
                meta.field == FunMetaMaps.Edit) {
                if(!meta.callback) {
                    meta.callback = () => {
                        editSwitchActive(true); // 打开编辑页
                    }
                }
            } else {
                meta.callback = callbackMaps[meta.field];
            }

        })

        return {searchFunMetas, viewInfo, formRef};
    },
    render() {
        let props = mergeProps(this.$attrs,
            {funMetas: this.searchFunMetas, ref: 'ibsRef'});

        return h(IvzBasicSearch, props, this.$slots)
    },
    mounted() {
        this.formRef = this.$refs['ibsRef'];
    }
})

const IvzViewModal = defineComponent({
    name: 'IvzViewModal',
    setup() {
        let iemRef = ref();
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewModal组件只能在IvzMenuView等视图组件中使用`);
        }

        let {editFunMetas, config, viewMenu} = viewInfo
        let funMetas = editFunMetas;

        // 设置编辑视图的信息
        useStore().commit('view/setEditViewContext', {
            url: viewMenu.url,
            model: () => iemRef.value.getEditModel(),
            switchActive: () => iemRef.value.switchActive(),
            formContext: () => iemRef.value.getEditContext(),
            loadingActive: () => iemRef.value.loadingActive()
        })

        if(funMetas instanceof Array) {
            if(config.reset) { // 需要显示重置按钮
                funMetas.push({field: FunMetaMaps.Reset, name: '重置'})
            }

            funMetas.forEach(meta => {
                if(meta.callback) {
                    return;
                }

                if(meta.field == FunMetaMaps.Cancel) {
                    meta.callback = (editModel, meta) => {
                        iemRef.value.switchActive(false)
                    }
                } else if(meta.field == FunMetaMaps.Submit) {
                    meta.isEdit = viewInfo.config.isEdit;
                    if(!meta.isEdit) {
                        let key = viewInfo.config.key;
                        meta.isEdit = (model) => model[key] != null
                    }

                    meta.callback = callbackMaps[meta.field]
                } else {
                    meta.callback = callbackMaps[meta.field]
                }
            })
        }

        return {funMetas, viewInfo, viewMenu, iemRef}
    },
    computed: {
        ...mapGetters({
            editActive: 'view/editActive'
        }),
    },
    created() {
        this.iemRef = this.$refs['iemRef'];
    },
    render() {
        let props = mergeProps(this.$attrs, {funMetas: this.funMetas, ref: 'iemRef'});

        return h(IvzEditModal, props, this.$slots);
    }
})

const IvzViewTable = defineComponent({
    name: 'IvzViewTable',
    components: {IvzBasicTable},
    setup(props, {attrs}) {
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewTable组件只能在IvzMenuView等视图组件中使用`);
        }

        let ibtRef = ref();
        let {columns} = attrs;
        let {tableFunMetas, config, viewMenu, editLoadingActive} = viewInfo;

        // 设置表视图的信息
        useStore().commit('view/setTableViewContext', {
            url: viewMenu.url,
            selectedRows: () => ibtRef.value.getSelectedRows(),
        })

        if(tableFunMetas instanceof Array) {
            tableFunMetas.forEach(meta => {
                if(meta.field == FunMetaMaps.Edit) {
                    let {key} = viewInfo.config;

                    meta.callback = (row, meta) => {
                        let keyValue = row[key];
                        editLoadingActive().then(({setEditModel, callback}) => {
                            TypeMethodMaps.Edit(meta.url+`?${key}=${keyValue}`)
                                .then(({data}) => {
                                    callback()
                                    setEditModel(data)
                                }).finally(callback)
                        });
                    }
                }

                if(meta.callback) {
                    return;
                }

            })
        }
        if(columns instanceof Array) {
            columns.forEach(column => {
                if(column.type == 'action' && !column.funMetas) {
                    column['funMetas'] = tableFunMetas;
                }
            })
        }

        return {ibtRef}
    },
    created() {
        this.ibtRef = this.$refs['ibtRef']
    },
    render() {
        return (
            <ivz-basic-table {...this.$attrs} ref="ibtRef" v-slots={this.$slots} />
        )
    }
})

export {IvzMenuView, IvzViewSearch, IvzViewModal, IvzViewTable}
