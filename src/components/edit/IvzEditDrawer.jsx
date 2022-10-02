import {defineComponent, reactive, ref} from "vue";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
export default defineComponent({
    name: 'IvzEditDrawer',
    props: {
        title: String,
        bodyStyle: Object,
        afterClose: Function,
        centered: Boolean,
        destroyOnClose: Boolean,
        width: {default: 452},
        height: {default: 452},
        zIndex: {default: 1000},
        keyboard: {default: true},
        placement: {default: 'right'},
        maskClosable: {default: true},
        funMetas: {type: Array, default: () => []},
        forceRender: {type: Boolean, default: false},
        afterVisibleChange: {type: Function},
    },
    mixins: [MixinsEditItem],
    setup({funMetas}, {slots}) {
        let refs = ref(null);
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(false);

        let initFunMetas = (formRef, funMetas) => {
            funMetas.forEach(meta => {
                let oriClickEvent = meta.props.onClick;
                if(!oriClickEvent && import.meta.env.DEV) {
                    console.warn(`组件[IvzEditDrawer]的功能[${meta.field}]没有监听点击事件`)
                }

                meta.props.onClick = () => {
                    let editModel = formRef.value.getEditModel();
                    let formContext = formRef.value.getFormContext();
                    if(oriClickEvent) {
                        oriClickEvent(editModel, meta, formContext);
                    } else {
                        console.error(`组件[IvzEditDrawer]的功能[${meta.field}]没有监听点击事件[meta.props.onClick=undefined]`)
                    }
                }
            })
        }
        // watch('xx', () => {})
        initFunMetas(formRef, funMetas);
        let footer = (model, context, fun) => {
            if(slots.fun) {
                return slots.fun({model, context});
            } else {
                return fun;
            }
        }
        return {formRef, initFunMetas, refs, spinning, visible, footer}
    },
    watch: {
        visible: function () {
            if(!this.formRef) {
                this.$nextTick().then(() =>
                    this.formRef = this.$refs['iemFormRef'])
            }
        },

        'funMetas.length': function(newFunMetas) {
            this.initFunMetas(newFunMetas);
        }
    },
    render() {
        let fun = [], model = {}, context = {};
        for(let meta of this.funMetas) {
            fun.push(<ivz-button meta={meta} class="ivz-fm">{meta.name}</ivz-button>)
        }

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        }

        let slots = {
            title: () => this.$slots.title ? this.$slots.title() : <span>{this.title}</span>
        }

        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} wrapStyle={{position: 'absolute'}}
                    {...this.$props} closable={false} v-slots={slots} ref="ADrawerRef" getContainer={false}>
            <a-spin size="small" tip="数据处理中..." spinning={this.spinning}>
                <ivz-form {...this.$attrs} ref="iemFormRef">
                    {this.$slots.default ? this.$slots.default({model, context}) : null}
                </ivz-form>
                <div class="ivz-func ivz-ied-func">
                    {this.$slots.fun ? this.$slots.fun({model, context}) : fun}
                </div>
            </a-spin>
        </a-drawer>)
    }
})
