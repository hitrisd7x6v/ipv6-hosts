export const MixBasicTable = {
    props: {
        data: {type: Array, default: null},
        tableConfig: {type: Object, required: true},
        tableMetas: {type: Array, default: () => { return [] }},
        searchModel: {type: Object, default: () => { return {} }},
        actionMetas: {type: Object, default: () => { return {} }}
    },
    data () {
        return {
            mainMetas: [],
            moreMetas: [],
            queryMate: null, // 查询元数据
            slotMetas: [],
            loading: false,
            pagination: null,
            dataSource: null,
            actionMetaKeys: []
        }
    },
    created () {
        this.dataSource = this.data;
        this.queryMate = this.actionMetas['View'];
        if (!this.tableConfig) {
            this.$log.errorLog('没有设置表格配置', '传入tableConfig配置对象, 且必须先初始化', this.tableConfig)
        }
        if (!this.tableConfig.isInit) {
            this.$log.errorLog('表格配置项未初始化', '调用初始化方法：this.$page.initDefaultTableConfig(config, vue)')
        }

        this.pagination = this.tableConfig.pagination;

        if (this.pagination) {
            this.searchModel['size'] = this.pagination.defaultPageSize;
            this.searchModel['current'] = this.pagination.defaultCurrent
        }
        this.initActionMates(this.actionMetas)
    },
    mounted () {
        this.$emit('finished', this); // 挂载完成
        this.tableConfig.mountedFinished(this);
        if (this.isBlank(this.data)) this.query()
    },
    beforeUpdate() {
        // 解析元数据, 获取需要slot的字段
        this.slotMetas.length = 0;
        this.$page.resolverMetas(this.tableMetas, this, (meta) => {
            if (meta['tableSlot']) {
                this.slotMetas.push(meta)
            }
        });
    },
    methods: {
        query () { // 查询
            if (!this.queryMate) {
                return this.$log.errorLog('没有指定查询动作', '在后台菜单新增查询功能点(View)或在代码里面添加')
            }
            this.queryMate.callBack(this.searchModel, this).then(param => {
                this.loading = true
                let promiseResolve = this.$utils.getPromiseResolve(param)
                this.$http.get(this.queryMate.url, {params: this.searchModel}).then(resp => {
                    this.dataSource = resp[this.tableConfig.queryField]
                    if (typeof promiseResolve.success === 'function') {
                        promiseResolve.success(resp)
                    }

                    if (this.pagination) { // 设置总条数
                        this.pagination['total'] = resp.total
                    }
                }).catch(reason => {
                    if (typeof promiseResolve.fail === 'function') {
                        promiseResolve.fail(reason)
                    }
                }).finally(() => {
                    this.loading = false
                })
            })
        },
        disabledClass (meta, row) {
            let disabled = meta['disabled']
            if (disabled && disabled(row)) return 'ivz-tag-disabled'
        },
        getSlotMetas() {
            return this.slotMetas;
        },
        getOperaMates () {
            return this.mainMetas
        },
        getMoreOperaMates () {
            return this.moreMetas
        },
        getSelectionRows () {
            let selection = this.tableConfig.selection
            return selection ? selection['selectedRows'] : []
        },
        getSelectionKeys () {
            let selection = this.tableConfig.selection
            return selection ? selection['selectedRowKeys'] : []
        },
        change (pagination, filter, sorted) {
            if (pagination) {
                pagination.change({page: pagination, query: this.query, model: this.searchModel})
            }
        },
        initActionMates (actionMetas) {
            if (this.isBlank(actionMetas)) {
                return this.$log.warningLog('设置功能动作按钮', '未指定任何功能动作', actionMetas)
            }
            Object.values(actionMetas).forEach(mate => {
                this.register(mate)
            })
        },
        actionHandle (mate, row, index) { //
            if(!mate || !mate['id']) {
                return this.$log.errorLog("入参错误, 未指定动作", "请传入要操作的动作.e.g {id: 'add', label: '新增', ...}");
            }
            let disabled = this.disabledClass(mate, row);
            if (disabled) return null;

            let submit = row || this.getSelectionKeys();
            let selectionRows = row || this.getSelectionRows();
            switch(mate['id']) {
                case 'view': this.viewActionHandle(); break;
                case 'add': this.addActionHandle(mate, row, index); break;
                case 'del': this.delActionHandle(mate, selectionRows, submit); break;
                case 'edit': this.editActionHandle(mate, row); break;
                case 'save': this.saveActionHandle(mate, row); break;
                case 'detail': this.detailActionHandle(mate, row); break;
                case 'cancel': this.cancelActionHandle(mate, row); break;
                default: this.otherActionHandle(mate, selectionRows, submit);
            }
        },
        viewActionHandle () {this.query();},
        addActionHandle (meta, row, index) { },
        editActionHandle (meta, row) { },
        saveActionHandle (meta, row) { },
        delActionHandle (meta, row, submit) { },
        cancelActionHandle(meta, row) { },
        detailActionHandle(meta, row) {
            meta.callBack(row).then(() => {
                let izField = this.$page.izField;
                this.$page.putStore("detailModel", row);
                let query = {}[izField] = row[izField];
                console.log(new Date().getTime())
                this.$router.push({path: "/IvzSys/detail", query: query})
            })

        },
        otherActionHandle (meta, row, submit) { },
    }
}
