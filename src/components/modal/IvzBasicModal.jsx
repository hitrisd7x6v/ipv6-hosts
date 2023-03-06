import {defineComponent, inject, provide, ref} from "vue";
import {FuncContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/Context";

export default defineComponent({
  name: 'IvzBasicModal',
  props: {
    title: String,
    bodyStyle: Object,
    centered: Boolean,
    span: {type: Array}, // labelCol 和wrapperCol简写 如：[6, 18]
    afterClose: Function,
    width: {default: 558},
    destroyOnClose: Boolean,
    getContainer: {type: Function},
    maskClosable: {default: true},
    primary: {type: Boolean, default: false},
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
    if(viewContext) {
      if(props.primary) {
        let context = viewContext['primaryEditContext'];
        if(!context.isPrimary) {
          editContext = context;
          context.isPrimary = true;
        } else {
          console.warn(`当前视图[${viewContext.name}]已包含声明为[primary]的编辑组件`)
        }
      } else if(attrs['id']) {
        viewContext.addContextById(attrs['id'], editContext);
      }
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
        <IvzForm {...this.$attrs} labelCol={this.labelCol} wrapperCol={this.wrapperCol} ref="iemFormRef">
          {this.$slots.default ? this.$slots.default({model, context}) : []}
        </IvzForm>
      </ASpin>
    </AModal>
  }
})
