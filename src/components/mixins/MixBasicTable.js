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
            outHeight: 0,
            pagination: null,
            dataSource: null,
            actionMetaKeys: []
        }
    },
    watch: {
        outHeight: function (newVal) {
            if(this.tableConfig.fixedHeight) {
                this.$emit("heightChange", newVal);
            }
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
        if(this.tableConfig.fixedHeight) {
            this.handleTableHeight();
        }

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
        handleTableHeight() {
            let outHeight = 0;
            let tableHeader = this.$el.querySelector(".ant-table-thead");
            if(tableHeader) {
                outHeight = tableHeader.clientHeight;
            }

            let pagination = this.$el.querySelector(".ant-table-pagination");
            if(pagination) {
                outHeight += pagination.clientHeight;
            }

            if(outHeight>0 && this.outHeight != outHeight) {
                this.outHeight = outHeight
            }
        },
        getSelectionRows () {
            let selection = this.tableConfig.selection;
            return selection ? selection['selectedRows'] : []
        },
        getSelectionKeys () {
            let selection = this.tableConfig.selection;
            return selection ? selection['selectedRowKeys'] : []
        },
        change (pagination, filter, sorted, type) {

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
            let metaId = mate['id'];
            if(!mate || !metaId) {
                return this.$log.errorLog("未指定动作, 或作元数据错误(需指定id)", "请指定要操作的元数据", mate);
            }
            let disabled = this.disabledClass(mate, row);
            if (disabled) return null;

            let submit = row || this.getSelectionKeys();
            let selectionRows = row || this.getSelectionRows();

            let selection = this.tableConfig['selection'];
            if(metaId == 'add' || metaId == 'edit' || metaId == 'view') {
                /*新增和编辑, 查询不需要处理*/
            } else if(selection && selection['type'] == 'checkbox'){ // 如果有多选按钮
                // 操作数据将转换成数组
                if(!this.$utils.isArray(submit)) {
                    let value = submit[this.tableConfig.submitField];
                    submit = [value];
                    selectionRows = [selectionRows];
                }
            } else {
                submit = submit[this.tableConfig.submitField];
            }

            switch(metaId) {
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
        detailActionHandle(meta, row) { meta.callBack(row) },
        otherActionHandle(mate, selectionRows, submit) {
            if(this.$utils.isBlank(selectionRows)) {
                return this.$msg.warningMessage("请选择要操作的记录");
            }

            mate.callBack(selectionRows).then(resp => {
                let resolve = this.$utils.getPromiseResolve(resp)
                let tipTitle = resolve.tipTitle;
                let tipContent = resolve.tipContent;
                // 提交数据实体
                if(!resolve.submitType || resolve.submitType == 'entity') {
                    submit = selectionRows;
                }

                if (tipTitle && tipContent) { // 需要提交确认
                    this.$msg.confirm(tipTitle, tipContent).then(() => {
                        this.submitData(mate, resolve, submit)
                    }).catch(reason => null)
                } else { // 不需要提交确认
                    this.submitData(mate, resolve, submit)
                }
            })
        },
        submitData(mate, resolve, submit) {
            this.loading = true;
            this.$http.post(mate.url, submit).then(data => {
                this.$msg.submitSuccessNotify(resolve, data, this, submit)
            }).catch(reason => {
                this.$msg.submitFailNotify(resolve, reason, this, submit)
            }).finally(() => {
                this.loading = false
            })
        }
    }
}
