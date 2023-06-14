import {defineComponent, isProxy, provide, reactive} from "vue";
import {Form} from "ant-design-vue";
import {getMetaValue, initMetaValue, setMetaValue} from "@/utils/MetaUtils";
import {FormContext} from "@/components/form/basic/FormContext";
import SysUtils from "@/utils/SysUtils";


export default defineComponent({
    name: 'UForm',
    props: {
        span: Array, // labelCol wrapperCol eg: [3, 21]
        // 和AForm不同的是model必须双向绑定的方式即：v-model="model"
        'onUpdate:modelValue': {type: Function},
        modelValue: {type: Object, default: () => { return {}}}
    },
    setup({rules, modelValue}, {attrs}) {
        if(attrs.model) {
            console.warn("UForm不支持[:model] 请使用[v-model]替代")
        }

        let formRef;
        let initModel = modelValue;
        let editModel = modelValue;
        let formContext = new FormContext();
        provide('initModel', (namePath, value) =>
            initMetaValue(namePath, initModel, value))
        provide('formContext', formContext);

        let proxy = reactive({editModel});
        if(rules instanceof Object) {
            Object.keys(rules).forEach(key => {
                let rule = rules[key];
                rules[key] = rule instanceof Array ? rule : [rule];
            })
            formContext['useForm'] = Form.useForm(proxy.editModel, reactive(rules));
        } else {
            formContext['useForm'] = {};
        }

        formContext['getFieldValue'] = (namePath) => getMetaValue(namePath, proxy.editModel);
        formContext['setFieldValue'] = (namePath, value) => setMetaValue(namePath, proxy.editModel, value);

        return {formContext, formRef, proxy, initModel}
    },
    created() {
        this.formRef = this.$refs['formRef']

        this.formContext.validate = this.validate;
        this.formContext.resetFields = this.resetFields;
        this.formContext.getEditModel = this.getEditModel;
        this.formContext.setEditModel = this.setEditModel;
        this.formContext.getInitModel = this.getInitModel;
        this.formContext.scrollToField = this.scrollToField;
        this.formContext.clearValidate = this.clearValidate;
        this.formContext.validateFields = this.validateFields;
        this.formContext.resetModel = () => this.setEditModel(this.getInitModel());
    },
    mounted() {
        this.proxy.editModel = this.getInitModel();
    },
    render() {
        let editModel = this.proxy.editModel;
        let labelCol = this.$attrs.labelCol, wrapperCol = this.$attrs.wrapperCol;
        if(this.span instanceof Array) {
            labelCol = labelCol || {span: this.span[0]};
            wrapperCol = wrapperCol || {span: this.span[1]}
        }

        return (
            <AForm {...this.$attrs} model={editModel}
                   labelCol={labelCol} wrapperCol={wrapperCol} ref="formRef">
                {this.$slots.default({model: editModel})}
            </AForm>)
    },
    methods: {
        // 元表单引用对象
        getFormRef() {
            return this.formRef;
        },
        validate() {
            return this.getFormRef().validate();
        },

        getFormContext() {
            return this.formContext;
        },
        resetFields() {
            this.getFormRef().resetFields();
            this.setEditModel(this.getInitModel())
        },
        scrollToField() {
            this.getFormRef().scrollToField();
        },

        validateFields() {
            return this.getFormRef().validateFields();
        },

        clearValidate() {
            this.getFormRef().clearValidate();
        },

        getInitModel() {
            return SysUtils.clone(this.initModel);
        },

        getEditModel() {
            return this.proxy.editModel;
        },

        setEditModel(editModel) {
            if(!editModel) {
                throw new Error("UForm组件的model参数不能设置为null")
            } else {
                this.$emit('update:modelValue', editModel);
            }

            if(!isProxy(editModel)) {
                this.proxy.editModel = reactive(editModel);
            }else {
                this.proxy.editModel = editModel;
            }
        }
    }
})
