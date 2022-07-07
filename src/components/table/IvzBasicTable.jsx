import {defineComponent, h, mergeProps, reactive, ref, resolveComponent} from "vue";
import {mapGetters, useStore} from "vuex";

function initColumnActionSlot(column, slotName, slots) {
    let funMetas = column['funMetas'];
    if(funMetas instanceof Array) {
        funMetas.forEach(meta => {
            meta['key'] = meta.field;
            if(!meta.render) {
                meta.render = (row) => {
                    let props = {onClick: () => meta.callback(row, meta)
                        , key: meta.field, style: meta.style}
                    return h('a', props, [meta.name]);
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
function initColumnFormatterSlot(column, slotName, slots) {
    let getOptionsLabel = useStore().getters['sys/optionsLabel'];
    let key = column.dict || column.url;
    if(!column.formatter) {
        column.formatter = ({value, row, column}) => {
            return getOptionsLabel(key, value)
        }
    } else {
        let formatter = column.formatter;
        column.formatter = ({value, row, column}) => {
            let label = getOptionsLabel(key, value);
            return formatter({value, row, column, label})
        }
    }

    slots[slotName] = ({text, row}) => {
        return column.formatter({value: text, row, column})
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
            if(column['_init']) return;

            let dataIndex = column.dataIndex;
            if(!dataIndex) {

            }
            let slotName = slotNameMaps[dataIndex];
            if(slotName) {
                columnSlot['customRender'] = slotName
            } else {
                if(column.type == 'action') {
                    let fieldPath = dataIndex.split('.');
                    fieldPath.splice(0, 0, 'c');
                    columnSlot['customRender'] = fieldPath.join('_');
                    initColumnActionSlot(column, columnSlot['customRender'], returnSlots)
                }

                if(column.dict || column.url) {
                    let fieldPath = dataIndex.split('.');
                    fieldPath.splice(0, 0, 'c');
                    columnSlot['customRender'] = fieldPath.join('_');
                    initColumnFormatterSlot(column, columnSlot['customRender'], returnSlots);
                }
            }

            column['slots'] = columnSlot
            column['_init'] = true;
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
                columns.splice(index, 1);
                return selectionColumn;
            }
        }

        return selectionColumn;
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
    computed: {
      ...mapGetters({
          getOptionsLabel: 'sys/optionsLabel'
      })
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
