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
        this.setTableHeight();
        this.setTableQueryProxy();
        this.$page.registerVueRef(this, 'list');
        if (this.isBlank(this.data)) this.query();
    },
    beforeUpdate () {
        this.setTableHeight();
    },
    methods: {
        query () {
            let searchModel = this.$utils.formatDateForSearchModel(
                this.$page.dateSearchMeta, this.searchModel);

            this.$refs['tableRef'].query(searchModel);
        },
        actionHandleWrapper(meta, row, index) {
            if(meta.id == 'view') {
                this.query();
            } else {
                this.$refs['tableRef'].actionHandle(meta, row, index);
            }
        },

        // 对表格的查询回调进行代理, 处理时间格式化问题
        setTableQueryProxy() {
            let delMeta = this.actionMetas['Del'];
            if(delMeta) {
                let oriCall = delMeta.callBack;
                // 删除动作代理
                delMeta.callBack = (row) => {
                    return new Promise((resolve, reject) => {
                        oriCall(row).then(resp=>{
                            let proxyResp = resp || {success: (params)=>{
                                    this.query();
                                }};
                            resolve(proxyResp);
                        }).catch(reason => {
                            reject(reason);
                        });
                    })
                }
            }

            // 分页动作代理
            let pagination = this.tableConfig['pagination'];
            if(pagination) {
                pagination.change = (args)=>{
                    this.query();
                }
            }
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
