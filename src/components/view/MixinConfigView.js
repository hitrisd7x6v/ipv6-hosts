import {mapMutations} from "vuex";
import {mergeProps} from "vue";

export default {
    props: {
        // 删除提示框的提示信息 {title, content}
        delDescCall: {type: Function},
        // 唯一标识, 用于table的rowKey 或者用于编辑组件用来判断是修改或者新增
        key: {type: String, default: 'id'},
        // 是否是编辑
        isEdit: {type: Function, default: null},
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

        $parent['getViewMenu'] = () => this.viewMenu;
        $parent['getEditModel'] = () => this.viewInfo.editModel()
        $parent['getSearchModel'] = () => this.viewInfo.searchModel()
        $parent['getSelectedRows'] = () => this.viewInfo.selectedRows()

        $parent['loadingTableData'] = (promise) => this.viewInfo.loadingTableData(promise);

        $parent['getEditContext'] = () => this.viewInfo.editFormContext()
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

        fileUploadChange() {

        }
    },

    unmounted() { // 在卸载的时候移除视图数据
        this.removePageViewData(this.viewMenu);
    }
}
