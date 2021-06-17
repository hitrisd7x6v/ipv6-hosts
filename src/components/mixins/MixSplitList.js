/**
 * 页级列表组件拆分出来的基础数据
 * @type {{data(): *, created(): void, props: {tableConfig: {type: ObjectConstructor, required: boolean}, data: {default: null, type: ArrayConstructor}}}}
 */

export const MixSplitList = {
    data () {
        return {
            addMate: null,
            queryMate: null,
            searchModel: {},
            // viewTopSearch: false // 搜索框是否展示在顶行
        }
    },
    created () {
        // 获取当前页面的查询参数
        this.searchModel = this.$getQueryParams();
    },
    mounted () {
        this.setTableHeight()
    },
    beforeUpdate () {
        this.setTableHeight();
    },
    methods: {
        query () {
            this.$refs['tableRef'].query()
        },
        actionHandleWrapper(meta, row, index) {
            this.$refs['tableRef'].actionHandle(meta, row, index)
        },
        setTableHeight () {
            let tableRef = this.$refs['tableRef']
            let pagination = this.tableConfig['pagination']
            let remain = tableRef.$el.offsetTop + 64 + (pagination ? 34 : 0);
            let height = 'calc(100vh - ' + (remain) + 'px)'
            this.tableConfig.scroll.y = height
        },
    }
}
