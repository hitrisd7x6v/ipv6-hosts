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
