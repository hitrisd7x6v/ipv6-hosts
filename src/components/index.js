import './index.css'
import {IvzButton} from '@/components/functional'
import IvzViewComponents from '@/components/view'
import IvzBasicComponents from '@/components/basic'
import IvzBasicFormComponents from "@/components/form/basic";

import IvzBasicTable from "@/components/table/IvzBasicTable.jsx";
import IvzBasicModal from "@/components/modal/IvzBasicModal.jsx";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer.jsx";
import IvzBreadSearch from "@/components/search/IvzBreadSearch.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";

export default {
    install(app) {
        app.use(IvzViewComponents) // 视图组件
        app.use(IvzBasicComponents) // 基础组件
        app.use(IvzBasicFormComponents)
        app.component(IvzBasicTable.name, IvzBasicTable)
        app.component(IvzBasicModal.name, IvzBasicModal)
        app.component(IvzBasicDrawer.name, IvzBasicDrawer)
        app.component(IvzBasicSearch.name, IvzBasicSearch)
        app.component(IvzBreadSearch.name, IvzBreadSearch)
    }
}
