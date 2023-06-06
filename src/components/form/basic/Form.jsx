import {defineComponent, isProxy, mergeProps, provide, reactive} from "vue";
import {Form} from "ant-design-vue";
import {createMetasMap, getMetaValue, setMetaValue} from "@/utils/MetaUtils";
import {FormContext} from "@/components/form/basic/FormContext";
import SysUtils from "@/utils/SysUtils";

const unMounted = () => console.log('IvzForm组件未完成挂载')
export default defineComponent({
    name: 'UForm',
    props: {
        rules: Object,
        name: String,
        span: Array, // labelCol wrapperCol eg: [3, 21]
        labelCol: Object,
        wrapperCol: Object,
        hideRequiredMark: Boolean,
        colon: {type: Boolean, default: true},
        validateTrigger: {type: String | Array},
        labelAlign: {type: String, default: 'right'},
        layout: {type: String, default: 'horizontal'},
        scrollToFirstError: {type: Boolean, default: false},
        validateOnRuleChange: {type: Boolean, default: true},
        metas: {type: Array, required: false, default: () => []},
    },
    setup({metas, rules}) {
        const initModel = {};
        const metasMap = createMetasMap(metas);

        let formRef;
        let editModel = reactive({});
        let formContext = new FormContext();

        provide('initModel', (namePath, value) =>
            setMetaValue(namePath, editModel, value))

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

        provide('formContext', formContext);
        return {metasMap, formContext, formRef, proxy, initModel}
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
        this.initModel = SysUtils.clone(this.proxy.editModel);
    },
    render() {
        let editModel = this.proxy.editModel;
        let labelCol = this.labelCol, wrapperCol = this.wrapperCol;
        if(this.span instanceof Array) {
            labelCol = {span: this.span[0]};
            wrapperCol = {span: this.span[1]}
        }

        let props = mergeProps(this.$props, {model: editModel, labelCol, wrapperCol});
        return (
            <AForm {...props} ref="formRef">
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
            if(!isProxy(editModel)) {
                this.proxy.editModel = reactive(editModel);
            }else {
                this.proxy.editModel = editModel;
            }
        }
    }
})
