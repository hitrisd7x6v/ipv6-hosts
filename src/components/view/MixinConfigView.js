import {mapMutations} from "vuex";
import {FunMetaMaps} from "@/utils/MetaUtils";

export default {
    props: {
        // 显示重置按钮
        reset: {type: Boolean, default: true},
    },
    created() {
        // 对于视图组件(IvzXxxView)必须作为页面的顶级组件
        let $parent = this.$parent;
        $parent.$view = this.IvzView;
    },

    mounted() {
        // 加载数据
        let viewMeta = this.IvzView.getMetaContext()
            .getSearchMeta(FunMetaMaps.View);

        this.IvzView.query(viewMeta.url);
    },
    methods: {
        ...mapMutations({
            removePageViewData: 'view/removePageViewData',
        }),
    },

    unmounted() { // 在卸载的时候移除视图数据
        this.removePageViewData(this.viewMenu);
    }
}
