import {defineComponent, reactive, ref} from "vue";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
export default defineComponent({
    name: 'IvzEditModal',
    props: {
        title: String,
        bodyStyle: Object,
        afterClose: Function,
        centered: Boolean,
        destroyOnClose: Boolean,
        width: {default: 558},
        getContainer: {type: Function},
        maskClosable: {default: false},
        closable: {type: Boolean, default: false},
        funMetas: {type: Array, default: () => []},
        forceRender: {type: Boolean, default: false},
        afterVisibleChange: {type: Function},
    },
    mixins: [MixinsEditItem],
    setup({funMetas}) {
        let refs = ref(null);
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(false);

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
        return {formRef, initFunMetas, refs, spinning, visible}
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

        return <a-modal v-model={[this.visible, 'visible', ["modifier"]]}
                        {...this.$props} v-slots={slots} ref="iemRef">
                <a-spin size="small" tip="数据处理中..." spinning={this.spinning}>
                    <ivz-form {...this.$attrs} ref="iemFormRef">
                        {this.$slots.default ? this.$slots.default({model, context}) : null}
                    </ivz-form>
                </a-spin>
            </a-modal>
    }
})
