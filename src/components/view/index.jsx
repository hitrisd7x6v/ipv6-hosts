import '@/components/view/index.css'
import UView from "@/components/view/View.jsx";
import ULinkView from "@/components/view/LinkView.jsx";
import UTable from "@/components/table/BasicTable.jsx";
import UBreadSearch from "@/components/search/BreadSearch.vue";
import UBasicSearch from "@/components/search/BasicSearch.vue";
import {defineComponent, inject} from "vue";
import UFormModal from "@/components/modal/FormModal";
import UFormDrawer from "@/components/drawer/FormDrawer";
import {ViewContextKey} from "@/utils/ProvideKeys";
import CoreConsts from "@/components/CoreConsts";

export const UViewSearch = defineComponent({
    name: 'UViewSearch',
    components: {UBreadSearch, UBasicSearch},
    props: {
        bread: {type: Boolean, default: false},
        tid: {type: String, default: CoreConsts.DefaultTableUid} // 表组件uid 默认主表组件的uid
    },
    setup({tid, bread}, {attrs, slots}) {
        let component = bread ?
            <UBreadSearch {...attrs} tid={tid} v-slots={slots} uid={CoreConsts.DefaultSearchUid}/> :
            <UBasicSearch  {...attrs} tid={tid} v-slots={slots} uid={CoreConsts.DefaultSearchUid}/>
        return {component}
    },
    render() {
        return (<div class="ivz-view ivz-primary-search">{this.component}</div>)
    }
})

export const UViewModal = defineComponent({
    name: 'UViewModal',
    components: {UFormModal},
    render() {
        return <div class="ivz-view ivz-primary-modal">
            <UFormModal {...this.$attrs} uid={CoreConsts.DefaultEditUid} v-slots={this.$slots} />
        </div>
    }
})

export const UViewDrawer = defineComponent({
    name: 'UViewDrawer',
    components: {UFormDrawer},
    render() {
        return <div class="ivz-view ivz-primary-drawer">
            <UFormDrawer {...this.$attrs}  uid={CoreConsts.DefaultEditUid} v-slots={this.$slots} />
        </div>
    }
})

export const UViewTable = defineComponent({
    name: 'UViewTable',
    components: {UTable},
    props: {
        rowKey: {default: null}
    },
    setup(props, {attrs}) {
        let viewContext = inject(ViewContextKey);

        let viewRowKey = viewContext.getRowKey();
        return {viewContext, viewRowKey}
    },
    render() {
        let rowKey = this.rowKey || this.viewRowKey;
        return (
            <div class="ivz-view ivz-primary-table">
                <UTable {...this.$attrs} uid={CoreConsts.DefaultTableUid} rowKey={rowKey} v-slots={this.$slots}/>
            </div>)
    }
})

export default {
    install(app) {
        app.component(UView.name, UView);
        app.component(ULinkView.name, ULinkView);
        app.component(UViewModal.name, UViewModal);
        app.component(UViewTable.name, UViewTable);
        app.component(UViewDrawer.name, UViewDrawer);
        app.component(UViewSearch.name, UViewSearch);
    }
}
