import {defineComponent, ref} from "vue";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/ViewAction";

export default defineComponent({
    name: 'IvzEditModal',
    props: {
        title: String,
        bodyStyle: Object,
        centered: Boolean,
        span: {type: Array}, // labelCol 和wrapperCol简写 如：[6, 18]
        afterClose: Function,
        width: {default: 558},
        destroyOnClose: Boolean,
        getContainer: {type: Function},
        maskClosable: {default: false},
        closable: {type: Boolean, default: false},
        funMetas: {type: Array, default: () => []},
        forceRender: {type: Boolean, default: false},
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
        let editContext = new EditContext({});
        return {formRef, initFunMetas, refs, spinning, visible, editContext}
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

        let labelCol = this.$attrs.labelCol, wrapperCol = this.$attrs.wrapperCol;
        if(!labelCol && this.span) {
            labelCol = {span: this.span[0]};
        }

        if(!wrapperCol && this.span) {
            wrapperCol = {span: this.span[1]}
        }
        return <a-modal v-model={[this.visible, 'visible', ["modifier"]]}
                        {...this.$props} v-slots={slots} ref="iemRef">
                <a-spin size="small" tip="数据处理中..." spinning={this.spinning}>
                    <ivz-form {...this.$attrs} labelCol={labelCol} wrapperCol={wrapperCol} ref="iemFormRef">
                        {this.$slots.default ? this.$slots.default({model, context}) : null}
                    </ivz-form>
                </a-spin>
            </a-modal>
    }
})
