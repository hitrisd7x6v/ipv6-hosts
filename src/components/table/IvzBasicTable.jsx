import moment from 'moment'
import {mapGetters, useStore} from "vuex";
import {
    defineComponent,
    h,
    mergeProps,
    reactive,
    ref,
    resolveComponent,
    watch,
    toRefs,
    isReactive,
    computed
} from "vue";
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
            return h(resolveComponent('a-space'), () => {
                let children = []
                funMetas.forEach(meta => {
                    children.push(meta.render(record, meta))
                })

                return children;
            });
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
        showSizeChanger: {type: Boolean, default: true},
        showQuickJumper: {type: Boolean, default: true},
        pageSizeOptions: {type: Array, default: () => ['10', '30', '50', '80', '100']},
    },
    setup({columns}, {attrs, slots, emit}) {
        let selectedRowKeys = [];
        let page = reactive({});
        let selectedRows = ref([]);
        let rowSelection = getTableRowSelection(columns);
        if(rowSelection) {
            rowSelection = reactive(rowSelection);
            rowSelection.selectedRowKeys = selectedRowKeys;

            let onChange = rowSelection.onChange;
            rowSelection.onChange = (selectedRowKeys, rows) => {
                selectedRows.value = rows;
                rowSelection.selectedRowKeys = selectedRowKeys;
                if(onChange instanceof Function) {
                    onChange(selectedRowKeys, rows)
                }
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
        let flushColumns = () => {
            let tableInfo = initTableColumns(columns, slotsRef.value);
            slotsRef.value = tableInfo.slots;
            columnsRef.value = tableInfo.columns
        }

        return {slotsRef, columnsRef, selectedRows, rowSelection, mergePagination, flushColumns}
    },

    render() {
        this.flushColumns();
        let pagination = this.mergePagination(this.$props);
        let rowSelection = getTableRowSelection(this.$props['columns']);

        return (
            <a-table {...this.$attrs} columns={this.columnsRef} rowSelection={rowSelection} pagination={pagination}  v-slots={this.slotsRef}
                 customRow={(row) => {
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

        getSelectedRows() {
            return this.selectedRows;
        },

        getSelectedRowKeys() {
            return this.rowSelection.selectedRowKeys;
        },

        setSelectedRowKeys(selectedRowKeys) {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
        }
    }
})

export {initTableColumns}
