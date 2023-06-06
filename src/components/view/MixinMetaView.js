import {mapMutations} from "vuex";
import {FunMetaMaps} from "@/utils/MetaUtils";
import CoreConsts from "@/components/CoreConsts";

export default {
    props: {
        // 功能点是否需要权限{@link UFuncBtn} {@link UFuncTag} 通过url判断是否显示
        auth: {type: Boolean, default: false},
        name: {type: String, default: ''},
        rowKey: {type: String, default: CoreConsts.DefaultRowKey},
    },
    created() {
        // 对于视图组件(IvzXxxView)必须作为页面的顶级组件
        this.$parent.$view = this.meta$View;
    },

    mounted() {
        // 加载数据
        let viewMeta = this.meta$View.getSearchMeta(FunMetaMaps.View);
        this.meta$View.query(viewMeta.url);
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
