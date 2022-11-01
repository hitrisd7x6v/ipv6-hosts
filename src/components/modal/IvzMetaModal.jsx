import {defineComponent, inject, mergeProps, ref, watch} from "vue";
import {initMetaCallback} from "@/utils/MetaUtils";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import {IvzFuncBtn} from "@/components/basic";

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
                initMetaCallback(meta, viewInfo, 'edit');
                funcBtn.push(<IvzFuncBtn func={meta.field} meta={meta}>{meta.name}</IvzFuncBtn>)
            })

            funcBtnRef.value = funcBtn;
        }

        let editFuncMetas = funMetas
        let viewInfo = inject("IvzViewInfo");
        if(editFuncMetas == null && viewInfo != null) {
            editFuncMetas = viewInfo.editFunMetas;
            watch(() => viewInfo.editFunMetas, (newFunMetas) => {
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
