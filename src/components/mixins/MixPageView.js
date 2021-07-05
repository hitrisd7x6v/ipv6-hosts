import PageOptions from '../page.config'

export const MixPageView = {
    router: PageOptions.router,
    props: {
        data: {type: Array, default: () => { return [] }},
        metas: {type: Array, default: () => { return [] }},
        config: {type: Object, default: () => { return {} }},
        searchMetas: {type: Array, default: () => { return [] }},
    },
    data () {
        return {
            listRef: null, // 对于view组件必须有名称为'listRef'表引用
            formRef: null, // 对于view组件必须有名称为'formRef'表单引用
            listView: true, // 默认为true, 显示列表页
            detailRef: null,
            operaMeta: null,
            formGroup: null,
            actionMetas: {},
            tableMetas: null,
            formConfig: null, // 可编辑表单配置
            tableConfig: null, // 表格配置
            detailConfig: null, // 详细配置
            searchConfig: null, // 搜索表单配置
            formAliasMetas: [],
            tableAliasMetas: [],
            detailAliasMetas: [],
            detailVisible: false,
        }
    },
    created () {
        this.actionMetas = this.$page.getActionMetas();
        this.detailVisible = this.actionMetas['Detail'] ? true : false;

        if (this.isBlank(this.actionMetas)) {
            return this.$log.warningLog('此视图无任何功能点', '后台新增或者手动创建')
        }
        // 如果页面在编辑页刷新则直接显示编辑页
        if (this.$route.path === '/IvzSys/edit'
            || this.$route.path === '/IvzSys/add') {
            this.listView = false
        }

        // 初始化页级组件的默认配置
        this.$page.initPageDefaultConfig(this.config, this);
        this.detailConfig = this.config.detail;

        // 解析搜索表单元数据
        this.searchConfig = this.config.search;
        this.$page.resolverFormMetas(this.searchMetas, this.searchConfig, this);

        // 初始化表单实体对象
        this.formConfig = this.config.form;
        this.formGroup = this.$page.resolverFormMetas(this.metas, this.formConfig, this);

        // 解析表格元数据
        this.tableConfig = this.config.table;
        this.tableMetas = this.$page.resolverTableMetas(this.metas, this.tableConfig, this);

        // 解析各个字段插槽
        this.formAliasMetas = this.$page.formSlotMetas;
        this.tableAliasMetas = this.$page.tableSlotMetas;
        this.detailAliasMetas = this.$page.detailSlotMetas;
    },
    mounted () {
        this.listRef = this.$refs['listRef']; // 页级列表组件的引用
        this.detailRef = this.$refs['detailRef'];
        this.$page.resolverSlots(this.$scopedSlots);
        this.$page.registerVueRef(this, 'view');
    },
    methods: {
        /**
         * 显示列表页
         */
        viewListPage() {
            this.listView = true;
        },
        /**
         * 显示编辑页
         */
        viewEditPage() {
            this.listView = false;
        },
    }
}
