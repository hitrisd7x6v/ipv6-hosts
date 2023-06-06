import './index.css'
import {IvzButton} from '@/components/functional'
import IvzViewComponents from '@/components/view'
import IvzBasicComponents from '@/components/basic'
import UBasicFormComponents from "@/components/form/basic";

import UTable from "@/components/table/BasicTable.jsx";
import UBasicModal from "@/components/modal/BasicModal.jsx";
import UBasicDrawer from "@/components/drawer/BasicDrawer.jsx";
import UBreadSearch from "@/components/search/BreadSearch.vue";
import USearch from "@/components/search/BasicSearch.vue";

export default {
    install(app) {
        app.use(IvzViewComponents) // 视图组件
        app.use(IvzBasicComponents) // 基础组件
        app.use(UBasicFormComponents)
        app.component(UTable.name, UTable)
        app.component(UBasicModal.name, UBasicModal)
        app.component(UBasicDrawer.name, UBasicDrawer)
        app.component(USearch.name, USearch)
        app.component(UBreadSearch.name, UBreadSearch)
    }
}
