import {defineComponent, inject, ref} from "vue";
import {ViewContextKey} from "@/utils/ProvideKeys";
import {EditContext} from "@/components/view/ViewAction";
import MixinsEditItem from "@/components/edit/MixinsEditItem";

export default defineComponent({
    name: 'IvzBasicDrawer',
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
        afterVisibleChange: {type: Function},
        forceRender: {type: Boolean, default: false},
        spinTip: {type: String, default: "数据处理中..."},
    },
    mixins: [MixinsEditItem],
    setup(props, {attrs, slots}) {
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(false);

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
            title: () => slots.title ? slots.title() : []
        }

        let viewContext = inject(ViewContextKey);
        let editContext = new EditContext(viewContext);
        if(viewContext) {
            let primary = attrs.primary;
            if(primary == '' || primary == true) {
                let context = viewContext['primaryEditContext'];
                if(!context.isPrimary) {
                    editContext = context;
                    context.isPrimary = true;
                }
            } else if(attrs['id']) {
                viewContext.addContextById(attrs['id'], editContext);
            }
        }

        return {formRef, spinning, visible, labelCol, wrapperCol, titleSlots, editContext}
    },
    render() {
        let model = {}, context = {};

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        } else {
            this.formRef = this.$refs['iemFormRef'];
        }

        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} wrapStyle={{position: 'absolute'}}
                         {...this.$props} closable={false} v-slots={this.titleSlots} ref="ADrawerRef" getContainer={false}>
            <a-spin size="small" tip={this.spinTip} spinning={this.spinning}>
                <ivz-form {...this.$attrs} ref="iemFormRef" labelCol={this.labelCol} wrapperCol={this.wrapperCol}>
                    {this.$slots.default ? this.$slots.default({model, context}) : []}
                </ivz-form>
            </a-spin>
        </a-drawer>)
    }
})

