import '@/components/view/index.css'
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzFuncView from "@/components/view/IvzFuncView.vue";
import IvzBasicView from "@/components/view/IvzBasicView.jsx";
import IvzBasicTable from "@/components/table/IvzBasicTable.jsx";
import IvzBreadSearch from "@/components/search/IvzBreadSearch.vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import {defineComponent, inject, mergeProps} from "vue";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer";
import {ViewContextKey} from "@/utils/ProvideKeys";

export const IvzPrimarySearch = defineComponent({
    name: 'IvzPrimarySearch',
    components: {IvzBreadSearch},
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
            <IvzBreadSearch funMetas={this.searchFunMetas} {...this.$attrs} v-slots={this.$slots} primary/>
        </div>)
    }
})

export const IvzPrimaryModal = defineComponent({
    name: 'IvzViewModal',
    components: {IvzBasicModal},
    render() {
        return <div class="ivz-view ivz-primary-modal">
            <IvzBasicModal {...this.$attrs} primary v-slots={this.$slots} />
        </div>
    }
})

export const IvzViewDrawer = defineComponent({
    name: 'IvzViewDrawer',
    components: {IvzBasicDrawer},
    render() {
        return <div class="ivz-view ivz-primary-drawer">
            <IvzBasicDrawer {...this.$attrs} primary v-slots={this.$slots} />
        </div>
    }
})

export const IvzViewTable = defineComponent({
    name: 'IvzViewTable',
    components: {IvzBasicTable},
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
        let rowKey = viewContext.__$View.getRowKey();
        return {viewContext, rowKey}
    },
    render() {

        return (
            <div class="ivz-view ivz-primary-table">
                <IvzBasicTable {...this.$attrs} primary rowKey={this.rowKey} v-slots={this.$slots}/>
            </div>)
    }
})

export default {
    install(app) {
        app.component(IvzMenuView.name, IvzMenuView);
        app.component(IvzFuncView.name, IvzFuncView);
        app.component(IvzBasicView.name, IvzBasicView);
        app.component(IvzPrimaryModal.name, IvzPrimaryModal);
        app.component(IvzViewTable.name, IvzViewTable);
        app.component(IvzViewDrawer.name, IvzViewDrawer);
        app.component(IvzPrimarySearch.name, IvzPrimarySearch);
    }
}
