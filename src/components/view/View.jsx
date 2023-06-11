import {defineComponent, provide} from "vue";
import {$View, ViewContext} from "@/components/view/Context";
import {ViewContextKey} from "@/utils/ProvideKeys";
import {FuncNameMeta} from "@/utils/MetaUtils";

export default defineComponent({
    name: "UView",
    props: {
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
        // 功能点是否需要权限{@link UFuncBtn} {@link UFuncTag} 通过url判断是否显示
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
        // 获取查询按钮
        let queryFunc = $view.getSearchFunc(FuncNameMeta.QUERY);
        if(queryFunc && $view.getPrimaryTableContext() != null) {
            $view.funcMetaQuery();
        }
    },
    render() {
        return <div class="ivz-page-view ivz-basic-view">
            {this.$slots.default ? this.$slots.default() : []}
        </div>
    }
})
