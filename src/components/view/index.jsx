import '@/components/view/index.css'
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzFuncView from "@/components/view/IvzFuncView.vue";
import UView from "@/components/view/View.jsx";
import UTable from "@/components/table/BasicTable.jsx";
import UBreadSearch from "@/components/search/BreadSearch.vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import {defineComponent, inject, mergeProps} from "vue";
import UBasicModal from "@/components/modal/BasicModal";
import UBasicDrawer from "@/components/drawer/BasicDrawer";
import {ViewContextKey} from "@/utils/ProvideKeys";

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
            <UBreadSearch funMetas={this.searchFunMetas} {...this.$attrs} v-slots={this.$slots} primary/>
        </div>)
    }
})

export const UViewModal = defineComponent({
    name: 'UViewModal',
    components: {UBasicModal},
    render() {
        return <div class="ivz-view ivz-primary-modal">
            <UBasicModal {...this.$attrs} primary v-slots={this.$slots} />
        </div>
    }
})

export const UViewDrawer = defineComponent({
    name: 'UViewDrawer',
    components: {UBasicDrawer},
    render() {
        return <div class="ivz-view ivz-primary-drawer">
            <UBasicDrawer {...this.$attrs} primary v-slots={this.$slots} />
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
                <UTable {...this.$attrs} primary rowKey={this.rowKey} v-slots={this.$slots}/>
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
