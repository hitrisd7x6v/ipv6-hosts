import {defineComponent, inject, provide, ref} from "vue";
import {FuncContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/Context";

export default defineComponent({
  name: 'UFormModal',
  props: {
    title: String,
    bodyStyle: Object,
    span: {type: Array}, // labelCol 和wrapperCol简写 如：[6, 18]
    afterClose: Function,
    width: {default: 558},
    destroyOnClose: Boolean,
    getContainer: {type: Function},
    maskClosable: {default: true},
    centered: {type: Boolean, default: true},
    closable: {type: Boolean, default: false},
    forceRender: {type: Boolean, default: false},
    wrapClassName: {type: String, default: 'ivz-basic-modal'}
  },
  mixins: [MixinsEditItem],
  setup(props, {attrs, slots}) {
    let refs = ref(null);
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

    let viewContext = inject(ViewContextKey);
    let editContext = new EditContext(viewContext);
    if(attrs.uid && viewContext) {
      editContext.uid = attrs.uid;
      viewContext.addContextByUid(attrs.uid, editContext);
    }

    provide(FuncContextKey, editContext);
    return {formRef, refs, spinning, spinTip, visible, labelCol, wrapperCol, editContext}
  },
  render() {
    let model = {}, context = {};

    if(this.formRef) {
      context = this.getEditContext();
      model =  this.formRef.getEditModel();
    }

    let slots = {
      title: () => this.$slots.title ? this.$slots.title({model, context}) : this.title,
      footer: () => this.$slots.footer ? this.$slots.footer({model, context}) : null
    }

    return <AModal v-model={[this.visible, 'visible', ["modifier"]]} {...this.$props} v-slots={slots} ref="iemRef">
      <ASpin size="small" tip={this.spinTip} spinning={this.spinning}>
        <UForm {...this.$attrs} labelCol={this.labelCol} wrapperCol={this.wrapperCol} ref="iemFormRef">
          {this.$slots.default ? this.$slots.default({model, context}) : []}
        </UForm>
      </ASpin>
    </AModal>
  }
})
