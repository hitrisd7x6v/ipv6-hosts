import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzButton} from '@/components/functional'
import {IvzForm} from "@/components/form/basic";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import IvzEditModal from "@/components/edit/IvzEditModal.jsx";
export default {
    install(app) {
        app.component("IvzForm", IvzForm)
        app.component("IvzButton", IvzButton)
        app.component("IvzBasicSearch", IvzBasicSearch)
    }
}

export {IvzMenuView, IvzEditModal, IvzBasicTable}
