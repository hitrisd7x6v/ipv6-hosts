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
import {confirm, msgSuccess, msgWarn} from "@/utils/message";
import {MetaConst} from "@/utils/MetaUtils";

let callbackMaps = { }

// 搜索按钮点击回调
callbackMaps[FunMetaMaps.View] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        } else {
            viewInfo.loadingTableData();
        }
    }
}
// 取消按钮点击回调
callbackMaps[FunMetaMaps.Cancel] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let {switchEditView} = viewInfo;
            switchEditView(false);
        }
    }
}
// 提交表单点击回调
callbackMaps[FunMetaMaps.Submit] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let {config, editFormContext, editSwitchSpinning
                , switchEditView, getSearchFunMeta, searchModel} = viewInfo;
            let url = config.isEdit(model) ? meta['editUrl'] : meta['addUrl'];
            let formContext = editFormContext();
            formContext.validate().then(() => {
                editSwitchSpinning(true);
                meta.props.loading = true;
                TypeMethodMaps.Submit(url, model, meta.http)
                    .then(({data, message}) => {
                        switchEditView(false)
                        msgSuccess(message || '提交数据成功')

                        // 提交数据成功之后重新加载列表
                        let viewFunMeta = getSearchFunMeta(FunMetaMaps.View);
                        if(viewFunMeta) {
                            let model = searchModel();
                            viewFunMeta.props.onClick(model, meta);
                        }
                    }).finally(() => {
                        editSwitchSpinning(false)
                        meta.props.loading = false;
                    })
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
            viewInfo.openEditView(meta);
        }
    }

}
// 编辑按钮点击回调
callbackMaps[FunMetaMaps.Edit] = (meta, viewInfo) => {
    meta.props.onClick = (row, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(row, meta, viewInfo)
        } else {
            viewInfo.openEditView(meta, row);
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
            let {config, getSearchFunMeta, searchModel} = viewInfo;
            let {title, content} = config.delDescCall(model, viewInfo);
            // 删除单条记录
            confirm({title, content
                , onOk: () => new Promise((resolve, reject) => {
                    let keyValue = model[config.key];

                    TypeMethodMaps.Del(meta.url, [keyValue]).then(() => {
                        resolve();
                        let viewMeta = getSearchFunMeta(FunMetaMaps.View);
                        if(viewMeta) {
                            let model = searchModel();
                            viewMeta.props.onClick(model, viewMeta);
                        }

                        nextTick().then(() => msgSuccess('删除成功'))
                    }).finally(() => resolve())
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

callbackMaps[FunMetaMaps.__Default] = (meta, viewInfo) => {
    meta.props.onClick = (model, meta) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        }
    }
}

function initCallback(meta, viewInfo) {
    let callback = callbackMaps[meta.field]
        || callbackMaps[FunMetaMaps.__Default];

    callback(meta, viewInfo);
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

        let {searchFunMetas, config, viewMenu, getSearchFunMeta} = viewInfo;

        // 设置搜索视图的信息
        useStore().commit('view/setSearchViewContext', {
            url: viewMenu.url,
            model: () => formRef.value.getSearchModel(),
            formContext: () => formRef.value.getSearchContext()
        })

        // 搜索栏有删除功能属于批量删除
        let delFunMeta = getSearchFunMeta(FunMetaMaps.Del);
        if(delFunMeta) {
            if(!delFunMeta.callback) {
                delFunMeta.callback = (model, meta) => {
                    let {selectedKeys, selectedRows, searchModel} = viewInfo

                    let keys = selectedKeys();
                    let rows = selectedRows();
                    if(rows instanceof Array && rows.length > 0) {
                        let {title, content} = config.delDescCall(rows, viewInfo);
                        confirm({title, content
                            , onOk: () => new Promise((resolve, reject) => {
                                TypeMethodMaps.Del(meta.url, keys).then(() => {
                                    resolve();
                                    let viewMeta = getSearchFunMeta(FunMetaMaps.View);
                                    if(viewMeta) {
                                        let model = searchModel();
                                        viewMeta.props.onClick(model, viewMeta);
                                    }

                                    nextTick().then(() => msgSuccess('删除成功'))
                                }).finally(() => resolve())
                            })
                        })
                    } else {
                        msgWarn(`请选择要删除的记录`)
                    }
                }
            }
        }

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

        // 打开编辑视图
        // meta 必须是Add或者Edit
        let openEditView = (meta, model) => {
            if(meta == null) {
                return console.error(`未指定要操作的功能点`)
            }

            if(meta.field != FunMetaMaps.Add &&
                meta.field != FunMetaMaps.Edit) {
                return console.error(`期待新增或者编辑功能点`)
            }

            if(meta.field == FunMetaMaps.Edit && !meta.url) {
                return console.error(`功能点[${meta.name}]没有指定url`);
            }

            return new Promise((resolve, reject) => {
                iemRef.value.openEditAtFormInit().then(context => {
                    let {setEditModel, getInitModel} = context;
                    if(meta.field == FunMetaMaps.Add) {
                        let initModel = getInitModel();
                        resolve(initModel);
                        setEditModel(initModel);
                    } else {
                        let param = {}
                        iemRef.value.switchSpinning(true);
                        param[config.key] = model[config.key]
                        TypeMethodMaps.Edit(meta.url, param).then(({data}) => {
                            if(data) {
                                resolve(data);
                                setEditModel(data);
                            } else {
                                console.error(`获取[${meta.url}]数据失败[${data}]`)
                            }
                        }).catch(reason => reject(reason))
                            .finally(() => iemRef.value.switchSpinning(false))
                    }
                });
            })
        }

        // 设置编辑视图的信息
        useStore().commit('view/setEditViewContext', {
            url: viewMenu.url,
            model: () => iemRef.value.getEditModel(),
            formContext: () => iemRef.value.getEditContext(),
            openEditView: (meta, model) => openEditView(meta, model),
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

        return <div class="ivz-view ivz-view-modal">
            <ivz-edit-modal {...this.$attrs} funMetas={this.funMetas}
                title={this.title} ref="iemRef" v-slots={this.$slots}>
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

        // 打开编辑视图
        // meta 必须是Add或者Edit
        let openEditView = (meta, model) => {
            if(meta == null) {
                return console.error(`未指定要操作的功能点`)
            }

            if(meta.field != FunMetaMaps.Add &&
                meta.field != FunMetaMaps.Edit) {
                return console.error(`期待新增或者编辑功能点`)
            }

            if(meta.field == FunMetaMaps.Edit && !meta.url) {
                return console.error(`功能点[${meta.name}]没有指定url`);
            }

            return new Promise((resolve, reject) => {
                iemRef.value.openEditAtFormInit().then(context => {
                    let {setEditModel, getInitModel} = context;
                    if(meta.field == FunMetaMaps.Add) {
                        let initModel = getInitModel();
                        resolve(initModel);
                        setEditModel(initModel);
                    } else {
                        let param = {}
                        iemRef.value.switchSpinning(true);
                        param[config.key] = model[config.key]
                        TypeMethodMaps.Edit(meta.url, param).then(({data}) => {
                            if(data) {
                                resolve(data);
                                setEditModel(data);
                            } else {
                                console.error(`获取[${meta.url}]数据失败[${data}]`)
                            }
                        }).catch(reason => reject(reason))
                            .finally(() => iemRef.value.switchSpinning(false))
                    }
                });
            })
        }

        // 设置编辑视图的信息
        useStore().commit('view/setEditViewContext', {
            url: viewMenu.url,
            model: () => iemRef.value.getEditModel(),
            openEditView: (meta, model) => openEditView(meta, model),
            formContext: () => iemRef.value.getEditContext(),
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

        return <div class="ivz-view ivz-view-drawer">
            <ivz-edit-drawer {...this.$attrs} funMetas={this.funMetas} ref="iemRef"
                 v-slots={this.$slots} title={this.title}>
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
            selectedKeys: () => ibtRef.value.getSelectedRowKeys(),
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
