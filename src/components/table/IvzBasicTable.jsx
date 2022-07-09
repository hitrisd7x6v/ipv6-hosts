import moment from 'moment'
import {mapGetters, useStore} from "vuex";
import {defineComponent, h, mergeProps, reactive, ref, resolveComponent} from "vue";
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

function initTableColumns(columns, slots) {
    let slotNameMaps = {}, returnSlots = {...slots};

    Object.keys(slots).forEach(name => {
        if(name.startsWith('c_')) {
            let dataIndex = name.split('_')
                .filter(key => key != 'c').join('.');

            slotNameMaps[dataIndex] = name;
        }
    });

    if(columns instanceof Array) {
        columns.forEach(column => {
            let columnSlot = {}

            // 声明此列已经初始化
            if(column['__init']) return;

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
                    initColumnActionSlot(column, columnSlot['customRender'], returnSlots)
                } else if(column.dict || column.url || column.options) {
                    columnSlot['customRender'] = getSlotName(dataIndex);
                    initColumnFormatterSlot(column, columnSlot['customRender'], returnSlots);
                } else if(column.type == 'datetime') {
                    columnSlot['customRender'] = getSlotName(dataIndex);
                    initDatetimeColumnSlot(column, columnSlot['customRender'], returnSlots);
                }
            }

            column['slots'] = columnSlot
            column['__init'] = true;
        })
    }

    return returnSlots;
}

function getTableRowSelection(columns) {
    if(columns instanceof Array) {
        let selectionColumn;
        for(let index in columns) {
            let column = columns[index];
            if(column.type == 'selection') {
                let {width, title, fixed, hideDefaultSelections, selections, selectionType} = column;
                selectionColumn = {columnWidth: width, columnTitle: title
                    , fixed, hideDefaultSelections, type: selectionType || 'checkbox', selections};
                columns.splice(parseInt(index), 1);
                return selectionColumn;
            }
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
    },
    setup(props, {attrs, slots, emit}) {
        let {columns} = attrs;
        let selectedRows = ref([]);
        let selectedRowKeys = [];
        let rowSelection = getTableRowSelection(columns);
        if(rowSelection) {
            rowSelection = reactive(rowSelection);
            rowSelection.selectedRowKeys = selectedRowKeys;

            rowSelection.onChange = (selectedRowKeys, rows) => {
                selectedRows.value = rows;
                rowSelection.selectedRowKeys = selectedRowKeys;
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

        let columnSlots = initTableColumns(columns, slots);

        let tableProps = mergeProps(attrs, {rowSelection})
        return {slots: columnSlots, props: tableProps, selectedRows, rowSelection}
    },
    render() {
        return (
            <a-table {...this.props} customRow={(row) => {
                return {
                    onClick: (event) => 3,       // 点击行
                    onDblclick: (event) => 6,
                }
            }} v-slots={this.slots}>

        </a-table>)
    },
    methods: {
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
