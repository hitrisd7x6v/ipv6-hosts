import {defineComponent, inject, provide, ref} from "vue";
import {FuncContextKey, LinkViewContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {EditContext} from "@/components/view/Context";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import CoreConsts from "@/components/CoreConsts";

export default defineComponent({
    name: 'UFormDrawer',
    props: {
        title: String,
        bodyStyle: Object,
        centered: Boolean,
        afterClose: Function,
        width: {default: 452},
        height: {default: 452},
        destroyOnClose: Boolean,
        zIndex: {default: 1000},
        keyboard: {default: true},
        placement: {default: 'right'},
        maskClosable: {default: true},
        headerStyle: {type: Object},
        footerStyle: {type: Object, default: () => { return {textAlign: 'center'}}},
        uid: {type: String, required: true, default: CoreConsts.DefaultEditUid}
    },
    mixins: [MixinsEditItem],
    setup(props, {attrs, slots}) {
        let formRef = ref(null);
        let visible = ref(false);
        let spinning = ref(false);
        let spinTip = ref("");

        /**
         * @type {LinkContext}
         */
        let linkContext = inject(LinkViewContextKey);
        let editContext = new EditContext(linkContext);
        if(linkContext) {
            editContext.uid = props.uid;
            linkContext.addChildrenContext(editContext);
        }

        let slotProxy = {
            title: () => {
                let func = editContext.openType;
                let model = formRef.value ? formRef.value.getEditModel() : {};
                return slots.title ? slots.title({model, func}) : props.title
            },
            footer: () => {
                let model = formRef.value ? formRef.value.getEditModel() : {};
                return slots.footer ? slots.footer({model}) : []
            },
            extra: () => slots.extra ? slots.extra() : null,
            closeIcon: () => slots.closeIcon ? slots.closeIcon() : null,
        }

        provide(FuncContextKey, editContext);
        return {formRef, spinning, spinTip, visible, slotProxy, editContext}
    },
    render() {
        let model = {}, context = this.editContext;

        if(this.formRef) {
            model =  this.formRef.getEditModel();
        } else {
            this.formRef = this.$refs['iemFormRef'];
        }

        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} style={{position: 'absolute'}}
                         {...this.$props} closable={false} v-slots={this.slotProxy} forceRender={true}
                         getContainer=".ivz-main-container" ref="ADrawerRef">
            <a-spin size="small" tip={this.spinTip} spinning={this.spinning}>
                <UForm {...this.$attrs} ref="iemFormRef">
                    {this.$slots.default ? this.$slots.default({model, context}) : []}
                </UForm>
            </a-spin>
        </a-drawer>)
    }
})

