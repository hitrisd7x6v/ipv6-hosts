import {defineComponent, inject, mergeProps, ref, watch} from "vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import UBasicModal from "@/components/modal/BasicModal";
import {UFuncBtn} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'UMetaModal',
    components: {UBasicModal, UFuncBtn},
    props: {
        funMetas: {type: Array, default: () => []}
    },
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
        let footerSlots = { footer: () => this.funcBtnRef}
        let slots = mergeProps(footerSlots, this.$slots);
        return <UBasicModal class="ivz-metas-modal" {...this.$attrs} v-slots={slots}></UBasicModal>
    }
})
