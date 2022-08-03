import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzButton} from '@/components/functional'
import IvzViewComponents from '@/components/view'
import IvzFormComponents from "@/components/form/basic";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzEditModal from "@/components/edit/IvzEditModal.jsx";
export default {
    install(app) {
        app.use(IvzFormComponents) // 表单组件
        app.use(IvzViewComponents) // 视图组件

        app.component("IvzButton", IvzButton)
        app.component(IvzBasicTable.name, IvzBasicTable)
        app.component(IvzBasicSearch.name, IvzBasicSearch)
    }
}

export {IvzEditModal, IvzBasicTable}
