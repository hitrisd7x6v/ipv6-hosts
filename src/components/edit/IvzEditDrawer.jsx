import {defineComponent, reactive, ref} from "vue";
const formProps = {labelCol: {span: 7}, wrapperCol: {span: 17}}
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
                return <div style="text-align: center">{() => fun}</div>
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
            fun.push(<ivz-button meta={meta}>{meta.name}</ivz-button>)
        }

        if(this.formRef) {
            context = this.getEditContext();
            model =  this.formRef.getEditModel();
        }

        let slots = {
            title: () => this.$slots.title ? this.$slots.title() : <span>{this.title}</span>
        }

        return(<a-drawer v-model={[this.visible, 'visible', ["modifier"]]} wrapStyle={{position: 'absolute'}}
                    {...this.$props} v-slots={slots} ref="ADrawerRef" getContainer={false}>
            <a-spin size="small" tip="数据处理中..." spinning={this.spinning}>
                <ivz-form {...this.$attrs} {...formProps} ref="iemFormRef">
                    {this.$slots.default ? this.$slots.default({model, context}) : null}
                </ivz-form>
                <div>
                    {this.footer(model, context, fun)}
                </div>
            </a-spin>
        </a-drawer>)
    },
    methods: {
        // 表单组件是否初始化
        isInitForm() {
            return this.formRef != null
        },

        switchActive(visible) {
            this.visible = visible;
        },

        switchSpinning(spinning) {
            this.spinning = spinning;
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
            // 再次从$refs获取, 防止未初始化或者延迟
            return this.$refs['iemFormRef'].getEditModel();
        },

        getEditContext() {
            // 可能出现获取的时候form还未初始化, 自行判断
            if(this.formRef) {
                return this.formRef.getFormContext();
            }

            return null
        }
    }
})
