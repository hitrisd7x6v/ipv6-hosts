import '@/components/view/index.css'
import {mapGetters, useStore} from "vuex";
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzFuncView from "@/components/view/IvzFuncView.vue";
import IvzEditModal from "@/components/edit/IvzEditModal.jsx";
import IvzEditDrawer from "@/components/edit/IvzEditDrawer.jsx";
import IvzBasicTable from "@/components/table/IvzBasicTable.jsx";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {FunMetaMaps, TypeMethodMaps} from "@/utils/SysUtils";
import {defineComponent, inject, mergeProps, nextTick, reactive, ref} from "vue";
import {confirm, msgSuccess} from "@/utils/message";
import {MetaConst} from "@/utils/MetaUtils";

let callbackMaps = { }

// 搜索按钮点击回调
callbackMaps[FunMetaMaps.View] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        } else {
            let {loadingTableData} = viewInfo;
            loadingTableData();
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
    meta.props.onClick = (model, meta, {resetFields, type}) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            resetFields();
            if(type == MetaConst.SearchFormType) {
                let {loadingTableData} = viewInfo;
                loadingTableData(1);
            }
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
// 文件导入导出功能
callbackMaps[FunMetaMaps.Import] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        meta.callback(model, meta, viewInfo);
    }
}
// 表格的展开和折叠功能
callbackMaps[FunMetaMaps.Expanded] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        } else {
            viewInfo.expanded();
            // 图标旋转
            if(meta.props.rotate == 90) {
                meta.props.rotate = 270;
            } else {
                meta.props.rotate = 90;
            }
        }
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
            throw new Error(`IvzViewSearch只能作为IvzXxxView等视图组件的子组件`);
        }

        let {searchFunMetas, config, viewMenu} = viewInfo;

        // 设置搜索视图的信息
        useStore().commit('view/setSearchViewContext', {
            url: viewMenu.url,
            model: () => formRef.value.getSearchModel(),
            formContext: () => formRef.value.getSearchContext()
        })

        searchFunMetas.forEach(meta => {
            // 功能点默认点击事件
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
            throw new Error(`IvzViewModal组件只能作为IvzXxxView等视图组件的子组件`);
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
const IvzViewDrawer = defineComponent({
    name: 'IvzViewDrawer',
    components: {IvzEditDrawer},
    setup() {
        let iemRef = ref();
        let title = ref("");
        let viewInfo = inject("IvzViewInfo");
        if(!viewInfo) {
            throw new Error(`IvzViewModal组件只能作为IvzXxxView等视图组件的子组件`);
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

        return <div class="ivz-view-drawer">
            <ivz-edit-drawer {...this.$attrs} funMetas={this.funMetas}
                     title={this.title} ref="iemRef" v-slots={this.$slots}>
            </ivz-edit-drawer>
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
            throw new Error(`IvzViewTable组件只能作为IvzXxxView等视图组件的子组件`);
        }

        let ibtRef = ref();
        let dataRef = ref([]);

        let totalRef = ref(0);
        let page = reactive({});
        let loading = ref(false);

        let {tableFunMetas, viewMenu, getSearchFunMeta} = viewInfo;

        if(tableFunMetas instanceof Array) {
            tableFunMetas.forEach(meta => {
                initCallback(meta, viewInfo);
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

        // 搜索功能
        let viewFunMeta = getSearchFunMeta(FunMetaMaps.View);
        let loadTableData = (current, pageSize) => {
            if(viewFunMeta) {
                let searchModel = viewInfo.searchModel();
                if(attrs.pagination != false) { // 需要分页
                    searchModel[MetaConst.PageSize] = pageSize;
                    searchModel[MetaConst.PageCurrent] = current;
                }

                if(!viewFunMeta.url) {
                    return console.warn(`获取列表失败 功能点[${viewFunMeta.name}]没有设置搜索地址[url][${JSON.stringify(viewFunMeta)}]`)
                }

                loading.value = true;
                TypeMethodMaps[FunMetaMaps.View](viewFunMeta.url
                    , searchModel, viewFunMeta.http).then(({data}) => {

                    if(data instanceof Array){
                        dataRef.value = data;
                    } else if(data instanceof Object) { // 需要分页
                        let {records, total} = data;
                        dataRef.value = records;
                        totalRef.value = total
                    }

                }).finally(() => loading.value = false)
            }
        }

        // 设置表视图的信息
        useStore().commit('view/setTableViewContext', {
            url: viewMenu.url,
            expanded: () => ibtRef.value.expanded(),
            dataSource: () => ibtRef.value.getDataSource(),
            selectedRows: () => ibtRef.value.getSelectedRows(),
            loadingTableData: (current) =>  loadTableData(current)
        })

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
        // let defaultPageSize = this.$attrs.defaultPageSize ? this.$attrs.defaultPageSize : 10;
        this.loadTableData(1);
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

const IvzViewComponents = {IvzMenuView, IvzFuncView, IvzViewSearch
    , IvzViewModal, IvzViewDrawer, IvzViewTable}

export default {
    install(app) {
        Object.keys(IvzViewComponents).forEach(name => {
            app.component(name, IvzViewComponents[name]);
        })
    }
}

export {IvzMenuView, IvzViewSearch, IvzViewModal, IvzViewTable, IvzViewDrawer}
