import {defineComponent, provide} from "vue";
import {$View, ViewContext} from "@/components/view/Context";
import {ViewContextKey} from "@/utils/ProvideKeys";
import CoreConsts from "@/components/CoreConsts";
import ULinkView from "@/components/view/LinkView";

export default defineComponent({
    name: "UView",
    props: {
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
        // 功能点是否需要权限{@link UFuncBtn} {@link UFuncTag} 通过url判断是否显示
        auth: {type: Boolean, default: false},
        rowKey: {type: String, default: 'id'},
    },
    components: {ULinkView},
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
        let linkContext = this.viewContext.getLinkContextByUid(CoreConsts.PrimaryUid);
        linkContext.queryFuncs.forEach(func => {
            let context = func.getContext().getLinkContext();
            if(context == linkContext) {
                func.trigger();
            }
        })
    },
    render() {
        return <ULinkView {...this.$props} uid={CoreConsts.PrimaryUid} class="ivz-page-view u-page-view">
            {this.$slots.default ? this.$slots.default() : []}
        </ULinkView>
    },
    methods: {
        /**
         * @return {$View|void|*}
         */
        getView() {
            return this.$parent.$view;
        }
    }
})
