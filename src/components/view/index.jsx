import '@/components/view/index.css'
import UView from "@/components/view/View.jsx";
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
        type: {type: String, default: 'basic'} // basic or bread
    },
    setup(props, {attrs, slots}) {
        let component = props.type == 'bread' ?
            <UBreadSearch {...attrs} v-slots={slots} uid={CoreConsts.PrimarySearchRef}/> :
            <UBasicSearch  {...attrs} v-slots={slots} uid={CoreConsts.PrimarySearchRef}/>
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
        let viewContext = inject(ViewContextKey);

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
        app.component(UView.name, UView);
        app.component(UViewModal.name, UViewModal);
        app.component(UViewTable.name, UViewTable);
        app.component(UViewDrawer.name, UViewDrawer);
        app.component(UViewSearch.name, UViewSearch);
    }
}
