import moment from 'moment'
import {useStore} from "vuex";
import {defineComponent, reactive, ref, watch} from "vue";

function getSlotName(dataIndex) {
    let fieldPath = dataIndex.split('.');
    fieldPath.splice(0, 0, 'c');
    return fieldPath.join('_');
}
function initColumnActionSlot(column, slotName, slots) {
    let funMetas = column['funMetas'];
    if(funMetas instanceof Array) {
        funMetas.forEach(meta => {
            let oriClickEvent = meta.props.onClick;
            if(!oriClickEvent && import.meta.env.DEV) {
                console.warn(`组件[IvzBasicTable]的操作功能[${meta.field}]没有监听点击事件`)
            }

            if(!meta.render) {
                delete meta.props.onClick; // 删除原先的事件
                meta.render = (row, meta) => {
                    let onClick = () => {
                        if(oriClickEvent) {
                            oriClickEvent(row, meta);
                        } else {
                            console.error(`组件[IvzBasicTable]的操作功能[${meta.field}]没有监听点击事件[meta.props.onClick=undefined]`)
                        }
                    }

                    return <a {...meta.props} onClick={onClick} class="ivz-ibt-fun">{meta.name}</a>
                }
            }
        })

        slots[slotName] = ({record}) => {
            let children = []
            funMetas.forEach(meta => {
                children.push(meta.render(record, meta))
            })

            return <div>{children}</div>
        }


    }
}

function initOptionsLabel(column) {
    if(column.options instanceof Array) {
        column['__valueLabelMap'] = {}
        column.options.forEach(item => {
            column['__valueLabelMap'][item.value] = item.label;
        })
    } else if(column.dict){
        useStore().getters['sys/getOptionsByDictType'](column.dict);
        let valueLabelMap = useStore().getters['sys/getValueLabelMap'](column.dict);
        column['__valueLabelMap'] = valueLabelMap
    } else if(column.url) {
        useStore().getters['sys/getOptionsByUrl'](column.url);
        let valueLabelMap = useStore().getters['sys/getValueLabelMap'](column.url);
        column['__valueLabelMap'] = valueLabelMap
    }
}

function initColumnFormatterSlot(column, slotName, slots) {
    initOptionsLabel(column);

    let formatter = column.formatter;
    if(formatter instanceof Function) {
        // 对formatter创建代理, 新增返回label值
        column.formatter = ({value, record, column}) => {
            let label = column['__valueLabelMap'][value];
            return formatter({value, record, column, label})
        }
    } else {
        column.formatter = ({value, record, column}) => {
            return column['__valueLabelMap'][value];
        }
    }

    slots[slotName] = ({text, record}) => {
        return column.formatter({value: text, record, column})
    }
}

const typeFormatMaps = {date: 'YYYY-MM-DD HH:mm:ss', month: 'MM', week: 'E', time: 'HH:mm:ss'}
function initDatetimeColumnSlot(column, slotName, slots) {
    let formatter = column.formatter;
    if(!(formatter instanceof Function)) {
        column.formatter = ({value, row, column}) => {
            if(value) {
                let picker = column.picker || 'date';
                return moment(value, column.format || typeFormatMaps[picker])
            } else {
                return '';
            }
        }
    }

    slots[slotName] = ({text, record}) => {
        return column.formatter({value: text, record, column})
    }
}

function initTableColumns(oriColumns, slots) {
    let slotNameMaps = {}, columns = [];

    Object.keys(slots).forEach(name => {
        if(name.startsWith('c_')) {
            let dataIndex = name.split('_')
                .filter(key => key != 'c').join('.');

            slotNameMaps[dataIndex] = name;
        }
    });

    if(oriColumns instanceof Array) {
        oriColumns.forEach(column => {

            // 多选列无需处理
            if(column.type == 'selection') return;
            columns.push(column);

            // 声明此列已经初始化
            if(column['__init']) return;
            else column['__init'] = true;

            let columnSlot = {}
            column.align = column.align || 'center';
            column.dataIndex = column.dataIndex || column.field;

            let dataIndex = column.dataIndex;

            let slotName = slotNameMaps[dataIndex];
            if(slotName) {
                columnSlot['customRender'] = slotName
            } else {
                if(column.type == 'action') {
                    // 操作列的默认对齐方式为居中对齐
                    column['align'] = column['align'] || 'center';

                    columnSlot['customRender'] = getSlotName(dataIndex);
                    initColumnActionSlot(column, columnSlot['customRender'], slots)
                } else if(column.dict || column.url || column.options) {
                    columnSlot['customRender'] = getSlotName(dataIndex);
                    initColumnFormatterSlot(column, columnSlot['customRender'], slots);
                } else if(column.type == 'datetime') {
                    columnSlot['customRender'] = getSlotName(dataIndex);
                    initDatetimeColumnSlot(column, columnSlot['customRender'], slots);
                }
            }

            // 合并slots信息
            column['slots'] = column['slots'] == null ? columnSlot : {...column['slots'], ...columnSlot}
        })
    }

    return {slots, columns};
}

function getTableRowSelection(columns) {
    if(columns instanceof Array) {
        let firstColumn = columns[0];
        if(firstColumn.type == 'selection') {
            let selectionRow = {...firstColumn};
            selectionRow.type = 'checkbox';
            selectionRow.columnWidth = firstColumn.columnWidth || firstColumn.width;
            selectionRow.columnTitle = firstColumn.columnTitle || firstColumn.title;
            return selectionRow;
        }

        return null;
    } else {
        return null;
    }
}
export default defineComponent({
    name: 'IvzBasicTable',
    props: {
        rowSelection: {type: null}, // 不支持此选项
        showTotal: {type: Function},
        columns: {type: Array, default: () => []},
        total: {type: Number, default: 0}, // 总条数
        pagination: {type: Boolean, default: true}, // 是否分页, 不支持使用对象
        defaultPageSize: {type: Number, default: 10},
        showSizeChanger: {type: Boolean, default: true},
        showQuickJumper: {type: Boolean, default: true},
        expandedRowKeys: {type: Array, default: null}, // 展开的行
        pageSizeOptions: {type: Array, default: () => ['10', '20', '30', '50', '80']},
    },
    setup(props, {slots, emit}) {
        let page = reactive({});
        let selectedRows = ref([]);
        let selectedRowKeys = ref([]);

        let {columns, expandedRowKeys} = props;
        let unfoldRowKeys = ref(expandedRowKeys);
        let rowSelection = getTableRowSelection(columns);

        // 监控展开行数据变化
        watch(() => props.expandedRowKeys, (newVal) => {
            unfoldRowKeys.value = newVal;
        })

        if(rowSelection) {
            rowSelection = reactive(rowSelection);

            rowSelection.onChange = (selectedKeys, rows) => {
                selectedRows.value = rows;
                selectedRowKeys.value = selectedKeys;
                emit('selectChange', selectedKeys, rows);
            }

            rowSelection.onSelect = (record, selected, selectedRows) => {
                emit('select', record, selected, selectedRows)
            }

            rowSelection.onSelectAll = (selected, selectedRows, changeRows) => {
                emit('selectAll', selected, selectedRows, changeRows)
            }

            rowSelection.onSelectInvert = (selectedRows) => {
                emit('selectInvert', selectedRows)
            }
        }

        // 分页触发事件
        page.onChange = (current, pageSize) => {
            emit('pageChange', current, pageSize);
        }

        page.onShowSizeChange = (current, pageSize) => {
            emit('sizeChange', current, pageSize);
        }

        let mergePagination = ({pagination, total, showTotal, showSizeChanger, showQuickJumper, pageSizeOptions}) => {
            if(pagination) {
                page.total = total;
                page.showQuickJumper = showQuickJumper;
                page.showSizeChanger = showSizeChanger;
                page.pageSizeOptions = pageSizeOptions;
                page.showTotal = showTotal ? showTotal : (total, range) => `共 ${total} 条`

                return page;
            } else {
                return false;
            }
        }

        let tableInfo = initTableColumns(columns, {...slots});
        let slotsRef = ref(tableInfo.slots);
        let columnsRef = ref(tableInfo.columns)

        // 刷新列数据
        let updateColumns = () => {
            let tableInfo = initTableColumns(columns, slotsRef.value);
            slotsRef.value = tableInfo.slots;
            columnsRef.value = tableInfo.columns
        }

        return {slotsRef, columnsRef, selectedRows, rowSelection, selectedRowKeys
            , mergePagination, updateColumns, unfoldRowKeys}
    },

    render() {
        this.updateColumns();
        let pagination = this.mergePagination(this.$props);

        return (
            <a-table {...this.$attrs} columns={this.columnsRef} rowSelection={this.rowSelection}
                pagination={pagination} v-slots={this.slotsRef} expandedRowKeys={this.unfoldRowKeys}
                ref="ATableRef" onExpandedRowsChange={this.expandedRowsChange} customRow={(row) => {
                    return {
                        onClick: (event) => this.$emit('rowClick', row),       // 点击行
                        onDblclick: (event) => this.$emit('rowDblclick', row), // 行双击
                    }
                 }}>
        </a-table>)
    },
    methods: {
        getPagination() {
          return this.$props.pagination ? this.page : false;
        },

        /**
         * 展开/折叠
         */
        expanded(expandedRows) {
            if(expandedRows) {
                this.unfoldRowKeys = expandedRows;
                return; // 展开传入的行
            }

            if(this.unfoldRowKeys && this
                .unfoldRowKeys.length > 0) {
                this.unfoldRowKeys = [];
            } else {
                this.unfoldRowKeys = this.getAllKeys();
            }
        },

        /**
         * 展开行改变
         * @param expandedRows
         */
        expandedRowsChange(expandedRows) {
            this.unfoldRowKeys = expandedRows;
        },
        /**
         * 获取所有的可展开keys
         * @return {null|[]}
         */
        getAllKeys() {
            let dataSource = this.$attrs.dataSource;
            if(dataSource instanceof Array) {
                let keys = [];
                let doGetAllKeys = (children) => {
                    children.forEach(item => {
                        if(item.children instanceof Array) {
                            keys.push(item[this.$attrs.rowKey])
                            doGetAllKeys(item.children)
                        }
                    })

                    return keys;
                }

                return doGetAllKeys(dataSource);
            }

            return null;
        },

        getDataSource() {
            return this.$refs['ATableRef'].dataSource;
        },

        getSelectedRows() {
            return this.selectedRows;
        },

        getSelectedRowKeys() {
            return this.selectedRowKeys;
        },

        setSelectedRowKeys(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        }
    }
})

export {initTableColumns}