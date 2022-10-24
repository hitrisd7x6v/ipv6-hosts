import {defineComponent, provide} from "vue";
import {FunMetaMaps} from "@/utils/MetaUtils";
import {$View, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: "IvzBasicView",
    setup() {
        const config = {};
        config[FunMetaMaps.Add] = null;
        config[FunMetaMaps.Del] = null;
        config[FunMetaMaps.Edit] = null;
        config[FunMetaMaps.View] = null;
        config[FunMetaMaps.Import] = null;
        config[FunMetaMaps.Export] = null;

        const viewContext = new ViewContext();
        provide(ViewContextKey, viewContext);
        return {viewContext}
    },
    created() {
        let $parent = this.$parent;
        $parent.$view = new $View();
    },
    render() {
        return <div class="ivz-view ivz-basic-view" v-slots={this.$slots}></div>
    }
})
