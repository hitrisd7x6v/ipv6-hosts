import {defineComponent, provide} from "vue";
import {FunMetaMaps} from "@/utils/MetaUtils";
import {ViewAction} from "@/components/view/ViewAction";

export default defineComponent({
    name: "IvzBasicView",
    setup() {
        const viewContext = {};
        viewContext[FunMetaMaps.Add] = null;
        viewContext[FunMetaMaps.Del] = null;
        viewContext[FunMetaMaps.Edit] = null;
        viewContext[FunMetaMaps.View] = null;
        viewContext[FunMetaMaps.Import] = null;
        viewContext[FunMetaMaps.Export] = null;
        provide("IvzViewContext", viewContext);
        return {viewContext}
    },
    created() {
        let $parent = this.$parent;
        $parent.$actions = new ViewAction(this.viewContext);
    },
    render() {
        return <div>
            {this.$slots.default()}
        </div>
    }
})