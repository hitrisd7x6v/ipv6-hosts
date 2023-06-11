import './index.css'
import {IvzButton} from '@/components/functional'
import IvzViewComponents from '@/components/view'
import IvzBasicComponents from '@/components/basic'
import UBasicFormComponents from "@/components/form/basic";

import UTable from "@/components/table/BasicTable.jsx";
import UFormModal from "@/components/modal/FormModal.jsx";
import UFormDrawer from "@/components/drawer/FormDrawer.jsx";
import UBreadSearch from "@/components/search/BreadSearch.vue";
import USearch from "@/components/search/BasicSearch.vue";

export default {
    install(app) {
        app.use(IvzViewComponents) // 视图组件
        app.use(IvzBasicComponents) // 基础组件
        app.use(UBasicFormComponents)
        app.component(UTable.name, UTable)
        app.component(UFormModal.name, UFormModal)
        app.component(UFormDrawer.name, UFormDrawer)
        app.component(USearch.name, USearch)
        app.component(UBreadSearch.name, UBreadSearch)
    }
}
