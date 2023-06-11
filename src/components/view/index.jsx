import '@/components/view/index.css'
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzFuncView from "@/components/view/IvzFuncView.vue";
import UView from "@/components/view/View.jsx";
import UTable from "@/components/table/BasicTable.jsx";
import UBreadSearch from "@/components/search/BreadSearch.vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import {defineComponent, inject, mergeProps} from "vue";
import UFormModal from "@/components/modal/FormModal";
import UFormDrawer from "@/components/drawer/FormDrawer";
import {ViewContextKey} from "@/utils/ProvideKeys";
import CoreConsts from "@/components/CoreConsts";

export const UViewSearch = defineComponent({
    name: 'UViewSearch',
    components: {UBreadSearch},
    setup() {
        let viewContext = inject(ViewContextKey);
        let searchFunMetas = [];
        if(viewContext) {
            searchFunMetas = viewContext.funMetasContext['searchFunMetas'];
        }

        return {searchFunMetas};
    },
    render() {
        return (<div class="ivz-view ivz-primary-search">
            <UBreadSearch funMetas={this.searchFunMetas} {...this.$attrs} v-slots={this.$slots} uid={CoreConsts.PrimarySearchRef}/>
        </div>)
    }
})

export const UViewModal = defineComponent({
    name: 'UViewModal',
    components: {UFormModal},
    render() {
        return <div class="ivz-view ivz-primary-modal">
            <UFormModal {...this.$attrs} uid={CoreConsts.PrimaryEditRef} v-slots={this.$slots} />
        </div>
    }
})

export const UViewDrawer = defineComponent({
    name: 'UViewDrawer',
    components: {UFormDrawer},
    render() {
        return <div class="ivz-view ivz-primary-drawer">
            <UFormDrawer {...this.$attrs}  uid={CoreConsts.PrimaryEditRef} v-slots={this.$slots} />
        </div>
    }
})

export const UViewTable = defineComponent({
    name: 'UViewTable',
    components: {UTable},
    setup(props, {attrs}) {
        let tableFunMetas = [];
        let viewContext = inject(ViewContextKey);
        if(viewContext) {
            tableFunMetas = viewContext.funMetasContext['tableFunMetas'];
            if(tableFunMetas instanceof Array) {
                tableFunMetas.forEach(meta => {
                    initMetaCallback(meta, viewContext.__$View, 'table');
                })
            }
        }

        let {columns} = attrs;
        if(columns instanceof Array) {
            columns.forEach(column => {
                if(column.type == 'action' && !column.funMetas) {
                    column['funMetas'] = tableFunMetas;
                }
            })
        }
        let rowKey = viewContext.getRowKey();
        return {viewContext, rowKey}
    },
    render() {
        return (
            <div class="ivz-view ivz-primary-table">
                <UTable {...this.$attrs} uid={CoreConsts.PrimaryTableRef} rowKey={this.rowKey} v-slots={this.$slots}/>
            </div>)
    }
})

export default {
    install(app) {
        app.component(IvzMenuView.name, IvzMenuView);
        app.component(IvzFuncView.name, IvzFuncView);
        app.component(UView.name, UView);
        app.component(UViewModal.name, UViewModal);
        app.component(UViewTable.name, UViewTable);
        app.component(UViewDrawer.name, UViewDrawer);
        app.component(UViewSearch.name, UViewSearch);
    }
}
