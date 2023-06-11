import {defineComponent, inject, provide, ref} from "vue";
import {FuncContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {EditContext} from "@/components/view/Context";
import MixinsEditItem from "@/components/edit/MixinsEditItem";

export default defineComponent({
    name: 'UFormDrawer',
    props: {
        title: String,
        bodyStyle: Object,
        centered: Boolean,
        span: {type: Array}, // labelCol 和wrapperCol简写 如：[6, 18]
        afterClose: Function,
        width: {default: 452},
        height: {default: 452},
        destroyOnClose: Boolean,
        zIndex: {default: 1000},
        keyboard: {default: true},
        placement: {default: 'right'},
        maskClosable: {default: true},
        primary: {type: Boolean, default: false},
        // afterVisibleChange: {type: Function},
        forceRender: {type: Boolean, default: false},
    },
    mixins: [MixinsEditItem],
    setup(props, {attrs, slots}) {
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(false);
        let spinTip = ref("数据处理中...");

        let labelCol = attrs.labelCol, wrapperCol = attrs.wrapperCol;
        if(props.span) {
            if(!labelCol) {
                labelCol = {span: props.span[0]};
            }

            if(!wrapperCol) {
                wrapperCol = {span: props.span[1]}
            }
        }

        let titleSlots = {
            title: () => {
                let model = formRef.value ? formRef.value.getEditModel() : {};
                return slots.title ? slots.title({model}) : props.title
            }
        }

        let viewContext = inject(ViewContextKey);
        let editContext = new EditContext(viewContext);
        if(attrs.uid && viewContext) {
            editContext.uid = attrs.uid;
            viewContext.addContextByUid(attrs.uid, editContext);
        }

        provide(FuncContextKey, editContext);
        return {formRef, spinning, spinTip, visible, labelCol, wrapperCol, titleSlots, editContext}
    },
    render() {
        let model = {}, context = {};

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        } else {
            this.formRef = this.$refs['iemFormRef'];
        }
        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} style={{position: 'absolute'}}
                         {...this.$props} closable={false} v-slots={this.titleSlots}
                         getContainer=".ivz-main-container" ref="ADrawerRef">
            <a-spin size="small" tip={this.spinTip} spinning={this.spinning}>
                <UForm {...this.$attrs} ref="iemFormRef" labelCol={this.labelCol} wrapperCol={this.wrapperCol}>
                    {this.$slots.default ? this.$slots.default({model, context}) : []}
                </UForm>
                <div class="ivz-drawer-footer">
                    {this.$slots.footer ? this.$slots.footer({model, context}) : []}
                </div>
            </a-spin>
        </a-drawer>)
    }
})

