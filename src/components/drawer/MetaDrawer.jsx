import {computed, defineComponent, inject, mergeProps, ref, watch} from "vue";
import UFormDrawer from "@/components/drawer/FormDrawer";
import {initMetaCallback} from "@/utils/MetaUtils";
import {USearch} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'UMetaDrawer',
    props: {
        funMetas: {type: Array, default: () => []}
    },
    components: {UFormDrawer, UFuncBtn},
    setup({funMetas}) {
        let funcBtnRef = ref([]);
        let viewContext = inject(ViewContextKey);
        let initFunMetas = (funMetas) => {
            let funcBtn = [];
            funMetas.forEach(meta => {
                initMetaCallback(meta, viewContext.__$View, 'edit');
                funcBtn.push(<UFuncBtn {...meta.props} func={meta.field}>{meta.name}</UFuncBtn>)
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
        return <UFormDrawer class="ivz-metas-drawer" {...this.$attrs} v-slots={slots}/>
    }
})
