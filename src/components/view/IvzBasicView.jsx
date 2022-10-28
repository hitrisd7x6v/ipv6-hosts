import {defineComponent, provide} from "vue";
import {$View, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: "IvzBasicView",
    setup() {
        const viewContext = new ViewContext();
        provide(ViewContextKey, viewContext);

        return {viewContext}
    },
    created() {
        let $parent = this.$parent;
        $parent.$view = new $View(this.viewContext);
    },
    render() {
        return <div class="ivz-page-view ivz-basic-view">
            {this.$slots.default ? this.$slots.default() : []}
        </div>
    }
})
