import '@/components/view/index.css'
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzFuncView from "@/components/view/IvzFuncView.vue";
import IvzBasicView from "@/components/view/IvzBasicView.jsx";
import IvzBasicTable from "@/components/table/IvzBasicTable.jsx";
import IvzBreadSearch from "@/components/search/IvzBreadSearch.vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import {defineComponent, inject, mergeProps} from "vue";
import IvzMetaModal from "@/components/modal/IvzMetaModal";
import IvzMetaDrawer from "@/components/drawer/IvzMetaDrawer";

export const IvzPrimarySearch = defineComponent({
    name: 'IvzPrimarySearch',
    components: {IvzBreadSearch},
    setup() {
        let viewInfo = inject("IvzViewInfo");
        let searchFunMetas = [];
        if(viewInfo) {
            searchFunMetas = viewInfo['searchFunMetas'];
            searchFunMetas.forEach(meta => {
                // 功能点默认点击事件
                initMetaCallback(meta, viewInfo, 'search');
            })
        }

        return {searchFunMetas, viewInfo};
    },
    render() {
        let props = mergeProps( {funMetas: this.searchFunMetas}, this.$attrs);
        return (<div class="ivz-view ivz-primary-search">
            <IvzBreadSearch {...props} v-slots={this.$slots} primary/>
        </div>)
    }
})

export const IvzPrimaryModal = defineComponent({
    name: 'IvzPrimaryModal',
    components: {IvzMetaModal},
    render() {
        return <div class="ivz-view ivz-primary-modal">
            <IvzMetaModal {...this.$attrs} primary v-slots={this.$slots} />
        </div>
    }
})

export const IvzPrimaryDrawer = defineComponent({
    name: 'IvzPrimaryDrawer',
    components: {IvzMetaDrawer},
    render() {
        return <div class="ivz-view ivz-primary-drawer">
            <IvzMetaDrawer {...this.$attrs} primary v-slots={this.$slots} />
        </div>
    }
})

export const IvzPrimaryTable = defineComponent({
    name: 'IvzPrimaryTable',
    components: {IvzBasicTable},
    setup(props, {attrs}) {
        let tableFunMetas = [];
        let viewInfo = inject("IvzViewInfo");
        if(viewInfo) {
            tableFunMetas = viewInfo['tableFunMetas'];
            if(tableFunMetas instanceof Array) {
                tableFunMetas.forEach(meta => {
                    initMetaCallback(meta, viewInfo, 'table');
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
        let rowKey = viewInfo.get$View().getRowKey();
        return {viewInfo, rowKey}
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
        app.component(IvzPrimaryTable.name, IvzPrimaryTable);
        app.component(IvzPrimaryDrawer.name, IvzPrimaryDrawer);
        app.component(IvzPrimarySearch.name, IvzPrimarySearch);
    }
}
