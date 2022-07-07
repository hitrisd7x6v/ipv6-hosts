import {defineComponent, reactive, ref} from "vue";
import {IvzForm} from "@/components/form/basic";
const formProps = {labelCol: {span: 6}, wrapperCol: {span: 16}}
export default defineComponent({
    name: 'IvzEditModal',
    components: {IvzForm},
    props: {
        title: String,
        bodyStyle: Object,
        afterClose: Function,
        centered: Boolean,
        destroyOnClose: Boolean,
        width: {default: 452},
        maskClosable: {default: false},
        closable: {type: Boolean, default: false},
        funMetas: {type: Array, default: () => []},
        forceRender: {type: Boolean, default: false},
    },
    setup({funMetas}) {
        let refs = ref(null);
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(true);
        let initFunMetas = (formRef, funMetas) => {
            funMetas.forEach(meta => {
                if(!meta.onClick) {
                    meta.onClick = () => {
                        let editModel = formRef.value.getEditModel();
                        let formContext = formRef.value.getFormContext();
                        meta.callback(editModel, meta, formContext);
                    }
                }
            })
        }
        // watch('xx', () => {})
        initFunMetas(formRef, funMetas);
        return {formRef, initFunMetas, refs, spinning, visible}
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
            fun.push(<ivz-button meta={meta}>{meta.name}</ivz-button>)
        }

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        }

        let slots = {
            footer: () => this.$slots.fun ? this.$slots.fun({model, context}) : fun,
            title: () => this.$slots.title ? this.$slots.title() : <span>{this.title}</span>
        }

        return <a-modal v-model={[this.visible, 'visible', ["modifier"]]}
                        {...this.$props} v-slots={slots} ref="iemRef">
                <a-spin size="small" tip="数据加载中..." spinning={this.spinning}>
                    <ivz-form {...this.$attrs} {...formProps} ref="iemFormRef">
                        {this.$slots.default({model, context})}
                    </ivz-form>
                </a-spin>
            </a-modal>
    },
    methods: {
        switchActive(visible) {
          this.visible = visible;
        },

        toggleActive() {
          this.visible = !this.visible;
        },

        loadingActive() {
            return new Promise(resolve => {
              this.visible = true;
              this.spinning = true;

              this.$nextTick().then(() => {
                if(this.formRef) {
                    let editContext = this.getEditContext();
                    let callback = () => this.spinning = false;
                    resolve({callback, ...editContext});
                } else {
                    this.$nextTick().then(() => {
                        let editContext = this.getEditContext();
                        let callback = () => this.spinning = false;
                        resolve({callback, ...editContext});
                    })
                }
            })
          })
        },
        getEditModel() {
            return this.formRef.getEditModel();
        },

        getEditContext() {
            return this.formRef.getFormContext();
        }
    }
})
