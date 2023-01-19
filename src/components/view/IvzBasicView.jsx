import {defineComponent, provide} from "vue";
import {$View, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: "IvzBasicView",
    props: {
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
    },
    setup() {
        const viewContext = new ViewContext();
        provide(ViewContextKey, viewContext);

        return {viewContext}
    },
    created() {
        let $parent = this.$parent;
        $parent.$view = new $View(this.viewContext);
    },
    mounted() {
        let $view = this.$parent.$view;
        if($view.getTableContext()) {
            $view.query();
        }
    },
    render() {
        return <div class="ivz-page-view ivz-basic-view">
            {this.$slots.default ? this.$slots.default() : []}
        </div>
    }
})
