import {defineComponent, inject, ref} from "vue";
import UTable from "@/components/table/BasicTable";
import {initMetaCallback} from "@/utils/MetaUtils";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'UMetasTable',
    components: {UTable},
    props: {
        rowSelection: null, // 不支持
    },
    setup(props, {attrs}) {
        let viewInfo = inject("IvzViewInfo");
        let viewContext = inject(ViewContextKey);
        if(!viewInfo) {
            throw new Error(`UViewTable组件只能作为IvzXxxView等视图组件的子组件`);
        }

        let ibtRef = ref();
        let dataRef = ref([]);

        let {tableFunMetas} = viewInfo;

        if(tableFunMetas instanceof Array) {
            tableFunMetas.forEach(meta => {
                initMetaCallback(meta, viewInfo, 'table');
            })
        }

        let {columns} = attrs;
        if(columns instanceof Array) {
            columns.forEach(column => {
                if(column.type == 'action' && !column.funMetas) {
                    column['funMetas'] = tableFunMetas;
                }
            })
        }

        return {ibtRef, dataRef, viewInfo, viewContext}
    },
    created() {
        this.ibtRef = this.$refs['ibtRef']
    },
    render() {
        let rowKey = this.viewContext.getRowKey();

        return (
            <div class="ivz-view ivz-view-table">
                <UTable {...this.$attrs} dataSource={this.dataRef} ref="ibtRef" primary
                   rowKey={rowKey} v-slots={this.$slots}/>
            </div>)
    }
})
