import {defineComponent, inject, provide} from "vue";
import {LinkContext, ViewContext} from "@/components/view/Context";
import {LinkViewContextKey, ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: "ULinkView",
    props: {
        // 功能名称 比如 用户管理
        name: {type: String, default: ''},
        uid: {type: String, required: true},
        rowKey: {type: String, default: 'id'},
    },
    setup({uid}) {
        let viewContext = inject(ViewContextKey);
        const linkContext = new LinkContext(uid, viewContext);
        if(viewContext == null) {
            throw new Error(`ULinkView组件必须作为UView的子组件`);
        }

        provide(LinkViewContextKey, linkContext);
        return {linkContext, viewContext}
    },
    mounted() {
        /**
         * @type {LinkContext}
         */
        let linkContext = this.linkContext;
        let queryFunc = linkContext.getQueryFunc();
        queryFunc.forEach(func => {
            func.trigger();
        })
    },
    render() {
        return <div class="u-link-view">{this.$slots.default ? this.$slots.default() : []}</div>
    },
    methods: {
        /**
         * @return {UnwrapRef<ViewContext>}
         */
        getViewContext() {
            return this.viewContext;
        },

        /**
         * @return {UnwrapRef<LinkContext>}
         */
        getLinkContext() {
            return this.linkContext;
        }
    }
})
