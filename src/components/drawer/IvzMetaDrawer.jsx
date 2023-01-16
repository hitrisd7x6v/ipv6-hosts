import {computed, defineComponent, inject, mergeProps, ref, watch} from "vue";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer";
import {initMetaCallback} from "@/utils/MetaUtils";
import {IvzFuncBtn} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'IvzMetaDrawer',
    props: {
        funMetas: {type: Array, default: () => []}
    },
    components: {IvzBasicDrawer, IvzFuncBtn},
    setup({funMetas}) {
        let funcBtnRef = ref([]);
        let viewContext = inject(ViewContextKey);
        let initFunMetas = (funMetas) => {
            let funcBtn = [];
            funMetas.forEach(meta => {
                initMetaCallback(meta, viewContext.__$View, 'edit');
                funcBtn.push(<IvzFuncBtn {...meta.props} func={meta.field}>{meta.name}</IvzFuncBtn>)
            })

            funcBtnRef.value = funcBtn;
        }

        initFunMetas(funMetas);
        return {initFunMetas, funcBtnRef}
    },
    watch: {
        funMetas: function(newFunMetas) {
            this.initFunMetas(newFunMetas);
        }
    },
    render() {
        let footerSlots = { footer: () => <div class="ivz-func-footer">{this.funcBtnRef}</div>}
        let slots = mergeProps(footerSlots, this.$slots);
        return <IvzBasicDrawer class="ivz-metas-drawer" {...this.$attrs} v-slots={slots}/>
    }
})
