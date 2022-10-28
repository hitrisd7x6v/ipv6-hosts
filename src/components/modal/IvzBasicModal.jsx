import {defineComponent, inject, ref} from "vue";
import {ViewContextKey} from "@/utils/ProvideKeys";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import {EditContext} from "@/components/view/ViewAction";

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
    maskClosable: {default: false},
    closable: {type: Boolean, default: false},
    forceRender: {type: Boolean, default: false},
  },
  mixins: [MixinsEditItem],
  setup(props, {attrs, slots}) {
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
    return {formRef, refs, spinning, visible, labelCol, wrapperCol, editContext}
  },
  render() {
    let model = {}, context = {};

    if(this.formRef) {
      context = this.getEditContext();
      model =  this.formRef.getEditModel();
    }

    let slots = {
      title: () => this.$slots.title ? this.$slots.title({model, context}) : null,
      footer: () => this.$slots.footer ? this.$slots.footer({model, context}) : null
    }

    return <a-modal v-model={[this.visible, 'visible', ["modifier"]]}
                    {...this.$props} v-slots={slots} ref="iemRef">
      <a-spin size="small" tip="数据处理中..." spinning={this.spinning}>
        <ivz-form {...this.$attrs} labelCol={this.labelCol}
                  wrapperCol={this.wrapperCol} ref="iemFormRef">
          {this.$slots.default({model, context})}
        </ivz-form>
      </a-spin>
    </a-modal>
  },
  methods: {
    visible() {
      return this.visible;
    },

    toggle() {
      this.visible = !this.visible;
    },

  }
})
