import {defineComponent, inject, mergeProps, ref, watch} from "vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import {IvzFuncBtn} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'IvzMetaModal',
    components: {IvzBasicModal, IvzFuncBtn},
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
        let footerSlots = { footer: () => this.funcBtnRef}
        let slots = mergeProps(footerSlots, this.$slots);
        return <IvzBasicModal class="ivz-metas-modal" {...this.$attrs} v-slots={slots}></IvzBasicModal>
    }
})
