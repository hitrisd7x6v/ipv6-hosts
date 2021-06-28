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
        this.registerActionEvent();
        this.listRef = this.$refs['listRef']; // 页级列表组件的引用
        this.detailRef = this.$refs['detailRef'];
        this.$page.resolverSlots(this.$scopedSlots, this);
        this.$page.registerPageRef(this, this.listRef)
    },
    methods: {
        registerActionEvent() {
            const vue = this;
            this.$router.beforeEach((to, form, next) => {
                let path = to.path;
                switch (path) {
                    case '/IvzSys/list':
                        vue.list();
                        return next('/IvzSys/void');
                    case '/IvzSys/cancel':
                        vue.cancel();
                        return next('/IvzSys/void');
                    case '/IvzSys/add':
                        vue.add(0);
                        return next();
                    case '/IvzSys/edit':
                        this.listView = false;
                        return next();
                    case '/IvzSys/detail':
                        this.detailRef.open();
                        return next('/IvzSys/void');
                    case '/IvzSys/action':
                        let actionMeta = this.$page.getStore('actionMeta');
                        vue.action(actionMeta, null);
                    case '/IvzSys/void': return next();
                    default: return next('/IvzSys/void');
                }
            })
        },
        /**
         * 新增数据
         * @param meta
         */
        add(index) {
            this.listView = false;
            let editModel = this.$page.getStore("editModel");
            this.operaMeta = this.$page.getStore("actionMeta");
            this.listRef.actionHandleWrapper(this.operaMeta, editModel, index)
        },
        /**
         * 编辑数据
         */
        edit(row) {
            this.listView = false;
            this.operaMeta = this.actionMetas.Edit;
            if(row) {
                this.listRef.actionHandleWrapper(this.operaMeta, row)
            }
        },
        /**
         * 返回列表
         */
        list() {
            this.listView = true;
            this.listRef.query();
        },
        /**
         * 删除指定行
         * @param meta
         * @param row
         */
        del(row) {
            let delMeta = this.actionMetas.Del;
            this.listRef.actionHandleWrapper(delMeta)
        },
        /**
         * 元数据动作
         * @param meta
         * @param row
         */
        action(meta, row) {
            this.listRef.actionHandleWrapper(meta, row)
        },
        /**
         * 获取表格数据
         */
        query() {
            let viewMeta = this.actionMetas.View;
            this.listRef.actionHandleWrapper(viewMeta)
        },
        /**
         * 取消编辑
         */
        cancel() {
            this.listView = true;
        },
        /**
         * 刷新数据
         */
        freshen() {
            this.$refs['formRef'].freshenHandle();
        },
        /**
         * 提交数据
         */
        submit() {
            this.$refs['formRef'].submitHandle();
        },
    }
}
