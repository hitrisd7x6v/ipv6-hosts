import {defineComponent, inject, provide, ref} from "vue";
import {FuncContextKey, LinkViewContextKey} from "@/utils/ProvideKeys";
import {EditContext} from "@/components/view/Context";
import MixinsEditItem from "@/components/edit/MixinsEditItem";
import CoreConsts from "@/components/CoreConsts";

const FooterColFuncConfig = {xs: 12, ms: 12, md: 12}
const FooterColEmptyConfig = {xs: 0, ms: 0, md: 6}
export default defineComponent({
    name: 'UFormDrawer',
    props: {
        title: String,
        bodyStyle: Object,
        centered: Boolean,
        afterClose: Function,
        width: {default: 680},
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
                return <ARow>
                    <ACol {...FooterColEmptyConfig}></ACol>
                    <ACol {...FooterColFuncConfig}>{slots.footer ? slots.footer({model}) : []}</ACol>
                    <ACol {...FooterColEmptyConfig}></ACol>
                </ARow>
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

        return(<ADrawer v-model={[this.visible, 'visible', ["modifier"]]} style={{position: 'absolute'}}
                         {...this.$props} closable={false} v-slots={this.slotProxy} forceRender={true}
                         getContainer=".ivz-main-container" ref="ADrawerRef">
            <ASpin size="small" tip={this.spinTip} spinning={this.spinning}>
                <UForm {...this.$attrs} ref="iemFormRef">
                    {this.$slots.default ? this.$slots.default({model, context}) : []}
                </UForm>
            </ASpin>
        </ADrawer>)
    }
})

