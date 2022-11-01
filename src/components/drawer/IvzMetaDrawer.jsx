import {computed, defineComponent, inject, mergeProps, ref, watch} from "vue";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer";
import {initMetaCallback} from "@/utils/MetaUtils";
import {IvzFuncBtn} from "@/components/basic";

export default defineComponent({
    name: 'IvzMetaDrawer',
    props: {
        funMetas: {type: Array}
    },
    components: {IvzBasicDrawer, IvzFuncBtn},
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
        let footerSlots = { footer: () => <div class="ivz-func-footer">{this.funcBtnRef}</div>}
        let slots = mergeProps(footerSlots, this.$slots);
        return <IvzBasicDrawer class="ivz-metas-drawer" {...this.$attrs} v-slots={slots}/>
    }
})
