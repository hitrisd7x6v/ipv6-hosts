import {defineComponent, ref} from "vue";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/ViewAction";
import IvzBasicModal from "@/components/modal/IvzBasicModal";

export default defineComponent({
    name: 'IvzEditModal',
    setup({funMetas}) {
        let formRef = ref(null);

        let initFunMetas = (formRef, funMetas) => {
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
        for(let meta of this.funMetas) {
            fun.push(<ivz-button meta={meta}>{meta.name}</ivz-button>)
        }

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        }

        let slots = {
            footer: () => this.$slots.fun ? this.$slots.fun({model, context})
                : <div class="ivz-func ivz-iem-func">{fun}</div>,
            title: () => this.$slots.title ? this.$slots.title() : <span>{this.title}</span>
        }

        return <IvzBasicModal {...this.$attrs} v-slots={this.slots}></IvzBasicModal>
    }
})
