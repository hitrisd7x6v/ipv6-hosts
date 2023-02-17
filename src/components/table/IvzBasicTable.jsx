import moment from 'moment'
import {useStore} from "vuex";
import {Tag} from 'ant-design-vue'
import {IvzFuncTag} from "@/components/basic";
import {defineComponent, h, inject, mergeProps, provide, reactive, ref, watch} from "vue";
import {MetaConst} from "@/utils/MetaUtils";
import {FuncContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {TableContext} from "@/components/view/ViewAction";
import CoreConsts from "@/components/CoreConsts";

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
                    return <IvzFuncTag func={meta.field} onClick={oriClickEvent}
                        data={row} disabled={meta.disabled}>{meta.name}</IvzFuncTag>
                }
            }
        })

        slots[slotName] = ({record}) => {
            let children = []
            funMetas.forEach(meta => {
                if(meta.view(record, meta)) {
                    children.push(meta.render(record, meta))
                }
            })

            return <div>{() => children}</div>
        }


    }
}

function initOptionsLabel(column) {
    let labelField = column.labelField || MetaConst.DefaultLabelField;
    let valueField = column.valueField || MetaConst.DefaultValueField;

    if(column.options instanceof Array) {
        column['__valueLabelMap'] = {}
        column.options.forEach(item => {
            let label = item[labelField];
            let value = item[valueField];

            column['__valueLabelMap'][value] = label;
        })
    } else if(column.dict){
        useStore().getters['sys/getOptionsByDictType'](column.dict, labelField, valueField);
        let valueLabelMap = useStore().getters['sys/getValueLabelMap'](column.dict);
        column['__valueLabelMap'] = valueLabelMap
    } else if(column.url) {
        useStore().getters['sys/getOptionsByUrl'](column.url, labelField, valueField);
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

const typeFormatMaps = {datetime: 'YYYY-MM-DD HH:mm:ss', date: 'YYYY-MM-DD', month: 'MM', week: 'E', time: 'HH:mm:ss'}
function initDatetimeColumnSlot(column, slotName, slots) {
    let formatter = column.formatter;
    if(!(formatter instanceof Function)) {
        column.formatter = ({value, row, column}) => {
            try {
                if (value) {
                    let picker = column.picker || 'datetime';
                    return moment(value).format(column.format || typeFormatMaps[picker]);
                } else {
                    return '';
                }
            } catch (e) {
                console.error(e);
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
    if(columns.length > 0) {
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
        primary: {type: Boolean, default: false},
        dataSource: {type: Array},
        rowSelection: {type: null}, // 不支持此选项
        columns: {type: Array, default: () => []},
        pagination: {
            default: () => {
                return {
                    total: 0,
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `共 ${total}条`,
                    pageSizeOptions: ['10', '20', '30', '50', '100']
                }
            }
        }, // 是否分页, 不支持使用对象
    },
    setup(props, {slots, emit, attrs}) {
        let selectedRows = ref([]);
        let selectedRowKeys = ref([]);

        let loading = ref(false);
        let dataSourceRef = ref(props.dataSource);
        let {columns, expandedRowKeys} = props;
        let unfoldRowKeys = ref(expandedRowKeys);
        let rowSelection = getTableRowSelection(columns);

        let viewContext = inject(ViewContextKey);
        let tableContext = new TableContext(viewContext);

        // 监控展开行数据变化
        watch(() => props['expandedRowKeys'], (newVal) => {
            unfoldRowKeys.value = newVal;
        })

        // 监听数据源变化
        watch(() => props.dataSource, (newVal) => {
            dataSourceRef.value = newVal;
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
        if(props.pagination instanceof Object) {
            props.pagination.onChange = (current, pageSize) => {
                emit('pageChange', current, pageSize);
                tableContext.pageChange(current, pageSize);
            }

            // 每页条数改变事件
            props.pagination.onShowSizeChange = (current, pageSize) => {
                emit('sizeChange', current, pageSize);
                tableContext.sizeChange(current, pageSize);
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

        let setLoading = (status) => loading.value = status;
        let setDataSource = (ds) => dataSourceRef.value = ds;
        let setTotalRows = (total) => {
            if(props.pagination instanceof Object) {
                props.pagination.total = total;
            }
        }

        if(viewContext) {
            if(props.primary) {
                let primaryContext = viewContext["primaryTableContext"];
                if(primaryContext.isPrimary) {
                    console.warn(`当前视图[${viewContext.name}]已经包含声明为[primary]的表格组件`)
                } else {
                    tableContext = primaryContext;
                    tableContext.isPrimary = true; // 标记是主上下文
                }
            } else if(attrs['id']) {
                viewContext.addContextById(attrs['id'], tableContext);
            }

            if(tableContext) {
                tableContext['setLoading'] = setLoading;
                tableContext['setTotalRows'] = setTotalRows;
                tableContext['setDataSource'] = setDataSource;

                if(props.pagination instanceof Object) { // 如果需要分页
                    tableContext['currentPage'] = 1;
                    tableContext['pageSize'] = props.pagination.defaultPageSize
                }
            }
        }

        provide(FuncContextKey, tableContext);
        return {slotsRef, columnsRef, selectedRows, rowSelection, selectedRowKeys
            , updateColumns, unfoldRowKeys, loading, dataSourceRef
            , setDataSource, setLoading, setTotalRows, tableContext}
    },
    created() {
        this.tableContext['expanded'] = this.expanded;
        this.tableContext['getSelectedRows'] = this.getSelectedRows;
        this.tableContext['getSelectedRowKeys'] = this.getSelectedRowKeys;
    },
    render() {
        return (
            <ATable {...this.$attrs} columns={this.columnsRef} rowSelection={this.rowSelection}
                loading={this.loading} dataSource={this.dataSourceRef} ref="ATableRef"
                pagination={this.pagination} v-slots={this.slotsRef} expandedRowKeys={this.unfoldRowKeys}
                onExpandedRowsChange={this.expandedRowsChange} customRow={(row) => {
                    return {
                        onClick: (event) => this.$emit('rowClick', row),       // 点击行
                        onDblclick: (event) => this.$emit('rowDblclick', row), // 行双击
                    }
                 }}>
            </ATable>)
    },
    methods: {
        getPagination() {
          return this.$props.pagination ? this.page : false;
        },

        getTableContext() {
            return this.tableContext;
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
            let dataSource = this.dataSourceRef;
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
