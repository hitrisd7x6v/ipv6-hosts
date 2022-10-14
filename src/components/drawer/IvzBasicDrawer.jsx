import {defineComponent, ref} from "vue";

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
    setup(props, {attrs}) {
        let refs = ref(null);
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
        return {formRef, refs, spinning, visible, labelCol, wrapperCol}
    },
    render() {
        let model = {}, context = {};

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        } else {
            this.formRef = this.$refs['iemFormRef'];
        }

        let slots = {
            title: () => this.$slots.title ? this.$slots.title() : ""
        }

        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} wrapStyle={{position: 'absolute'}}
                         {...this.$props} closable={false} v-slots={slots} ref="ADrawerRef" getContainer={false}>
            <a-spin size="small" tip={this.spinTip} spinning={this.spinning}>
                <ivz-form {...this.$attrs} ref="iemFormRef" labelCol={this.labelCol} wrapperCol={this.wrapperCol}>
                    {this.$slots.default ? this.$slots.default({model, context}) : ''}
                </ivz-form>
            </a-spin>
        </a-drawer>)
    }
})

