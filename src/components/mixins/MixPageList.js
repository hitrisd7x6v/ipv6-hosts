/**
 * 页级列表组件, 包含表格组件以及搜索组件
 * @type {{data(): *, created(): void, props: {tableConfig: {type: ObjectConstructor, required: boolean}, data: {default: null, type: ArrayConstructor}}}}
 */
export const MixPageList = {
    props: {
        data: {type: Array, default: null},
        tableConfig: {type: Object, required: true},
        searchConfig: {type: Object, required: true},
        tableAliasMetas: {type: Array, default: () => []},
        tableMetas: {type: Array, default: () => [], required: true},
        searchMetas: {type: Array, default: () => [], required: true},
        actionMetas: {type: Object, default: () => {}, required: true}
    },
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
        this.searchModel = this.$page.getQueryParams();
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
