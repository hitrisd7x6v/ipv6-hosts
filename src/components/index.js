import './index.css'
import {IvzButton} from '@/components/functional'
import IvzViewComponents from '@/components/view'
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzBreadSearch from "@/components/search/IvzBreadSearch.vue";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzForm, IvzInput, IvzSelect, IvzCheckbox, IvzSwitch
    , IvzRate, IvzSlider, IvzInputNumber, IvzCascader, IvzAutoComplete, IvzInputPassword
    , IvzRadio, IvzMentions, IvzDateTime, IvzTreeSelect, IvzTextarea, IvzInputGroup} from "@/components/form/basic";

export default {
    install(app) {
        app.use(IvzViewComponents) // 视图组件

        app.component("IvzButton", IvzButton)
        app.component(IvzBasicTable.name, IvzBasicTable)
        app.component(IvzBasicSearch.name, IvzBasicSearch)
        app.component(IvzBreadSearch.name, IvzBreadSearch)

        app.component(IvzForm.name, IvzForm);
        app.component(IvzRate.name, IvzRate);
        app.component(IvzInput.name, IvzInput);
        app.component(IvzRadio.name, IvzRadio);
        app.component(IvzSelect.name, IvzSelect);
        app.component(IvzSwitch.name, IvzSwitch);
        app.component(IvzSlider.name, IvzSlider);
        app.component(IvzDateTime.name, IvzDateTime);
        app.component(IvzTextarea.name, IvzTextarea);
        app.component(IvzCheckbox.name, IvzCheckbox);
        app.component(IvzMentions.name, IvzMentions);
        app.component(IvzCascader.name, IvzCascader);
        app.component(IvzTreeSelect.name, IvzTreeSelect);
        app.component(IvzInputGroup.name, IvzInputGroup);
        app.component(IvzInputNumber.name, IvzInputNumber);
        app.component(IvzAutoComplete.name, IvzAutoComplete);
        app.component(IvzInputPassword.name, IvzInputPassword);
    }
}
