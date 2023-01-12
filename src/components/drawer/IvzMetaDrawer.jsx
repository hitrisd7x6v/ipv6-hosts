import {computed, defineComponent, inject, mergeProps, ref, watch} from "vue";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer";
import {initMetaCallback} from "@/utils/MetaUtils";
import {IvzFuncBtn} from "@/components/basic";
import {ViewContextKey} from "@/utils/ProvideKeys";

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
        let footerSlots = { footer: () => <div class="ivz-func-footer">{this.funcBtnRef}</div>}
        let slots = mergeProps(footerSlots, this.$slots);
        return <IvzBasicDrawer class="ivz-metas-drawer" {...this.$attrs} v-slots={slots}/>
    }
})
