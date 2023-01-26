import {defineComponent, provide} from "vue";
import {$View, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: "IvzBasicView",
    props: {
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
        // 功能点是否需要权限{@link IvzFuncBtn} {@link IvzFuncTag} 通过url判断是否显示
        auth: {type: Boolean, default: false},
        rowKey: {type: String, default: 'id'},
    },
    setup(props) {
        const viewContext = new ViewContext(props);
        provide(ViewContextKey, viewContext);

        return {viewContext}
    },
    created() {
        let $parent = this.$parent;
        $parent.$view = new $View(this.viewContext);
    },
    mounted() {
        let $view = this.$parent.$view;
        if($view.getTableContext().isPrimary) {
            $view.query();
        }
    },
    render() {
        return <div class="ivz-page-view ivz-basic-view">
            {this.$slots.default ? this.$slots.default() : []}
        </div>
    }
})
