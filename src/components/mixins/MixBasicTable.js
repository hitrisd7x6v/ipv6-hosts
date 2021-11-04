export const MixBasicTable = {
    props: {
        data: {type: Array, default: null},
        tableConfig: {type: Object, required: true, default: () => {}},
        tableMetas: {type: Array, required: true, default: () => { return [] }},
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
        query (model) { // 查询
            if (!this.queryMate) {
                return this.$log.errorLog('没有指定查询动作', '在后台菜单新增查询功能点(View)或在代码里面添加')
            }

            model = model || this.searchModel;
            this.queryMate.callBack(model, this).then(param => {
                this.loading = true;
                let promiseResolve = this.$utils.getPromiseResolve(param);

                this.$http.get(this.queryMate.url, {params: model}).then(resp => {
                    let rows = resp[this.tableConfig.queryField];
                    if(this.$utils.isBlank(this.dataSource)) { // 只在第一次加载
                        this.tableConfig.loadFinished(rows); // 触发数据加载完成事件
                    }

                    this.dataSource = rows;
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
            let selection = this.tableConfig.selection;
            return selection ? selection['selectedRows'] : []
        },
        getSelectionKeys () {
            let selection = this.tableConfig.selection;
            return selection ? selection['selectedRowKeys'] : []
        },
        change (pagination, filter, sorted) {
            if (pagination) {
                this.searchModel[this.tableConfig.pageNumField] = pagination.current;
                this.searchModel[this.tableConfig.pageSizeField] = pagination.pageSize;
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
                return this.$log.errorLog("未指定动作, 或作元数据错误(需指定id)", "请指定要操作的元数据", mate);
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
                this.$page.detail(row);
            })

        },
        otherActionHandle (meta, row, submit) { },
    }
}
