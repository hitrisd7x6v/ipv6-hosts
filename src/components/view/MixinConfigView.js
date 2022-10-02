import {mapMutations} from "vuex";

export default {
    props: {
        // 删除提示框的提示信息 {title, content}
        delDescCall: {type: Function},
        // 唯一标识, 用于table的rowKey 或者用于编辑组件用来判断是修改或者新增
        key: {type: String, default: 'id'},
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
        // 显示重置按钮
        reset: {type: Boolean, default: true},
        // 是否是编辑
        isEdit: {type: Function, default: null},
        // 新增标题
        addTitle: {type: String, default: null},
        // 修改标题
        editTitle: {type: String, default: null},
        // 文件上传<IvzUploadModal>组件配置
        importProps: {type: Object, default: function () {
                return {
                    accept: '.xls,.xlsx', title: '导入文件'
                    , name: 'file', multiple: true, disabled: false
                }
            }
        },
    },
    created() {
        // 对于视图组件(IvzXxxView)必须作为页面的顶级组件
        let $parent = this.$parent;

        // 暴露以下方法到其父组件
        let {getEditFunMeta, getTableFunMeta, getSearchFunMeta} = this.viewInfo;

        $parent['getEditFunMeta'] = getEditFunMeta;
        $parent['getTableFunMeta'] = getTableFunMeta;
        $parent['getSearchFunMeta'] = getSearchFunMeta;

        $parent['getViewMenu'] = () => this.viewMenu
        // 获取当前编辑表单组件的数据
        $parent['getEditModel'] = () => this.viewInfo.editModel()
        // 获取当前搜索表单组件的数据
        $parent['getSearchModel'] = () => this.viewInfo.searchModel()
        // 获取当前表格的列表数据
        $parent['getDataSource'] = () => this.viewInfo.dataSource()
        // 获取当前表格选中的行
        $parent['getSelectedRows'] = () => this.viewInfo.selectedRows()
        // 设置当前表格可以展开的行
        $parent['setExpandedRows'] = (expandedRows) => this.viewInfo.expanded(expandedRows)
        // 重新加载表格数据
        $parent['loadingTableData'] = (promise) => this.viewInfo.loadingTableData(promise)

        // 打开编辑视图
        $parent['openEditView'] = (meta, model) => this.viewInfo.openEditView(meta, model);

        // 获取当前编辑表单相关上下文信息(包括重置、校验、数据等)
        $parent['getEditContext'] = () => this.viewInfo.editFormContext()
        // 获取当前搜索表单相关上下文信息(包括重置、数据等)
        $parent['getSearchContext'] = () => this.viewInfo.searchFormContext()


        if(this.importMeta) {
            this.importMeta.callback = (model, meta) => {
                this.$refs['uploadRef'].switchActive(true)
            }
        }
    },
    methods: {
        ...mapMutations({
            removePageViewData: 'view/removePageViewData',
        }),
    },

    unmounted() { // 在卸载的时候移除视图数据
        this.removePageViewData(this.viewMenu);
    }
}
