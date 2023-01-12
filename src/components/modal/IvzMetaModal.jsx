import {defineComponent, inject, mergeProps, ref, watch} from "vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import {IvzFuncBtn} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default defineComponent({
    name: 'IvzMetaModal',
    components: {IvzBasicModal, IvzFuncBtn},
    props: {
        funMetas: {type: Array}
    },
    setup({funMetas}) {
        let funcBtnRef = ref([]);
        let initFunMetas = (funMetas) => {
            let funcBtn = [];
            funMetas.forEach(meta => {
                initMetaCallback(meta, viewContext.__$View, 'edit');
                funcBtn.push(<IvzFuncBtn {...meta.props} func={meta.field}>{meta.name}</IvzFuncBtn>)
            })

            funcBtnRef.value = funcBtn;
        }

        let editFuncMetas = funMetas
        let viewContext = inject(ViewContextKey);
        if(editFuncMetas == null && viewContext != null) {
            editFuncMetas = viewContext.funMetasContext.editFunMetas;
            watch(() => viewContext.funMetasContext.editFunMetas, (newFunMetas) => {
                initFunMetas(newFunMetas);
            })
        }

        initFunMetas(editFuncMetas);
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
