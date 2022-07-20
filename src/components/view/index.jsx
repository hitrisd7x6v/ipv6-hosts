import '@/components/view/index.css'
import {defineComponent, h, inject, mergeProps, ref, nextTick, reactive} from "vue";
import IvzEditModal from "@/components/edit/IvzEditModal.jsx";
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {mapGetters, useStore} from "vuex";
import {FunMetaMaps, getMetaConfig, TypeMethodMaps} from "@/utils/SysUtils";
import {IvzBasicTable} from "@/components";
import {confirm, msgInfo, msgSuccess} from "@/utils/message";
import shortOut from "lodash-es/_shortOut";
let callbackMaps = { }
// 搜索按钮点击回调
callbackMaps[FunMetaMaps.View] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        }
    }
}
// 取消按钮点击回调
callbackMaps[FunMetaMaps.Cancel] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let {editSwitchActive} = viewInfo;
            editSwitchActive(false);
        }
    }
}
// 提交表单点击回调
callbackMaps[FunMetaMaps.Submit] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let {config, editFormContext, editSwitchSpinning} = viewInfo;
            let url = config.isEdit(model) ? meta['editUrl'] : meta['addUrl'];
            let formContext = editFormContext();
            formContext.validate().then(() => {
                editSwitchSpinning(true);
                TypeMethodMaps.Submit(url, model, meta.http).then(({data}) => {})
                    .finally(() => editSwitchSpinning(false))
            })
        }
    }
}
// 新增按钮点击回调
callbackMaps[FunMetaMaps.Add] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let {config, editSwitchActive, editFormContext} = viewInfo;
            let formContext = editFormContext();
            if(formContext) {
                let {getEditModel, getInitModel, setEditModel} = formContext;

                if(getEditModel) {
                    let editModel = getEditModel();
                    // 从编辑切换到新增
                    if(config.isEdit(editModel)) {
                        let initModel = getInitModel();
                        setEditModel(initModel);
                    }
                }
                editSwitchActive(true);
            }
        }
    }

}
// 编辑按钮点击回调
callbackMaps[FunMetaMaps.Edit] = (meta, viewInfo) => {
    meta.props.onClick = (row, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(row, meta, viewInfo)
        } else {
            let {editLoadingActive, config} = viewInfo;

            let keyValue = row[config.key];
            editLoadingActive().then(({setEditModel, callback}) => {
                TypeMethodMaps.Edit(`${meta.url}?${config.key}=${keyValue}`)
                    .then(({data}) => {
                        callback();
                        setEditModel(data)
                    }).finally(callback)
            });
        }
    }
}
// 重置按钮点击回调
callbackMaps[FunMetaMaps.Reset] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta, {resetFields}) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            resetFields();
            let funMeta = viewInfo.getSearchFunMeta(FunMetaMaps.View);
            funMeta.props.onClick(model, funMeta);
        }
    }
}
// 删除按钮点击回调
callbackMaps[FunMetaMaps.Del] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        } else {
            let {config, searchFunMetas, searchModel} = viewInfo;
            let keyValue = model[config.key];
            let {title, content} = config.delDescCall(model, viewInfo);
            confirm({title, content
                , onOk: () => new Promise(resolve => {
                    TypeMethodMaps.Del(meta.url, keyValue).then(() => {
                        resolve();
                        let viewMeta = searchFunMetas.filter(item => item.field == FunMetaMaps.View);
                        if(viewMeta.length > 0) {
                            let model = searchModel();
                            viewMeta[0].props.onClick(model, viewMeta[0]);
                        }

                        nextTick().then(() => msgSuccess('删除成功'))
                    })
                })
            })
        }
    }
}
callbackMaps[FunMetaMaps.Import] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        meta.callback(model, meta, viewInfo);
    }
}
function initCallback(meta, viewInfo) {
    let callback = callbackMaps[meta.field];
    if(callback) {
        callback(meta, viewInfo);
    } else {
        callback = meta.callback;
        meta.callback = (model, meta) => {
            callback(model, meta, viewInfo)
        }
    }
}
const IvzViewSearch = defineComponent({
    name: 'IvzViewSearch',
    components: {IvzBasicSearch},
    setup() {
        let formRef = ref();
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewSearch只能在IvzMenuView等视图组件中使用`);
        }

        let {searchFunMetas, config, viewMenu} = viewInfo;

        // 设置搜索视图的信息
        useStore().commit('view/setSearchViewContext', {
            url: viewMenu.url,
            model: () => formRef.value.getSearchModel(),
            formContext: () => formRef.value.getSearchContext()
        })

        let viewFunMeta = viewInfo.getSearchFunMeta(FunMetaMaps.View);
        let resetFunMeta = viewInfo.getSearchFunMeta(FunMetaMaps.Reset);
        // 包含搜索功能并且需要显示重置功能按钮
        if(viewFunMeta && !resetFunMeta && config.reset) {
            let props = getMetaConfig(FunMetaMaps.Reset);
            searchFunMetas.push({field: FunMetaMaps.Reset, sort: 80, name: '重置', props})
        }

        searchFunMetas.forEach(meta => {
            // 点击新增和编辑按钮回调
            initCallback(meta, viewInfo);
        })

        return {searchFunMetas, viewInfo, formRef};
    },
    render() {
        let props = mergeProps(this.$attrs,
            {funMetas: this.searchFunMetas, ref: 'ibsRef'});

        return (<div class="ivz-view-search">
            <ivz-basic-search {...props} v-slots={this.$slots} />
        </div>)
    },
    mounted() {
        this.formRef = this.$refs['ibsRef'];
    }
})

const IvzViewModal = defineComponent({
    name: 'IvzViewModal',
    components: {IvzEditModal},
    setup() {
        let iemRef = ref();
        let title = ref("");
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
            formContext: () => iemRef.value.getEditContext(),
            loadingActive: () => iemRef.value.loadingActive(),
            switchActive: (status) => iemRef.value.switchActive(status),
            switchSpinning: (spinning) => iemRef.value.switchSpinning(spinning)
        })

        if(funMetas instanceof Array) {
            let resetFunMeta = viewInfo.getEditFunMeta(FunMetaMaps.Reset);
            if(config.reset && !resetFunMeta) { // 需要显示重置按钮
                let props = getMetaConfig(FunMetaMaps.Reset);
                funMetas.push({field: FunMetaMaps.Reset, name: '重置', sort: 80, props})
            }

            funMetas.forEach(meta => {
                initCallback(meta, viewInfo);
            })
        }

        return {funMetas, viewInfo, viewMenu, iemRef, title}
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
        if(this.iemRef && this.iemRef.isInitForm()) {
            let {config} = this.viewInfo;
            let editModel = this.iemRef.getEditModel();
            this.title = config.isEdit(editModel) ? config.editTitle : config.addTitle;
        }

        return <div class="ivz-view-modal">
            <ivz-edit-modal {...this.$attrs} funMetas={this.funMetas} title={this.title}
                            ref="iemRef" v-slots={this.$slots}>
            </ivz-edit-modal>
        </div>
    }
})

const IvzViewTable = defineComponent({
    name: 'IvzViewTable',
    components: {IvzBasicTable},
    props: {
        dataSource: null, // 不支持
        rowSelection: null, // 不支持
    },
    setup(props, {attrs}) {
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewTable组件只能在IvzMenuView等视图组件中使用`);
        }

        let ibtRef = ref();
        let dataRef = ref([]);

        let totalRef = ref(0);
        let page = reactive({});
        let loading = ref(false);

        let {tableFunMetas, viewMenu, getSearchFunMeta} = viewInfo;

        if(tableFunMetas instanceof Array) {
            tableFunMetas.forEach(meta => {
                let callback = callbackMaps[meta.field];
                if(callback) callback(meta, viewInfo);
            })
        }

        let {columns} = attrs;
        if(columns instanceof Array) {
            columns.forEach(column => {
                if(column.type == 'action' && !column.funMetas) {
                    column['funMetas'] = tableFunMetas;
                }
            })
        }

        let viewFunMeta = getSearchFunMeta(FunMetaMaps.View);
        let loadTableData = (current, pageSize) => {
            if(viewFunMeta) {
                let searchModel = viewInfo.searchModel();
                searchModel.current = current;
                searchModel.pageSize = pageSize;

                viewFunMeta.props.onClick(searchModel, viewFunMeta);
            }
        }

        // 设置表视图的信息
        useStore().commit('view/setTableViewContext', {
            url: viewMenu.url,
            selectedRows: () => ibtRef.value.getSelectedRows(),
            loadingTableData: () => {
                let searchModel = viewInfo.searchModel();
                viewFunMeta.props.onClick(searchModel, viewFunMeta);
            }
        })

        if(viewFunMeta) {
            // 对搜索功能回调进行代理
            let callback = viewFunMeta.callback;
            viewFunMeta.callback = (searchModel, meta) => {
                loading.value = true;
                TypeMethodMaps[FunMetaMaps.View](viewFunMeta.url
                    , searchModel, viewFunMeta.http).then(({data}) => {

                    let {records, total} = data;

                    dataRef.value = records;
                    totalRef.value = total
                }).finally(() => loading.value = false)

                if(callback instanceof Function) {
                    callback(searchModel, meta, viewInfo);
                }
            }
        }

        return {ibtRef, dataRef, loading, viewInfo, loadTableData, page, totalRef}
    },
    created() {
        this.ibtRef = this.$refs['ibtRef']
    },
    render() {
        return (
            <ivz-basic-table {...this.$attrs} dataSource={this.dataRef} ref="ibtRef"
                rowKey={this.viewInfo.config.key} loading={this.loading} v-slots={this.$slots}
                onPageChange={this.pageChange} onSizeChange={this.sizeChange} total={this.totalRef}/>
        )
    },
    mounted() {
        this.loadTableData(1, 10);
    },
    methods: {
        sizeChange(current, size) {
            this.loadTableData(current, size)
        },
        pageChange(current, size) {
            this.loadTableData(current, size)
        }
    }
})

export {IvzMenuView, IvzViewSearch, IvzViewModal, IvzViewTable}
