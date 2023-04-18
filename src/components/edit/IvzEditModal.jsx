import {defineComponent, mergeProps, ref} from "vue";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/Context";
import IvzBasicModal from "@/components/modal/IvzBasicModal";

export default defineComponent({
    name: 'IvzEditModal',
    props: ['funMetas'],
    setup({funMetas}) {
        let formRef = ref(null);

        let initFunMetas = (formRef, funMetas) => {
            if(funMetas instanceof Array) {
                funMetas.forEach(meta => {
                    let oriClickEvent = meta.props.onClick;
                    if(!oriClickEvent && import.meta.env.DEV) {
                        console.warn(`组件[IvzEditModal]的功能[${meta.field}]没有监听点击事件`)
                    }

                    meta.props.onClick = () => {
                        let editModel = formRef.value.getEditModel();
                        let formContext = formRef.value.getFormContext();
                        if(oriClickEvent) {
                            oriClickEvent(editModel, meta, formContext);
                        } else {
                            console.error(`组件[IvzEditModal]的功能[${meta.field}]没有监听点击事件[meta.props.onClick=undefined]`)
                        }
                    }
                })
            }
        }
        // watch('xx', () => {})
        initFunMetas(formRef, funMetas);

        return {initFunMetas}
    },
    watch: {
        'funMetas.length': function(newFunMetas) {
            this.initFunMetas(newFunMetas);
        }
    },
    render() {
        let fun = [], model = {}, context = {};
        if(this.funMetas) {
            for(let meta of this.funMetas) {
                fun.push(<ivz-button meta={meta}>{meta.name}</ivz-button>)
            }
        }

        let slots = mergeProps(this.$slots, {
            footer: () => this.$slots.fun ? this.$slots.fun({model, context})
                : <div class="ivz-func ivz-iem-func">{fun}</div>,
        })
        return <IvzBasicModal {...this.$attrs} v-slots={slots} ref="basicModalRef"></IvzBasicModal>
    }
})
